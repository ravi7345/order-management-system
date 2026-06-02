const VARIANT_CLASS = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  danger: 'btn btn--danger',
  ghost: 'btn btn--ghost',
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={loading ? 'btn__label btn__label--loading' : 'btn__label'}>
        {loading ? 'Processing…' : children}
      </span>
    </button>
  )
}
