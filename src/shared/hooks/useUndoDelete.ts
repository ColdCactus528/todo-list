import { useCallback, useRef, useState } from 'react'

export type UndoDeleteOpts<T> = {
  getById: (id: string) => T | undefined
  onRemove: (id: string) => void
  onRestore: (item: T) => void
  timeoutMs?: number
}

export function useUndoDelete<T>({
  getById,
  onRemove,
  onRestore,
  timeoutMs = 5000,
}: UndoDeleteOpts<T>) {
  const [visible, setVisible] = useState(false)
  const last = useRef<T | null>(null)
  const timer = useRef<number | null>(null)

  const removeWithUndo = useCallback(
    (id: string) => {
      const item = getById(id)
      if (!item) return
      last.current = item
      onRemove(id)
      setVisible(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        last.current = null
        setVisible(false)
        timer.current = null
      }, timeoutMs)
    },
    [getById, onRemove, timeoutMs]
  )

  const undo = useCallback(() => {
    if (!last.current) return
    onRestore(last.current)
    last.current = null
    setVisible(false)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
  }, [onRestore])

  return { visible, removeWithUndo, undo }
}
