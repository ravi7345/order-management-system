import { formatCurrency, formatDate } from '../../utils/format'
import { Badge } from '../../components/ui/Badge'

export function OrderDetails({ order }) {
  if (!order) return null

  return (
    <aside className="order-details">
      <div className="order-details__header">
        <div>
          <p className="order-details__eyebrow">Order</p>
          <h3>#{order.id}</h3>
        </div>
        <Badge variant="info">{formatCurrency(order.total_amount)}</Badge>
      </div>

      <dl className="order-details__meta">
        <div>
          <dt>Customer</dt>
          <dd>{order.customer_name}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDate(order.created_at)}</dd>
        </div>
      </dl>

      <ul className="order-details__items">
        {order.items.map((item) => (
          <li key={`${item.product_id}-${item.product_name}`}>
            <div>
              <strong>{item.product_name}</strong>
              <span>{item.quantity} × {formatCurrency(item.unit_price)}</span>
            </div>
            <span className="money">{formatCurrency(item.quantity * item.unit_price)}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
