const CRISIS_RESOURCES = [
  { name: 'National Suicide Prevention Lifeline', number: '988', url: 'https://988lifeline.org' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', url: 'https://www.samhsa.gov/find-help/national-helpline' },
  { name: 'iCall (India)', number: '9152987821', url: 'https://www.icallhelpline.org' },
  { name: 'Vandrevala Helpline (India)', number: '1860-266-2345', url: 'https://www.vandrevalafoundation.com' },
  { name: 'Jeevan Saathi (India)', number: '1800-891-4416', url: 'https://www.jeevansathi.com' },
]

const EXAM_LIST = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'CLAT', 'NDA', 'Banking', 'SSC', 'School', 'Other']

const STUDY_TIPS = [
  { title: 'Pomodoro Technique', desc: 'Study for 25 min, break for 5 min. Repeat 4x, then take a longer break.' },
  { title: 'Active Recall', desc: 'Close your book and try to recall what you just studied. Strengthens memory.' },
  { title: 'Spaced Repetition', desc: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 1 month.' },
  { title: 'Mind Mapping', desc: 'Create visual maps connecting key concepts. Great for revision.' },
  { title: 'Teach Someone', desc: 'Explain concepts aloud as if teaching. Reveals gaps in understanding.' },
]

const MOOD_LABELS = ['Terrible', 'Very Low', 'Low', 'Down', 'Okay', 'Decent', 'Good', 'Great', 'Excellent', 'Amazing']

const STRESS_TRIGGER_LABELS = {
  comparison: 'Comparing yourself to others',
  self_doubt: 'Self-doubt & negative self-talk',
  overload: 'Feeling overwhelmed by workload',
  procrastination: 'Procrastination & time management',
  burnout: 'Burnout & exhaustion',
  exam_anxiety: 'Exam-related anxiety',
  perfectionism: 'Perfectionist tendencies',
  general: 'General study-related stress',
}

const STORAGE_WARNING = 'Your API key is stored in your browser\'s localStorage. For production use, consider using a proxy server to avoid exposing your key to client-side access.'

function sanitizeInput(text) {
  if (typeof text !== 'string') return ''
  return text.replace(/[<>&"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#x27;',
  }[char]))
}

export { CRISIS_RESOURCES, EXAM_LIST, MOOD_LABELS, STRESS_TRIGGER_LABELS, STORAGE_WARNING, STUDY_TIPS, sanitizeInput }
