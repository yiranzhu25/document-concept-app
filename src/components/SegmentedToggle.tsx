// Segmented switcher — Clearmark style

interface SegmentedToggleProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '3px',
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-full)',
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: active ? 600 : 500,
              letterSpacing: 'var(--track-snug)',
              color: active ? 'var(--ink)' : 'var(--ink-3)',
              backgroundColor: active ? 'var(--surface-1)' : 'transparent',
              boxShadow: active
                ? '0 1px 0 0 rgba(27,24,19,0.04), 0 2px 6px -1px rgba(27,24,19,0.10)'
                : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: `background-color var(--dur-fast) var(--ease-out),
                           color var(--dur-fast) var(--ease-out),
                           box-shadow var(--dur-fast) var(--ease-out)`,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = 'var(--ink-3)'
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
