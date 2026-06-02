import { Alert } from './Alert'

export function FormNotice({ notice, onDismiss }) {
  if (!notice?.message) return null

  return (
    <div className="form-notice">
      <Alert
        type={notice.type ?? 'error'}
        message={notice.message}
        onDismiss={onDismiss}
        autoCloseMs={0}
      />
    </div>
  )
}
