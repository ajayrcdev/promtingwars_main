import { useState, useEffect, useRef } from 'react'
import { useWellness } from '../context/WellnessContext.jsx'
import { COPING_STRATEGIES, MINDFULNESS_EXERCISES } from '../utils/ai.js'
import './CheckIn.css'

const MOOD_LABELS = ['Terrible', 'Very Low', 'Low', 'Down', 'Okay', 'Decent', 'Good', 'Great', 'Excellent', 'Amazing']
const SUBJECTS = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'School', 'Other']

export default function CheckIn({ onDone }) {
  const { todayEntry, addEntry } = useWellness()
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

  function toggleSubject(subj) {
    setSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    )
  }

  function handleSubmit() {
    if (!journal.trim()) return
    setSubmitting(true)
    const entry = addEntry({
      mood,
      stressLevel: stress,
      journal: journal.trim(),
      sleepHours: sleep,
      exerciseMinutes: exercise,
      subjects,
    })
    setCopingStrategy(entry.analysis.recommendation)
    setDone(true)
    setSubmitting(false)
  }

  function getMoodEmoji(val) {
    if (val <= 2) return '😢'
    if (val <= 4) return '😟'
    if (val <= 5) return '😐'
    if (val <= 7) return '🙂'
    if (val <= 8) return '😊'
    return '🌟'
  }

  if (done) {
    return (
      <div className="checkin checkin-done">
        <div className="done-animation">✨</div>
        <h2>Check-in Complete!</h2>
        <p className="done-sub">Your entry has been analyzed by AI.</p>

        {copingStrategy && copingStrategy.title && (
          <div className="strategy-card">
            <h4>🧘 Recommended: {copingStrategy.title}</h4>
            <p>{copingStrategy.desc}</p>
          </div>
        )}

        <button className="btn-primary btn-large" onClick={onDone}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="checkin">
      <div className="checkin-progress">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`progress-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="step fadeIn">
          <h2>How are you feeling?</h2>
          <p className="step-sub">Rate your overall mood today</p>
          <div className="mood-display">
            <span className="mood-emoji">{getMoodEmoji(mood)}</span>
            <span className="mood-score">{mood}/10</span>
            <span className="mood-label">{MOOD_LABELS[mood - 1]}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={e => setMood(Number(e.target.value))}
            className="mood-slider"
          />
          <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="step fadeIn">
          <h2>Stress & Lifestyle</h2>
          <div className="slider-group">
            <label>Stress Level: <strong>{stress}/10</strong></label>
            <input type="range" min="1" max="10" value={stress} onChange={e => setStress(Number(e.target.value))} className="mood-slider stress-slider" />
          </div>
          <div className="slider-group">
            <label>Sleep: <strong>{sleep}h</strong></label>
            <input type="range" min="0" max="12" step="0.5" value={sleep} onChange={e => setSleep(Number(e.target.value))} className="mood-slider" />
          </div>
          <div className="slider-group">
            <label>Exercise: <strong>{exercise}min</strong></label>
            <input type="range" min="0" max="120" step="5" value={exercise} onChange={e => setExercise(Number(e.target.value))} className="mood-slider" />
          </div>
          <button className="btn-primary" onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="step fadeIn">
          <h2>What are you preparing for?</h2>
          <p className="step-sub">Select all that apply</p>
          <div className="subject-grid">
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={`subject-chip ${subjects.includes(s) ? 'selected' : ''}`}
                onClick={() => toggleSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(4)}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div className="step fadeIn">
          <h2>Write your journal</h2>
          <p className="step-sub">How was your day? What's on your mind?</p>
          <textarea
            ref={journalRef}
            className="journal-input"
            placeholder="Today I felt… because… I wish…"
            rows={7}
            value={journal}
            onChange={e => setJournal(e.target.value)}
            maxLength={2000}
          />
          <span className="char-count">{journal.length}/2000</span>
          <button
            className="btn-primary btn-large"
            onClick={handleSubmit}
            disabled={!journal.trim() || submitting}
          >
            {submitting ? 'Analyzing…' : 'Complete Check-in ✨'}
          </button>
        </div>
      )}
    </div>
  )
}
