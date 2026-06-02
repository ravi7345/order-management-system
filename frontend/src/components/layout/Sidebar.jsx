import { NAV_ITEMS } from '../../constants/navigation'

export function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <strong>StockFlow</strong>
        <span>Inventory</span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__link ${activeView === item.id ? 'sidebar__link--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
