import { describe, it, expect, beforeEach } from 'vitest'
import { loadEntries, saveEntries, saveApiKey, loadApiKey } from '../utils/storage.js'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads entries', () => {
    const entries = [{ id: '1', mood: 7, journal: 'Good day' }]
    saveEntries(entries)
    const loaded = loadEntries()
    expect(loaded).toEqual(entries)
  })

  it('returns empty array when no entries', () => {
    const loaded = loadEntries()
    expect(loaded).toEqual([])
  })

  it('handles corrupted data gracefully', () => {
    localStorage.setItem('mindwell_entries', 'not-json')
    const loaded = loadEntries()
    expect(loaded).toEqual([])
  })

  it('saves and loads API key', () => {
    saveApiKey('test-key-123')
    expect(loadApiKey()).toBe('test-key-123')
  })

  it('returns empty string for missing API key', () => {
    expect(loadApiKey()).toBe('')
  })

  it('overwrites existing entries', () => {
    saveEntries([{ id: '1' }])
    saveEntries([{ id: '2' }])
    expect(loadEntries()).toEqual([{ id: '2' }])
  })
})
