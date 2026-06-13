import { useState, useRef, useEffect, useCallback } from 'react'
import { useWellness } from '../context/WellnessContext.jsx'
import { CRISIS_RESOURCES } from '../utils/constants.js'
import './AIChat.css'

export default function AIChat() {
  const { chatMessages, sendMessage, clearChat, aiMode, apiKey } = useWellness()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [chatMessages, isTyping])

  useEffect(() => {
    if (chatMessages.length === 0 && apiKey && aiMode === 'gemini') {
      sendMessage('hello')
    }
  }, [])

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    setInput('')
    setIsTyping(true)
    sendMessage(text)
    setTimeout(() => setIsTyping(false), aiMode === 'gemini' ? 3000 : 1500)
  }, [input, isTyping, sendMessage, aiMode])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleClear = useCallback(() => {
    clearChat()
    if (inputRef.current) inputRef.current.focus()
  }, [clearChat])

  return (
    <div className="chat-page" role="region" aria-label="AI chat companion">
      <header className="chat-header">
        <div className="chat-avatar">
          <span className="chat-avatar-icon" aria-hidden="true">🧠</span>
          <div>
            <h2>MindWell AI</h2>
            <span className="chat-status" role="status">
              {aiMode === 'gemini' ? '✨ Powered by Gemini AI' : '🧪 Demo Mode'}
            </span>
          </div>
        </div>
        {chatMessages.length > 1 && (
          <button className="clear-btn" onClick={handleClear} aria-label="Clear chat history">
            <span aria-hidden="true">🗑️</span>
          </button>
        )}
      </header>

      <div className="chat-messages" ref={listRef} role="log" aria-live="polite" aria-label="Chat messages">
        {chatMessages.length === 0 && (
          <div className="chat-welcome">
            <p>Hi there! 💙 I&apos;m your wellness companion. How are you feeling today?</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            <div className="msg-bubble">
              <p>{msg.text}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-msg bot" aria-label="AI is typing">
            <div className="msg-bubble typing">
              <span className="typing-dot" aria-hidden="true" />
              <span className="typing-dot" aria-hidden="true" />
              <span className="typing-dot" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {!apiKey && aiMode === 'mock' && chatMessages.length > 3 && (
        <div className="crisis-resources" role="note" aria-label="Crisis support resources">
          <p className="crisis-title">
            <span aria-hidden="true">🆘</span> Need immediate help?
          </p>
          {CRISIS_RESOURCES.slice(0, 2).map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="crisis-link">
              {r.name}: <strong>{r.number}</strong>
            </a>
          ))}
        </div>
      )}

      <div className="chat-input-wrap">
        <label htmlFor="chat-input" className="sr-only">Type your message</label>
        <textarea
          ref={inputRef}
          id="chat-input"
          className="chat-input"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={500}
          aria-describedby="send-btn"
        />
        <button
          id="send-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  )
}
