// Base modal + confirmation modal variant — Addendum A14
import { useEffect, type ReactNode } from 'react'
import { X, AlertTriangle, AlertCircle } from 'lucide-react'
import { Button } from './Button'

// ─── Base Modal ───────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  disableBackdropClick?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  disableBackdropClick = false,
}: ModalProps) {
  // Trap keyboard
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxWidth = { sm: '480px', md: '640px', lg: '800px' }[size]

  return (
    <div
      onClick={disableBackdropClick ? undefined : onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn var(--duration-deliberate) var(--easing-decelerate)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-bg-surface-raised)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-4)',
          boxShadow: 'var(--shadow-4)',
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp var(--duration-deliberate) var(--easing-decelerate)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--color-border-default)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: '26px',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              flexShrink: 0,
              marginLeft: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: '20px 24px',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border-default)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

// ─── Confirmation Modal (A14) ─────────────────────────────────────────────────

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'neutral'
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'neutral',
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const Icon = variant === 'destructive' ? AlertTriangle : AlertCircle
  const iconBg = variant === 'destructive'
    ? 'var(--color-negative-subtle)'
    : 'var(--color-warning-subtle)'
  const iconColor = variant === 'destructive'
    ? 'var(--color-negative)'
    : 'var(--color-warning)'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn var(--duration-deliberate) var(--easing-decelerate)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface-raised)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-4)',
          boxShadow: 'var(--shadow-4)',
          width: '100%',
          maxWidth: '480px',
          padding: '32px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'slideUp var(--duration-deliberate) var(--easing-decelerate)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: iconBg,
          }}
        >
          <Icon size={24} style={{ color: iconColor }} />
        </div>

        <h2
          style={{
            margin: '16px 0 0',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '26px',
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: '20px',
              maxWidth: '360px',
            }}
          >
            {description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            justifyContent: 'center',
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={() => { onConfirm(); onClose() }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
