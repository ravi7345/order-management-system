import { customersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useForm } from '../../hooks/useForm'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { INITIAL_CUSTOMER_FORM } from './customer.constants'
import { validateCustomerForm } from './customer.validators'

export function CustomerForm({ onCancel, onCreated }) {
  const { invalidateDashboard, invalidateOrderOptions } = useInventory()
  const { values, handleChange, reset, validateAll, getFieldError } = useForm(
    INITIAL_CUSTOMER_FORM,
    validateCustomerForm,
  )

  const { mutate: createCustomer, loading } = useInventoryMutation(customersApi.create, {
    successMessage: MESSAGES.customer.created,
  })

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateAll()) return
    await createCustomer({
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone_number: values.phone_number.trim(),
    })
    invalidateDashboard()
    invalidateOrderOptions()
    onCreated?.()
    reset(INITIAL_CUSTOMER_FORM)
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <p className="form-hint">All fields are required. Email must be unique per customer.</p>
      <FormField
        label="Full name"
        name="full_name"
        value={values.full_name}
        onChange={handleChange}
        error={getFieldError('full_name')}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={getFieldError('email')}
        required
      />
      <FormField
        label="Phone number"
        name="phone_number"
        value={values.phone_number}
        onChange={handleChange}
        error={getFieldError('phone_number')}
        required
      />
      <div className="form-actions">
        <Button type="submit" loading={loading}>
          Add customer
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
