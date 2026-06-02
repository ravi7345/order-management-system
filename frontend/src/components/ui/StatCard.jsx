import { Icon } from './Icons'

const ACCENTS = {
  products: { icon: 'box', tone: 'violet' },
  customers: { icon: 'users', tone: 'cyan' },
  orders: { icon: 'cart', tone: 'amber' },
  stock: { icon: 'alert', tone: 'rose' },
}

export function StatCard({ title, value, hint, accent = 'products' }) {
  const meta = ACCENTS[accent] ?? ACCENTS.products

  return (
    <article className={`stat-card stat-card--${meta.tone}`}>
      <div className="stat-card__glow" />
      <div className="stat-card__icon">
        <Icon name={meta.icon} size={22} />
      </div>
      <div className="stat-card__body">
        <h3>{title}</h3>
        <p className="stat-card__value">{value}</p>
        {hint && <small>{hint}</small>}
      </div>
    </article>
  )
}
