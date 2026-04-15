// Search input (A20) — pill shape, leading search icon, trailing clear
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  width?: number | string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  width = 280,
}: SearchInputProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        flexShrink: 0,
      }}
    >
      {/* Leading icon */}
      <Search
        size={14}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-secondary)',
          pointerEvents: 'none',
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '36px',
          paddingLeft: '34px',
          paddingRight: value ? '32px' : '12px',
          fontSize: '13px',
          lineHeight: '22px',
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-pill)',
          outline: 'none',
          transition: `border-color var(--duration-fast) var(--easing-standard)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-focus)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,70,185,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-default)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseEnter={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = 'var(--color-border-strong)'
          }
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = 'var(--color-border-default)'
          }
        }}
      />

      {/* Trailing clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            borderRadius: '50%',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
