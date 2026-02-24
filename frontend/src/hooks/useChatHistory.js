import { useCallback, useState } from 'react'

const STORAGE_KEY = 'agribot_history'

const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Manages persisted chat session history in localStorage.
 *
 * Each session: { id, label, confidence, startedAt, messages }
 */
export const useChatHistory = () => {
  const [history, setHistory] = useState(loadFromStorage)

  // Inserts a new session or updates an existing one (matched by id)
  const addOrUpdateSession = useCallback((session) => {
    setHistory((prev) => {
      const exists = prev.some((s) => s.id === session.id)
      const updated = exists
        ? prev.map((s) => (s.id === session.id ? session : s))
        : [session, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return { history, addOrUpdateSession, clearHistory }
}
