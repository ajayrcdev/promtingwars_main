import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadEntries, saveEntries, loadChat, saveChat, loadProfile, saveProfile } from '../utils/storage.js'
import { analyzeEntry, generateChatResponse } from '../utils/ai.js'

const WellnessContext = createContext(null)

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [profile, setProfile] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(loadEntries())
    setChatMessages(loadChat())
    setProfile(loadProfile())
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) saveEntries(entries) }, [entries, loaded])
  useEffect(() => { if (loaded) saveChat(chatMessages) }, [chatMessages, loaded])
  useEffect(() => { if (loaded) saveProfile(profile) }, [profile, loaded])

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0])
  const streak = calculateStreak(entries)

  const addEntry = useCallback((entryData) => {
    const date = new Date().toISOString().split('T')[0]
    const existing = entries.findIndex(e => e.date === date)

    const entry = {
      ...entryData,
      date,
      id: date,
      createdAt: new Date().toISOString(),
    }

    const analysis = analyzeEntry(entry, entries)
    entry.analysis = analysis

    if (existing >= 0) {
      setEntries(prev => {
        const next = [...prev]
        next[existing] = { ...next[existing], ...entry }
        return next
      })
    } else {
      setEntries(prev => [entry, ...prev])
    }

    return entry
  }, [entries])

  const sendMessage = useCallback((text) => {
    const userMsg = { role: 'user', text, timestamp: new Date().toISOString() }
    setChatMessages(prev => [...prev, userMsg])

    const response = generateChatResponse(text, entries)
    setTimeout(() => {
      const botMsg = { role: 'bot', text: response, timestamp: new Date().toISOString() }
      setChatMessages(prev => [...prev, botMsg])
    }, 600 + Math.random() * 800)

    return userMsg
  }, [entries])

  const clearChat = useCallback(() => {
    setChatMessages([])
  }, [])

  return (
    <WellnessContext value={{ entries, chatMessages, profile, loaded, todayEntry, streak, addEntry, setEntries, sendMessage, clearChat, setProfile }}>
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
    if (sorted[i].date === expectedStr) {
      streak++
    } else {
      break
    }
  }
  return streak
}
