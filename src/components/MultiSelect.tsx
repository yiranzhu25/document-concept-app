// Multi-select with pills — section 5.3
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Avatar } from './Avatar'
import type { User } from '../data/mockData'

interface MultiSelectProps {
  value: User[]
  onChange: (users: User[]) => void
  options: User[]
  placeholder?: string
  error?: boolean
}

export function MultiSelect({ value, onChange, options, placeholder = 'Select users...', error }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggle = (user: User) => {
    const already = value.some((u) => u.id === user.id)
    onChange(already ? value.filter((u) => u.id !== user.id) : [...value, user])
  }

  const remove = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    onChange(value.filter((u) => u.id !== userId))
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger box */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          minHeight: '36px',
          padding: '4px 36px 4px 8px',
          border: `1px solid ${error ? 'var(--color-negative)' : open ? 'var(--color-border-focus)' : 'var(--color-border-default)'}`,
          boxShadow: open ? '0 0 0 3px rgba(45,70,185,0.12)' : 'none',
          borderRadius: 'var(--radius-2)',
          backgroundColor: 'var(--color-bg-surface)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
          position: 'relative',
          boxSizing: 'border-box',
          transition: `border-color var(--duration-fast) var(--easing-standard)`,
        }}
      >
        {value.length === 0 && (
          <span style={{ fontSize: '13px', color: 'var(--color-text-placeholder)', lineHeight: '28px' }}>
            {placeholder}
          </span>
        )}
        {value.map((user) => (
          <span
            key={user.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              height: '26px',
              padding: '0 6px 0 4px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
            }}
          >
            <Avatar initials={user.initials} name={user.name} size={18} />
            {user.name.split(' ')[0]}
            <button
              onClick={(e) => remove(e, user.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14px',
                height: '14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                padding: 0,
                marginLeft: '2px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-negative)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <ChevronDown
          size={14}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            color: 'var(--color-text-secondary)',
            pointerEvents: 'none',
            transition: `transform var(--duration-fast) var(--easing-standard)`,
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-3)',
            boxShadow: 'var(--shadow-3)',
            overflow: 'hidden',
            zIndex: 40,
          }}
        >
          {options.map((user) => {
            const selected = value.some((u) => u.id === user.id)
            return (
              <button
                key={user.id}
                onClick={() => toggle(user)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 14px',
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  backgroundColor: selected ? 'var(--color-info-subtle)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: `background-color var(--duration-fast) var(--easing-standard)`,
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Avatar initials={user.initials} name={user.name} size={22} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{user.role}</div>
                </div>
                {selected && (
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-action-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
