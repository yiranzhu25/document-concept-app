export interface Tab<T extends string> {
  id: T
  label: string
  badge?: number
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
  /**
   * Horizontal padding of the parent container. The bottom divider bleeds out
   * by this amount (edge-to-edge across the page) while the tabs stay aligned
   * with the surrounding content.
   */
  bleedX?: number
}

export function TabBar<T extends string>({ tabs, active, onChange, bleedX = 0 }: TabBarProps<T>) {
  return (
    <div
      role="tablist"
      className="cm-scroll-x"
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--rule)',
        gap: 0,
        flexShrink: 0,
        // Break out of the parent's horizontal padding so the divider runs the
        // full page width, then pad the tabs back in to stay aligned.
        marginLeft: -bleedX,
        marginRight: -bleedX,
        paddingLeft: bleedX,
        paddingRight: bleedX,
        // Scroll horizontally instead of squashing when tabs overflow on narrow screens.
        overflowX: 'auto',
        // Explicitly hide the vertical axis (overflow-x:auto otherwise makes overflow-y compute to auto).
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 600 : 500,
              letterSpacing: 'var(--track-snug)',
              color: isActive ? 'var(--ink)' : 'var(--ink-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: `color var(--dur-fast) var(--ease-out)`,
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = 'var(--ink-3)'
            }}
          >
            {tab.label}
            {/* Active indicator — dark, bold underline that sits on the divider */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  right: '8px',
                  bottom: '-1px',
                  height: '3px',
                  backgroundColor: 'var(--ink)',
                  borderRadius: '3px 3px 0 0',
                }}
              />
            )}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--ink)' : 'var(--surface-3)',
                  color: isActive ? 'var(--cream)' : 'var(--ink-3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
