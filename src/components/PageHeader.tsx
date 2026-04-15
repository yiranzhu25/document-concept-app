import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header style={{ marginBottom: 'var(--space-8)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: title + description */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              lineHeight: '32px',
              letterSpacing: '-0.02em',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '14px',
                lineHeight: '22px',
                color: 'var(--color-text-secondary)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Right: primary action */}
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
