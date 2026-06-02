import { LoadingOverlay } from '../ui/LoadingOverlay'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout({ loading, activeView, onNavigate, children }) {
  return (
    <div className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <div className="ambient ambient--three" />

      <Sidebar activeView={activeView} onNavigate={onNavigate} />

      <div className="app-content">
        <TopBar activeView={activeView} />
        <main className="app-main">{children}</main>
      </div>

      <LoadingOverlay visible={loading} />
    </div>
  )
}
