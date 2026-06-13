import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useWellness } from '../context/WellnessContext.jsx'
import { STORAGE_WARNING } from '../utils/constants.js'
import { GROQ_ENDPOINT, GROQ_MODEL } from '../utils/ai.js'
import './SettingsModal.css'

export default function SettingsModal({ onClose }) {
  const { apiKey, setApiKey, aiMode } = useWellness()
  const [key, setKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const firstFocusRef = useRef(null)

  useEffect(() => {
    if (firstFocusRef.current) {
      firstFocusRef.current.focus()
    }
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSave() {
    setApiKey(key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    setKey('')
    setApiKey('')
  }

  async function testKey() {
    const currentKey = key.replace(/[^\x20-\x7E]/g, '').trim()
    if (!currentKey || currentKey.length < 10) {
      setTestStatus('invalid')
      return
    }
    setTestStatus('testing')
    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: 'Say "ok"' }],
          max_tokens: 10,
        }),
      })
      if (response.ok) {
        setTestStatus('valid')
      } else {
        setTestStatus('invalid')
      }
    } catch {
      setTestStatus('invalid')
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div className="modal" onClick={e => e.stopPropagation()} role="document">
        <div className="modal-header">
          <h2>
            <span aria-hidden="true">⚙️</span> Settings
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings" ref={firstFocusRef}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <section className="setting-section">
            <h3>Groq AI (<code>{GROQ_MODEL}</code>)</h3>
            <p className="setting-desc">
              Connect a free Groq API key to use real AI analysis and chat.
              Sign up and get a free API key at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noreferrer">
                console.groq.com
              </a>
              {' '}(no credit card required).
            </p>

            <div className="api-key-input-wrap">
              <label htmlFor="api-key" className="sr-only">Groq API key</label>
              <input
                id="api-key"
                type="password"
                className="api-key-input"
                placeholder="Enter your Groq API key (gsk_...)"
                value={key}
                onChange={e => setKey(e.target.value)}
                autoComplete="off"
                maxLength={200}
              />
              <button
                className="btn-secondary"
                onClick={testKey}
                disabled={!key.trim() || testStatus === 'testing'}
                aria-label={testStatus === 'testing' ? 'Testing API key' : 'Test API key'}
              >
                {testStatus === 'testing' ? 'Testing…' : 'Test'}
              </button>
            </div>

            {testStatus === 'valid' && <p className="key-status valid" role="status">✓ Key is valid!</p>}
            {testStatus === 'invalid' && <p className="key-status invalid" role="status">✗ Key is invalid. Please check and try again.</p>}

            <div className="api-key-actions">
              <button className="btn-primary" onClick={handleSave} disabled={!key.trim()}>
                {saved ? '✓ Saved' : 'Save Key'}
              </button>
              {apiKey && (
                <button className="btn-danger" onClick={handleClear}>
                  Remove Key
                </button>
              )}
            </div>

            <p className="security-note" role="note">
              <span aria-hidden="true">🔒</span> {STORAGE_WARNING}
            </p>
          </section>

          <section className="setting-section">
            <h3>AI Mode</h3>
            <div className={`mode-badge ${aiMode}`} role="status">
              {aiMode === 'groq' ? '✨ Groq AI (Real — Llama 3.3)' : '🧪 Mock AI (Demo)'}
            </div>
            <p className="setting-desc">
              {aiMode === 'mock'
                ? 'Add a Groq API key above to unlock real AI-powered analysis and conversations.'
                : 'Journal entries are analyzed and chat responses are generated using Groq (Llama 3.3). Your key stays in your browser.'}
            </p>
          </section>

          <section className="setting-section">
            <h3>About MindWell</h3>
            <p className="setting-desc">
              MindWell is a mental wellness companion for students preparing for high-stakes exams.
              All data is stored in your browser&apos;s local storage — nothing is uploaded to any server.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
