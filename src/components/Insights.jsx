import { useMemo } from 'react'
import { useWellness } from '../context/WellnessContext.jsx'
import { COPING_STRATEGIES, MINDFULNESS_EXERCISES } from '../utils/ai.js'
import './Insights.css'

export default function Insights() {
  const { entries } = useWellness()

  const stats = useMemo(() => {
    if (entries.length < 2) return null
    const recent = entries.slice(0, 14)
    const moods = recent.map(e => e.mood)
    const avgMood = (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
    const lowMoods = moods.filter(m => m <= 4).length
    const highMoods = moods.filter(m => m >= 7).length

    const allTriggers = entries.flatMap(e => e.analysis?.stressTriggers || [])
    const triggerCounts = {}
    for (const t of allTriggers) {
      triggerCounts[t.label] = (triggerCounts[t.label] || 0) + 1
    }
    const topTriggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const sortedByMood = [...entries].sort((a, b) => a.mood - b.mood)
    const worstDays = sortedByMood.slice(0, 3)
    const bestDays = [...sortedByMood].reverse().slice(0, 3)

    const strategy = COPING_STRATEGIES[Math.floor(Math.random() * COPING_STRATEGIES.length)]
    const exercise = MINDFULNESS_EXERCISES[Math.floor(Math.random() * MINDFULNESS_EXERCISES.length)]

    return { avgMood, lowMoods, highMoods, total: moods.length, topTriggers, allTriggers: allTriggers.length, worstDays, bestDays, strategy, exercise }
  }, [entries])

  if (!stats) {
    return (
      <div className="insights-page" role="region" aria-label="Wellness insights">
        <div className="empty-page">
          <span className="empty-icon" aria-hidden="true">📊</span>
          <h2>Not enough data yet</h2>
          <p>Complete at least 2 check-ins to unlock personalized insights.</p>
        </div>
      </div>
    )
  }

  const trendText = entries.length >= 3
    ? entries[0].mood > entries[entries.length - 1].mood
      ? 'Your recent mood is trending upward — keep up the great work! 🌱'
      : entries[0].mood < entries[entries.length - 1].mood
        ? 'Your mood has dipped recently. Remember to reach out for support when needed. 💙'
        : 'Your mood has been consistent, which shows stability.'
    : ''

  return (
    <div className="insights-page" role="region" aria-label="Wellness insights">
      <header className="page-header">
        <h1>Insights</h1>
        <span className="entry-count">AI-powered</span>
      </header>

      <section className="insights-summary" aria-label="Key metrics">
        <div className="insight-stat wide">
          <span className="insight-stat-value">{stats.avgMood}</span>
          <span className="insight-stat-label">Average Mood</span>
          <div className="mood-distribution">
            <div className="mood-dist-bar" role="img" aria-label={`Mood distribution: ${stats.highMoods} good, ${stats.total - stats.highMoods - stats.lowMoods} neutral, ${stats.lowMoods} low days`}>
              <div className="mood-dist-fill good" style={{ width: `${(stats.highMoods / stats.total) * 100}%` }} />
              <div className="mood-dist-fill mid" style={{ width: `${((stats.total - stats.highMoods - stats.lowMoods) / stats.total) * 100}%` }} />
              <div className="mood-dist-fill low" style={{ width: `${(stats.lowMoods / stats.total) * 100}%` }} />
            </div>
            <div className="mood-dist-labels">
              <span>
                <span aria-hidden="true">😊</span> {stats.highMoods}
              </span>
              <span>
                <span aria-hidden="true">😐</span> {stats.total - stats.highMoods - stats.lowMoods}
              </span>
              <span>
                <span aria-hidden="true">😢</span> {stats.lowMoods}
              </span>
            </div>
          </div>
        </div>
      </section>

      {stats.topTriggers.length > 0 && (
        <section className="insight-card" aria-label="Top stress triggers">
          <h2>
            <span aria-hidden="true">🎯</span> Top Stress Triggers
          </h2>
          <div className="trigger-list">
            {stats.topTriggers.map(([label, count]) => (
              <div key={label} className="trigger-row">
                <span className="trigger-name">{label}</span>
                <div className="trigger-bar-wrap">
                  <div className="trigger-bar" style={{ width: `${(count / stats.allTriggers) * 100}%` }} />
                </div>
                <span className="trigger-count">{count}x</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="insight-card" aria-label="Mood trends">
        <h2>
          <span aria-hidden="true">📈</span> Mood Trends
        </h2>
        <div className="trend-insights">
          {trendText && <p className="trend-text">{trendText}</p>}
          {stats.worstDays[0] && (
            <div className="day-highlight">
              <span className="highlight-label">Toughest day</span>
              <span>{new Date(stats.worstDays[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="highlight-mood">{stats.worstDays[0].mood}/10</span>
            </div>
          )}
          {stats.bestDays[0] && (
            <div className="day-highlight">
              <span className="highlight-label">Best day</span>
              <span>{new Date(stats.bestDays[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="highlight-mood good">{stats.bestDays[0].mood}/10</span>
            </div>
          )}
        </div>
      </section>

      <section className="insight-card" aria-label="Suggested wellness practices">
        <h2>
          <span aria-hidden="true">🧘</span> Suggested Practices
        </h2>
        <div className="practice-card">
          <h3>Coping Strategy</h3>
          <p className="practice-title">{stats.strategy.title}</p>
          <p className="practice-desc">{stats.strategy.desc}</p>
        </div>
        <div className="practice-card">
          <h3>Mindfulness Exercise</h3>
          <p className="practice-title">{stats.exercise.title}</p>
          <p className="practice-desc">{stats.exercise.desc}</p>
        </div>
      </section>

      {entries.length >= 5 && (
        <section className="insight-card" aria-label="AI pattern analysis">
          <h2>
            <span aria-hidden="true">💡</span> GenAI Pattern Analysis
          </h2>
          <div className="pattern-analysis">
            <p>Based on your {entries.length} journal entries, here are your emotional patterns:</p>
            <ul className="pattern-list">
              <li>
                <strong>Weekly rhythm:</strong> Your mood follows a{' '}
                {Number(stats.avgMood) > 5 ? 'generally positive' : 'variable'} pattern.
              </li>
              {stats.topTriggers.length > 0 && (
                <li>
                  <strong>Recurring trigger:</strong> &ldquo;{stats.topTriggers[0][0]}&rdquo; appears most frequently.
                </li>
              )}
              <li>
                <strong>Recommendation:</strong> Try &ldquo;{stats.strategy.title}&rdquo; when stress exceeds 7/10.
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
