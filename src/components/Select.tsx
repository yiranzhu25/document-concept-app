import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: boolean
  disabled?: boolean
}

export function Select({ value, onChange, options, placeholder, error, disabled }: SelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          height: '36px',
          padding: '0 32px 0 12px',
          fontSize: 'var(--text-sm)',
          color: value ? 'var(--ink)' : 'var(--ink-4)',
          backgroundColor: disabled ? 'var(--surface-2)' : 'var(--surface-1)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--rule-strong)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          appearance: 'none',
          WebkitAppearance: 'none',
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
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={1.5}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--ink-3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
