import { useMemo, useState } from 'react'
import { productsApi } from '../../api'
import { Badge, StockBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { PaginatedTable } from '../../components/ui/PaginatedTable'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { formatCurrency } from '../../utils/format'

function ProductRowActions({ product, deletingId, onEdit, onDelete }) {
  return (
    <div className="table-actions">
      <Button variant="secondary" onClick={() => onEdit(product)}>
        Edit
      </Button>
      <Button
        variant="danger"
        loading={deletingId === product.id}
        onClick={() => onDelete(product.id)}
      >
        Delete
      </Button>
    </div>
  )
}

export function ProductTable({ list, onEdit }) {
  const { refresh } = list
  const { invalidateDashboard } = useInventory()
  const [deletingId, setDeletingId] = useState(null)
  const { mutate: removeProductApi } = useInventoryMutation(productsApi.remove, {
    successMessage: MESSAGES.product.deleted,
  })

  async function handleDelete(productId) {
    setDeletingId(productId)
    try {
      await removeProductApi(productId)
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
          <ProductRowActions
            product={row}
            deletingId={deletingId}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    [onEdit, deletingId],
  )

  return (
    <PaginatedTable
      list={list}
      columns={columns}
      emptyMessage="No products yet. Add your first product above."
      loadingMessage="Loading products…"
    />
  )
}
