import { useCallback, useEffect, useState } from 'react'

const EMPTY_PAGE = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 0,
}

export function usePaginatedList(listFn, { pageSize: initialPageSize = 10 } = {}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [data, setData] = useState(EMPTY_PAGE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  const setPageSize = useCallback((size) => {
    setPageSizeState(Number(size))
    setPage(1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await listFn({ page, page_size: pageSize })
        if (cancelled) return

        if (result.items.length === 0 && page > 1) {
          setPage(page - 1)
          return
        }

        setData(result)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [listFn, page, pageSize, reloadToken])

  return {
    items: data.items,
    total: data.total,
    page: data.page || page,
    pageSize,
    totalPages: data.total_pages,
    loading,
    error,
    setPage,
    setPageSize,
    refresh,
  }
}
