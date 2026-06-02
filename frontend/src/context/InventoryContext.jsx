import { createContext, useCallback, useContext, useMemo } from 'react'
import { dashboardApi, customersApi, ordersApi, productsApi } from '../api'
import { MESSAGES } from '../constants/messages'
import { useAsync } from '../hooks/useAsync'
import { useNotification } from './NotificationContext'

const InventoryContext = createContext(null)

async function fetchInventorySnapshot() {
  const [products, customers, orders, dashboard] = await Promise.all([
    productsApi.list(),
    customersApi.list(),
    ordersApi.list(),
    dashboardApi.getSummary(),
  ])
  return { products, customers, orders, dashboard }
}

export function InventoryProvider({ children }) {
  const { notifyError } = useNotification()
  const { data, loading, error, execute } = useAsync(fetchInventorySnapshot, {
    immediate: true,
    initialData: { products: [], customers: [], orders: [], dashboard: null },
  })

  const refresh = useCallback(async () => {
    try {
      await execute()
    } catch (err) {
      notifyError(err.message || MESSAGES.load.failed)
    }
  }, [execute, notifyError])

  const value = useMemo(
    () => ({
      products: data?.products ?? [],
      customers: data?.customers ?? [],
      orders: data?.orders ?? [],
      dashboard: data?.dashboard ?? null,
      loading,
      error,
      refresh,
    }),
    [data, loading, error, refresh],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
