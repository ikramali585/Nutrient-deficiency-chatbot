import io
import json
import re
import uuid
from typing import Any, Optional

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_classic.chains import ConversationChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from PIL import Image
from pydantic import BaseModel
from ultralytics import YOLO

load_dotenv()

app = FastAPI(title="Rice Nutrient Deficiency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Model singleton
# ---------------------------------------------------------------------------
_yolo_model: Optional[YOLO] = None


def get_yolo_model() -> YOLO:
    global _yolo_model
    if _yolo_model is None:
        _yolo_model = YOLO("model/best.pt")
    return _yolo_model


# ---------------------------------------------------------------------------
# In-memory session store  {session_id: ConversationChain}
# ---------------------------------------------------------------------------
sessions: dict[str, ConversationChain] = {}

CHAT_TEMPLATE = """You are an agricultural expert specializing in rice crop nutrient deficiencies.
Provide brief, accurate information about nutrient deficiencies, their causes, symptoms, and treatments.
Current conversation:
{history}
Human: {input}
Assistant:"""


def create_conversation() -> ConversationChain:
    llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.3)
    memory = ConversationBufferMemory()
    prompt = PromptTemplate(input_variables=["history", "input"], template=CHAT_TEMPLATE)
    return ConversationChain(llm=llm, memory=memory, prompt=prompt)


# ---------------------------------------------------------------------------
# Prompt for structured JSON analysis
# ---------------------------------------------------------------------------
ANALYSIS_PROMPT = """You are an agricultural expert specializing in rice crop nutrient deficiencies.
Analyze the detected condition in a rice crop: {deficiency_class}

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with exactly this structure:
{{
  "severity": "Mild or Moderate or Severe",
  "summary": "2-3 sentence description of the deficiency pattern and crop impact",
  "keySymptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "likelyCauses": ["cause 1", "cause 2", "cause 3"],
  "immediateActions": ["action 1", "action 2", "action 3"],
  "fertilizerPlan": {{
    "recommendation": "fertilizer type and product name",
    "dosagePerAcre": "specific dosage recommendation",
    "caution": "one important caution"
  }},
  "preventionTips": ["tip 1", "tip 2", "tip 3"],
  "followUp": "1-2 sentence follow-up recommendation"
}}"""


def parse_json_response(text: str) -> dict:
    """Extract and parse JSON from LLM response text."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise HTTPException(status_code=500, detail="Failed to parse structured analysis from LLM")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    """
    Accept a rice leaf image, run YOLO classification, then call the LLM
    for a structured deficiency report.  Returns the full analysis JSON plus
    a session_id to use for follow-up chat messages.
    """
    contents = await image.read()
    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or unreadable image file")

    image_np = np.array(pil_image)

    # YOLO classification
    model = get_yolo_model()
    results = model(image_np)
    result = results[0]
    detected_class: str = result.names[int(result.probs.top1)]
    confidence: float = float(result.probs.top1conf)

    # Structured LLM analysis
    llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.3)
    prompt_text = ANALYSIS_PROMPT.format(deficiency_class=detected_class)
    llm_response = llm.invoke([HumanMessage(content=prompt_text)])
    analysis_data = parse_json_response(llm_response.content)

    # Create a chat session pre-loaded with the detection context
    session_id = str(uuid.uuid4())
    conversation = create_conversation()
    conversation.predict(
        input=(
            f"A rice crop image has been analyzed and {detected_class} was detected with "
            f"{round(confidence * 100)}% confidence. I am ready to answer any follow-up "
            "questions about this condition, its treatment, and prevention."
        )
    )
    sessions[session_id] = conversation

    return {
        "fileName": image.filename or "uploaded_image.jpg",
        "crop": "Rice",
        "predictedClass": detected_class,
        "confidence": confidence,
        **analysis_data,
        "session_id": session_id,
    }


class ChatPayload(BaseModel):
    message: str
    analysis: Optional[Any] = None
    session_id: Optional[str] = None


@app.post("/chat")
async def chat(payload: ChatPayload):
    """
    Send a follow-up message to the AgriBot.  Requires the session_id
    returned by /analyze to continue a context-aware conversation.
    """
    if payload.session_id and payload.session_id in sessions:
        conversation = sessions[payload.session_id]
    else:
        # Fall back to a fresh conversation (no prior context)
        conversation = create_conversation()
        if payload.session_id:
            sessions[payload.session_id] = conversation

    reply = conversation.predict(input=payload.message)
    return {"reply": reply}
