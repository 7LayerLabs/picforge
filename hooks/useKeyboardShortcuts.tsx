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
        console.log('Keyboard shortcut: Undo')
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y (Redo)
      if ((isCtrlOrCmd && e.key === 'z' && isShift) || (isCtrlOrCmd && e.key === 'y')) {
        e.preventDefault()
        handlers.onRedo?.()
        console.log('Keyboard shortcut: Redo')
      }

      // Ctrl/Cmd + S (Save)
      if (isCtrlOrCmd && e.key === 's') {
        e.preventDefault()
        handlers.onSave?.()
        console.log('Keyboard shortcut: Save')
      }

      // Ctrl/Cmd + V (Paste)
      if (isCtrlOrCmd && e.key === 'v') {
        // Don't prevent default for paste in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          handlers.onPaste?.()
          console.log('Keyboard shortcut: Paste')
        }
      }

      // Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't prevent default in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault()
          handlers.onDelete?.()
          console.log('Keyboard shortcut: Delete')
        }
      }

      // Ctrl/Cmd + A (Select All)
      if (isCtrlOrCmd && e.key === 'a') {
        // Don't prevent default in input fields
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault()
          handlers.onSelectAll?.()
          console.log('Keyboard shortcut: Select All')
        }
      }

      // Escape
      if (e.key === 'Escape') {
        handlers.onEscape?.()
        console.log('Keyboard shortcut: Escape')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}