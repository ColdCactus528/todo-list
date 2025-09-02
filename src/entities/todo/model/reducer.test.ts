import { describe, it, expect } from 'vitest'
import { reducer, initialState } from './reducer'

describe('todo reducer', () => {
  it('adds trimmed item', () => {
    const s1 = reducer(initialState, { type: 'add', title: '  hello  ' })
    expect(s1.order.length).toBe(1)
    const id = s1.order[0]
    expect(s1.items[id].title).toBe('hello')
    expect(s1.items[id].completed).toBe(false)
  })

  it('ignores empty title', () => {
    const s1 = reducer(initialState, { type: 'add', title: '   ' })
    expect(s1.order.length).toBe(0)
  })

  it('toggle works', () => {
    let s = reducer(initialState, { type: 'add', title: 'a' })
    const id = s.order[0]
    s = reducer(s, { type: 'toggle', id })
    expect(s.items[id].completed).toBe(true)
    s = reducer(s, { type: 'toggle', id })
    expect(s.items[id].completed).toBe(false)
  })

  it('edit changes title (trimmed) and ignores empty', () => {
    let s = reducer(initialState, { type: 'add', title: 'a' })
    const id = s.order[0]
    s = reducer(s, { type: 'edit', id, title: '  b  ' })
    expect(s.items[id].title).toBe('b')
    const prev = s
    s = reducer(s, { type: 'edit', id, title: '   ' })
    expect(s).toBe(prev) 
  })

  it('remove deletes item', () => {
    let s = reducer(initialState, { type: 'add', title: 'x' })
    const id = s.order[0]
    s = reducer(s, { type: 'remove', id })
    expect(s.items[id]).toBeUndefined()
    expect(s.order.includes(id)).toBe(false)
  })

  it('clearCompleted removes only done', () => {
    let s = reducer(initialState, { type: 'add', title: 'a' })
    s = reducer(s, { type: 'add', title: 'b' })
    const [a, b] = s.order
    s = reducer(s, { type: 'toggle', id: a })
    s = reducer(s, { type: 'clearCompleted' })
    expect(Object.keys(s.items)).toEqual([b])
  })

  it('toggleAll sets all to completed/uncompleted', () => {
    let s = reducer(initialState, { type: 'add', title: 'a' })
    s = reducer(s, { type: 'add', title: 'b' })
    s = reducer(s, { type: 'toggleAll', completed: true })
    expect(s.order.every(id => s.items[id].completed)).toBe(true)
    s = reducer(s, { type: 'toggleAll', completed: false })
    expect(s.order.every(id => !s.items[id].completed)).toBe(true)
  })
})
