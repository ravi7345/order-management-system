export function validateOrderForm(values, products = []) {
  const errors = {}
  const productMap = Object.fromEntries(products.map((p) => [String(p.id), p]))

  if (!values.customer_id) errors.customer_id = 'Select a customer.'

  const quantityByProduct = {}

  values.items?.forEach((item, index) => {
    if (!item.product_id) {
      errors[`items.${index}.product_id`] = 'Select a product.'
    }
    if (!item.quantity || Number(item.quantity) < 1) {
      errors[`items.${index}.quantity`] = 'Quantity must be at least 1.'
    } else if (item.product_id) {
      const key = String(item.product_id)
      quantityByProduct[key] = (quantityByProduct[key] || 0) + Number(item.quantity)
    }
  })

  values.items?.forEach((item, index) => {
    if (!item.product_id || !item.quantity) return
    const product = productMap[String(item.product_id)]
    if (!product) {
      errors[`items.${index}.product_id`] = 'Selected product is unavailable.'
      return
    }
    const totalQty = quantityByProduct[String(item.product_id)]
    if (totalQty > product.quantity_in_stock) {
      errors[`items.${index}.quantity`] =
        `Insufficient stock for ${product.sku}. Only ${product.quantity_in_stock} available.`
    }
  })

  return errors
}

export function calculateOrderTotal(items, products) {
  const productMap = Object.fromEntries(products.map((p) => [String(p.id), p]))
  return items.reduce((total, line) => {
    const product = productMap[String(line.product_id)]
    const qty = Number(line.quantity)
    if (!product || !qty || qty < 1) return total
    return total + product.price * qty
  }, 0)
}
