import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../entities/todo/model/types'

type Props = {
  todo: Todo
  onToggle: () => void
  onRemove: () => void
  onEdit: (title: string) => void
}

export function TodoItem({ todo, onToggle, onRemove, onEdit }: Props) {
  const [isEditing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setTitle(todo.title)
      inputRef.current?.focus()
    } 
  }, [isEditing, todo.title])

  const commit = () => {
    const next = title.trim()
    if (next && next !== todo.title) onEdit(next)
    setEditing(false)
  }

  return (
    <li className={isEditing ? 'editing' : ''}>
      {!isEditing ? (
        <>
          <div
            className="item-left"
            onDoubleClick={() => { setTitle(todo.title); setEditing(true) }}
            title="Double-click to edit"
          >
            <input type="checkbox" checked={todo.completed} onChange={onToggle} />
            <span className={todo.completed ? 'todo-title completed' : 'todo-title'}>
              {todo.title}
            </span>
          </div>

          <div className="item-actions" style={{ display: 'inline-flex', gap: 6 }}>
            <button
              className="btn icon"
              aria-label="Edit"
              onClick={() => { setTitle(todo.title); setEditing(true) }}
            >
              ✏️
            </button>
            <button className="btn icon danger" aria-label="Remove" onClick={onRemove}>
              ✕
            </button>
          </div>
        </>
      ) : (
        <input
          ref={inputRef}
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setEditing(false)
          }}
        />
      )}
    </li>
  )

}
