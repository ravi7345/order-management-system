export function LoadingOverlay({ visible, label = 'Loading…' }) {
  if (!visible) return null
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__spinner" />
      <span>{label}</span>
    </div>
  )
}
