import { apiClient } from './client'

export const analyzeCropImage = async (file) => {
  const data = await apiClient.analyzeImage(file)

  return {
    label: data.predictedClass,
    confidence: data.confidence,
    recommendation: data.fertilizerPlan.recommendation,
    detailed: data,
    session_id: data.session_id,
  }
}

export const buildDetailedAnalysisMessage = (data) => {
  // Empty strings in the array produce blank lines (paragraph breaks) when joined with \n.
  // Blank lines are required in standard markdown to separate blocks.
  return [
    '**Detailed Analysis Report**',
    '',
    `- **Crop:** ${data.crop}`,
    `- **Prediction:** ${data.predictedClass}`,
    `- **Confidence:** ${Math.round(data.confidence * 100)}%`,
    `- **Severity:** ${data.severity}`,
    '',
    '**Summary:**',
    '',
    data.summary,
    '',
    '**Key Symptoms:**',
    '',
    ...data.keySymptoms.map((s) => `- ${s}`),
    '',
    '**Likely Causes:**',
    '',
    ...data.likelyCauses.map((c) => `- ${c}`),
    '',
    '**Immediate Actions:**',
    '',
    ...data.immediateActions.map((a) => `- ${a}`),
    '',
    '**Fertilizer Plan:**',
    '',
    `- **Recommendation:** ${data.fertilizerPlan.recommendation}`,
    `- **Dose:** ${data.fertilizerPlan.dosagePerAcre}`,
    `- **Caution:** ${data.fertilizerPlan.caution}`,
    '',
    '**Prevention Tips:**',
    '',
    ...data.preventionTips.map((t) => `- ${t}`),
    '',
    '**Follow-up:**',
    '',
    data.followUp,
  ].join('\n')
}
