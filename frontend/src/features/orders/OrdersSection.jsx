import { useState } from 'react'
import { ordersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { useInventory } from '../../context/InventoryContext'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { OrderForm } from './OrderForm'
import { OrderTable } from './OrderTable'

export function OrdersSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [optionsLoading, setOptionsLoading] = useState(false)
  const orderList = usePaginatedList(ordersApi.list)
  const { loadView, refreshOrderOptions } = useInventory()

  async function openCreateModal() {
    setOptionsLoading(true)
    try {
      await loadView('orders')
      await refreshOrderOptions()
      setModalOpen(true)
    } finally {
      setOptionsLoading(false)
    }
  }

  function closeModal() {
    setModalOpen(false)
  }

  function handleCreated() {
    closeModal()
    orderList.refresh()
  }

  return (
    <>
      <Card
        title="Order management"
        subtitle="Browse orders and create new ones."
        action={
          <Button type="button" loading={optionsLoading} onClick={openCreateModal}>
            Add order
          </Button>
        }
      >
        <OrderTable list={orderList} />
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title="Create order" size="lg">
        <OrderForm onCancel={closeModal} onCreated={handleCreated} />
      </Modal>
    </>
  )
}
