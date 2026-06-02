import { useCallback, useState } from 'react'

/**
 * Controlled form state with field helpers and validation map.
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target
      setField(name, value)
    },
    [setField],
  )

  const reset = useCallback(
    (nextValues = initialValues) => {
      setValues(nextValues)
      setErrors({})
      setTouched({})
    },
    [initialValues],
  )

  const validateAll = useCallback(() => {
    if (!validate) return true
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched((prev) => {
      const next = { ...prev }
      Object.keys(nextErrors).forEach((key) => {
        next[key] = true
      })
      return next
    })
    return Object.keys(nextErrors).length === 0
  }, [validate, values])

  const getFieldError = useCallback(
    (name) => (touched[name] ? errors[name] : undefined),
    [errors, touched],
  )

  return {
    values,
    errors,
    touched,
    setValues,
    setField,
    handleChange,
    reset,
    validateAll,
    getFieldError,
    setErrors,
  }
}
