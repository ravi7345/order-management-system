import { useCallback, useMemo, useState } from 'react'
import { ordersApi } from '../../api'
import { PaginatedTable } from '../../components/ui/PaginatedTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { formatCurrency } from '../../utils/format'
import { OrderDetails } from './OrderDetails'
import { OrderRowActions } from './OrderRowActions'

export function OrderTable({ list }) {
  const { refresh } = list
  const { invalidateDashboard } = useInventory()
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [cancelingOrderId, setCancelingOrderId] = useState(null)

  const { mutate: cancelOrder } = useInventoryMutation(ordersApi.remove, {
    successMessage: MESSAGES.order.canceled,
  })

  const toggleDetails = useCallback((orderId) => {
    setSelectedOrderId((current) => (current === orderId ? null : orderId))
  }, [])

  const handleCancel = useCallback(
    async (orderId) => {
      setCancelingOrderId(orderId)
      try {
        await cancelOrder(orderId)
        if (selectedOrderId === orderId) setSelectedOrderId(null)
        invalidateDashboard()
        refresh()
      } catch {
        // Error toast handled by useInventoryMutation
      } finally {
        setCancelingOrderId(null)
      }
    },
    [cancelOrder, invalidateDashboard, refresh, selectedOrderId],
  )

  const columns = useMemo(
    () => [
      { key: 'id', header: 'Order', render: (row) => <strong>#{row.id}</strong> },
      { key: 'customer_name', header: 'Customer' },
      {
        key: 'total_amount',
        header: 'Total',
        render: (row) => <span className="money">{formatCurrency(row.total_amount)}</span>,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <OrderRowActions
            orderId={row.id}
            cancelingOrderId={cancelingOrderId}
            isExpanded={selectedOrderId === row.id}
            onViewDetails={toggleDetails}
            onCancel={handleCancel}
          />
        ),
      },
    ],
    [toggleDetails, handleCancel, cancelingOrderId, selectedOrderId],
  )

  return (
    <PaginatedTable
      list={list}
      columns={columns}
      emptyMessage="No orders yet."
      loadingMessage="Loading orders…"
      expandedRowId={selectedOrderId}
      renderExpandedRow={(order) => (
        <OrderDetails order={order} onClose={() => setSelectedOrderId(null)} />
      )}
    />
  )
}
