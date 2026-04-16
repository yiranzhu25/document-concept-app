import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
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
  const isPrimary = variant === 'primary'
  const isSmall = size === 'sm'
  const isDisabled = disabled || loading

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    cursor: isDisabled ? (loading ? 'wait' : 'not-allowed') : 'pointer',
    border: 'none',
    transition: `background-color var(--duration-fast) var(--easing-standard),
                 color var(--duration-fast) var(--easing-standard),
                 box-shadow var(--duration-fast) var(--easing-standard),
                 opacity var(--duration-fast) var(--easing-standard),
                 transform 80ms ease`,
    whiteSpace: 'nowrap',
    opacity: isDisabled && !loading ? 0.4 : 1,
    // Size
    fontSize: isSmall ? '12px' : '14px',
    lineHeight: isSmall ? '18px' : '22px',
    padding: isSmall ? '5px 14px' : '8px 18px',
    // Shape: primary = pill, secondary = radius-2
    borderRadius: isPrimary ? 'var(--radius-pill)' : 'var(--radius-2)',
    // Colors
    backgroundColor: isPrimary
      ? 'var(--color-action-primary)'
      : 'var(--color-action-secondary)',
    color: isPrimary
      ? 'var(--color-action-primary-text)'
      : 'var(--color-text-primary)',
    boxShadow: isPrimary ? 'none' : `inset 0 0 0 1px var(--color-action-secondary-border)`,
    ...style,
  }

  return (
    <button
      style={baseStyle}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = isPrimary
            ? 'var(--color-action-primary-hover)'
            : 'var(--color-action-secondary-hover)'
        }
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = isPrimary
            ? 'var(--color-action-primary)'
            : 'var(--color-action-secondary)'
        }
        onMouseLeave?.(e)
      }}
      {...rest}
    >
      {loading ? (
        <>
          <span
            style={{
              width: isSmall ? '12px' : '14px',
              height: isSmall ? '12px' : '14px',
              border: `2px solid currentColor`,
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
