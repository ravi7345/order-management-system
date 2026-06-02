export function Card({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="card__header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
