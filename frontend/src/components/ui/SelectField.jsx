export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  error,
  required = false,
}) {
  const selectId = `select-${name}`

  return (
    <label className="field" htmlFor={selectId}>
      {label && (
        <span className="field__label">
          {label}
          {required && <span className="field__required">*</span>}
        </span>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'field__input field__input--error' : 'field__input'}
        aria-invalid={Boolean(error)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="field__error" role="alert">{error}</span>}
    </label>
  )
}
