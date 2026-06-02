import { useMemo } from 'react'
import { ordersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { SelectField } from '../../components/ui/SelectField'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useForm } from '../../hooks/useForm'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { INITIAL_ORDER_FORM, INITIAL_ORDER_LINE } from './order.constants'
import { validateOrderForm } from './order.validators'

export function OrderForm() {
  const { products, customers } = useInventory()
  const { values, setField, setValues, validateAll, getFieldError } = useForm(
    INITIAL_ORDER_FORM,
    validateOrderForm,
  )

  const { mutate: createOrder, loading } = useInventoryMutation(
    ordersApi.create,
    MESSAGES.order.created,
  )

  const customerOptions = useMemo(
    () => customers.map((c) => ({ value: c.id, label: c.full_name })),
    [customers],
  )

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: `${p.name} (stock: ${p.quantity_in_stock})`,
      })),
    [products],
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
      <SelectField
        label="Customer"
        name="customer_id"
        value={values.customer_id}
        onChange={(e) => setField('customer_id', e.target.value)}
        options={customerOptions}
        placeholder="Select customer"
        error={getFieldError('customer_id')}
        required
      />

      {values.items.map((line, index) => (
        <div className="order-row" key={`line-${index}`}>
          <SelectField
            name={`product_id_${index}`}
            value={line.product_id}
            onChange={(e) => updateLine(index, 'product_id', e.target.value)}
            options={productOptions}
            placeholder="Select product"
            error={getFieldError(`items.${index}.product_id`)}
            required
          />
          <FormField
            label="Qty"
            name={`quantity_${index}`}
            type="number"
            min="1"
            value={line.quantity}
            onChange={(e) => updateLine(index, 'quantity', e.target.value)}
            error={getFieldError(`items.${index}.quantity`)}
            required
          />
        </div>
      ))}

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={addLine}>
          Add line
        </Button>
        <Button type="submit" loading={loading}>
          Create order
        </Button>
      </div>
    </form>
  )
}
