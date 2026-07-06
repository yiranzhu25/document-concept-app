import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FolderOpen, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ElementType
  to: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', icon: FolderOpen,   to: '/projects' },
  { label: 'Tasks',    icon: CheckSquare,  to: '/tasks'    },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  /** Mobile drawer mode — renders as a push-in drawer instead of a fixed rail. */
  isMobile?: boolean
  open?: boolean
  onClose?: () => void
}

/* ── Clearmark pen/nib glyph — from design system comp-sidebar.html ── */
function ClearmarkGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'var(--ink)', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M42.6668 21.3333L5.3335 58.6667" />
      <path d="M46.6668 40H24.0002" />
      <path d="M53.9735 32.64C56.9757 29.6377 58.6624 25.5658 58.6624 21.32C58.6624 17.0742 56.9757 13.0022 53.9735 9.99999C50.9712 6.99774 46.8993 5.3111 42.6535 5.3111C38.4077 5.3111 34.3357 6.99774 31.3335 9.99999L13.3335 28V50.6667H36.0002L53.9735 32.64Z" />
    </svg>
  )
}

export function Sidebar({ collapsed, onToggle, isMobile = false, open = false, onClose }: SidebarProps) {
  const [hovering, setHovering] = useState(false)
  const location = useLocation()

  // On mobile the drawer is always full (never the 64px collapsed rail).
  // On desktop, hovering the rail temporarily expands it (overlay peek) even
  // when it is pinned collapsed.
  const railCollapsed = isMobile ? false : (collapsed && !hovering)

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/')

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    if (isMobile && open) onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const mobileStyle: React.CSSProperties = isMobile
    ? {
        width:     'min(264px, 82vw)',
        minWidth:  'min(264px, 82vw)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 220ms var(--ease-out)',
        zIndex:    30,
        boxShadow: open ? 'var(--shadow-lg)' : 'none',
      }
    : {
        width:    railCollapsed ? 'var(--nav-collapsed)' : 'var(--nav-expanded)',
        minWidth: railCollapsed ? 'var(--nav-collapsed)' : 'var(--nav-expanded)',
        transition: 'width 220ms var(--ease-out), min-width 220ms var(--ease-out)',
        zIndex:   20,
      }

  return (
    <aside
      /* .sb */
      style={{
        background:  'var(--surface-1)',
        borderRight: '1px solid var(--rule)',
        position:    'fixed',
        top: 0, left: 0,
        height:   '100dvh',
        overflow: 'visible',
        display:  'flex',
        flexDirection: 'column',
        ...mobileStyle,
      }}
      onMouseEnter={() => { if (!isMobile) setHovering(true) }}
      onMouseLeave={() => { if (!isMobile) setHovering(false) }}
    >

      {/* ── .sb-head ──────────────────────────────────────────── */}
      <div
        style={{
          height:        'var(--header-height)',
          padding:       railCollapsed ? '0 14px' : '0 16px',
          display:       'flex',
          alignItems:    'center',
          gap:           '10px',
          borderBottom:  '1px solid var(--rule)',
          flexShrink:    0,
          overflow:      'hidden',
          justifyContent: railCollapsed ? 'center' : 'flex-start',
          transition:    'padding 220ms var(--ease-out)',
        }}
      >
        <ClearmarkGlyph size={22} />

        {/* Wordmark — fades out just before width collapses */}
        {!railCollapsed && (
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    500,
              fontSize:      '15px',
              letterSpacing: '-0.01em',
              color:         'var(--ink)',
              whiteSpace:    'nowrap',
              overflow:      'hidden',
            }}
          >
            Clearmark
          </span>
        )}

        {/* Collapse / expand toggle — small icon button, top-right. Desktop only. */}
        {!railCollapsed && !isMobile && (
          <button
            onClick={onToggle}
            aria-label={collapsed ? 'Pin sidebar open' : 'Collapse sidebar'}
            title={collapsed ? 'Pin sidebar open' : 'Collapse sidebar'}
            style={{
              marginLeft:      'auto',
              display:         'inline-flex',
              alignItems:      'center',
              justifyContent:  'center',
              width:           '24px',
              height:          '24px',
              flexShrink:      0,
              borderRadius:    'var(--radius-sm)',
              border:          'none',
              background:      'transparent',
              color:           'var(--ink-3)',
              cursor:          'pointer',
              transition:      `background-color var(--dur-fast) var(--ease-out),
                                 color var(--dur-fast) var(--ease-out)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-2)'
              e.currentTarget.style.color           = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color           = 'var(--ink-3)'
            }}
          >
            {collapsed
              ? <ChevronRight size={15} strokeWidth={2} />
              : <ChevronLeft  size={15} strokeWidth={2} />
            }
          </button>
        )}
      </div>

      {/* ── .sb-section (primary nav) ─────────────────────────── */}
      <nav
        style={{
          flex:       1,
          overflowY:  'auto',
          overflowX:  'hidden',
          padding:    railCollapsed ? '8px' : '12px 8px 8px',
        }}
        aria-label="Primary navigation"
      >
        {/* .sb-cap — only shown expanded */}
        {!railCollapsed && (
          <div
            style={{
              fontSize:       '10px',
              letterSpacing:  '0.1em',
              textTransform:  'uppercase',
              color:          'var(--ink-4)',
              padding:        '4px 12px',
              fontWeight:     600,
              fontFamily:     'var(--font-sans)',
            }}
          >
            Workspace
          </div>
        )}

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to)
            const Icon   = item.icon
            return (
              <li key={item.to}>
                <NavTooltip label={item.label} disabled={!railCollapsed}>
                  {/* .sb-item  /  .sb-item.active */}
                  <NavLink
                    to={item.to}
                    onClick={() => { if (isMobile) onClose?.() }}
                    style={({ isActive: ra }) => ({
                      display:        'flex',
                      alignItems:     'center',
                      gap:            '10px',
                      padding:        isMobile ? '11px 12px' : railCollapsed ? '9px' : '7px 12px',
                      justifyContent: railCollapsed ? 'center' : 'flex-start',
                      borderRadius:   'var(--radius-sm)',   /* 6px */
                      fontFamily:     'var(--font-sans)',
                      fontSize:       'var(--text-sm)',     /* 13px */
                      fontWeight:     ra ? 600 : 400,
                      color:          ra ? 'var(--accent)' : 'var(--ink-2)',
                      backgroundColor: ra ? 'var(--accent-soft)' : 'transparent',
                      textDecoration: 'none',
                      transition:     `background-color var(--dur-fast) var(--ease-out),
                                       color var(--dur-fast) var(--ease-out)`,
                      cursor:         'pointer',
                      whiteSpace:     'nowrap',
                      overflow:       'hidden',
                    })}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                        e.currentTarget.style.color           = 'var(--ink)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color           = 'var(--ink-2)'
                      }
                    }}
                  >
                    {/* .sb-item svg */}
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{
                        flexShrink: 0,
                        color: active ? 'var(--accent)' : 'var(--ink-3)',
                      }}
                    />
                    {!railCollapsed && (
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

      {/* ── User profile (.sb-section border-top) ────────────── */}
      <div
        style={{
          borderTop:  '1px solid var(--rule)',
          padding:    railCollapsed ? '8px' : '8px',
          flexShrink: 0,
        }}
      >
        <NavTooltip label="Sarah Chen — Senior Reviewer" disabled={!railCollapsed}>
          {/* treated as a .sb-item */}
          <button
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             '10px',
              width:           '100%',
              padding:         railCollapsed ? '9px' : '7px 12px',
              justifyContent:  railCollapsed ? 'center' : 'flex-start',
              borderRadius:    'var(--radius-sm)',
              backgroundColor: 'transparent',
              border:          'none',
              cursor:          'pointer',
              fontFamily:      'var(--font-sans)',
              transition:      `background-color var(--dur-fast) var(--ease-out)`,
              overflow:        'hidden',
              whiteSpace:      'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'       }}
          >
            {/* Avatar chip */}
            <span
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                justifyContent:  'center',
                width:           '26px',
                height:          '26px',
                minWidth:        '26px',
                borderRadius:    '50%',
                backgroundColor: 'var(--accent)',
                color:           'var(--cream)',
                fontSize:        '10px',
                fontWeight:      700,
                letterSpacing:   '0.04em',
                flexShrink:      0,
              }}
            >
              SC
            </span>

            {!railCollapsed && (
              <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', overflow: 'hidden', minWidth: 0 }}>
                <span
                  style={{
                    fontSize:      'var(--text-xs)',
                    fontWeight:    600,
                    color:         'var(--ink)',
                    lineHeight:    '18px',
                    overflow:      'hidden',
                    textOverflow:  'ellipsis',
                  }}
                >
                  Sarah Chen
                </span>
                <span
                  style={{
                    fontSize:     '11px',
                    color:        'var(--ink-3)',
                    lineHeight:   '16px',
                    overflow:     'hidden',
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

    </aside>
  )
}

/* ── Right-side tooltip for collapsed nav items ─────────────────────── */
interface NavTooltipProps {
  label:    string
  disabled: boolean
  children: React.ReactNode
}

function NavTooltip({ label, disabled, children }: NavTooltipProps) {
  const [visible, setVisible]  = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (disabled) return <>{children}</>

  const show = () => { timerRef.current = setTimeout(() => setVisible(true), 300) }
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
            position:        'absolute',
            left:            'calc(100% + 10px)',
            top:             '50%',
            transform:       'translateY(-50%)',
            backgroundColor: 'var(--dark-surface)',
            color:           'var(--ink-on-dark)',
            fontFamily:      'var(--font-sans)',
            fontSize:        'var(--text-xs)',
            fontWeight:      500,
            padding:         '5px 10px',
            borderRadius:    'var(--radius-sm)',
            boxShadow:       'var(--shadow-md)',
            whiteSpace:      'nowrap',
            zIndex:          50,
            pointerEvents:   'none',
          }}
        >
          {/* Arrow */}
          <span
            style={{
              position:           'absolute',
              right:              '100%',
              top:                '50%',
              transform:          'translateY(-50%)',
              border:             '5px solid transparent',
              borderRightColor:   'var(--dark-surface)',
            }}
          />
          {label}
        </div>
      )}
    </div>
  )
}
