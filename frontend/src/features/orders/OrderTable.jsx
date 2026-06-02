import { useCallback, useMemo, useState } from 'react'
import { ordersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { DataTable } from '../../components/ui/DataTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { useNotification } from '../../context/NotificationContext'
import { formatCurrency } from '../../utils/format'
import { OrderDetails } from './OrderDetails'

export function OrderTable() {
  const { orders } = useInventory()
  const { notifyError } = useNotification()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const { mutate: cancelOrder, loading: canceling } = useInventoryMutation(
    ordersApi.remove,
    MESSAGES.order.canceled,
  )

  const viewDetails = useCallback(
    async (orderId) => {
      setLoadingDetails(true)
      try {
        const order = await ordersApi.getById(orderId)
        setSelectedOrder(order)
      } catch (error) {
        notifyError(error.message)
      } finally {
        setLoadingDetails(false)
      }
    },
    [notifyError],
  )

  const handleCancel = useCallback(
    async (orderId) => {
      await cancelOrder(orderId)
      if (selectedOrder?.id === orderId) setSelectedOrder(null)
    },
    [cancelOrder, selectedOrder],
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
          <div className="table-actions">
            <Button variant="secondary" loading={loadingDetails} onClick={() => viewDetails(row.id)}>
              Details
            </Button>
            <Button variant="danger" loading={canceling} onClick={() => handleCancel(row.id)}>
              Cancel
            </Button>
          </div>
        ),
      },
    ],
    [viewDetails, handleCancel, loadingDetails, canceling],
  )

  return (
    <>
      <DataTable columns={columns} rows={orders} emptyMessage="No orders yet." />
      <OrderDetails order={selectedOrder} />
    </>
  )
}
