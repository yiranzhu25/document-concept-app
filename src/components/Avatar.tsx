interface AvatarProps {
  initials: string
  name?: string
  size?: number
  /** Override bg color; defaults to action-primary */
  bg?: string
}

export function Avatar({ initials, name, size = 28, bg }: AvatarProps) {
  return (
    <span
      title={name}
      aria-label={name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: '50%',
        backgroundColor: bg ?? 'var(--color-action-primary)',
        color: 'var(--color-action-primary-text)',
        fontSize: `${Math.round(size * 0.4)}px`,
        fontWeight: 600,
        letterSpacing: '0.02em',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  )
}

// Stacked avatars with overflow count
interface AvatarStackProps {
  users: { initials: string; name: string }[]
  max?: number
  size?: number
}

export function AvatarStack({ users, max = 3, size = 24 }: AvatarStackProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max

  // Alternating bg colors for visual distinction
  const COLORS = [
    'var(--color-action-primary)',
    'var(--primitive-brand-500)',
    'var(--primitive-green-500)',
  ]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {visible.map((u, i) => (
        <span
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : `-${Math.round(size * 0.3)}px`,
            border: '2px solid var(--color-bg-surface)',
            borderRadius: '50%',
            zIndex: visible.length - i,
          }}
        >
          <Avatar
            initials={u.initials}
            name={u.name}
            size={size}
            bg={COLORS[i % COLORS.length]}
          />
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: `-${Math.round(size * 0.3)}px`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '2px solid var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: `${Math.round(size * 0.36)}px`,
            fontWeight: 600,
          }}
        >
          +{overflow}
        </span>
      )}
    </span>
  )
}
