// Status, severity, confidence, priority, and document-type badges

interface BadgeProps {
  variant:
    | 'active'
    | 'archived'
    | 'extraction-progress'
    | 'extraction-failed'
    | 'pending-review'
    | 'complete'
    | 'critical'
    | 'warning'
    | 'info'
    | 'high'
    | 'medium'
    | 'low'
    | 'priority'
    | 'doc-main'
    | 'doc-supporting'
  label?: string
  dot?: boolean
  value?: number  // for priority variant
}

const VARIANT_STYLES: Record<
  BadgeProps['variant'],
  { bg: string; color: string }
> = {
  'active':               { bg: 'var(--success-soft)',  color: 'var(--success)' },
  'archived':             { bg: 'var(--surface-2)',      color: 'var(--ink-3)' },
  'extraction-progress':  { bg: 'var(--info-soft)',      color: 'var(--info)' },
  'extraction-failed':    { bg: 'var(--danger-soft)',    color: 'var(--danger)' },
  'pending-review':       { bg: 'var(--warning-soft)',   color: 'var(--warning)' },
  'complete':             { bg: 'var(--success-soft)',   color: 'var(--success)' },
  'critical':             { bg: 'var(--danger-soft)',    color: 'var(--danger)' },
  'warning':              { bg: 'var(--warning-soft)',   color: 'var(--warning)' },
  'info':                 { bg: 'var(--info-soft)',      color: 'var(--info)' },
  'high':                 { bg: 'var(--success-soft)',   color: 'var(--success)' },
  'medium':               { bg: 'var(--warning-soft)',   color: 'var(--warning)' },
  'low':                  { bg: 'var(--danger-soft)',    color: 'var(--danger)' },
  'priority':             { bg: 'var(--surface-2)',      color: 'var(--ink-2)' },
  'doc-main':             { bg: 'var(--accent)',         color: 'var(--cream)' },
  'doc-supporting':       { bg: 'var(--surface-2)',      color: 'var(--ink-3)' },
}

const STATUS_LABELS: Partial<Record<BadgeProps['variant'], string>> = {
  'active':              'Active',
  'archived':            'Archived',
  'extraction-progress': 'Extraction in progress',
  'extraction-failed':   'Extraction failed',
  'pending-review':      'Pending review',
  'complete':            'Complete',
}

export function Badge({ variant, label, dot = true, value }: BadgeProps) {
  const styles = VARIANT_STYLES[variant]
  const displayLabel = label ?? STATUS_LABELS[variant] ?? variant

  if (variant === 'priority') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: styles.bg,
          color: styles.color,
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          border: '1px solid var(--rule)',
          letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value ?? displayLabel}
      </span>
    )
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        backgroundColor: styles.bg,
        color: styles.color,
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        letterSpacing: 'var(--track-snug)',
        whiteSpace: 'nowrap',
        ...(variant === 'doc-supporting' ? { border: '1px solid var(--rule)' } : {}),
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            minWidth: '6px',
            borderRadius: '50%',
            backgroundColor: styles.color,
          }}
        />
      )}
      {displayLabel}
    </span>
  )
}

// Helper: map task/project status strings to badge variants
export function statusToBadgeVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'active':                 return 'active'
    case 'archived':               return 'archived'
    case 'Extraction in progress': return 'extraction-progress'
    case 'Extraction failed':      return 'extraction-failed'
    case 'Pending review':         return 'pending-review'
    case 'Complete':               return 'complete'
    default:                       return 'info'
  }
}
