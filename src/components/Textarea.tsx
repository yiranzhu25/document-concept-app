// Textarea with optional character count
interface TextareaProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  error?: boolean
  disabled?: boolean
}

export function Textarea({ value, onChange, placeholder, rows = 4, maxLength, error, disabled }: TextareaProps) {
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={(e) => {
          if (maxLength && e.target.value.length > maxLength) return
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px 12px',
          paddingBottom: maxLength ? '24px' : '8px',
          fontSize: '13px',
          lineHeight: '20px',
          color: 'var(--color-text-primary)',
          backgroundColor: disabled ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
          border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-border-default)'}`,
          borderRadius: 'var(--radius-2)',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
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
      {maxLength && (
        <span
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            fontSize: '11px',
            color: value.length >= maxLength ? 'var(--color-negative)' : 'var(--color-text-placeholder)',
            pointerEvents: 'none',
          }}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  )
}
