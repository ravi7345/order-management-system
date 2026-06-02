import { formatCurrency, formatDate } from '../../utils/format'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

export function OrderDetails({ order, onClose }) {
  if (!order) return null

  return (
    <div className="order-details order-details--inline">
      <div className="order-details__header">
        <div>
          <p className="order-details__eyebrow">Order details</p>
          <h3>#{order.id}</h3>
        </div>
        <div className="order-details__actions">
          <Badge variant="info">Total: {formatCurrency(order.total_amount)}</Badge>
          {onClose && (
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <dl className="order-details__meta">
        <div>
          <dt>Customer reference</dt>
          <dd>{order.customer_name}</dd>
        </div>
        <div>
          <dt>Total amount</dt>
          <dd>{formatCurrency(order.total_amount)}</dd>
        </div>
        <div>
          <dt>Placed on</dt>
          <dd>{formatDate(order.created_at)}</dd>
        </div>
      </dl>

      <p className="field__label">Products & quantities</p>
      <ul className="order-details__items">
        {order.items.map((item) => (
          <li key={`${item.product_id}-${item.product_name}`}>
            <div>
              <strong>{item.product_name}</strong>
              <span>
                Product #{item.product_id} · Qty {item.quantity} × {formatCurrency(item.unit_price)}
              </span>
            </div>
            <span className="money">{formatCurrency(item.quantity * item.unit_price)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
