import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useWellness } from '../context/WellnessContext.jsx'
import './JournalHistory.css'

function JournalEntry({ entry, isLatest }) {
  const dateStr = useMemo(
    () => new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    }),
    [entry.date]
  )

  return (
    <article className={`journal-entry ${isLatest ? 'latest' : ''}`} aria-label={`Journal entry from ${dateStr}`}>
      <header className="entry-header">
        <span className="entry-date">{dateStr}</span>
        <div className="entry-badges">
          <span className="badge mood-badge">Mood: {entry.mood}/10</span>
          <span className={`badge sentiment-badge ${entry.analysis?.sentiment || 'neutral'}`}>
            {entry.analysis?.sentiment || 'Neutral'}
          </span>
        </div>
      </header>

      <p className="entry-text">{entry.journal}</p>

      {entry.analysis?.stressTriggers?.length > 0 && (
        <div className="entry-triggers" role="list" aria-label="Detected stress triggers">
          {entry.analysis.stressTriggers.map(t => (
            <span key={t.id} className="trigger-tag" role="listitem">{t.label}</span>
          ))}
        </div>
      )}

      {entry.analysis?.examContext && (
        <p className="entry-exam">
          <span aria-hidden="true">📚</span> Context: {entry.analysis.examContext}
        </p>
      )}

      {entry.analysis?.motivational && (
        <p className="entry-motivation" role="status">
          <span aria-hidden="true">💙</span> {entry.analysis.motivational}
        </p>
      )}

      {entry.subjects?.length > 0 && (
        <div className="entry-subjects" role="list" aria-label="Subjects">
          {entry.subjects.map(s => (
            <span key={s} className="subject-tag" role="listitem">{s}</span>
          ))}
        </div>
      )}
    </article>
  )
}

JournalEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  isLatest: PropTypes.bool,
}

export default function JournalHistory() {
  const { entries } = useWellness()

  if (!entries.length) {
    return (
      <div className="journal-page" role="region" aria-label="Journal history">
        <div className="empty-page">
          <span className="empty-icon" aria-hidden="true">📖</span>
          <h2>No journal entries yet</h2>
          <p>Start your daily check-in to build your journal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="journal-page" role="region" aria-label="Journal history">
      <header className="page-header">
        <h1>Journal</h1>
        <span className="entry-count" aria-label={`${entries.length} total entries`}>
          {entries.length} entries
        </span>
      </header>

      <div className="journal-list">
        {entries.map((entry, i) => (
          <JournalEntry key={entry.id} entry={entry} isLatest={i === 0} />
        ))}
      </div>
    </div>
  )
}
