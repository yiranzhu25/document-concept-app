export interface Tab<T extends string> {
  id: T
  label: string
  badge?: number
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
}

export function TabBar<T extends string>({ tabs, active, onChange }: TabBarProps<T>) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        borderBottom: '1px solid var(--rule)',
        gap: 0,
        flexShrink: 0,
        width: '100%',
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
            {/* Underline indicator */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  right: '8px',
                  bottom: '-1px',
                  height: '2px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '2px 2px 0 0',
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
