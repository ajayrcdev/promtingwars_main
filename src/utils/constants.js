const CRISIS_RESOURCES = [
  { name: 'National Suicide Prevention Lifeline', number: '988', url: 'https://988lifeline.org' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', url: 'https://www.samhsa.gov/find-help/national-helpline' },
  { name: 'National Helpline (India)', number: '1800-891-4416', url: 'https://www.jeevansathi.com' },
]

const EXAM_LIST = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'School', 'Other']

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

const STORAGE_WARNING = 'Your Gemini API key is stored in your browser\'s localStorage. For production use, consider using a proxy server to avoid exposing your key to client-side access.'

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

export { CRISIS_RESOURCES, EXAM_LIST, MOOD_LABELS, STRESS_TRIGGER_LABELS, STORAGE_WARNING, sanitizeInput }
