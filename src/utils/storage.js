const KEYS = {
  ENTRIES: 'mindwell_entries',
  PROFILE: 'mindwell_profile',
  CHAT: 'mindwell_chat',
  API_KEY: 'mindwell_gemini_key',
}

export function loadEntries() {
  try { return JSON.parse(localStorage.getItem(KEYS.ENTRIES) || '[]') }
  catch { return [] }
}

export function saveEntries(entries) {
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries))
}

export function loadChat() {
  try { return JSON.parse(localStorage.getItem(KEYS.CHAT) || '[]') }
  catch { return [] }
}

export function saveChat(messages) {
  localStorage.setItem(KEYS.CHAT, JSON.stringify(messages))
}

export function loadProfile() {
  try { return JSON.parse(localStorage.getItem(KEYS.PROFILE) || 'null') }
  catch { return null }
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
}

export function loadApiKey() {
  return localStorage.getItem(KEYS.API_KEY) || ''
}

export function saveApiKey(key) {
  localStorage.setItem(KEYS.API_KEY, key)
}
