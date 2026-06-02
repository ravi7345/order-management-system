import { useCallback, useState } from 'react'

/**
 * Wraps async mutations with loading state and optional lifecycle callbacks.
 */
export function useMutation(mutationFn, { onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(
    async (...args) => {
      setLoading(true)
      try {
        const result = await mutationFn(...args)
        onSuccess?.(result, ...args)
        return result
      } catch (error) {
        onError?.(error, ...args)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, onSuccess, onError],
  )

  return { mutate, loading }
}
