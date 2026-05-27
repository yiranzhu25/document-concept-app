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
          padding: maxLength ? '10px 12px 24px' : '10px 12px',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.5,
          color: 'var(--ink)',
          backgroundColor: disabled ? 'var(--surface-2)' : 'var(--surface-1)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--rule-strong)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'var(--font-sans)',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.5 : 1,
          minHeight: '80px',
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
      />
      {maxLength && (
        <span
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            fontSize: 'var(--text-xs)',
            color: value.length >= maxLength ? 'var(--danger)' : 'var(--ink-4)',
            pointerEvents: 'none',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  )
}
