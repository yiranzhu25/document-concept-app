import { useIsMobile } from '../hooks/useIsMobile'

interface InputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  type?: string
}

export function Input({ value, onChange, placeholder, error, disabled, type = 'text' }: InputProps) {
  const isMobile = useIsMobile()
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        height: isMobile ? '40px' : '36px',
        padding: '0 12px',
        // 16px on mobile prevents iOS auto-zoom on focus (a device-default behavior).
        fontSize: isMobile ? '16px' : 'var(--text-sm)',
        color: 'var(--ink)',
        backgroundColor: disabled ? 'var(--surface-2)' : 'var(--surface-1)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--rule-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
        fontFamily: 'var(--font-sans)',
        cursor: disabled ? 'not-allowed' : 'text',
        opacity: disabled ? 0.5 : 1,
        boxSizing: 'border-box',
        transition: `border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)`,
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--ink-3)'
          e.currentTarget.style.boxShadow = '0 1px 0 0 rgba(27,24,19,0.04), 0 2px 6px -1px rgba(27,24,19,0.10)'
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--rule-strong)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onMouseEnter={(e) => {
        if (document.activeElement !== e.currentTarget && !disabled) {
          e.currentTarget.style.borderColor = 'var(--ink-3)'
        }
      }}
      onMouseLeave={(e) => {
        if (document.activeElement !== e.currentTarget && !disabled) {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--rule-strong)'
        }
      }}
    />
  )
}
