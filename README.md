# Rice Crop Nutrient Deficiency Detector

A full-stack application that identifies nutrient deficiencies in rice crops from leaf images and provides an interactive AI chat assistant for treatment guidance.

Upload a rice leaf photo, get a structured deficiency report powered by YOLOv8 classification and LLaMA 3.3 70B, then ask follow-up questions in the built-in AgriBot chat — with full session history persisted across page refreshes.

---

## Architecture

The project ships two independent interfaces that share the same underlying model and AI logic.

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│   (Vite + Tailwind + react-markdown)             │
│                                                  │
│  Image Upload → Analysis Result → AgriBot Chat   │
│                  History Tab                     │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (REST)
┌──────────────────────▼──────────────────────────┐
│              FastAPI Backend (api_server.py)    │
│                                                 │
│  POST /analyze   →  YOLO classify + LLM report  │
│  POST /chat      →  Session-aware AgriBot reply │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│          Streamlit App (streamlit_app.py)       │
│          Original interface — unchanged         │
└─────────────────────────────────────────────────┘
```

---

## Features

- **YOLOv8 classification** — custom-trained model detects Nitrogen, Phosphorus, Potassium deficiency, or Healthy
- **Structured AI analysis** — LLaMA 3.3 70B generates severity, symptoms, causes, immediate actions, fertilizer plan, prevention tips, and follow-up in one call
- **Session-aware AgriBot** — each image upload creates a Groq conversation pre-loaded with the detection context; follow-up questions are answered with full awareness of the analysis
- **Chat history** — all sessions are stored in `localStorage` and browsable in the History tab; each past session is viewable in full read-only replay
- **Markdown rendering** — bot responses render bold text, bullet lists, and headings properly via `react-markdown`
- **Streamlit interface** — the original single-file app remains fully functional alongside the new stack

---

## Tech Stack

| Layer | Technology |
|---|---|
| Detection model | YOLOv8 (Ultralytics) |
| LLM | LLaMA 3.3 70B via Groq API |
| LLM orchestration | LangChain + LangChain-Groq |
| REST API | FastAPI + Uvicorn |
| React frontend | Vite, React 19, Tailwind CSS v4 |
| Markdown rendering | react-markdown + remark-gfm |
| Original interface | Streamlit |
| Containerisation | Docker + Docker Compose + Nginx |

---

## Project Structure

```
├── api_server.py          # FastAPI backend (POST /analyze, POST /chat)
├── streamlit_app.py       # Original Streamlit interface
├── model/
│   └── best.pt            # YOLOv8 classification weights
├── requirements.txt       # Python dependencies (shared by both apps)
├── Dockerfile.backend     # Backend container
├── docker-compose.yml     # Orchestrates backend + frontend containers
└── frontend/
    ├── Dockerfile         # Multi-stage: Vite build → Nginx serve
    ├── nginx.conf         # Proxies /analyze and /chat to the backend
    ├── src/
    │   ├── App.jsx
    │   ├── api/
    │   │   ├── client.js       # Axios instance + mock toggle
    │   │   ├── analysisApi.js  # analyzeCropImage, buildDetailedAnalysisMessage
    │   │   └── chatApi.js      # sendAgriBotMessage
    │   ├── hooks/
    │   │   └── useChatHistory.js   # localStorage persistence hook
    │   ├── components/
    │   │   ├── MessageBubble.jsx   # Markdown-rendered chat bubble
    │   │   ├── ChatBox.jsx         # Chat tab + History tab
    │   │   ├── ChatHistory.jsx     # Session list + read-only session viewer
    │   │   ├── ResultCard.jsx
    │   │   ├── UploadBox.jsx
    │   │   ├── ImagePreview.jsx
    │   │   ├── HeroSlider.jsx
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   └── pages/
    │       └── Home.jsx
    └── .env               # VITE_API_BASE_URL, VITE_API_TIMEOUT_MS
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- A [Groq API key](https://console.groq.com)

### 1. Clone and configure

```bash
git clone https://github.com/ikramali585/Nutrient-deficiency-chatbot.git
cd Nutrient-deficiency-chatbot
```

Create `.env` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

### Option A — Streamlit (original interface)

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`.

---

### Option B — React + FastAPI (local development)

**Backend**

```bash
pip install -r requirements.txt
uvicorn api_server:app --reload --port 8000
```

**Frontend** (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env` is pre-configured to point at `http://localhost:8000`. The React app opens at `http://localhost:5173`.

---

### Option C — Docker (production)

```bash
docker compose up --build
```

Serves the React app on port `80`. Nginx proxies `/analyze` and `/chat` internally to the backend container — no CORS issues, no exposed backend port.

```bash
# Pass the API key without editing any file
GROQ_API_KEY=your_key_here docker compose up --build
```

---

## API Reference

### `POST /analyze`

Accepts a rice leaf image, runs YOLO classification, and calls the LLM for a structured deficiency report. Creates a new chat session pre-loaded with the detection context.

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `image` | file | Rice leaf image (JPEG / PNG) |

**Response** — `application/json`

```json
{
  "fileName": "leaf.jpg",
  "crop": "Rice",
  "predictedClass": "Nitrogen Deficiency",
  "confidence": 0.97,
  "severity": "Moderate",
  "summary": "...",
  "keySymptoms": ["...", "...", "..."],
  "likelyCauses": ["...", "...", "..."],
  "immediateActions": ["...", "...", "..."],
  "fertilizerPlan": {
    "recommendation": "...",
    "dosagePerAcre": "...",
    "caution": "..."
  },
  "preventionTips": ["...", "...", "..."],
  "followUp": "...",
  "session_id": "uuid"
}
```

---

### `POST /chat`

Continues the AgriBot conversation for a given session. Falls back to a fresh conversation if `session_id` is absent or expired.

**Request** — `application/json`

```json
{
  "message": "How often should I apply urea?",
  "session_id": "uuid"
}
```

**Response**

```json
{
  "reply": "..."
}
```

---

## Environment Variables

### Root (Python / backend)

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key — required by both the FastAPI server and the Streamlit app |

### `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL for the FastAPI backend. Leave empty in Docker builds — Nginx handles routing. |
| `VITE_API_TIMEOUT_MS` | `60000` | Axios request timeout in ms. Keep high — YOLO inference plus LLM call can take several seconds. |

---

## License

MIT License — see [LICENSE](LICENSE).
