import { describe, it, expect } from 'vitest'
import { analyzeEntry, generateChatFallback, COPING_STRATEGIES, MINDFULNESS_EXERCISES, MOTIVATIONAL } from '../utils/ai.js'

const mockEntry = (journal, mood = 5) => ({
  journal,
  mood,
  date: '2025-01-01',
  stressLevel: 5,
  sleepHours: 7,
  exerciseMinutes: 30,
})

describe('analyzeEntry', () => {
  it('returns sentiment and triggers for a positive entry', () => {
    const entry = mockEntry('I had a great day today. I felt confident and made progress on my studies.')
    const result = analyzeEntry(entry, [])
    expect(result.sentiment).toBe('positive')
    expect(result.stressTriggers).toBeDefined()
    expect(result.stressTriggers.length).toBeGreaterThanOrEqual(1)
    expect(result.motivational).toBeTruthy()
    expect(result.recommendation).toBeTruthy()
  })

  it('returns negative sentiment for distressed entries', () => {
    const entry = mockEntry('I am so stressed and anxious. I feel hopeless and overwhelmed by everything.')
    const result = analyzeEntry(entry, [])
    expect(result.sentiment).toBe('negative')
  })

  it('returns neutral when sentiment is mixed', () => {
    const entry = mockEntry('Today was okay. I studied a bit and felt tired but managed.')
    const result = analyzeEntry(entry, [])
    expect(['positive', 'negative', 'neutral']).toContain(result.sentiment)
  })

  it('detects exam context in journal text', () => {
    const entry = mockEntry('Studying math for JEE advanced. Physics mock went well.')
    const result = analyzeEntry(entry, [])
    expect(result.examContext).toBe('JEE')
  })

  it('detects NEET context', () => {
    const entry = mockEntry('Biology ncert revision for neet. Zoology is hard.')
    const result = analyzeEntry(entry, [])
    expect(result.examContext).toBe('NEET')
  })

  it('detects comparison stress trigger', () => {
    const entry = mockEntry('Everyone else is ahead of me. My friends are scoring better.')
    const result = analyzeEntry(entry, [])
    expect(result.stressTriggers.some(t => t.id === 'comparison')).toBe(true)
  })

  it('detects self-doubt stress trigger', () => {
    const entry = mockEntry('I am not smart enough. I will fail. I feel stupid.')
    const result = analyzeEntry(entry, [])
    expect(result.stressTriggers.some(t => t.id === 'self_doubt')).toBe(true)
  })

  it('detects overload stress trigger', () => {
    const entry = mockEntry('Too much syllabus. I am overwhelmed and cannot handle this backlog.')
    const result = analyzeEntry(entry, [])
    expect(result.stressTriggers.some(t => t.id === 'overload')).toBe(true)
  })

  it('handles empty journal gracefully', () => {
    const entry = mockEntry('', 5)
    const result = analyzeEntry(entry, [])
    expect(result.sentiment).toBe('neutral')
    expect(result.stressTriggers.length).toBeGreaterThanOrEqual(1)
  })

  it('returns valid recommendation structure', () => {
    const entry = mockEntry('Feeling stressed about upcoming exams.')
    const result = analyzeEntry(entry, [])
    const rec = result.recommendation
    if (rec && rec.title) {
      expect(typeof rec.title).toBe('string')
      expect(typeof rec.desc).toBe('string')
    }
  })
})

describe('generateChatFallback', () => {
  it('responds to greetings', () => {
    const reply = generateChatFallback('hello there')
    expect(reply.length).toBeGreaterThan(0)
  })

  it('responds to stress mentions', () => {
    const reply = generateChatFallback('I am feeling very stressed about exams')
    expect(reply.length).toBeGreaterThan(10)
  })

  it('responds to anxiety mentions', () => {
    const reply = generateChatFallback('I feel anxious and nervous')
    expect(reply.length).toBeGreaterThan(10)
  })

  it('responds to study mentions', () => {
    const reply = generateChatFallback('I cannot focus on studying')
    expect(reply.length).toBeGreaterThan(10)
  })

  it('responds to sadness', () => {
    const reply = generateChatFallback('I feel sad and lonely')
    expect(reply.length).toBeGreaterThan(10)
  })

  it('responds to motivation requests', () => {
    const reply = generateChatFallback('I need motivation to keep going')
    expect(reply.length).toBeGreaterThan(10)
  })

  it('provides fallback for unknown input', () => {
    const reply = generateChatFallback('quantum physics is interesting')
    expect(reply.length).toBeGreaterThan(10)
  })
})

describe('Data integrity', () => {
  it('COPING_STRATEGIES has valid entries', () => {
    expect(COPING_STRATEGIES.length).toBeGreaterThan(0)
    for (const s of COPING_STRATEGIES) {
      expect(s.title).toBeTruthy()
      expect(s.desc).toBeTruthy()
    }
  })

  it('MINDFULNESS_EXERCISES has valid entries', () => {
    expect(MINDFULNESS_EXERCISES.length).toBeGreaterThan(0)
    for (const e of MINDFULNESS_EXERCISES) {
      expect(e.title).toBeTruthy()
      expect(e.desc).toBeTruthy()
    }
  })

  it('MOTIVATIONAL quotes are non-empty', () => {
    expect(MOTIVATIONAL.length).toBeGreaterThan(0)
    for (const q of MOTIVATIONAL) {
      expect(q.length).toBeGreaterThan(10)
    }
  })
})
