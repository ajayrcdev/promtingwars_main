import { useWellness } from '../context/WellnessContext.jsx'
import { MOTIVATIONAL } from '../utils/ai.js'
import './Dashboard.css'

export default function Dashboard({ onNavigate }) {
  const { entries, streak, todayEntry, aiMode, apiKey } = useWellness()
  const quote = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]

  const recentEntries = entries.slice(0, 7)
  const avgMood = entries.length ? Math.round(entries.reduce((s, e) => s + e.mood, 0) / entries.length * 10) / 10 : 0
  const totalCheckins = entries.length
  const goodDays = entries.filter(e => e.mood >= 7).length

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>Welcome back</h1>
          <p className="dash-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="streak-badge">
          <span className="streak-fire">🔥</span>
          <span className="streak-num">{streak}</span>
          <span className="streak-label">day streak</span>
        </div>
      </header>

      <div className="quote-card">
        <p className="quote-text">"{quote}"</p>
      </div>

      {aiMode === 'mock' && (
        <div className="ai-banner">
          <span className="ai-banner-icon">🧪</span>
          <div>
            <strong>Demo Mode</strong>
            <p>Add a Gemini API key in Settings (⚙️) for real AI analysis ✨</p>
          </div>
        </div>
      )}
      {aiMode === 'gemini' && (
        <div className="ai-banner active">
          <span className="ai-banner-icon">✨</span>
          <div>
            <strong>Gemini AI Active</strong>
            <p>Journal analysis & chat powered by real AI</p>
          </div>
        </div>
      )}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{avgMood}</span>
          <span className="stat-label">Avg Mood</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{totalCheckins}</span>
          <span className="stat-label">Check-ins</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌟</span>
          <span className="stat-value">{goodDays}</span>
          <span className="stat-label">Good Days</span>
        </div>
      </div>

      {todayEntry && (
        <div className="today-card">
          <h3>Today's Entry</h3>
          <div className="today-mood">
            <span>Mood: <strong>{todayEntry.mood}/10</strong></span>
            <span className={`sentiment-tag ${todayEntry.analysis?.sentiment || 'neutral'}`}>
              {todayEntry.analysis?.sentiment || 'Neutral'}
            </span>
          </div>
          <p className="today-journal">"{todayEntry.journal.slice(0, 120)}{todayEntry.journal.length > 120 ? '…' : ''}"</p>
          {todayEntry.analysis?.motivational && (
            <p className="today-motivation">💙 {todayEntry.analysis.motivational}</p>
          )}
        </div>
      )}

      {!todayEntry && (
        <button className="btn-primary btn-large" onClick={() => onNavigate('checkin')}>
          ✏️ Start Today's Check-in
        </button>
      )}

      {recentEntries.length > 0 && (
        <div className="mini-chart">
          <h3>Recent Mood</h3>
          <div className="mood-bars">
            {recentEntries.map((e, i) => (
              <div key={e.id} className="mood-bar-wrap" title={`${e.date}: ${e.mood}/10`}>
                <div
                  className="mood-bar"
                  style={{ height: `${(e.mood / 10) * 100}%` }}
                />
                <span className="mood-bar-label">
                  {new Date(e.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🧘</span>
          <h3>Start Your Wellness Journey</h3>
          <p>Log your first daily check-in to begin tracking your mental well-being.</p>
        </div>
      )}
    </div>
  )
}
