import { useEffect } from 'react'
import { Icon } from './Icons'

export function Alert({ type = 'info', message, onDismiss, autoCloseMs = 5000 }) {
  useEffect(() => {
    if (!autoCloseMs || !onDismiss) return undefined
    const timer = setTimeout(onDismiss, autoCloseMs)
    return () => clearTimeout(timer)
  }, [autoCloseMs, onDismiss, message])

  if (!message) return null

  return (
    <div className={`alert alert--${type}`} role="alert">
      <div className="alert__content">
        <Icon name={type === 'success' ? 'spark' : 'alert'} size={18} />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  )
}
