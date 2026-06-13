import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { loadEntries, saveEntries, loadChat, saveChat, loadApiKey, saveApiKey } from '../utils/storage.js'
import { analyzeEntry, analyzeEntryWithGemini, chatWithGemini, generateChatFallback } from '../utils/ai.js'
import { sanitizeInput } from '../utils/constants.js'

const WellnessContext = createContext(null)

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [apiKey, setApiKeyState] = useState('')
  const [aiMode, setAiMode] = useState('mock')
  const [loaded, setLoaded] = useState(false)
  const [analyzingEntry, setAnalyzingEntry] = useState(false)
  const pendingReply = useRef(false)

  useEffect(() => {
    setEntries(loadEntries())
    setChatMessages(loadChat())
    const key = loadApiKey()
    setApiKeyState(key)
    setAiMode(key ? 'gemini' : 'mock')
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) saveEntries(entries) }, [entries, loaded])
  useEffect(() => { if (loaded) saveChat(chatMessages) }, [chatMessages, loaded])
  useEffect(() => { if (loaded) saveApiKey(apiKey) }, [apiKey, loaded])

  const todayEntry = useMemo(
    () => entries.find(e => e.date === new Date().toISOString().split('T')[0]),
    [entries]
  )

  const streak = useMemo(() => calculateStreak(entries), [entries])

  const setApiKey = useCallback((key) => {
    setApiKeyState(key)
    setAiMode(key ? 'gemini' : 'mock')
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

    if (aiMode === 'gemini' && apiKey) {
      const analysis = await analyzeEntryWithGemini(entry, entries, apiKey)
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

      if (aiMode === 'gemini' && apiKey) {
        responseText = await chatWithGemini(cleanText, chatMessages, apiKey)
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
    entries, chatMessages, apiKey, aiMode, loaded, todayEntry, streak,
    analyzingEntry, addEntry, setEntries, sendMessage, clearChat, setApiKey,
  }), [entries, chatMessages, apiKey, aiMode, loaded, todayEntry, streak, analyzingEntry, addEntry, sendMessage, clearChat, setApiKey])

  return (
    <WellnessContext value={value}>
      {children}
    </WellnessContext>
  )
}

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
