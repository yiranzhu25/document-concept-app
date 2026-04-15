// Status, severity, confidence, priority, and document-type badges (A4)

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
  // For priority variant
  value?: number
}

const VARIANT_STYLES: Record<
  BadgeProps['variant'],
  { bg: string; color: string }
> = {
  'active':               { bg: 'var(--color-positive-subtle)', color: 'var(--color-positive)' },
  'archived':             { bg: 'var(--color-bg-subtle)',        color: 'var(--color-text-secondary)' },
  'extraction-progress':  { bg: 'var(--color-info-subtle)',      color: 'var(--color-info)' },
  'extraction-failed':    { bg: 'var(--color-negative-subtle)',  color: 'var(--color-negative)' },
  'pending-review':       { bg: 'var(--color-warning-subtle)',   color: 'var(--color-warning)' },
  'complete':             { bg: 'var(--color-positive-subtle)',  color: 'var(--color-positive)' },
  'critical':             { bg: 'var(--color-negative-subtle)',  color: 'var(--color-negative)' },
  'warning':              { bg: 'var(--color-warning-subtle)',   color: 'var(--color-warning)' },
  'info':                 { bg: 'var(--color-info-subtle)',      color: 'var(--color-info)' },
  'high':                 { bg: 'var(--color-positive-subtle)',  color: 'var(--color-positive)' },
  'medium':               { bg: 'var(--color-warning-subtle)',   color: 'var(--color-warning)' },
  'low':                  { bg: 'var(--color-negative-subtle)',  color: 'var(--color-negative)' },
  'priority':             { bg: 'var(--color-bg-subtle)',        color: 'var(--color-text-primary)' },
  'doc-main':             { bg: 'var(--color-action-primary)',   color: 'var(--color-action-primary-text)' },
  'doc-supporting':       { bg: 'var(--color-bg-subtle)',        color: 'var(--color-text-secondary)' },
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
          borderRadius: 'var(--radius-pill)',
          backgroundColor: styles.bg,
          color: styles.color,
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          border: '1px solid var(--color-border-default)',
          letterSpacing: '0.02em',
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
        gap: '6px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: styles.bg,
        color: styles.color,
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...(variant === 'doc-supporting'
          ? { border: '1px solid var(--color-border-default)' }
          : {}),
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
export function statusToBadgeVariant(
  status: string,
): BadgeProps['variant'] {
  switch (status) {
    case 'active':                return 'active'
    case 'archived':              return 'archived'
    case 'Extraction in progress':return 'extraction-progress'
    case 'Extraction failed':     return 'extraction-failed'
    case 'Pending review':        return 'pending-review'
    case 'Complete':              return 'complete'
    default:                      return 'info'
  }
}
