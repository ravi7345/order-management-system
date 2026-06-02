import { useMemo } from 'react'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { StatCard } from '../../components/ui/StatCard'
import { StockBadge } from '../../components/ui/Badge'
import { useInventory } from '../../context/InventoryContext'

export function DashboardSection() {
  const { dashboard } = useInventory()
  const lowStock = dashboard?.low_stock_products ?? []

  const stats = useMemo(
    () => [
      { title: 'Products', value: dashboard?.total_products ?? 0 },
      { title: 'Customers', value: dashboard?.total_customers ?? 0 },
      { title: 'Orders', value: dashboard?.total_orders ?? 0 },
      { title: 'Low stock', value: lowStock.length, hint: '≤ 5 units' },
    ],
    [dashboard, lowStock.length],
  )

  return (
    <div className="dashboard">
      <section className="stats-grid" aria-label="Dashboard summary">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <Card title="Low stock products" subtitle="Items that may need restocking.">
        {lowStock.length === 0 ? (
          <EmptyState message="No low-stock products." />
        ) : (
          <ul className="inventory-list">
            {lowStock.map((product) => (
              <li key={product.id} className="inventory-list__item">
                <div className="inventory-list__meta">
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>
                <StockBadge quantity={product.quantity_in_stock} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
