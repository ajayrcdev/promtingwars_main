const COPING_STRATEGIES = [
  { title: '4-7-8 Breathing', desc: 'Inhale for 4s, hold for 7s, exhale for 8s. Calms nervous system.' },
  { title: 'Body Scan', desc: 'Close your eyes and mentally scan from head to toe, releasing tension.' },
  { title: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.' },
  { title: 'Thought Defusion', desc: 'Imagine your thoughts as clouds passing by—observe without attaching.' },
  { title: 'Box Breathing', desc: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 cycles.' },
  { title: 'Gratitude Pause', desc: 'List 3 things you are grateful for right now, however small.' },
  { title: 'Progressive Relaxation', desc: 'Tense each muscle group for 5s, then release completely.' },
  { title: 'Visualization', desc: 'Picture a calm place—beach, forest, mountain—engage all senses.' },
]

const MINDFULNESS_EXERCISES = [
  { title: 'One-Minute Breath', desc: 'Simply watch your breath for 60 seconds. In… out…' },
  { title: 'Raisin Exercise', desc: 'Pick a small object. Examine it like you have never seen one before.' },
  { title: 'Walking Meditation', desc: 'Walk slowly, feeling each footfall. Notice the air on your skin.' },
  { title: 'Loving-Kindness', desc: 'Silently repeat: May I be happy. May I be healthy. May I be at peace.' },
  { title: 'Listening Meditation', desc: 'Close your eyes. Listen to the farthest sound you can hear.' },
]

const MOTIVATIONAL = [
  'Your effort today is building a stronger tomorrow. Keep going.',
  'Progress, not perfection. Every step counts.',
  'You\'ve overcome every difficult day so far. This one is no different.',
  'Rest is not weakness—it is how champions recharge.',
  'This moment of stress is temporary. Your strength is permanent.',
  'You are exactly where you need to be. Trust the process.',
  'Small consistent steps lead to extraordinary results.',
  'Your mind is your most powerful tool—nurture it with kindness.',
  'It\'s okay to not be okay. What matters is that you reached out.',
  'You are more resilient than you know. This too shall pass.',
]

const EXAM_STRESS_KEYWORDS = {
  'jee': ['math', 'physics', 'chemistry', 'iit', 'entrance', 'numericals', 'organic'],
  'neet': ['biology', 'botany', 'zoology', 'medical', 'mbbs', 'ncert', 'coaching'],
  'cuet': ['commerce', 'accounts', 'economics', 'business', 'english', 'general test'],
  'cat': ['quant', 'dilr', 'varc', 'mba', 'percentile', 'mock', 'sectional'],
  'gate': ['engineering', 'aptitude', 'technical', 'ece', 'cse', 'mech', 'civil'],
  'upsc': ['prelims', 'mains', 'interview', 'current affairs', 'optional', 'gs'],
}

const STRESS_TRIGGER_PATTERNS = {
  'comparison': ['everyone else', 'friends are', 'others are', 'they all', 'everyone is ahead'],
  'self_doubt': ['not enough', 'i can\'t', 'i will fail', 'not smart', 'never', 'hopeless', 'stupid'],
  'overload': ['too much', 'overwhelmed', 'can\'t handle', 'so much', 'endless', 'backlog'],
  'procrastination': ['wasted', 'didn\'t study', 'scrolling', 'distracted', 'lazy', 'procrastinate'],
  'burnout': ['exhausted', 'tired', 'no energy', 'drained', 'sleepy', 'can\'t focus'],
  'exam_anxiety': ['exam', 'test', 'paper', 'result', 'marks', 'score', 'rank', 'percentile'],
  'perfectionism': ['perfect', 'must get', 'should have', 'not good enough', 'mistake', 'error'],
}

function analyzeSentiment(text) {
  const positive = ['good', 'great', 'happy', 'better', 'improved', 'proud', 'confident', 'calm', 'peaceful', 'hopeful', 'progress', 'managed', 'solved', 'understood']
  const negative = ['stressed', 'anxious', 'worried', 'sad', 'angry', 'frustrated', 'scared', 'panic', 'hopeless', 'tired', 'overwhelmed', 'depressed', 'nervous']

  const lower = text.toLowerCase()
  let posCount = 0, negCount = 0

  for (const word of positive) {
    if (lower.includes(word)) posCount++
  }
  for (const word of negative) {
    if (lower.includes(word)) negCount++
  }

  if (posCount > negCount + 1) return 'positive'
  if (negCount > posCount + 1) return 'negative'
  return 'neutral'
}

function detectStressTriggers(text) {
  const triggers = []
  const lower = text.toLowerCase()

  for (const [trigger, patterns] of Object.entries(STRESS_TRIGGER_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        triggers.push(trigger)
        break
      }
    }
  }

  return triggers.length ? [...new Set(triggers)] : ['general']
}

function detectExamContext(text) {
  const lower = text.toLowerCase()
  for (const [exam, keywords] of Object.entries(EXAM_STRESS_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return exam.toUpperCase()
    }
  }
  return null
}

function getThematicPatterns(history) {
  if (history.length < 2) return []

  const recent = history.slice(-7)
  const allText = recent.map(e => e.journal.toLowerCase()).join(' ')
  const patterns = []

  if (allText.includes('sleep') || allText.includes('tired') || allText.includes('exhausted')) {
    patterns.push('Sleep/energy concerns — consider adjusting your sleep schedule for better recovery')
  }
  if (allText.includes('comparison') || allText.includes('everyone else') || allText.includes('behind')) {
    patterns.push('Social comparison tendency — your journey is unique, focus on your own progress')
  }
  if (allText.includes('mock') || allText.includes('test') || allText.includes('exam')) {
    patterns.push('Exam-focused stress — try breaking study sessions into smaller, manageable chunks')
  }
  if (allText.includes('overwhelm') || allText.includes('too much') || allText.includes('backlog')) {
    patterns.push('Signs of overwhelm — prioritize using the Eisenhower matrix (urgent vs important)')
  }
  if (allText.includes('focus') || allText.includes('concentrat') || allText.includes('distracted')) {
    patterns.push('Focus challenges — try the Pomodoro technique (25min work, 5min break)')
  }

  return patterns
}

function getTrend(history) {
  if (history.length < 3) return null
  const recent = history.slice(-7)
  const moods = recent.map(e => e.mood)
  const avg = moods.reduce((a, b) => a + b, 0) / moods.length
  const prev = history.slice(-14, -7)
  const prevAvg = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : null

  if (prevAvg && avg > prevAvg + 0.5) return { direction: 'improving', label: 'Your mood is trending upward! 🌱', avg: Math.round(avg * 10) / 10 }
  if (prevAvg && avg < prevAvg - 0.5) return { direction: 'declining', label: 'Your mood has dipped recently — let\'s check in 💙', avg: Math.round(avg * 10) / 10 }
  return { direction: 'stable', label: 'Your mood is stable — that\'s good!', avg: Math.round(avg * 10) / 10 }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getPersonalizedRecommendation(entry, history) {
  const lower = entry.journal.toLowerCase()
  const sentiment = entry.analysis.sentiment

  if (sentiment === 'negative') {
    if (entry.mood <= 3) {
      return 'Your mood is quite low. Consider speaking with a trusted friend, family member, or counselor. You don\'t have to go through this alone.'
    }
    return pickRandom(COPING_STRATEGIES)
  }

  if (entry.mood >= 8) {
    return 'You\'re doing great! Channel this positive energy into your studies, and remember how this feels for tougher days.'
  }

  if (lower.includes('exam') || lower.includes('test') || lower.includes('stud')) {
    return pickRandom(COPING_STRATEGIES)
  }

  return pickRandom(MINDFULNESS_EXERCISES)
}

export function analyzeEntry(entry, history) {
  const sentiment = analyzeSentiment(entry.journal)
  const stressTriggers = detectStressTriggers(entry.journal)
  const examContext = detectExamContext(entry.journal)
  const recommendation = getPersonalizedRecommendation(entry, history)
  const thematicPatterns = getThematicPatterns(history)
  const trend = getTrend(history)
  const motivational = pickRandom(MOTIVATIONAL)

  const triggerLabels = {
    comparison: 'Comparing yourself to others',
    self_doubt: 'Self-doubt & negative self-talk',
    overload: 'Feeling overwhelmed by workload',
    procrastination: 'Procrastination & time management',
    burnout: 'Burnout & exhaustion',
    exam_anxiety: 'Exam-related anxiety',
    perfectionism: 'Perfectionist tendencies',
    general: 'General study-related stress',
  }

  return {
    sentiment,
    stressTriggers: stressTriggers.map(t => ({ id: t, label: triggerLabels[t] || t })),
    examContext,
    thematicPatterns,
    trend,
    recommendation,
    motivational,
  }
}

export function generateChatResponse(userMessage, history) {
  const lower = userMessage.toLowerCase()

  const greetingResponses = [
    'Hey there! 💙 I\'m here for you. How are you feeling today?',
    'Hi! Thanks for reaching out. What\'s on your mind?',
    'Hello! I\'m glad you\'re here. Tell me what\'s going on.',
  ]

  const stressedResponses = [
    'I hear you. Stress is a signal, not a weakness. Let\'s take a deep breath together. Try breathing in for 4 counts… hold for 4… and out for 4. How does that feel?',
    'It\'s completely normal to feel stressed with everything on your plate. Remember—you\'re preparing for something big because you\'re capable of achieving big things. Let\'s break this down. What feels most overwhelming right now?',
    'Your feelings are valid. Stress often comes from caring deeply about the outcome. Instead of fighting the stress, try accepting it as a sign that you\'re pushing yourself. Now let\'s find a way to make it manageable.',
  ]

  const anxiousResponses = [
    'Anxiety is your brain trying to protect you, but sometimes it goes into overdrive. Let\'s try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Take your time. 🧘',
    'I understand that anxious feeling. It\'s like your mind is running a marathon while your body is standing still. Let\'s slow things down. Can you drink a glass of water slowly? Sometimes physical grounding helps the mind follow.',
  ]

  const studyResponses = [
    'Studying for long hours can be draining. Remember the Pomodoro technique: study for 25 minutes, then take a 5-minute break. Your brain needs those rest intervals to consolidate information!',
    'I can tell you\'re working hard. Just remember—consistency beats intensity. Studying for 4 focused hours every day beats 12 hours of burnout-driven cramming. How are your breaks looking?',
  ]

  const sadResponses = [
    'I\'m sorry you\'re feeling this way. Your feelings matter, and it\'s okay to not be okay. Sometimes the bravest thing we can do is simply acknowledge how we feel. Would you like to talk about what\'s bringing you down?',
    'That sounds really tough. 💙 Please remember that your worth is not determined by your exam scores or productivity. You are enough exactly as you are. What would make you feel even 1% better right now?',
  ]

  const motivationalRequest = [
    'You\'ve got this! Remember why you started. Every expert was once a beginner who never gave up. 🌟',
    'Here\'s something to hold onto: "Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
    'You are capable of amazing things. The fact that you\'re worried about your performance proves that you care deeply. And that care + consistent effort = inevitable growth.',
    'Think of yourself as a seed underground. You can\'t see growth yet, but the roots are developing strong. Your breakthrough is coming. 🌱',
  ]

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
    return pickRandom(greetingResponses)
  }
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('too much')) {
    return pickRandom(stressedResponses)
  }
  if (lower.includes('anxious') || lower.includes('panic') || lower.includes('nervous') || lower.includes('worried')) {
    return pickRandom(anxiousResponses)
  }
  if (lower.includes('study') || lower.includes('focus') || lower.includes('concentrat') || lower.includes('read') || lower.includes('syllabus')) {
    return pickRandom(studyResponses)
  }
  if (lower.includes('sad') || lower.includes('depress') || lower.includes('lonely') || lower.includes('down') || lower.includes('cry')) {
    return pickRandom(sadResponses)
  }
  if (lower.includes('motiv') || lower.includes('encourage') || lower.includes('inspire') || lower.includes('give up') || lower.includes('quit')) {
    return pickRandom(motivationalRequest)
  }

  const fallbacks = [
    'Thank you for sharing that with me. Can you tell me more about how that makes you feel?',
    'I appreciate you opening up. How has your energy level been today on a scale of 1-10?',
    'That\'s really helpful context. What do you think would help you feel even slightly better right now?',
    'I\'m listening. Sometimes just saying things out loud can make them feel more manageable. What\'s the first step you could take toward feeling better?',
    'That makes sense given everything you\'re dealing with. Remember—you\'re not alone in this. Many students face similar challenges. What helped you cope last time you felt this way?',
    'I hear you. Let me ask—is there one small thing you could do in the next 10 minutes that would bring you a little peace?',
  ]

  return pickRandom(fallbacks)
}

export { COPING_STRATEGIES, MINDFULNESS_EXERCISES, MOTIVATIONAL }
