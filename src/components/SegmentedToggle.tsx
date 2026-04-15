// Segmented toggle / button group filter (A19)

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
        backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px',
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
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              color: active
                ? 'var(--color-text-primary)'
                : 'var(--color-text-secondary)',
              backgroundColor: active
                ? 'var(--color-bg-surface)'
                : 'transparent',
              boxShadow: active ? 'var(--shadow-1)' : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: `background-color var(--duration-fast) var(--easing-standard),
                           color var(--duration-fast) var(--easing-standard),
                           box-shadow var(--duration-fast) var(--easing-standard)`,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
