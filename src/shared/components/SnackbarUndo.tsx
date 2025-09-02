import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  visible: boolean
  message?: string
  onUndo: () => void
  timeoutMs: number
}

export function SnackbarUndo({ visible, message = 'Task deleted', onUndo, timeoutMs }: Props) {
  const [container, setContainer] = useState<Element | null>(null)
  const animationKey = useMemo(() => (visible ? String(Date.now()) : 'hidden'), [visible])

  useEffect(() => {
    setContainer(document.body)
  }, [])

  if (!container || !visible) return null

  return createPortal(
    <div
      className="snackbar"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="snackbar__content">
        <span className="snackbar__text">{message}</span>
        <button className="btn snackbar__action" onClick={onUndo} aria-label="Undo last action">
          Undo
        </button>
      </div>

      <div
        key={animationKey}
        className="snackbar__progress"
        style={{ ['--snack-duration' as any]: `${timeoutMs}ms` }}
        aria-hidden="true"
      />
    </div>,
    container
  )
}
