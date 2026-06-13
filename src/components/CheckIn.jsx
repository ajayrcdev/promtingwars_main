import { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useWellness } from '../context/WellnessContext.jsx'
import { MOOD_LABELS, EXAM_LIST } from '../utils/constants.js'
import { COPING_STRATEGIES } from '../utils/ai.js'
import './CheckIn.css'

export default function CheckIn({ onDone }) {
  const { todayEntry, addEntry, analyzingEntry } = useWellness()
  const [step, setStep] = useState(todayEntry ? 4 : 1)
  const [mood, setMood] = useState(todayEntry?.mood || 5)
  const [stress, setStress] = useState(todayEntry?.stressLevel || 5)
  const [journal, setJournal] = useState(todayEntry?.journal || '')
  const [sleep, setSleep] = useState(todayEntry?.sleepHours || 7)
  const [exercise, setExercise] = useState(todayEntry?.exerciseMinutes || 0)
  const [subjects, setSubjects] = useState(todayEntry?.subjects || [])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [copingStrategy, setCopingStrategy] = useState(null)
  const journalRef = useRef(null)

  useEffect(() => {
    if (step === 4 && journalRef.current) {
      journalRef.current.focus()
    }
  }, [step])

  const toggleSubject = useCallback((subj) => {
    setSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    )
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!journal.trim() || submitting) return
    setSubmitting(true)
    const entry = await addEntry({
      mood,
      stressLevel: stress,
      journal: journal.trim(),
      sleepHours: sleep,
      exerciseMinutes: exercise,
      subjects,
    })
    setCopingStrategy(entry.analysis?.recommendation || null)
    setDone(true)
    setSubmitting(false)
  }, [journal, mood, stress, sleep, exercise, subjects, submitting, addEntry])

  const getMoodEmoji = useCallback((val) => {
    if (val <= 2) return '😢'
    if (val <= 4) return '😟'
    if (val <= 5) return '😐'
    if (val <= 7) return '🙂'
    if (val <= 8) return '😊'
    return '🌟'
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && step < 4) {
      e.preventDefault()
      setStep(s => s + 1)
    }
  }, [step])

  if (done) {
    return (
      <div className="checkin checkin-done" role="status" aria-live="polite">
        <div className="done-animation" aria-hidden="true">✨</div>
        <h2>Check-in Complete!</h2>
        <p className="done-sub">Your entry has been analyzed by AI.</p>

        {copingStrategy?.title && (
          <div className="strategy-card">
            <h3>
              <span aria-hidden="true">🧘</span> Recommended: {copingStrategy.title}
            </h3>
            <p>{copingStrategy.desc}</p>
          </div>
        )}

        <button
          className="btn-primary btn-large"
          onClick={onDone}
          aria-label="Go back to home"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="checkin" role="region" aria-label="Daily check-in form">
      <div className="checkin-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4} aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`progress-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
            aria-current={step === s ? 'step' : undefined}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="step fadeIn" onKeyDown={handleKeyDown}>
          <h2>How are you feeling?</h2>
          <p className="step-sub">Rate your overall mood today</p>
          <div className="mood-display">
            <span className="mood-emoji" aria-hidden="true">{getMoodEmoji(mood)}</span>
            <span className="mood-score" aria-live="polite">{mood}/10</span>
            <span className="mood-label">{MOOD_LABELS[mood - 1]}</span>
          </div>
          <label htmlFor="mood-slider" className="sr-only">Mood level: {mood} out of 10</label>
          <input
            id="mood-slider"
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={e => setMood(Number(e.target.value))}
            className="mood-slider"
            aria-valuenow={mood}
            aria-valuemin={1}
            aria-valuemax={10}
          />
          <button className="btn-primary" onClick={() => setStep(2)} aria-label="Next step">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="step fadeIn" onKeyDown={handleKeyDown}>
          <h2>Stress & Lifestyle</h2>
          <div className="slider-group">
            <label htmlFor="stress-slider">Stress Level: <strong>{stress}/10</strong></label>
            <input id="stress-slider" type="range" min="1" max="10" value={stress} onChange={e => setStress(Number(e.target.value))} className="mood-slider stress-slider" aria-valuenow={stress} aria-valuemin={1} aria-valuemax={10} />
          </div>
          <div className="slider-group">
            <label htmlFor="sleep-slider">Sleep: <strong>{sleep}h</strong></label>
            <input id="sleep-slider" type="range" min="0" max="12" step="0.5" value={sleep} onChange={e => setSleep(Number(e.target.value))} className="mood-slider" aria-valuenow={sleep} aria-valuemin={0} aria-valuemax={12} />
          </div>
          <div className="slider-group">
            <label htmlFor="exercise-slider">Exercise: <strong>{exercise}min</strong></label>
            <input id="exercise-slider" type="range" min="0" max="120" step="5" value={exercise} onChange={e => setExercise(Number(e.target.value))} className="mood-slider" aria-valuenow={exercise} aria-valuemin={0} aria-valuemax={120} />
          </div>
          <button className="btn-primary" onClick={() => setStep(3)} aria-label="Next step">Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="step fadeIn">
          <h2>What are you preparing for?</h2>
          <p className="step-sub">Select all that apply</p>
          <div className="subject-grid" role="group" aria-label="Exam subjects">
            {EXAM_LIST.map(s => (
              <button
                key={s}
                className={`subject-chip ${subjects.includes(s) ? 'selected' : ''}`}
                onClick={() => toggleSubject(s)}
                aria-pressed={subjects.includes(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(4)} aria-label="Next step">Next</button>
        </div>
      )}

      {step === 4 && (
        <div className="step fadeIn">
          <h2>Write your journal</h2>
          <p className="step-sub">How was your day? What&apos;s on your mind?</p>
          <label htmlFor="journal-input" className="sr-only">Journal entry</label>
          <textarea
            ref={journalRef}
            id="journal-input"
            className="journal-input"
            placeholder="Today I felt… because… I wish…"
            rows={7}
            value={journal}
            onChange={e => setJournal(e.target.value)}
            maxLength={2000}
            aria-describedby="char-count"
          />
          <span id="char-count" className="char-count" aria-live="polite">{journal.length}/2000</span>
          <button
            className="btn-primary btn-large"
            onClick={handleSubmit}
            disabled={!journal.trim() || submitting || analyzingEntry}
            aria-label={submitting ? 'Analyzing journal entry' : analyzingEntry ? 'Analyzing with AI' : 'Complete check-in'}
          >
            {analyzingEntry ? 'Analyzing with AI…' : submitting ? 'Saving…' : 'Complete Check-in ✨'}
          </button>
        </div>
      )}
    </div>
  )
}

CheckIn.propTypes = {
  onDone: PropTypes.func.isRequired,
}
