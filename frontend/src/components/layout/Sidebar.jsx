import { NAV_ITEMS } from '../../constants/navigation'
import { Icon } from '../ui/Icons'

export function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Icon name="spark" size={22} />
        </div>
        <div>
          <strong>StockFlow</strong>
          <span>Inventory OS</span>
        </div>
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
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
            {activeView === item.id && <span className="sidebar__indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Production-ready inventory & order management.</p>
      </div>
    </aside>
  )
}
