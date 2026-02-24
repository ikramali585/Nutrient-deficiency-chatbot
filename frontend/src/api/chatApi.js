import { apiClient } from './client'

export const sendAgriBotMessage = async ({ message, analysis, session_id }) => {
  const data = await apiClient.sendChat({ message, analysis, session_id })
  return data.reply
}
