import { useState, useRef } from 'react'
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

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [hoveringEdge, setHoveringEdge] = useState(false)
  const edgeRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <aside
      /* .sb */
      style={{
        width:    collapsed ? 'var(--nav-collapsed)' : 'var(--nav-expanded)',
        minWidth: collapsed ? 'var(--nav-collapsed)' : 'var(--nav-expanded)',
        background:  'var(--cream)',
        borderRight: '1px solid var(--rule)',
        transition:  'width 220ms var(--ease-out), min-width 220ms var(--ease-out)',
        position:    'fixed',
        top: 0, left: 0,
        height:   '100vh',
        zIndex:   20,
        overflow: 'visible',
        display:  'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHoveringEdge(true)}
      onMouseLeave={() => setHoveringEdge(false)}
    >

      {/* ── .sb-head ──────────────────────────────────────────── */}
      <div
        style={{
          height:        'var(--header-height)',
          padding:       collapsed ? '0 14px' : '0 16px',
          display:       'flex',
          alignItems:    'center',
          gap:           '10px',
          borderBottom:  '1px solid var(--rule)',
          flexShrink:    0,
          overflow:      'hidden',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition:    'padding 220ms var(--ease-out)',
        }}
      >
        <ClearmarkGlyph size={22} />

        {/* Wordmark — fades out just before width collapses */}
        {!collapsed && (
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

        {/* Workspace chevron (design system shows it; inactive for now) */}
        {!collapsed && (
          <svg
            style={{ marginLeft: 'auto', width: '14px', height: '14px', color: 'var(--ink-3)', flexShrink: 0 }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        )}
      </div>

      {/* ── .sb-section (primary nav) ─────────────────────────── */}
      <nav
        style={{
          flex:       1,
          overflowY:  'auto',
          overflowX:  'hidden',
          padding:    collapsed ? '8px' : '12px 8px 8px',
        }}
        aria-label="Primary navigation"
      >
        {/* .sb-cap — only shown expanded */}
        {!collapsed && (
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
                <NavTooltip label={item.label} disabled={!collapsed}>
                  {/* .sb-item  /  .sb-item.active */}
                  <NavLink
                    to={item.to}
                    style={({ isActive: ra }) => ({
                      display:        'flex',
                      alignItems:     'center',
                      gap:            '10px',
                      padding:        collapsed ? '9px' : '7px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
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

      {/* ── User profile (.sb-section border-top) ────────────── */}
      <div
        style={{
          borderTop:  '1px solid var(--rule)',
          padding:    collapsed ? '8px' : '8px',
          flexShrink: 0,
        }}
      >
        <NavTooltip label="Sarah Chen — Senior Reviewer" disabled={!collapsed}>
          {/* treated as a .sb-item */}
          <button
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             '10px',
              width:           '100%',
              padding:         collapsed ? '9px' : '7px 12px',
              justifyContent:  collapsed ? 'center' : 'flex-start',
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

            {!collapsed && (
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

      {/* ── Collapse toggle ───────────────────────────────────── */}
      <div
        ref={edgeRef}
        style={{
          position:      'absolute',
          right:         '-13px',
          top:           '50%',
          transform:     'translateY(-50%)',
          zIndex:        30,
          opacity:       hoveringEdge ? 1 : 0,
          transition:    `opacity var(--dur-fast) var(--ease-out)`,
          pointerEvents: hoveringEdge ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            width:           '26px',
            height:          '26px',
            borderRadius:    '50%',
            backgroundColor: 'var(--cream)',
            border:          '1px solid var(--rule-strong)',
            boxShadow:       'var(--shadow-sm)',
            cursor:          'pointer',
            color:           'var(--ink-3)',
            transition:      `background-color var(--dur-fast) var(--ease-out),
                               color var(--dur-fast) var(--ease-out)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            e.currentTarget.style.color           = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--cream)'
            e.currentTarget.style.color           = 'var(--ink-3)'
          }}
        >
          {collapsed
            ? <ChevronRight size={12} strokeWidth={2} />
            : <ChevronLeft  size={12} strokeWidth={2} />
          }
        </button>
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
