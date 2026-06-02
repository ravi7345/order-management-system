import { useEffect, useState } from 'react'
import { productsApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { FormNotice } from '../../components/ui/FormNotice'
import { MESSAGES } from '../../constants/messages'
import { useForm } from '../../hooks/useForm'
import { useInventory } from '../../context/InventoryContext'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { INITIAL_PRODUCT_FORM } from './product.constants'
import { validateProductForm } from './product.validators'

function toPayload(values) {
  return {
    name: values.name.trim(),
    sku: values.sku.trim(),
    price: Number(values.price),
    quantity_in_stock: Number(values.quantity_in_stock),
  }
}

function mapProductToForm(product) {
  return {
    name: product.name,
    sku: product.sku,
    price: String(product.price),
    quantity_in_stock: String(product.quantity_in_stock),
  }
}

export function ProductForm({ editingProduct, onCancel, onSaved }) {
  const editingId = editingProduct?.id ?? null
  const { invalidateDashboard, invalidateOrderOptions } = useInventory()
  const [formNotice, setFormNotice] = useState(null)

  const { values, handleChange, reset, validateAll, getFieldError } = useForm(
    INITIAL_PRODUCT_FORM,
    validateProductForm,
  )

  const { mutate: saveProduct, loading } = useInventoryMutation(
    ({ id, payload }) => (id ? productsApi.update(id, payload) : productsApi.create(payload)),
    {
      successMessage: (_, { id }) => (id ? MESSAGES.product.updated : MESSAGES.product.created),
      onError: (error) => setFormNotice({ type: 'error', message: error.message }),
    },
  )

  useEffect(() => {
    reset(editingProduct ? mapProductToForm(editingProduct) : INITIAL_PRODUCT_FORM)
    setFormNotice(null)
  }, [editingProduct, reset])

  function clearNotice() {
    setFormNotice(null)
  }

  function handleFieldChange(event) {
    clearNotice()
    handleChange(event)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    clearNotice()
    if (!validateAll()) {
      setFormNotice({ type: 'warning', message: MESSAGES.form.validationFailed })
      return
    }

    try {
      await saveProduct({ id: editingId, payload: toPayload(values) })
      invalidateDashboard()
      invalidateOrderOptions()
      onSaved?.()
    } catch {
      // Error shown inline via onError
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <FormNotice notice={formNotice} onDismiss={clearNotice} />
      <p className="form-hint">All fields are required. SKU must be unique. Stock cannot be negative.</p>
      <FormField
        label="Product name"
        name="name"
        value={values.name}
        onChange={handleFieldChange}
        error={getFieldError('name')}
        required
      />
      <FormField
        label="SKU / code"
        name="sku"
        value={values.sku}
        onChange={handleFieldChange}
        error={getFieldError('sku')}
        required
      />
      <FormField
        label="Price"
        name="price"
        type="number"
        min="0.01"
        step="0.01"
        value={values.price}
        onChange={handleFieldChange}
        error={getFieldError('price')}
        required
      />
      <FormField
        label="Quantity in stock"
        name="quantity_in_stock"
        type="number"
        min="0"
        value={values.quantity_in_stock}
        onChange={handleFieldChange}
        error={getFieldError('quantity_in_stock')}
        required
      />
      <div className="form-actions">
        <Button type="submit" loading={loading}>
          {editingId ? 'Update product' : 'Add product'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
