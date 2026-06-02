import { VIEW_META } from '../../constants/navigation'

export function TopBar({ activeView }) {
  const meta = VIEW_META[activeView] ?? VIEW_META.dashboard

  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Workspace</p>
        <h1>{meta.title}</h1>
        <p className="topbar__subtitle">{meta.subtitle}</p>
      </div>
      <div className="topbar__badge">
        <span className="pulse-dot" />
        Live sync
      </div>
    </header>
  )
}
