import type { State } from './reducer'
const KEY = 'todos:v1'
const FILTER_KEY = 'todos:filter'

export const load = (): State | null => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as State) : null
  } catch {
    return null
  }
}

export const save = (s: State) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

export const loadFilter = (): 'all' | 'active' | 'completed' | null => {
  try {
    const f = localStorage.getItem(FILTER_KEY)
    return f === 'all' || f === 'active' || f === 'completed' ? f : null
  } catch { return null }
}

export const saveFilter = (f: 'all' | 'active' | 'completed') => {
  try {
    localStorage.setItem(FILTER_KEY, f)
  } catch {}
}