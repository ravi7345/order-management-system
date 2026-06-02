export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
  max,
  step,
}) {
  const inputId = `field-${name}`

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">
        {label}
        {required && <span className="field__required">*</span>}
      </span>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={error ? 'field__input field__input--error' : 'field__input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
