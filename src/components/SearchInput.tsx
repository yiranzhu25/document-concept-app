import { Search, X } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  width?: number | string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  width = 280,
}: SearchInputProps) {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        position: 'relative',
        // Full-width on mobile; the numeric width becomes a desktop size.
        width: isMobile ? '100%' : typeof width === 'number' ? `${width}px` : width,
        flexShrink: isMobile ? 1 : 0,
      }}
    >
      <Search
        size={14}
        strokeWidth={1.5}
        style={{
          position: 'absolute',
          left: '11px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--ink-3)',
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
          height: isMobile ? '40px' : '36px',
          paddingLeft: '32px',
          paddingRight: value ? '30px' : '12px',
          // 16px on mobile prevents iOS auto-zoom on focus.
          fontSize: isMobile ? '16px' : 'var(--text-sm)',
          color: 'var(--ink)',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--rule-strong)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          transition: `border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--ink-3)'
          e.currentTarget.style.boxShadow = '0 1px 0 0 rgba(27,24,19,0.04), 0 2px 6px -1px rgba(27,24,19,0.10)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--rule-strong)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseEnter={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = 'var(--ink-3)'
          }
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = 'var(--rule-strong)'
          }
        }}
      />

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
            color: 'var(--ink-3)',
            borderRadius: '50%',
            padding: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)' }}
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
