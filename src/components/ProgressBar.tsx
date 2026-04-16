// Linear progress bar — Section 5.11
interface ProgressBarProps {
  value: number     // 0–100
  label?: string
  height?: number
}

export function ProgressBar({ value, label, height = 6 }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: 'var(--color-action-primary)',
            borderRadius: 'var(--radius-pill)',
            transition: `width var(--duration-standard) var(--easing-standard)`,
          }}
        />
      </div>
      {label && (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            textAlign: 'right',
          }}
        >
          {label}
        </p>
      )}
    </div>
  )
}
