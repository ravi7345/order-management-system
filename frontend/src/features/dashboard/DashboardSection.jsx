import { useMemo } from 'react'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icons'
import { StatCard } from '../../components/ui/StatCard'
import { StockBadge } from '../../components/ui/Badge'
import { useInventory } from '../../context/InventoryContext'

export function DashboardSection() {
  const { dashboard, products, orders } = useInventory()

  const stats = useMemo(
    () => [
      {
        title: 'Total products',
        value: dashboard?.total_products ?? 0,
        hint: `${products.length} in catalog`,
        accent: 'products',
      },
      {
        title: 'Total customers',
        value: dashboard?.total_customers ?? 0,
        hint: 'Active accounts',
        accent: 'customers',
      },
      {
        title: 'Total orders',
        value: dashboard?.total_orders ?? 0,
        hint: `${orders.length} loaded`,
        accent: 'orders',
      },
      {
        title: 'Low stock alerts',
        value: dashboard?.low_stock_products?.length ?? 0,
        hint: 'Needs attention',
        accent: 'stock',
      },
    ],
    [dashboard, products.length, orders.length],
  )

  const lowStock = dashboard?.low_stock_products ?? []

  return (
    <div className="dashboard">
      <section className="stats-grid bento-grid" aria-label="Dashboard summary">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <div className="dashboard__split">
        <Card
          title="Low stock radar"
          subtitle="Products at or below 5 units — reorder before you run out."
          accent
          className="dashboard__panel"
        >
          {lowStock.length === 0 ? (
            <EmptyState message="All products are healthy. No low-stock alerts right now." />
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

        <Card title="Quick insights" subtitle="At-a-glance system health." className="dashboard__panel">
          <ul className="insight-list">
            <li>
              <Icon name="box" size={18} />
              <div>
                <strong>Catalog size</strong>
                <span>{products.length} products tracked</span>
              </div>
            </li>
            <li>
              <Icon name="cart" size={18} />
              <div>
                <strong>Recent orders</strong>
                <span>{orders.length} orders in system</span>
              </div>
            </li>
            <li>
              <Icon name="alert" size={18} />
              <div>
                <strong>Stock risk</strong>
                <span>{lowStock.length} items need restocking</span>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
