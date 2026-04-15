import { useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Scale,
  FolderOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ElementType
  to: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', icon: FolderOpen, to: '/projects' },
  { label: 'Tasks',    icon: CheckSquare, to: '/tasks' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [hoveringEdge, setHoveringEdge] = useState(false)
  const edgeRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <aside
      className="relative flex flex-col h-screen"
      style={{
        width: collapsed ? '64px' : '240px',
        minWidth: collapsed ? '64px' : '240px',
        backgroundColor: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-default)',
        transition: 'width var(--duration-standard) var(--easing-standard), min-width var(--duration-standard) var(--easing-standard)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20,
        overflow: 'visible',
      }}
      onMouseEnter={() => setHoveringEdge(true)}
      onMouseLeave={() => setHoveringEdge(false)}
    >
      {/* ── Logo area ─────────────────────────────────────────── */}
      <div
        className="flex items-center shrink-0 overflow-hidden"
        style={{
          height: '56px',
          padding: collapsed ? '0 20px' : '0 16px',
          borderBottom: '1px solid var(--color-border-default)',
          transition: 'padding var(--duration-standard) var(--easing-standard)',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Scale
          size={24}
          style={{ color: 'var(--color-action-primary)', flexShrink: 0 }}
          strokeWidth={2}
        />
        {!collapsed && (
          <span
            className="font-semibold whitespace-nowrap overflow-hidden"
            style={{
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)',
              marginLeft: '12px',
              opacity: collapsed ? 0 : 1,
              transition: 'opacity var(--duration-fast) var(--easing-standard)',
            }}
          >
            LegalIQ
          </span>
        )}
      </div>

      {/* ── Primary nav ───────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ padding: '12px 8px' }}
      >
        <ul className="flex flex-col" style={{ gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to)
            const Icon = item.icon

            return (
              <li key={item.to} style={{ position: 'relative' }}>
                {/* Active left indicator bar */}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '20px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-action-primary)',
                      zIndex: 1,
                    }}
                  />
                )}
                <NavTooltip label={item.label} disabled={!collapsed}>
                  <NavLink
                    to={item.to}
                    className="flex items-center rounded-2 outline-none group"
                    style={({ isActive: routeActive }) => ({
                      height: '40px',
                      padding: collapsed ? '0' : '0 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      gap: '12px',
                      borderRadius: 'var(--radius-2)',
                      backgroundColor: routeActive
                        ? 'var(--color-bg-subtle)'
                        : 'transparent',
                      color: routeActive
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-secondary)',
                      fontWeight: routeActive ? 600 : 500,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: `background-color var(--duration-fast) var(--easing-standard),
                                   color var(--duration-fast) var(--easing-standard)`,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    })}
                    onMouseEnter={(e) => {
                      if (!isActive(item.to)) {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
                        e.currentTarget.style.color = 'var(--color-text-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.to)) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                      }
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 2}
                      style={{ flexShrink: 0 }}
                    />
                    {!collapsed && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </NavTooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── User profile ──────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-default)',
          padding: '12px 8px',
          flexShrink: 0,
        }}
      >
        <NavTooltip label="Sarah Chen — Senior Reviewer" disabled={!collapsed}>
          <button
            className="flex items-center w-full outline-none"
            style={{
              height: '44px',
              padding: collapsed ? '0' : '0 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: `background-color var(--duration-fast) var(--easing-standard)`,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {/* Avatar */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                minWidth: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-primary-text)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              SC
            </span>

            {!collapsed && (
              <span className="flex flex-col text-left overflow-hidden">
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    lineHeight: '18px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Sarah Chen
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Senior Reviewer
                </span>
              </span>
            )}
          </button>
        </NavTooltip>
      </div>

      {/* ── Collapse toggle ───────────────────────────────────── */}
      <div
        ref={edgeRef}
        style={{
          position: 'absolute',
          right: '-14px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          opacity: hoveringEdge ? 1 : 0,
          transition: `opacity var(--duration-fast) var(--easing-standard)`,
          pointerEvents: hoveringEdge ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            boxShadow: 'var(--shadow-1)',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            transition: `background-color var(--duration-fast) var(--easing-standard),
                         color var(--duration-fast) var(--easing-standard)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  )
}

/* ── Tooltip helper (right-side, for collapsed nav items) ──────────────── */
interface NavTooltipProps {
  label: string
  disabled: boolean
  children: React.ReactNode
}

function NavTooltip({ label, disabled, children }: NavTooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (disabled) return <>{children}</>

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), 300)
  }
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  return (
    <div
      style={{ position: 'relative', display: 'block' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--color-bg-inverse)',
            color: 'var(--color-text-inverse)',
            fontSize: '11px',
            fontWeight: 500,
            padding: '6px 10px',
            borderRadius: 'var(--radius-1)',
            boxShadow: 'var(--shadow-2)',
            whiteSpace: 'nowrap',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          {/* Arrow */}
          <span
            style={{
              position: 'absolute',
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '5px solid transparent',
              borderRightColor: 'var(--color-bg-inverse)',
            }}
          />
          {label}
        </div>
      )}
    </div>
  )
}
