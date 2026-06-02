export function LoadingOverlay({ visible, label = 'Syncing inventory…' }) {
  if (!visible) return null
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__card">
        <div className="loading-overlay__rings">
          <span />
          <span />
        </div>
        <span>{label}</span>
      </div>
    </div>
  )
}
