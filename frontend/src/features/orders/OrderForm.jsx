import { useCallback, useMemo } from 'react'
import { ordersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { SelectField } from '../../components/ui/SelectField'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useForm } from '../../hooks/useForm'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { formatCurrency } from '../../utils/format'
import { INITIAL_ORDER_FORM, INITIAL_ORDER_LINE } from './order.constants'
import { calculateOrderTotal, validateOrderForm } from './order.validators'

export function OrderForm({ onCancel, onCreated }) {
  const { products, customers, applyOrderStockUpdates, refreshOrderOptions } = useInventory()
  const validate = useCallback((values) => validateOrderForm(values, products), [products])
  const { values, setField, setValues, validateAll, getFieldError } = useForm(
    INITIAL_ORDER_FORM,
    validate,
  )

  const { mutate: createOrder, loading } = useInventoryMutation(ordersApi.create, {
    successMessage: MESSAGES.order.created,
    updateCache: (order) => {
      applyOrderStockUpdates(order)
      refreshOrderOptions()
      onCreated?.()
    },
  })

  const customerOptions = useMemo(
    () => customers.map((c) => ({ value: c.id, label: `${c.full_name} (${c.email})` })),
    [customers],
  )

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: `${p.name} · ${p.sku} · stock: ${p.quantity_in_stock} · ${formatCurrency(p.price)}`,
      })),
    [products],
  )

  const estimatedTotal = useMemo(
    () => calculateOrderTotal(values.items, products),
    [values.items, products],
  )

  function updateLine(index, field, fieldValue) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((line, i) => (i === index ? { ...line, [field]: fieldValue } : line)),
    }))
  }

  function addLine() {
    setValues((prev) => ({ ...prev, items: [...prev.items, { ...INITIAL_ORDER_LINE }] }))
  }

  function removeLine(index) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateAll()) return

    await createOrder({
      customer_id: Number(values.customer_id),
      items: values.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    })

    setValues(INITIAL_ORDER_FORM)
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <p className="form-hint">
        Order must include a customer, one or more products, quantities, and total amount
        (calculated by the server).
      </p>

      <SelectField
        label="Customer reference"
        name="customer_id"
        value={values.customer_id}
        onChange={(e) => setField('customer_id', e.target.value)}
        options={customerOptions}
        placeholder="Select customer"
        error={getFieldError('customer_id')}
        required
      />

      <div className="order-lines">
        <p className="field__label">Products & quantities</p>
        {values.items.map((line, index) => (
          <div className="order-line" key={`line-${index}`}>
            <SelectField
              label={`Product ${index + 1}`}
              name={`product_id_${index}`}
              value={line.product_id}
              onChange={(e) => updateLine(index, 'product_id', e.target.value)}
              options={productOptions}
              placeholder="Select product"
              error={getFieldError(`items.${index}.product_id`)}
              required
            />
            <FormField
              label="Quantity ordered"
              name={`quantity_${index}`}
              type="number"
              min="1"
              value={line.quantity}
              onChange={(e) => updateLine(index, 'quantity', e.target.value)}
              error={getFieldError(`items.${index}.quantity`)}
              required
            />
            {values.items.length > 1 && (
              <Button type="button" variant="ghost" onClick={() => removeLine(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="order-summary">
        <span>Estimated total</span>
        <strong>{formatCurrency(estimatedTotal)}</strong>
        <small>Final total is calculated automatically by the backend.</small>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={addLine}>
          Add product line
        </Button>
        <Button type="submit" loading={loading}>
          Create order
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
