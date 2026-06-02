const VARIANT_CLASS = {
  success: 'badge badge--success',
  warning: 'badge badge--warning',
  danger: 'badge badge--danger',
  neutral: 'badge badge--neutral',
  info: 'badge badge--info',
}

export function Badge({ children, variant = 'neutral' }) {
  return <span className={VARIANT_CLASS[variant] ?? VARIANT_CLASS.neutral}>{children}</span>
}

export function StockBadge({ quantity }) {
  if (quantity <= 0) return <Badge variant="danger">Out of stock</Badge>
  if (quantity <= 5) return <Badge variant="warning">{quantity} left</Badge>
  if (quantity <= 15) return <Badge variant="info">{quantity} units</Badge>
  return <Badge variant="success">{quantity} units</Badge>
}
