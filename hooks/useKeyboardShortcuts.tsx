import { useEffect } from 'react'

interface ShortcutHandlers {
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  onPaste?: () => void
  onDelete?: () => void
  onSelectAll?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifier keys
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      const isShift = e.shiftKey

      // Ctrl/Cmd + Z (Undo)
      if (isCtrlOrCmd && e.key === 'z' && !isShift) {
        e.preventDefault()
        handlers.onUndo?.()
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y (Redo)
      if ((isCtrlOrCmd && e.key === 'z' && isShift) || (isCtrlOrCmd && e.key === 'y')) {
        e.preventDefault()
        handlers.onRedo?.()
      }

      // Ctrl/Cmd + S (Save)
      if (isCtrlOrCmd && e.key === 's') {
        e.preventDefault()
        handlers.onSave?.()
      }

      // Ctrl/Cmd + V (Paste)
      if (isCtrlOrCmd && e.key === 'v') {
        // Don't prevent default for paste in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          handlers.onPaste?.()
        }
      }

      // Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't prevent default in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault()
          handlers.onDelete?.()
        }
      }

      // Ctrl/Cmd + A (Select All)
      if (isCtrlOrCmd && e.key === 'a') {
        // Don't prevent default in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault()
          handlers.onSelectAll?.()
        }
      }

      // Escape
      if (e.key === 'Escape') {
        handlers.onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}