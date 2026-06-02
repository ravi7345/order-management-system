export const INITIAL_ORDER_LINE = { product_id: '', quantity: '' }

export const INITIAL_ORDER_FORM = {
  customer_id: '',
  items: [{ ...INITIAL_ORDER_LINE }],
}
