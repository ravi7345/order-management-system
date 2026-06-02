export function StatCard({ title, value, hint }) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <p className="stat-card__value">{value}</p>
      {hint && <small>{hint}</small>}
    </article>
  )
}
