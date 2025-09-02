type Props = {
  visible: boolean
  onUndo: () => void
}

export function UndoBar({ visible, onUndo }: Props) {
  if (!visible) return null
  return (
    <div className="controls" role="status" aria-live="polite">
      <span>Task deleted</span>
      <button className="btn" onClick={onUndo}>Undo</button>
    </div>
  )
}
