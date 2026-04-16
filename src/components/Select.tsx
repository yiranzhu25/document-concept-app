// Styled native select — section 5.3
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
          padding: '0 36px 0 12px',
          fontSize: '13px',
          color: value ? 'var(--color-text-primary)' : 'var(--color-text-placeholder)',
          backgroundColor: disabled ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
          border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-border-default)'}`,
          borderRadius: 'var(--radius-2)',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          appearance: 'none',
          WebkitAppearance: 'none',
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
        size={14}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-secondary)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
