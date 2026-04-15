import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 64 : 240

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-app)',
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main content — offset by sidebar width */}
      <main
        style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: `margin-left var(--duration-standard) var(--easing-standard)`,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            padding: '32px 40px',
            minHeight: '100%',
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
