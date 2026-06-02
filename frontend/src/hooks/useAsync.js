import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Generic async state hook — loading, data, error, and manual refetch.
 */
export function useAsync(asyncFn, { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      if (mountedRef.current) setData(result)
      return result
    } catch (err) {
      if (mountedRef.current) setError(err)
      throw err
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [asyncFn])

  useEffect(() => {
    mountedRef.current = true
    if (immediate) execute()
    return () => {
      mountedRef.current = false
    }
  }, [execute, immediate])

  return { data, loading, error, execute, setData }
}
