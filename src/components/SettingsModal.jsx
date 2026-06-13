import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useWellness } from '../context/WellnessContext.jsx'
import './SettingsModal.css'

export default function SettingsModal({ onClose }) {
  const { apiKey, setApiKey, aiMode } = useWellness()
  const [key, setKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState(null)

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
    if (!key.trim()) return
    setTestStatus('testing')
    try {
      const genAI = new GoogleGenerativeAI(key.trim())
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent('Say "ok"')
      await result.response.text()
      setTestStatus('valid')
    } catch {
      setTestStatus('invalid')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="setting-section">
            <h3>Google Gemini AI</h3>
            <p className="setting-desc">
              Connect your own Gemini API key to use real AI analysis and chat.
              Get a free key at{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                aistudio.google.com/apikey
              </a>
            </p>

            <div className="api-key-input-wrap">
              <input
                type="password"
                className="api-key-input"
                placeholder="Enter your Gemini API key"
                value={key}
                onChange={e => setKey(e.target.value)}
              />
              <button className="btn-secondary" onClick={testKey} disabled={!key.trim() || testStatus === 'testing'}>
                {testStatus === 'testing' ? 'Testing…' : 'Test'}
              </button>
            </div>

            {testStatus === 'valid' && <p className="key-status valid">✓ Key is valid!</p>}
            {testStatus === 'invalid' && <p className="key-status invalid">✗ Key is invalid. Please check and try again.</p>}

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
          </div>

          <div className="setting-section">
            <h3>AI Mode</h3>
            <div className={`mode-badge ${aiMode}`}>
              {aiMode === 'gemini' ? '✨ Gemini AI (Real)' : '🧪 Mock AI (Demo)'}
            </div>
            {aiMode === 'mock' && (
              <p className="setting-desc">Add a Gemini API key above to unlock real AI-powered analysis and conversations.</p>
            )}
            {aiMode === 'gemini' && (
              <p className="setting-desc">Journal entries are analyzed and chat responses are generated using Google Gemini. Your key is stored locally and never sent to our servers.</p>
            )}
          </div>

          <div className="setting-section">
            <h3>About</h3>
            <p className="setting-desc">
              MindWell is a mental wellness companion for students preparing for high-stakes exams.
              All data is stored in your browser's local storage — nothing is uploaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
