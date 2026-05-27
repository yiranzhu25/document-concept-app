// Warm-toned avatar palette derived from Clearmark ink scale
const AVATAR_COLORS = [
  { bg: 'var(--accent)',   fg: 'var(--cream)' },
  { bg: 'var(--ink-2)',    fg: 'var(--cream)' },
  { bg: 'var(--success)',  fg: 'var(--cream)' },
  { bg: 'var(--info)',     fg: 'var(--cream)' },
  { bg: 'var(--warning)',  fg: 'var(--cream)' },
]

interface AvatarProps {
  initials: string
  name?: string
  size?: number
  colorIndex?: number
  bg?: string
}

export function Avatar({ initials, name, size = 28, colorIndex = 0, bg }: AvatarProps) {
  const colors = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
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
        backgroundColor: bg ?? colors.bg,
        color: bg ? 'var(--cream)' : colors.fg,
        fontSize: `${Math.max(9, Math.round(size * 0.38))}px`,
        fontWeight: 700,
        letterSpacing: '0.02em',
        userSelect: 'none',
        flexShrink: 0,
        fontFamily: 'var(--font-sans)',
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

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((u, i) => (
        <span
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : `-${Math.round(size * 0.28)}px`,
            border: '2px solid var(--surface-1)',
            borderRadius: '50%',
            zIndex: visible.length - i,
          }}
        >
          <Avatar initials={u.initials} name={u.name} size={size} colorIndex={i} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: `-${Math.round(size * 0.28)}px`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--surface-3)',
            border: '2px solid var(--surface-1)',
            color: 'var(--ink-3)',
            fontSize: `${Math.max(9, Math.round(size * 0.36))}px`,
            fontWeight: 600,
          }}
        >
          +{overflow}
        </span>
      )}
    </span>
  )
}
