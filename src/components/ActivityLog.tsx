// Activity log / timeline — Addendum A10
import { Sparkles, Check, Pencil, MessageSquare, Clock } from 'lucide-react'
import type { AuditEntry, AuditType } from '../data/task1Detail'

const ENTRY_CONFIG: Record<
  AuditType,
  { bg: string; color: string; icon: React.ElementType }
> = {
  system:        { bg: 'var(--color-info-subtle)',     color: 'var(--color-info)',           icon: Sparkles    },
  'human-verify':{ bg: 'var(--color-positive-subtle)', color: 'var(--color-positive)',       icon: Check       },
  'human-edit':  { bg: 'var(--color-warning-subtle)',  color: 'var(--color-warning)',        icon: Pencil      },
  comment:       { bg: 'var(--color-bg-subtle)',        color: 'var(--color-text-secondary)', icon: MessageSquare },
}

interface ActivityLogProps {
  entries: AuditEntry[]
}

export function ActivityLog({ entries }: ActivityLogProps) {
  if (entries.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
          gap: '8px',
        }}
      >
        <Clock size={32} strokeWidth={1.5} style={{ color: 'var(--color-text-placeholder)' }} />
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          No activity yet
        </p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Timeline line */}
      <div
        style={{
          position: 'absolute',
          left: '15px',
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: 'var(--color-border-default)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {entries.map((entry) => {
          const { bg, color, icon: Icon } = ENTRY_CONFIG[entry.type]
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 0',
                position: 'relative',
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  minWidth: '30px',
                  borderRadius: '50%',
                  backgroundColor: bg,
                  border: '2px solid var(--color-bg-surface)',
                  zIndex: 1,
                }}
              >
                <Icon size={14} style={{ color }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    lineHeight: '20px',
                  }}
                >
                  <strong style={{ fontWeight: 600 }}>{entry.actor}</strong>{' '}
                  {entry.action}
                </p>
                {entry.detail && (
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '18px',
                    }}
                  >
                    {entry.detail}
                  </p>
                )}
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '16px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {entry.timestamp}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
