export function validateOrderForm(values) {
  const errors = {}

  if (!values.customer_id) errors.customer_id = 'Select a customer.'

  values.items?.forEach((item, index) => {
    if (!item.product_id) errors[`items.${index}.product_id`] = 'Select a product.'
    if (!item.quantity || Number(item.quantity) < 1) {
      errors[`items.${index}.quantity`] = 'Quantity must be at least 1.'
    }
  })

  return errors
}
