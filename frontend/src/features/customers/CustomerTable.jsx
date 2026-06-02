import { useMemo } from 'react'
import { customersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { DataTable } from '../../components/ui/DataTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'

export function CustomerTable() {
  const { customers } = useInventory()
  const { mutate: removeCustomer, loading } = useInventoryMutation(
    customersApi.remove,
    MESSAGES.customer.deleted,
  )

  const columns = useMemo(
    () => [
      { key: 'full_name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'phone_number', header: 'Phone' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <Button variant="danger" loading={loading} onClick={() => removeCustomer(row.id)}>
            Delete
          </Button>
        ),
      },
    ],
    [removeCustomer, loading],
  )

  return <DataTable columns={columns} rows={customers} emptyMessage="No customers yet." />
}
