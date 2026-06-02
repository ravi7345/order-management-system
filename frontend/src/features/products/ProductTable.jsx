import { useMemo } from 'react'
import { productsApi } from '../../api'
import { Badge, StockBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { DataTable } from '../../components/ui/DataTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { formatCurrency } from '../../utils/format'

export function ProductTable({ onEdit }) {
  const { products } = useInventory()
  const { mutate: removeProduct, loading: deleting } = useInventoryMutation(
    productsApi.remove,
    MESSAGES.product.deleted,
  )

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Product',
        render: (row) => (
          <div className="cell-stack">
            <strong>{row.name}</strong>
            <Badge variant="neutral">{row.sku}</Badge>
          </div>
        ),
      },
      {
        key: 'price',
        header: 'Price',
        render: (row) => <span className="money">{formatCurrency(row.price)}</span>,
      },
      {
        key: 'quantity_in_stock',
        header: 'Stock',
        render: (row) => <StockBadge quantity={row.quantity_in_stock} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="table-actions">
            <Button variant="secondary" onClick={() => onEdit(row)}>
              Edit
            </Button>
            <Button variant="danger" loading={deleting} onClick={() => removeProduct(row.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, removeProduct, deleting],
  )

  return (
    <DataTable
      columns={columns}
      rows={products}
      emptyMessage="No products yet. Add your first product above."
    />
  )
}
