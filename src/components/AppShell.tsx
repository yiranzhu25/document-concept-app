import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--cream)',
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main content — offset by sidebar width */}
      <main
        style={{
          flex: 1,
          marginLeft: collapsed ? 'var(--nav-collapsed)' : 'var(--nav-expanded)',
          transition: `margin-left 220ms var(--ease-out)`,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: '100vh',
          backgroundColor: 'var(--cream)',
        }}
      >
        <div
          style={{
            padding: '40px 48px',
            minHeight: '100%',
            maxWidth: 'calc(var(--content-max) + 96px)',
          }}
        >
          <div
            key={location.key}
            style={{
              animation: `pageIn var(--dur-slow) var(--ease-out) both`,
              willChange: 'opacity, transform',
            }}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
