export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle || action) && (
        <header className="card__header">
          <div className="card__header-text">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action && <div className="card__header-action">{action}</div>}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
