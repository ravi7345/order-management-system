import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { customersApi, dashboardApi, productsApi } from '../api'
import { MESSAGES } from '../constants/messages'
import { RESOURCES, VIEW_RESOURCES } from '../constants/apiResources'
import { useNotification } from './NotificationContext'

const InventoryContext = createContext(null)

const ORDER_OPTIONS_PAGE_SIZE = 100

const FETCHERS = {
  [RESOURCES.dashboard]: dashboardApi.getSummary,
  [RESOURCES.orderOptions]: async () => {
    const [productsPage, customersPage] = await Promise.all([
      productsApi.list({ page: 1, page_size: ORDER_OPTIONS_PAGE_SIZE }),
      customersApi.list({ page: 1, page_size: ORDER_OPTIONS_PAGE_SIZE }),
    ])
    return {
      products: productsPage.items,
      customers: customersPage.items,
    }
  },
}

const EMPTY_STATE = {
  dashboard: null,
  orderOptions: { products: [], customers: [] },
}

export function InventoryProvider({ children }) {
  const { notifyError } = useNotification()
  const [data, setData] = useState(EMPTY_STATE)
  const [viewLoading, setViewLoading] = useState(false)
  const [error, setError] = useState(null)
  const loadedRef = useRef(new Set())
  const inflightRef = useRef(new Map())

  const applyResource = useCallback((resource, value) => {
    setData((prev) => ({ ...prev, [resource]: value }))
    loadedRef.current.add(resource)
  }, [])

  const fetchResource = useCallback(async (resource, { force = false } = {}) => {
    if (!force && loadedRef.current.has(resource)) return

    if (!force && inflightRef.current.has(resource)) {
      return inflightRef.current.get(resource)
    }

    const request = FETCHERS[resource]()
      .then((result) => {
        applyResource(resource, result)
        return result
      })
      .finally(() => {
        inflightRef.current.delete(resource)
      })

    inflightRef.current.set(resource, request)
    return request
  }, [applyResource])

  const loadView = useCallback(
    async (view) => {
      const resources = VIEW_RESOURCES[view] ?? []
      const pending = resources.filter((resource) => !loadedRef.current.has(resource))
      if (!pending.length) return

      setViewLoading(true)
      setError(null)
      try {
        await Promise.all(pending.map((resource) => fetchResource(resource)))
      } catch (err) {
        setError(err)
        notifyError(err.message || MESSAGES.load.failed)
        throw err
      } finally {
        setViewLoading(false)
      }
    },
    [fetchResource, notifyError],
  )

  const invalidateDashboard = useCallback(() => {
    loadedRef.current.delete(RESOURCES.dashboard)
    setData((prev) => ({ ...prev, dashboard: null }))
  }, [])

  const invalidateOrderOptions = useCallback(() => {
    loadedRef.current.delete(RESOURCES.orderOptions)
    setData((prev) => ({ ...prev, orderOptions: EMPTY_STATE.orderOptions }))
  }, [])

  const refreshOrderOptions = useCallback(async () => {
    setError(null)
    try {
      await fetchResource(RESOURCES.orderOptions, { force: true })
      invalidateDashboard()
    } catch (err) {
      notifyError(err.message || MESSAGES.load.failed)
      throw err
    }
  }, [fetchResource, invalidateDashboard, notifyError])

  const applyOrderStockUpdates = useCallback(
    (order) => {
      setData((prev) => {
        const stockUpdates = new Map()
        order.items?.forEach((item) => {
          stockUpdates.set(
            item.product_id,
            (stockUpdates.get(item.product_id) ?? 0) + item.quantity,
          )
        })
        const products = prev.orderOptions.products.map((item) => {
          const ordered = stockUpdates.get(item.id)
          if (!ordered) return item
          return {
            ...item,
            quantity_in_stock: Math.max(0, item.quantity_in_stock - ordered),
          }
        })
        return {
          ...prev,
          orderOptions: { ...prev.orderOptions, products },
        }
      })
      invalidateDashboard()
    },
    [invalidateDashboard],
  )

  const value = useMemo(
    () => ({
      products: data.orderOptions.products,
      customers: data.orderOptions.customers,
      dashboard: data.dashboard,
      viewLoading,
      error,
      loadView,
      refreshOrderOptions,
      applyOrderStockUpdates,
      invalidateDashboard,
      invalidateOrderOptions,
    }),
    [
      data,
      viewLoading,
      error,
      loadView,
      refreshOrderOptions,
      applyOrderStockUpdates,
      invalidateDashboard,
      invalidateOrderOptions,
    ],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
