import { useCallback, useState } from 'react'

/**
 * Wraps async mutations with loading state and optional lifecycle callbacks.
 * Tracks pending key (defaults to first argument) for per-row loading indicators.
 */
export function useMutation(mutationFn, { onSuccess, onError, getPendingKey } = {}) {
  const [pendingKey, setPendingKey] = useState(null)

  const mutate = useCallback(
    async (...args) => {
      const key = getPendingKey ? getPendingKey(...args) : args[0]
      setPendingKey(key ?? true)
      try {
        const result = await mutationFn(...args)
        await onSuccess?.(result, ...args)
        return result
      } catch (error) {
        onError?.(error, ...args)
        throw error
      } finally {
        setPendingKey(null)
      }
    },
    [mutationFn, onSuccess, onError, getPendingKey],
  )

  const isPending = useCallback(
    (key) => pendingKey !== null && String(pendingKey) === String(key),
    [pendingKey],
  )

  return { mutate, loading: pendingKey !== null, pendingKey, isPending }
}
