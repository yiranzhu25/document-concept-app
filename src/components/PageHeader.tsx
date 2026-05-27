import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--text-2xl)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--track-tight)',
              fontWeight: 'var(--weight-bold)' as any,
              color: 'var(--ink)',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                margin: '5px 0 0',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--ink-3)',
              }}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </header>
  )
}
