import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { Alert } from './components/ui/Alert'
import { InventoryProvider, useInventory } from './context/InventoryContext'
import { NotificationProvider } from './context/NotificationContext'
import { CustomersSection } from './features/customers/CustomersSection'
import { DashboardSection } from './features/dashboard/DashboardSection'
import { OrdersSection } from './features/orders/OrdersSection'
import { ProductsSection } from './features/products/ProductsSection'

const VIEWS = {
  dashboard: DashboardSection,
  products: ProductsSection,
  customers: CustomersSection,
  orders: OrdersSection,
}

function AppContent() {
  const { loading, error } = useInventory()
  const [activeView, setActiveView] = useState('dashboard')
  const ActiveSection = VIEWS[activeView]

  return (
    <AppLayout loading={loading} activeView={activeView} onNavigate={setActiveView}>
      {error && (
        <Alert type="error" message={error.message || 'Failed to load data.'} />
      )}
      <div key={activeView} className="view-panel">
        <ActiveSection />
      </div>
    </AppLayout>
  )
}

export default function App() {
  return (
    <NotificationProvider>
      <InventoryProvider>
        <AppContent />
      </InventoryProvider>
    </NotificationProvider>
  )
}
