import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useIsMobile } from '../hooks/useIsMobile'
import { useTopBarConfig } from '../contexts/TopBarContext'

/** Mobile drawer width — narrower than the viewport so a strip of content stays visible. */
const DRAWER_W = 'min(264px, 82vw)'

const topBarBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: 'var(--radius-sm)',
  border: 'none',
  background: 'transparent',
  color: 'var(--ink)',
  cursor: 'pointer',
  flexShrink: 0,
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const topBar = useTopBarConfig()

  // List roots keep the hamburger; every deeper "detail" route gets a back arrow.
  const isListRoute = location.pathname === '/projects' || location.pathname === '/tasks'

  /* ── Mobile: top bar + push-in drawer ─────────────────────────── */
  if (isMobile) {
    return (
      <div
        style={{
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'var(--surface-1)',
        }}
      >
        <Sidebar
          isMobile
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          collapsed={false}
          onToggle={() => {}}
        />

        {/* Content — pushed right when the drawer is open */}
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transform: drawerOpen ? `translateX(${DRAWER_W})` : 'translateX(0)',
            transition: 'transform 220ms var(--ease-out)',
            willChange: 'transform',
          }}
        >
          {/* Top app bar */}
          <header
            style={{
              height: 'var(--header-height)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 8px',
              borderBottom: '1px solid var(--rule)',
              backgroundColor: 'var(--surface-1)',
            }}
          >
            {isListRoute ? (
              <button
                onClick={() => setDrawerOpen((o) => !o)}
                aria-label="Open navigation"
                style={topBarBtnStyle}
              >
                <Menu size={20} strokeWidth={1.75} />
              </button>
            ) : (
              <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                style={topBarBtnStyle}
              >
                <ArrowLeft size={20} strokeWidth={1.75} />
              </button>
            )}

            {/* Page-injected title (truncates) */}
            {topBar.title && (
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--ink)',
                }}
              >
                {topBar.title}
              </div>
            )}

            {/* Page-injected right actions */}
            {topBar.right && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {topBar.right}
              </div>
            )}
          </header>

          {/* Main scroll area */}
          <main
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: 'var(--surface-1)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              key={location.key}
              style={{
                padding: '16px',
                minHeight: '100%',
                animation: `pageIn var(--dur-slow) var(--ease-out) both`,
                willChange: 'opacity, transform',
              }}
            >
              <Outlet />
            </div>
          </main>

          {/* Dismiss layer over the visible content strip while the drawer is open */}
          {drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 25,
                backgroundColor: 'var(--backdrop)',
                opacity: 0.5,
              }}
            />
          )}
        </div>
      </div>
    )
  }

  /* ── Desktop (unchanged) ──────────────────────────────────────── */
  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-1)',
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
          minHeight: '100dvh',
          backgroundColor: 'var(--surface-1)',
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
