import { GoogleGenerativeAI } from '@google/generative-ai'

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

const ANALYSIS_PROMPT = `You are a compassionate mental wellness AI analyzing a student's daily journal entry for an exam-prep context (JEE, NEET, CUET, CAT, GATE, UPSC, etc.).

Analyze the journal entry below and return a JSON object with exactly these fields:
{
  "sentiment": "positive" | "negative" | "neutral",
  "stressTriggers": [{"id": "trigger_id", "label": "Human readable label"}],
  "examContext": "JEE" | "NEET" | "CUET" | "CAT" | "GATE" | "UPSC" | null,
  "thematicPatterns": ["pattern description string"],
  "recommendation": {"title": "strategy title", "desc": "strategy description"},
  "motivational": "short motivational message"
}

Available trigger IDs (use only these): comparison, self_doubt, overload, procrastination, burnout, exam_anxiety, perfectionism, general

For recommendation, pick one concrete coping strategy or mindfulness exercise with a clear title and brief description.

Journal entry: {{JOURNAL}}

Recent mood history (last 7 days): {{MOOD_HISTORY}}`

const CHAT_SYSTEM_PROMPT = `You are MindWell AI, an empathetic mental wellness companion for students preparing for high-stakes exams (JEE, NEET, CUET, CAT, GATE, UPSC). 

Your personality:
- Warm, compassionate, and non-judgmental
- You use simple, clear language
- You occasionally include emojis (💙🧘🌟🌱)
- You suggest practical coping strategies (breathing exercises, grounding techniques, study tips)
- You normalize their feelings without minimizing them

Guidelines:
- NEVER give medical advice or diagnose
- If someone seems in crisis, gently encourage them to speak with a trusted adult or professional
- Keep responses concise (2-4 sentences usually)
- Be specific and actionable in your suggestions

Always respond as MindWell AI, the student wellness companion.`

const TRIGGER_LABELS = {
  comparison: 'Comparing yourself to others',
  self_doubt: 'Self-doubt & negative self-talk',
  overload: 'Feeling overwhelmed by workload',
  procrastination: 'Procrastination & time management',
  burnout: 'Burnout & exhaustion',
  exam_anxiety: 'Exam-related anxiety',
  perfectionism: 'Perfectionist tendencies',
  general: 'General study-related stress',
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function parseAnalysisJSON(text) {
  try {
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

function buildMoodHistory(history) {
  return history.slice(-7).map(e => `Date: ${e.date}, Mood: ${e.mood}/10, Sentiment: ${e.analysis?.sentiment || 'unknown'}`).join('\n')
}

function buildAnalysisFallback(entry) {
  const sentiment = analyzeSentiment(entry.journal)
  const triggers = detectStressTriggers(entry.journal)
  const examContext = detectExamContext(entry.journal)
  const recommendation = pickRandom(COPING_STRATEGIES)

  return {
    sentiment,
    stressTriggers: triggers.map(t => ({ id: t, label: TRIGGER_LABELS[t] || t })),
    examContext,
    thematicPatterns: [],
    recommendation,
    motivational: pickRandom(MOTIVATIONAL),
  }
}

export async function analyzeEntryWithGemini(entry, history, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    },
  })

  const prompt = ANALYSIS_PROMPT
    .replace('{{JOURNAL}}', entry.journal)
    .replace('{{MOOD_HISTORY}}', buildMoodHistory(history))

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    })

    const text = result.response.text()
    const parsed = parseAnalysisJSON(text)

    if (parsed && parsed.sentiment && parsed.stressTriggers) {
      return {
        sentiment: parsed.sentiment,
        stressTriggers: parsed.stressTriggers.map(t => ({
          id: t.id,
          label: TRIGGER_LABELS[t.id] || t.label || t.id,
        })),
        examContext: parsed.examContext || null,
        thematicPatterns: parsed.thematicPatterns || [],
        recommendation: parsed.recommendation || pickRandom(COPING_STRATEGIES),
        motivational: parsed.motivational || pickRandom(MOTIVATIONAL),
      }
    }
  } catch (err) {
    console.warn('Gemini analysis failed, using fallback:', err.message)
  }

  return buildAnalysisFallback(entry)
}

export async function chatWithGemini(message, history, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
    },
  })

  const contextMessages = history.slice(-10).map(m => ({
    role: m.role === 'bot' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: CHAT_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as MindWell AI, a compassionate wellness companion for students.' }] },
        ...contextMessages.slice(0, -1),
      ],
    })

    const result = await chat.sendMessage(message)
    return result.response.text()
  } catch (err) {
    console.warn('Gemini chat failed, using fallback:', err.message)
    return generateChatFallback(message)
  }
}

export function analyzeEntry(entry, history) {
  return buildAnalysisFallback(entry)
}

const EXAM_KEYWORDS = {
  'jee': ['math', 'physics', 'chemistry', 'iit', 'entrance', 'numericals', 'organic'],
  'neet': ['biology', 'botany', 'zoology', 'medical', 'mbbs', 'ncert', 'coaching'],
  'cuet': ['commerce', 'accounts', 'economics', 'business', 'english', 'general test'],
  'cat': ['quant', 'dilr', 'varc', 'mba', 'percentile', 'mock', 'sectional'],
  'gate': ['engineering', 'aptitude', 'technical', 'ece', 'cse', 'mech', 'civil'],
  'upsc': ['prelims', 'mains', 'interview', 'current affairs', 'optional', 'gs'],
}

const STRESS_PATTERNS = {
  comparison: ['everyone else', 'friends are', 'others are', 'they all', 'everyone is ahead'],
  self_doubt: ['not enough', 'i can\'t', 'i will fail', 'not smart', 'never', 'hopeless', 'stupid'],
  overload: ['too much', 'overwhelmed', 'can\'t handle', 'so much', 'endless', 'backlog'],
  procrastination: ['wasted', 'didn\'t study', 'scrolling', 'distracted', 'lazy', 'procrastinate'],
  burnout: ['exhausted', 'tired', 'no energy', 'drained', 'sleepy', 'can\'t focus'],
  exam_anxiety: ['exam', 'test', 'paper', 'result', 'marks', 'score', 'rank', 'percentile'],
  perfectionism: ['perfect', 'must get', 'should have', 'not good enough', 'mistake', 'error'],
}

function analyzeSentiment(text) {
  const pos = ['good', 'great', 'happy', 'better', 'improved', 'proud', 'confident', 'calm', 'peaceful', 'hopeful', 'progress', 'managed', 'solved', 'understood']
  const neg = ['stressed', 'anxious', 'worried', 'sad', 'angry', 'frustrated', 'scared', 'panic', 'hopeless', 'tired', 'overwhelmed', 'depressed', 'nervous']
  const lower = text.toLowerCase()
  let pc = 0, nc = 0
  for (const w of pos) { if (lower.includes(w)) pc++ }
  for (const w of neg) { if (lower.includes(w)) nc++ }
  if (pc > nc + 1) return 'positive'
  if (nc > pc + 1) return 'negative'
  return 'neutral'
}

function detectStressTriggers(text) {
  const triggers = []
  const lower = text.toLowerCase()
  for (const [trigger, patterns] of Object.entries(STRESS_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) { triggers.push(trigger); break }
    }
  }
  return triggers.length ? [...new Set(triggers)] : ['general']
}

function detectExamContext(text) {
  const lower = text.toLowerCase()
  for (const [exam, keywords] of Object.entries(EXAM_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return exam.toUpperCase()
    }
  }
  return null
}

function generateChatFallback(message) {
  const lower = message.toLowerCase()

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey'))
    return pickRandom(['Hey there! 💙 I\'m here for you. How are you feeling today?', 'Hi! Thanks for reaching out. What\'s on your mind?'])
  if (lower.includes('stress') || lower.includes('overwhelm'))
    return pickRandom(['I hear you. Let\'s take a deep breath together. In for 4… hold for 4… out for 4. How does that feel?', 'Stress is a signal, not a weakness. What feels most overwhelming right now?'])
  if (lower.includes('anxious') || lower.includes('nervous') || lower.includes('panic'))
    return pickRandom(['Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. 🧘', 'Anxiety is your brain trying to protect you. Let\'s slow down—can you drink a glass of water slowly?'])
  if (lower.includes('study') || lower.includes('focus'))
    return pickRandom(['Try the Pomodoro technique: 25 min study, 5 min break. Your brain needs rest to consolidate!', 'Consistency beats intensity. 4 focused hours daily > 12 hours of burnout. How are your breaks?'])
  if (lower.includes('sad') || lower.includes('depress') || lower.includes('lonely'))
    return pickRandom(['I\'m sorry you\'re feeling this way. Your feelings are valid. What would help you feel even 1% better? 💙', 'Your worth is not tied to exam scores. You are enough. Would you like to talk about it?'])
  if (lower.includes('motiv') || lower.includes('give up'))
    return pickRandom(['You\'ve got this! Every expert was once a beginner who never gave up. 🌟', 'You are like a seed underground—growth is happening even when you can\'t see it.'])

  return pickRandom([
    'Thank you for sharing. Can you tell me more about how that makes you feel?',
    'I\'m listening. What do you think would help you feel even slightly better right now?',
    'That makes sense given what you\'re dealing with. What helped you cope last time?',
    'Is there one small thing you could do in the next 10 minutes that would bring you a little peace?',
  ])
}

export { COPING_STRATEGIES, MINDFULNESS_EXERCISES, MOTIVATIONAL }
export { generateChatFallback }
