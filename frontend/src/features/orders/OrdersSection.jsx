import { Card } from '../../components/ui/Card'
import { OrderForm } from './OrderForm'
import { OrderTable } from './OrderTable'

export function OrdersSection() {
  return (
    <Card title="Order management" subtitle="Create orders and track fulfillment.">
      <OrderForm />
      <OrderTable />
    </Card>
  )
}
