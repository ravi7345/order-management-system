import { Card } from '../../components/ui/Card'
import { CustomerForm } from './CustomerForm'
import { CustomerTable } from './CustomerTable'

export function CustomersSection() {
  return (
    <Card title="Customer management" subtitle="Maintain customer contact records.">
      <CustomerForm />
      <CustomerTable />
    </Card>
  )
}
