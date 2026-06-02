import { useMemo, useState } from 'react'
import { customersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { PaginatedTable } from '../../components/ui/PaginatedTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'

export function CustomerTable({ list }) {
  const { refresh } = list
  const { invalidateDashboard } = useInventory()
  const [deletingId, setDeletingId] = useState(null)
  const { mutate: removeCustomerApi } = useInventoryMutation(customersApi.remove, {
    successMessage: MESSAGES.customer.deleted,
  })

  async function handleDelete(customerId) {
    setDeletingId(customerId)
    try {
      await removeCustomerApi(customerId)
      invalidateDashboard()
      refresh()
    } catch {
      // handled by mutation hook
    } finally {
      setDeletingId(null)
    }
  }

  const columns = useMemo(
    () => [
      { key: 'full_name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'phone_number', header: 'Phone' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <Button
            variant="danger"
            loading={deletingId === row.id}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [deletingId],
  )

  return (
    <PaginatedTable
      list={list}
      columns={columns}
      emptyMessage="No customers yet."
      loadingMessage="Loading customers…"
    />
  )
}
