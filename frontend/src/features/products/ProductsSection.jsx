import { useState } from 'react'
import { productsApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { ProductForm } from './ProductForm'
import { ProductTable } from './ProductTable'

export function ProductsSection() {
  const [modalProduct, setModalProduct] = useState(undefined)
  const productList = usePaginatedList(productsApi.list)
  const modalOpen = modalProduct !== undefined

  function closeModal() {
    setModalProduct(undefined)
  }

  function handleSaved() {
    closeModal()
    productList.refresh()
  }

  return (
    <>
      <Card
        title="Product management"
        subtitle="Browse and manage your product catalog."
        action={
          <Button type="button" onClick={() => setModalProduct(null)}>
            Add product
          </Button>
        }
      >
        <ProductTable list={productList} onEdit={setModalProduct} />
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={modalProduct ? 'Edit product' : 'Add product'}
      >
        <ProductForm
          editingProduct={modalProduct}
          onCancel={closeModal}
          onSaved={handleSaved}
        />
      </Modal>
    </>
  )
}
