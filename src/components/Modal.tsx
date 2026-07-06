import { useEffect, type ReactNode } from 'react'
import { X, AlertTriangle, AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { useIsMobile } from '../hooks/useIsMobile'

// ─── Base Modal ──────────────────────────────────────────────────────────────

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
  const isMobile = useIsMobile()
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxWidth = { sm: '480px', md: '600px', lg: '800px' }[size]

  return (
    <div
      onClick={disableBackdropClick ? undefined : onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'var(--backdrop)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '24px',
        animation: 'fadeIn var(--dur-slow) var(--ease-out)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth,
          maxHeight: isMobile ? 'calc(100dvh - 32px)' : 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp var(--dur-slow) var(--ease-out)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '20px 24px 18px',
            borderBottom: '1px solid var(--rule)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--ink)',
                lineHeight: 'var(--leading-snug)',
                letterSpacing: 'var(--track-snug)',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-3)' }}>
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
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: 'var(--ink-3)',
              flexShrink: 0,
              marginLeft: '12px',
              marginTop: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--ink-3)'
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 }                      to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

// ─── Confirmation Modal ──────────────────────────────────────────────────────

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
  const isMobile = useIsMobile()
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const Icon = variant === 'destructive' ? AlertTriangle : AlertCircle
  const iconBg    = variant === 'destructive' ? 'var(--danger-soft)'  : 'var(--warning-soft)'
  const iconColor = variant === 'destructive' ? 'var(--danger)'        : 'var(--warning)'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'var(--backdrop)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '24px',
        animation: 'fadeIn var(--dur-slow) var(--ease-out)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '440px',
          padding: '32px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'slideUp var(--dur-slow) var(--ease-out)',
        }}
      >
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
          <Icon size={22} strokeWidth={1.5} style={{ color: iconColor }} />
        </div>

        <h2
          style={{
            margin: '16px 0 0',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 'var(--leading-snug)',
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-3)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '360px',
            }}
          >
            {description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button
            variant={variant === 'destructive' ? 'danger' : 'primary'}
            onClick={() => { onConfirm(); onClose() }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
