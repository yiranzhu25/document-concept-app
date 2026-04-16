// Accordion / collapsible section — Addendum A7
import { useState, useRef, useEffect, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  title: ReactNode
  badge?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onToggle?: (open: boolean) => void
  children: ReactNode
  variant?: 'default' | 'subtle'
}

export function Accordion({
  title,
  badge,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  children,
  variant = 'default',
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0)

  useEffect(() => {
    if (!bodyRef.current) return
    if (isOpen) {
      setHeight(bodyRef.current.scrollHeight)
      const timer = setTimeout(() => setHeight('auto'), 220)
      return () => clearTimeout(timer)
    } else {
      setHeight(bodyRef.current.scrollHeight)
      requestAnimationFrame(() => setHeight(0))
    }
  }, [isOpen])

  const toggle = () => {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onToggle?.(next)
  }

  const isSubtle = variant === 'subtle'

  return (
    <div>
      <button
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: isSubtle ? '12px 16px' : '12px 0',
          borderBottom: isOpen ? 'none' : '1px solid var(--color-border-default)',
          backgroundColor: isSubtle ? 'var(--color-bg-subtle)' : 'transparent',
          borderRadius: isSubtle && !isOpen ? 'var(--radius-2)' : undefined,
          border: isSubtle ? `1px solid var(--color-border-default)` : undefined,
          borderBottomColor: isSubtle ? (isOpen ? 'transparent' : 'var(--color-border-default)') : undefined,
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          const titleEl = e.currentTarget.querySelector('.acc-title') as HTMLElement
          if (titleEl) titleEl.style.color = 'var(--color-text-link)'
        }}
        onMouseLeave={(e) => {
          const titleEl = e.currentTarget.querySelector('.acc-title') as HTMLElement
          if (titleEl) titleEl.style.color = 'var(--color-text-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="acc-title"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              transition: `color var(--duration-fast) var(--easing-standard)`,
            }}
          >
            {title}
          </span>
          {badge}
        </div>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--color-text-secondary)',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform var(--duration-fast) var(--easing-standard)`,
          }}
        />
      </button>

      <div
        style={{
          height: height === 'auto' ? 'auto' : `${height}px`,
          overflow: 'hidden',
          transition: `height var(--duration-standard) var(--easing-standard)`,
        }}
      >
        <div
          ref={bodyRef}
          style={{
            padding: isSubtle ? '12px 16px 16px' : '12px 0 16px 0',
            borderBottom: '1px solid var(--color-border-default)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
