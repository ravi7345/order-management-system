import { isNonNegativeInteger, isPositiveNumber, isRequired } from '../../utils/validators'

export function validateProductForm(values) {
  const errors = {}

  if (!isRequired(values.name?.trim())) errors.name = 'Product name is required.'
  if (!isRequired(values.sku?.trim())) errors.sku = 'SKU is required.'
  if (!isPositiveNumber(values.price)) errors.price = 'Price must be greater than 0.'
  if (!isNonNegativeInteger(values.quantity_in_stock)) {
    errors.quantity_in_stock = 'Quantity must be a whole number ≥ 0.'
  }

  return errors
}
