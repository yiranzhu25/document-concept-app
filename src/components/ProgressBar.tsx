interface ProgressBarProps {
  value: number   // 0–100
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
          backgroundColor: 'var(--surface-3)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            transition: `width var(--dur-base) var(--ease-out)`,
          }}
        />
      </div>
      {label && (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--ink-3)',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {label}
        </p>
      )}
    </div>
  )
}
