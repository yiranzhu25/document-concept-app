import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description?: string
  action?: ReactNode
  minHeight?: string | number
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  minHeight = 240,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-2)',
          color: 'var(--ink-4)',
          marginBottom: '16px',
        }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-md)',
          fontWeight: 600,
          color: 'var(--ink)',
          lineHeight: 'var(--leading-snug)',
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-3)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '320px',
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  )
}
