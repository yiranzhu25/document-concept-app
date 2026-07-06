import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

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

/**
 * Custom dropdown (not a native <select>) so the open/active state matches the
 * design system on every platform — native selects fall back to a device-default
 * picker on mobile.
 */
export function Select({ value, onChange, options, placeholder, error, disabled }: SelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const borderColor = error
    ? 'var(--danger)'
    : open
      ? 'var(--ink-3)'
      : 'var(--rule-strong)'

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: '100%',
          height: '36px',
          padding: '0 32px 0 12px',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'left',
          fontSize: 'var(--text-sm)',
          color: selected ? 'var(--ink)' : 'var(--ink-4)',
          backgroundColor: disabled ? 'var(--surface-2)' : 'var(--surface-1)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxSizing: 'border-box',
          boxShadow: open ? '0 1px 0 0 rgba(27,24,19,0.04), 0 2px 6px -1px rgba(27,24,19,0.10)' : 'none',
          transition: `border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)`,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !open && !error) e.currentTarget.style.borderColor = 'var(--ink-3)'
        }}
        onMouseLeave={(e) => {
          if (!disabled && !open) e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--rule-strong)'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
      </button>

      <ChevronDown
        size={13}
        strokeWidth={1.5}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
          color: 'var(--ink-3)',
          pointerEvents: 'none',
          transition: `transform var(--dur-fast) var(--ease-out)`,
        }}
      />

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            margin: 0,
            padding: '4px',
            listStyle: 'none',
            maxHeight: '260px',
            overflowY: 'auto',
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 50,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-sans)',
                    textAlign: 'left',
                    color: 'var(--ink)',
                    backgroundColor: isSelected ? 'var(--accent-soft)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: `background-color var(--dur-fast) var(--ease-out)`,
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check size={14} strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
