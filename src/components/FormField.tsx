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
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--ink-2)',
          letterSpacing: 'var(--track-snug)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', lineHeight: 1 }}>
            *
          </span>
        )}
      </label>
      {children}
      {helpText && !error && (
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--ink-3)' }}>
          {helpText}
        </p>
      )}
      {error && (
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
