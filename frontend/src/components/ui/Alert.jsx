import { useEffect } from 'react'

export function Alert({ type = 'info', message, onDismiss, autoCloseMs = 5000 }) {
  useEffect(() => {
    if (!autoCloseMs || !onDismiss) return undefined
    const timer = setTimeout(onDismiss, autoCloseMs)
    return () => clearTimeout(timer)
  }, [autoCloseMs, onDismiss, message])

  if (!message) return null

  return (
    <div className={`alert alert--${type}`} role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  )
}
