import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { ProductForm } from './ProductForm'
import { ProductTable } from './ProductTable'

export function ProductsSection() {
  const [editingProduct, setEditingProduct] = useState(null)

  return (
    <Card title="Product management" subtitle="Create, update, and remove catalog items.">
      <ProductForm
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onSaved={() => setEditingProduct(null)}
      />
      <ProductTable onEdit={setEditingProduct} />
    </Card>
  )
}
