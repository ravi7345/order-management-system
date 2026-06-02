import { VIEW_META } from '../../constants/navigation'

export function TopBar({ activeView }) {
  const meta = VIEW_META[activeView] ?? VIEW_META.dashboard

  return (
    <header className="topbar">
      <h1>{meta.title}</h1>
      <p className="topbar__subtitle">{meta.subtitle}</p>
    </header>
  )
}
