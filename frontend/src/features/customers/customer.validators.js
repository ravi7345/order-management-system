import { isRequired, isValidEmail } from '../../utils/validators'

export function validateCustomerForm(values) {
  const errors = {}

  if (!isRequired(values.full_name?.trim())) errors.full_name = 'Full name is required.'
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.'
  if (!isRequired(values.phone_number?.trim())) errors.phone_number = 'Phone number is required.'

  return errors
}
