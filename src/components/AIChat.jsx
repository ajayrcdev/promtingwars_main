import { useState, useRef, useEffect } from 'react'
import { useWellness } from '../context/WellnessContext.jsx'
import './AIChat.css'

export default function AIChat() {
  const { chatMessages, sendMessage, clearChat, aiMode } = useWellness()
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
    if (chatMessages.length === 0) {
      sendMessage('hello')
    }
  }, [])

  function handleSend() {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    setInput('')
    setIsTyping(true)
    sendMessage(text)
    setTimeout(() => setIsTyping(false), 1500)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-avatar">
          <span className="chat-avatar-icon">🧠</span>
          <div>
          <h2>MindWell AI</h2>
          <span className="chat-status">
            {aiMode === 'gemini' ? '✨ Powered by Gemini AI' : '🧪 Demo Mode'}
          </span>
          </div>
        </div>
        {chatMessages.length > 1 && (
          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            🗑️
          </button>
        )}
      </header>

      <div className="chat-messages" ref={listRef}>
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
          <div className="chat-msg bot">
            <div className="msg-bubble typing">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-wrap">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={500}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          Send
        </button>
      </div>
    </div>
  )
}
