import { useEffect } from 'react'
import { productsApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { MESSAGES } from '../../constants/messages'
import { useForm } from '../../hooks/useForm'
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

export function ProductForm({ editingProduct, onCancelEdit, onSaved }) {
  const editingId = editingProduct?.id ?? null

  const { values, handleChange, reset, validateAll, getFieldError } = useForm(
    INITIAL_PRODUCT_FORM,
    validateProductForm,
  )

  const { mutate: saveProduct, loading } = useInventoryMutation(
    ({ id, payload }) => (id ? productsApi.update(id, payload) : productsApi.create(payload)),
    (_, { id }) => (id ? MESSAGES.product.updated : MESSAGES.product.created),
  )

  useEffect(() => {
    reset(editingProduct ? mapProductToForm(editingProduct) : INITIAL_PRODUCT_FORM)
  }, [editingProduct, reset])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateAll()) return
    await saveProduct({ id: editingId, payload: toPayload(values) })
    onSaved?.()
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Product name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={getFieldError('name')}
        required
      />
      <FormField
        label="SKU"
        name="sku"
        value={values.sku}
        onChange={handleChange}
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
        onChange={handleChange}
        error={getFieldError('price')}
        required
      />
      <FormField
        label="Quantity in stock"
        name="quantity_in_stock"
        type="number"
        min="0"
        value={values.quantity_in_stock}
        onChange={handleChange}
        error={getFieldError('quantity_in_stock')}
        required
      />
      <div className="form-actions">
        <Button type="submit" loading={loading}>
          {editingId ? 'Update product' : 'Add product'}
        </Button>
        {editingId && (
          <Button type="button" variant="ghost" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
