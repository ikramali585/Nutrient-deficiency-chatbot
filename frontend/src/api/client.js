import axios from 'axios'

const USE_MOCK_API = false
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000)

const http = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
})

const mockAnalyzeImage = async (file) => {
  const name = file?.name || 'uploaded_image.jpg'

  return {
    fileName: name,
    crop: 'Rice',
    predictedClass: 'Nitrogen Deficiency',
    confidence: 0.91,
    severity: 'Moderate',
    summary:
      'Lower leaves appear pale yellow with reduced vigor. Pattern is consistent with Nitrogen deficiency in vegetative stage.',
    keySymptoms: [
      'General chlorosis starts from older leaves',
      'Stunted tillering and slower canopy development',
      'Leaf blades show uniform light green to yellow tone',
    ],
    likelyCauses: [
      'Insufficient nitrogen fertilization',
      'High leaching after heavy irrigation/rain',
      'Low organic matter in topsoil',
    ],
    immediateActions: [
      'Apply urea in split doses according to growth stage',
      'Avoid over-irrigation for next 3 to 5 days',
      'Use leaf color chart to monitor recovery weekly',
    ],
    fertilizerPlan: {
      recommendation: 'Urea (46-0-0) split application',
      dosagePerAcre: '20 to 25 kg now, 15 to 20 kg after 10 to 14 days',
      caution: 'Do not apply before heavy rain forecast.',
    },
    preventionTips: [
      'Integrate farmyard manure before transplanting',
      'Use site-specific nutrient management schedule',
      'Maintain balanced NPK ratio, not nitrogen-only correction',
    ],
    followUp:
      'Re-capture leaf image after 7 days. If yellowing persists, run soil test for pH and organic carbon.',
  }
}

const mockSendChat = async ({ message, analysis }) => {
  const lc = message.toLowerCase()

  if (!analysis) {
    return {
      reply:
        'Please upload a crop image first. I will provide a detailed deficiency report and then answer follow-up questions.',
    }
  }

  if (lc.includes('fertilizer') || lc.includes('dose')) {
    return {
      reply: `Recommended fertilizer plan:
- ${analysis.fertilizerPlan.recommendation}
- Dose: ${analysis.fertilizerPlan.dosagePerAcre}
- Caution: ${analysis.fertilizerPlan.caution}`,
    }
  }

  if (lc.includes('severity') || lc.includes('serious')) {
    return {
      reply: `Current severity is "${analysis.severity}" with ${Math.round(
        analysis.confidence * 100,
      )}% confidence. Start correction now to prevent yield loss.`,
    }
  }

  return {
    reply: `Based on the latest analysis (${analysis.predictedClass}), focus on:
- Split nitrogen correction
- Weekly leaf color monitoring
- Recheck with a fresh image in 7 days`,
  }
}

export const apiClient = {
  async analyzeImage(file) {
    if (USE_MOCK_API) return mockAnalyzeImage(file)

    try {
      const form = new FormData()
      form.append('image', file)

      const response = await http.post('/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return response.data
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Analysis API failed')
    }
  },

  async sendChat(payload) {
    if (USE_MOCK_API) return mockSendChat(payload)

    try {
      const response = await http.post('/chat', payload)
      return response.data
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Chat API failed')
    }
  },
}

export { USE_MOCK_API }
