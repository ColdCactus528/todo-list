import type { Filter } from './types'
import type { State } from './reducer'

export const selectAll = (s: State) => s.order.map((id) => s.items[id]).filter(Boolean)

export const selectFiltered = (s: State, f: Filter) => {
  const list = selectAll(s)
  if (f === 'active') return list.filter((t) => !t.completed)
  if (f === 'completed') return list.filter((t) => t.completed)
  return list
}

export const selectLeftCount = (s: State) => selectFiltered(s, 'active').length
export const hasCompleted = (s: State) => selectFiltered(s, 'completed').length > 0
