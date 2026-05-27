import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const heights: Record<string, string> = { sm: '28px', md: '36px', lg: '44px' }
  const paddings: Record<string, string> = { sm: '0 10px', md: '0 14px', lg: '0 18px' }
  const fontSizes: Record<string, string> = {
    sm: 'var(--text-xs)',
    md: 'var(--text-sm)',
    lg: 'var(--text-base)',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: 'var(--cream)',
      borderColor: 'var(--accent)',
    },
    secondary: {
      backgroundColor: 'var(--surface-1)',
      color: 'var(--ink)',
      borderColor: 'var(--rule-strong)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-2)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'var(--surface-1)',
      color: 'var(--danger)',
      borderColor: 'var(--rule-strong)',
    },
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: heights[size],
    padding: paddings[size],
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontSize: fontSizes[size],
    fontWeight: 'var(--weight-medium)' as any,
    letterSpacing: 'var(--track-snug)',
    border: '1px solid transparent',
    cursor: isDisabled ? (loading ? 'wait' : 'not-allowed') : 'pointer',
    transition: `background-color var(--dur-fast) var(--ease-out),
                 color var(--dur-fast) var(--ease-out),
                 border-color var(--dur-fast) var(--ease-out),
                 box-shadow var(--dur-fast) var(--ease-out)`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: isDisabled && !loading ? 0.5 : 1,
    ...variantStyles[variant],
    ...style,
  }

  const hoverBg: Record<string, string> = {
    primary:   'var(--accent-hover)',
    secondary: 'var(--surface-2)',
    ghost:     'var(--surface-2)',
    danger:    'var(--danger-soft)',
  }
  const hoverBorder: Record<string, string> = {
    primary:   'var(--accent-hover)',
    secondary: 'var(--rule-strong)',
    ghost:     'transparent',
    danger:    'var(--danger)',
  }
  const hoverColor: Record<string, string | undefined> = {
    primary:   undefined,
    secondary: undefined,
    ghost:     'var(--ink)',
    danger:    undefined,
  }

  return (
    <button
      style={baseStyle}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = hoverBg[variant]
          e.currentTarget.style.borderColor = hoverBorder[variant]
          if (hoverColor[variant]) e.currentTarget.style.color = hoverColor[variant]!
        }
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = (variantStyles[variant].backgroundColor as string) ?? 'transparent'
          e.currentTarget.style.borderColor = (variantStyles[variant].borderColor as string) ?? 'transparent'
          if (hoverColor[variant]) e.currentTarget.style.color = (variantStyles[variant].color as string)
        }
        onMouseLeave?.(e)
      }}
      {...rest}
    >
      {loading ? (
        <>
          <span
            style={{
              width: size === 'sm' ? '12px' : '14px',
              height: size === 'sm' ? '12px' : '14px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              flexShrink: 0,
            }}
          />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
