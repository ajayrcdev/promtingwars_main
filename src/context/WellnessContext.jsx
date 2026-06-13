import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { loadEntries, saveEntries, loadChat, saveChat, loadApiKey, saveApiKey } from '../utils/storage.js'
import { analyzeEntry, analyzeEntryWithGroq, chatWithGroq, generateChatFallback } from '../utils/ai.js'
import { sanitizeInput } from '../utils/constants.js'

const WellnessContext = createContext(null)

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState(() => loadEntries())
  const [chatMessages, setChatMessages] = useState(() => loadChat())
  const [apiKey, setApiKeyState] = useState(() => loadApiKey())
  const [aiMode, setAiMode] = useState(() => loadApiKey() ? 'groq' : 'mock')
  const [analyzingEntry, setAnalyzingEntry] = useState(false)
  const pendingReply = useRef(false)

  useEffect(() => { saveEntries(entries) }, [entries])
  useEffect(() => { saveChat(chatMessages) }, [chatMessages])
  useEffect(() => { saveApiKey(apiKey) }, [apiKey])

  const todayEntry = useMemo(
    () => entries.find(e => e.date === new Date().toISOString().split('T')[0]),
    [entries]
  )

  const streak = useMemo(() => calculateStreak(entries), [entries])

  const setApiKey = useCallback((key) => {
    setApiKeyState(key)
    setAiMode(key ? 'groq' : 'mock')
  }, [])

  const addEntry = useCallback(async (entryData) => {
    const date = new Date().toISOString().split('T')[0]
    const existing = entries.findIndex(e => e.date === date)
    setAnalyzingEntry(true)

    const entry = {
      ...entryData,
      journal: sanitizeInput(entryData.journal),
      date,
      id: date,
      createdAt: new Date().toISOString(),
    }

    if (aiMode === 'groq' && apiKey) {
      const analysis = await analyzeEntryWithGroq(entry, entries, apiKey)
      entry.analysis = analysis
    } else {
      entry.analysis = analyzeEntry(entry, entries)
    }

    if (existing >= 0) {
      setEntries(prev => {
        const next = [...prev]
        next[existing] = { ...next[existing], ...entry }
        return next
      })
    } else {
      setEntries(prev => [entry, ...prev])
    }

    setAnalyzingEntry(false)
    return entry
  }, [entries, aiMode, apiKey])

  const sendMessage = useCallback(async (text) => {
    if (pendingReply.current) return
    pendingReply.current = true

    const cleanText = sanitizeInput(text)
    const userMsg = { role: 'user', text: cleanText, timestamp: new Date().toISOString() }
    setChatMessages(prev => [...prev, userMsg])

    try {
      let responseText

      if (aiMode === 'groq' && apiKey) {
        responseText = await chatWithGroq(cleanText, chatMessages, apiKey)
      } else {
        await new Promise(r => setTimeout(r, 500 + Math.random() * 600))
        responseText = generateChatFallback(cleanText)
      }

      const botMsg = { role: 'bot', text: responseText, timestamp: new Date().toISOString() }
      setChatMessages(prev => [...prev, botMsg])
    } catch {
      const fallbackMsg = {
        role: 'bot',
        text: 'I\'m here for you. Could you tell me more about how you\'re feeling? 💙',
        timestamp: new Date().toISOString(),
      }
      setChatMessages(prev => [...prev, fallbackMsg])
    }

    pendingReply.current = false
  }, [chatMessages, aiMode, apiKey])

  const clearChat = useCallback(() => {
    setChatMessages([])
  }, [])

  const value = useMemo(() => ({
    entries, chatMessages, apiKey, aiMode, todayEntry, streak,
    analyzingEntry, addEntry, setEntries, sendMessage, clearChat, setApiKey,
  }), [entries, chatMessages, apiKey, aiMode, todayEntry, streak, analyzingEntry, addEntry, sendMessage, clearChat, setApiKey])

  return (
    <WellnessContext value={value}>
      {children}
    </WellnessContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWellness() {
  const ctx = useContext(WellnessContext)
  if (!ctx) throw new Error('useWellness must be used within WellnessProvider')
  return ctx
}

function calculateStreak(entries) {
  if (!entries.length) return 0
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split('T')[0]
    if (sorted[i].date === expectedStr) streak++
    else break
  }
  return streak
}
