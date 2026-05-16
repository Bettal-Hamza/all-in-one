const STORAGE_KEY = 'toolyy_recent'
const MAX_RECENT = 5

export function recordVisit(toolId) {
  const existing = getRecent()
  const filtered = existing.filter(entry => entry.id !== toolId)
  const updated = [{ id: toolId, visitedAt: Date.now() }, ...filtered]
  const trimmed = updated.slice(0, MAX_RECENT)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // localStorage full or blocked — silently ignore
  }
}

export function getRecent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
