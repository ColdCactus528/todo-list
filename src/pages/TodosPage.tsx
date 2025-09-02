import { useEffect, useReducer, useState } from 'react'
import { load, save, loadFilter, saveFilter} from '../entities/todo/model/storage'
import { reducer, initialState } from '../entities/todo/model/reducer'
import { selectFiltered, selectLeftCount, hasCompleted } from '../entities/todo/model/selectors'
import type { Filter, Todo } from '../entities/todo/model/types'
import { useUndoDelete } from '../shared/hooks/useUndoDelete'
import { SnackbarUndo } from '../shared/components/SnackbarUndo'
import { useBarVisible } from '../shared/hooks/useBarVisible'
import { TodoItem } from './TodoItem'

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => load() ?? s)
  const [filter, setFilter] = useState<Filter>(loadFilter() ?? 'all')
  const { sentryRef, isVisible } = useBarVisible()

  useEffect(() => { save(state) }, [state])
  useEffect(() => { saveFilter(filter) }, [filter])

  const timeoutMs = 5000
  const { visible: undoVisible, removeWithUndo, undo } = useUndoDelete({
    getById: (id: string) => state.items[id],
    onRemove: (id: string) => dispatch({ type: 'remove', id }),
    onRestore: (t) => dispatch({ type: 'add', title: t.title }),
    timeoutMs,
  })

  const todos: Todo[] = selectFiltered(state, filter)
  const left = selectLeftCount(state)
  const hasDone = hasCompleted(state)

  const allTodos = selectFiltered(state, 'all')
  const allCompleted = allTodos.length > 0 && allTodos.every((t) => t.completed)


  return (
    <div className="container">
      <h1 className="header">todos</h1>
      <div className="card content">
        <input
          type="text"
          placeholder="What needs to be done?"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = (e.target as HTMLInputElement).value
              dispatch({ type: 'add', title: value })
              ;(e.target as HTMLInputElement).value = ''
            }
          }}
        />
        <div style={{ padding: '8px 0' }}>
          <button
            className="btn toggle-all"
            onClick={() => dispatch({ type: 'toggleAll', completed: !allCompleted })}
            aria-pressed={allCompleted}
          >
            {allCompleted ? 'Unmark all' : 'Mark all as completed'}
          </button>
        </div>
        <ul>
          {todos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={() => dispatch({ type: 'toggle', id: t.id })}
              onRemove={() => removeWithUndo(t.id)}
              onEdit={(title) => dispatch({ type: 'edit', id: t.id, title })}
            />
          ))}
        </ul>
        <div ref={sentryRef} className="controls">
          <span aria-live="polite">{left} items left</span>
          <div className="filters">
            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
              <button 
                key={f} 
                className="btn" 
                aria-pressed={f === filter} 
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          {hasDone && (
            <button className="btn danger" onClick={() => dispatch({ type: 'clearCompleted' })}>
              Clear completed
            </button>
          )}
        </div>
        {!isVisible && (
          <div className="mini-controls" role="region" aria-label="Quick filters">
            <span className="count">{left}</span>
            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
              <button
                key={`mini-${f}`}
                className="btn"
                aria-pressed={f === filter}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
            {hasDone && (
              <button className="btn danger" onClick={() => dispatch({ type: 'clearCompleted' })}>
                Clear
              </button>
            )}
          </div>
        )}
        <SnackbarUndo
          visible={undoVisible}
          onUndo={undo}
          timeoutMs={timeoutMs}
        />
      </div>
    </div>
  )
}
