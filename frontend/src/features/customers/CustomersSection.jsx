import { useState } from 'react'
import { customersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { CustomerForm } from './CustomerForm'
import { CustomerTable } from './CustomerTable'

export function CustomersSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const customerList = usePaginatedList(customersApi.list)

  function closeModal() {
    setModalOpen(false)
  }

  function handleCreated() {
    closeModal()
    customerList.refresh()
  }

  return (
    <>
      <Card
        title="Customer management"
        subtitle="Browse and manage customer records."
        action={
          <Button type="button" onClick={() => setModalOpen(true)}>
            Add customer
          </Button>
        }
      >
        <CustomerTable list={customerList} />
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title="Add customer">
        <CustomerForm onCancel={closeModal} onCreated={handleCreated} />
      </Modal>
    </>
  )
}
