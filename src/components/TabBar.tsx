// Horizontal tab bar — Addendum A6
import type { ReactNode } from 'react'

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
        height: '44px',
        borderBottom: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0,
        backgroundColor: 'var(--color-bg-surface)',
        flexShrink: 0,
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
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive
                ? 'var(--color-text-primary)'
                : 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              borderBottom: isActive
                ? '2px solid var(--color-action-primary)'
                : '2px solid transparent',
              cursor: 'pointer',
              position: 'relative',
              transition: `color var(--duration-fast) var(--easing-standard),
                           border-color var(--duration-fast) var(--easing-standard)`,
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-negative)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 600,
                  lineHeight: 1,
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
