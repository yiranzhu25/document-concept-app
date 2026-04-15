// Empty state pattern (A13)
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
        padding: '40px 24px',
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
      }}
    >
      <Icon
        size={40}
        strokeWidth={1.5}
        style={{ color: 'var(--color-text-placeholder)' }}
      />
      <p
        style={{
          margin: '16px 0 0',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          lineHeight: '22px',
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: '20px',
            maxWidth: '320px',
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <div style={{ marginTop: '16px' }}>{action}</div>
      )}
    </div>
  )
}
