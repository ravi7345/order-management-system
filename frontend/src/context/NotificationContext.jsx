import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Alert } from '../components/ui/Alert'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)

  const clear = useCallback(() => setNotification(null), [])

  const notify = useCallback((type, message) => {
    setNotification({ type, message, id: Date.now() })
  }, [])

  const notifySuccess = useCallback((message) => notify('success', message), [notify])
  const notifyError = useCallback((message) => notify('error', message), [notify])

  const value = useMemo(
    () => ({ notifySuccess, notifyError, clear }),
    [notifySuccess, notifyError, clear],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite">
        {notification && (
          <Alert
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onDismiss={clear}
          />
        )}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
