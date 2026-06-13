import { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useWellness } from '../context/WellnessContext.jsx'
import './Dashboard.css'

function MoodBar({ date, mood }) {
  const dayLabel = new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })
  return (
    <div className="mood-bar-wrap" title={`${date}: ${mood}/10`}>
      <div
        className="mood-bar"
        style={{ height: `${(mood / 10) * 100}%` }}
        role="img"
        aria-label={`Mood ${mood} out of 10 on ${dayLabel}`}
      />
      <span className="mood-bar-label">{dayLabel}</span>
    </div>
  )
}

MoodBar.propTypes = {
  date: PropTypes.string.isRequired,
  mood: PropTypes.number.isRequired,
}

export default function Dashboard({ onNavigate }) {
  const { entries, streak, todayEntry, aiMode } = useWellness()

  const { avgMood, totalCheckins, goodDays, recentEntries } = useMemo(() => {
    const recent = entries.slice(0, 7)
    const avg = entries.length ? Math.round(entries.reduce((s, e) => s + e.mood, 0) / entries.length * 10) / 10 : 0
    return {
      avgMood: avg,
      totalCheckins: entries.length,
      goodDays: entries.filter(e => e.mood >= 7).length,
      recentEntries: recent,
    }
  }, [entries])

  const handleCheckinNav = useCallback(() => onNavigate('checkin'), [onNavigate])

  return (
    <div className="dashboard" role="region" aria-label="Dashboard overview">
      <header className="dash-header">
        <div>
          <h1>Welcome back</h1>
          <p className="dash-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="streak-badge" role="status" aria-label={`${streak} day streak`}>
          <span className="streak-fire" aria-hidden="true">🔥</span>
          <span className="streak-num">{streak}</span>
          <span className="streak-label">day streak</span>
        </div>
      </header>

      <div className="greeting-card">
        <p className="greeting-text">
          {aiMode === 'groq'
            ? '✨ AI is active — your entries are analyzed by Groq.'
            : 'Log your daily check-in to track your well-being.'}
        </p>
      </div>

      <section className="stats-grid" aria-label="Your wellness statistics">
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">📊</span>
          <span className="stat-value">{avgMood}</span>
          <span className="stat-label">Avg Mood</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">✅</span>
          <span className="stat-value">{totalCheckins}</span>
          <span className="stat-label">Check-ins</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">🌟</span>
          <span className="stat-value">{goodDays}</span>
          <span className="stat-label">Good Days</span>
        </div>
      </section>

      {todayEntry && (
        <section className="today-card" aria-label="Today's journal entry">
          <h2 id="today-heading" className="section-heading">Today&apos;s Entry</h2>
          <div className="today-mood">
            <span>Mood: <strong>{todayEntry.mood}/10</strong></span>
            <span className={`sentiment-tag ${todayEntry.analysis?.sentiment || 'neutral'}`}>
              {todayEntry.analysis?.sentiment || 'Neutral'}
            </span>
          </div>
          <p className="today-journal">
            &ldquo;{todayEntry.journal.slice(0, 120)}{todayEntry.journal.length > 120 ? '…' : ''}&rdquo;
          </p>
          {aiMode === 'groq' && todayEntry.analysis?.motivational && (
            <p className="today-motivation" role="status">
              <span aria-hidden="true">💙</span> {todayEntry.analysis.motivational}
            </p>
          )}
        </section>
      )}

      {!todayEntry && (
        <button className="btn-primary btn-large" onClick={handleCheckinNav} aria-label="Start today's check-in">
          <span aria-hidden="true">✏️</span> Start Today&apos;s Check-in
        </button>
      )}

      {recentEntries.length > 0 && (
        <section className="mini-chart" aria-label="Recent mood chart">
          <h2 id="chart-heading" className="section-heading">Recent Mood</h2>
          <div className="mood-bars" role="img" aria-label="Bar chart of mood over recent days">
            {recentEntries.map((e) => (
              <MoodBar key={e.id} date={e.date} mood={e.mood} />
            ))}
          </div>
        </section>
      )}

      {entries.length === 0 && (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true">🧘</span>
          <h2>Start Your Wellness Journey</h2>
          <p>Log your first daily check-in to begin tracking your mental well-being.</p>
        </div>
      )}
    </div>
  )
}

Dashboard.propTypes = {
  onNavigate: PropTypes.func.isRequired,
}
