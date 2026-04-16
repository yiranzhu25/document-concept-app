// Form field wrapper — label + required asterisk + error message
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  helpText?: string
  children: ReactNode
}

export function FormField({ label, required, error, helpText, children }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--color-negative)', fontSize: '13px', lineHeight: 1 }}>
            *
          </span>
        )}
      </label>
      {children}
      {helpText && !error && (
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {helpText}
        </p>
      )}
      {error && (
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-negative)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
