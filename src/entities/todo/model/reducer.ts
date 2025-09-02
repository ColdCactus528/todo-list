import type { Todo, TodoId } from './types'

export type State = { items: Record<TodoId, Todo>; order: TodoId[] }

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: TodoId }
  | { type: 'toggleAll'; completed: boolean }
  | { type: 'edit'; id: TodoId; title: string }
  | { type: 'remove'; id: TodoId }
  | { type: 'clearCompleted' }

export const initialState: State = { items: {}, order: [] }

const now = () => Date.now()
const makeId = () => (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2))

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const title = action.title.trim()
      if (!title) return state
      const id = makeId()
      const todo: Todo = { id, title, completed: false, createdAt: now(), updatedAt: now() }
      return { items: { ...state.items, [id]: todo }, order: [id, ...state.order] }
    }
    case 'toggle': {
      const t = state.items[action.id]
      if (!t) return state
      const updated = { ...t, completed: !t.completed, updatedAt: now() }
      return { items: { ...state.items, [t.id]: updated }, order: state.order }
    }
    case 'toggleAll': {
      const byId = { ...state.items }
      for (const id of state.order) {
        const t = byId[id]
        if (t) byId[id] = { ...t, completed: action.completed, updatedAt: now() }
      }
      return { items: byId, order: state.order }
    }
    case 'edit': {
      const t = state.items[action.id]
      if (!t) return state
      const title = action.title.trim()
      if (!title) return state
      return { items: { ...state.items, [t.id]: { ...t, title, updatedAt: now() } }, order: state.order }
    }
    case 'remove': {
      if (!state.items[action.id]) return state
      const { [action.id]: _removed, ...rest } = state.items
      return { items: rest, order: state.order.filter((id) => id !== action.id) }
    }
    case 'clearCompleted': {
      const byId: Record<TodoId, Todo> = {}
      const order: TodoId[] = []
      for (const id of state.order) {
        const t = state.items[id]
        if (t && !t.completed) {
          byId[id] = t
          order.push(id)
        }
      }
      return { items: byId, order }
    }
    default:
      return state
  }
}
