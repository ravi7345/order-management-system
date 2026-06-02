/**
 * Normalizes FastAPI / fetch error payloads into a user-facing string.
 */
export function parseApiError(error) {
  if (!error) return 'Something went wrong'

  if (typeof error === 'string') return error

  const detail = error.detail ?? error.message
  if (!detail) return 'Request failed'

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        const field = item.loc?.slice(-1)[0]
        return field ? `${field}: ${item.msg}` : item.msg
      })
      .join(', ')
  }

  return 'Request failed'
}
