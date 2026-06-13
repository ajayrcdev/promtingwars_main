import { useWellness } from '../context/WellnessContext.jsx'
import './JournalHistory.css'

export default function JournalHistory() {
  const { entries } = useWellness()

  if (!entries.length) {
    return (
      <div className="journal-page">
        <div className="empty-page">
          <span className="empty-icon">📖</span>
          <h3>No journal entries yet</h3>
          <p>Start your daily check-in to build your journal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="journal-page">
      <header className="page-header">
        <h1>Journal</h1>
        <span className="entry-count">{entries.length} entries</span>
      </header>

      <div className="journal-list">
        {entries.map((entry, i) => (
          <div key={entry.id} className={`journal-entry ${i === 0 ? 'latest' : ''}`}>
            <div className="entry-header">
              <span className="entry-date">
                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                })}
              </span>
              <div className="entry-badges">
                <span className="badge mood-badge">
                  Mood: {entry.mood}/10
                </span>
                <span className={`badge sentiment-badge ${entry.analysis?.sentiment || 'neutral'}`}>
                  {entry.analysis?.sentiment || 'Neutral'}
                </span>
              </div>
            </div>

            <p className="entry-text">{entry.journal}</p>

            {entry.analysis?.stressTriggers?.length > 0 && (
              <div className="entry-triggers">
                {entry.analysis.stressTriggers.map(t => (
                  <span key={t.id} className="trigger-tag">{t.label}</span>
                ))}
              </div>
            )}

            {entry.analysis?.examContext && (
              <div className="entry-exam">
                📚 Context: {entry.analysis.examContext}
              </div>
            )}

            {entry.analysis?.motivational && (
              <div className="entry-motivation">
                💙 {entry.analysis.motivational}
              </div>
            )}

            {entry.subjects?.length > 0 && (
              <div className="entry-subjects">
                {entry.subjects.map(s => (
                  <span key={s} className="subject-tag">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
