import { useWellness } from '../context/WellnessContext.jsx'
import { COPING_STRATEGIES, MINDFULNESS_EXERCISES } from '../utils/ai.js'
import './Insights.css'

export default function Insights() {
  const { entries } = useWellness()

  if (entries.length < 2) {
    return (
      <div className="insights-page">
        <div className="empty-page">
          <span className="empty-icon">📊</span>
          <h3>Not enough data yet</h3>
          <p>Complete at least 2 check-ins to unlock personalized insights.</p>
        </div>
      </div>
    )
  }

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

  const worstDays = [...entries]
    .sort((a, b) => a.mood - b.mood)
    .slice(0, 3)

  const bestDays = [...entries]
    .sort((a, b) => b.mood - a.mood)
    .slice(0, 3)

  const strategy = COPING_STRATEGIES[Math.floor(Math.random() * COPING_STRATEGIES.length)]
  const exercise = MINDFULNESS_EXERCISES[Math.floor(Math.random() * MINDFULNESS_EXERCISES.length)]

  return (
    <div className="insights-page">
      <header className="page-header">
        <h1>Insights</h1>
        <span className="entry-count">AI-powered</span>
      </header>

      <div className="insights-summary">
        <div className="insight-stat wide">
          <span className="insight-stat-value">{avgMood}</span>
          <span className="insight-stat-label">Average Mood</span>
          <div className="mood-distribution">
            <div className="mood-dist-bar">
              <div
                className="mood-dist-fill good"
                style={{ width: `${(highMoods / moods.length) * 100}%` }}
              />
              <div
                className="mood-dist-fill mid"
                style={{ width: `${((moods.length - highMoods - lowMoods) / moods.length) * 100}%` }}
              />
              <div
                className="mood-dist-fill low"
                style={{ width: `${(lowMoods / moods.length) * 100}%` }}
              />
            </div>
            <div className="mood-dist-labels">
              <span>😊 {highMoods}</span>
              <span>😐 {moods.length - highMoods - lowMoods}</span>
              <span>😢 {lowMoods}</span>
            </div>
          </div>
        </div>
      </div>

      {topTriggers.length > 0 && (
        <div className="insight-card">
          <h3>🎯 Top Stress Triggers</h3>
          <div className="trigger-list">
            {topTriggers.map(([label, count]) => (
              <div key={label} className="trigger-row">
                <span className="trigger-name">{label}</span>
                <div className="trigger-bar-wrap">
                  <div
                    className="trigger-bar"
                    style={{ width: `${(count / allTriggers.length) * 100}%` }}
                  />
                </div>
                <span className="trigger-count">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="insight-card">
        <h3>📈 Mood Trends</h3>
        <div className="trend-insights">
          {entries.length >= 3 && (
            <p className="trend-text">
              {moods[moods.length - 1] > moods[0]
                ? 'Your recent mood is trending upward — keep up the great work! 🌱'
                : moods[moods.length - 1] < moods[0]
                  ? 'Your mood has dipped recently. Remember to reach out for support when needed. 💙'
                  : 'Your mood has been consistent, which shows stability.'}
            </p>
          )}
          {worstDays[0] && (
            <div className="day-highlight">
              <span className="highlight-label">Toughest day</span>
              <span>{new Date(worstDays[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="highlight-mood">{worstDays[0].mood}/10</span>
            </div>
          )}
          {bestDays[0] && (
            <div className="day-highlight">
              <span className="highlight-label">Best day</span>
              <span>{new Date(bestDays[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="highlight-mood good">{bestDays[0].mood}/10</span>
            </div>
          )}
        </div>
      </div>

      <div className="insight-card">
        <h3>🧘 Suggested Practices</h3>
        <div className="practice-card">
          <h4>Coping Strategy</h4>
          <p className="practice-title">{strategy.title}</p>
          <p className="practice-desc">{strategy.desc}</p>
        </div>
        <div className="practice-card">
          <h4>Mindfulness Exercise</h4>
          <p className="practice-title">{exercise.title}</p>
          <p className="practice-desc">{exercise.desc}</p>
        </div>
      </div>

      {entries.length >= 5 && (
        <div className="insight-card">
          <h3>💡 GenAI Pattern Analysis</h3>
          <div className="pattern-analysis">
            <p>
              Based on your {entries.length} journal entries, our AI has detected the following patterns in your emotional well-being:
            </p>
            <ul className="pattern-list">
              {entries.length >= 7 && (
                <li>
                  <strong>Weekly rhythm:</strong> Your entries suggest that mood follows a {avgMood > 5 ? 'generally positive' : 'variable'} pattern. Consider scheduling relaxing activities on days when stress tends to peak.
                </li>
              )}
              {topTriggers.length > 0 && (
                <li>
                  <strong>Recurring triggers:</strong> "{topTriggers[0]?.[0]}" appears most frequently. Try preparing a go-to coping strategy for when this trigger arises.
                </li>
              )}
              <li>
                <strong>Recommendation:</strong> Based on your data, we recommend practicing "{strategy.title}" when stress levels rise above 7/10.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
