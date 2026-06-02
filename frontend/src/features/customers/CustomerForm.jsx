import { useState } from 'react'
import { customersApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { FormNotice } from '../../components/ui/FormNotice'
import { MESSAGES } from '../../constants/messages'
import { useInventory } from '../../context/InventoryContext'
import { useForm } from '../../hooks/useForm'
import { useInventoryMutation } from '../../hooks/useInventoryMutation'
import { INITIAL_CUSTOMER_FORM } from './customer.constants'
import { validateCustomerForm } from './customer.validators'

export function CustomerForm({ onCancel, onCreated }) {
  const { invalidateDashboard, invalidateOrderOptions } = useInventory()
  const [formNotice, setFormNotice] = useState(null)
  const { values, handleChange, reset, validateAll, getFieldError } = useForm(
    INITIAL_CUSTOMER_FORM,
    validateCustomerForm,
  )

  const { mutate: createCustomer, loading } = useInventoryMutation(customersApi.create, {
    successMessage: MESSAGES.customer.created,
    onError: (error) => setFormNotice({ type: 'error', message: error.message }),
  })

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
      await createCustomer({
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone_number: values.phone_number.trim(),
      })
      invalidateDashboard()
      invalidateOrderOptions()
      onCreated?.()
      reset(INITIAL_CUSTOMER_FORM)
    } catch {
      // Error shown inline via onError
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <FormNotice notice={formNotice} onDismiss={clearNotice} />
      <p className="form-hint">All fields are required. Email must be unique per customer.</p>
      <FormField
        label="Full name"
        name="full_name"
        value={values.full_name}
        onChange={handleFieldChange}
        error={getFieldError('full_name')}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleFieldChange}
        error={getFieldError('email')}
        required
      />
      <FormField
        label="Phone number"
        name="phone_number"
        value={values.phone_number}
        onChange={handleFieldChange}
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
