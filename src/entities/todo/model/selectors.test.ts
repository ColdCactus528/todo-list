import { describe, it, expect } from 'vitest'
import { selectFiltered, selectLeftCount, hasCompleted } from './selectors'
import type { State } from './reducer'
import type { Todo } from './types'

const makeState = (): State => {
  const now = Date.now()
  const mk = (id: string, title: string, completed = false): Todo => ({
    id,
    title,
    completed,
    createdAt: now,
    updatedAt: now,
  })

  const items: Record<string, Todo> = {
    '1': mk('1', 'a', false),
    '2': mk('2', 'b', true),
    '3': mk('3', 'c', false),
  }
  const order = ['1', '2', '3']
  return { items, order }
}

describe('selectors', () => {
  it('selectFiltered works', () => {
    const s = makeState()
    expect(selectFiltered(s, 'all').map(t => t.id)).toEqual(['1','2','3'])
    expect(selectFiltered(s, 'active').map(t => t.id)).toEqual(['1','3'])
    expect(selectFiltered(s, 'completed').map(t => t.id)).toEqual(['2'])
  })

  it('left count and hasCompleted', () => {
    const s = makeState()
    expect(selectLeftCount(s)).toBe(2)
    expect(hasCompleted(s)).toBe(true)
  })
})
