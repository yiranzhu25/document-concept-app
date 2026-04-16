// Base text input — section 5.2
interface InputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  type?: string
}

export function Input({ value, onChange, placeholder, error, disabled, type = 'text' }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        height: '36px',
        padding: '0 12px',
        fontSize: '13px',
        color: 'var(--color-text-primary)',
        backgroundColor: disabled ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
        border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-border-default)'}`,
        borderRadius: 'var(--radius-2)',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'text',
        opacity: disabled ? 0.6 : 1,
        boxSizing: 'border-box',
        transition: `border-color var(--duration-fast) var(--easing-standard)`,
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--color-border-focus)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,70,185,0.12)'
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? 'var(--color-negative)' : 'var(--color-border-default)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}
