import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message?: string
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export const useToast = () => useContext(ToastContext)

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ElementType; color: string }
> = {
  success: { icon: CheckCircle,    color: 'var(--color-positive)' },
  error:   { icon: AlertCircle,    color: 'var(--color-negative)' },
  warning: { icon: AlertTriangle,  color: 'var(--color-warning)'  },
  info:    { icon: Info,           color: 'var(--color-info)'     },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(Toast & { visible: boolean })[]>([])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => {
      const next = [...prev, { ...opts, id, visible: true }]
      return next.slice(-3) // max 3
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack — top-right */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '320px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast & { visible: boolean }
  onDismiss: (id: string) => void
}) {
  const { variant, title, message, id, visible } = toast
  const { icon: Icon, color } = VARIANT_CONFIG[variant]
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const duration = variant === 'error' ? 6000 : 4000

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => onDismiss(id), duration)
  }, [id, duration, onDismiss])

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, clearTimer])

  return (
    <div
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: 'var(--color-bg-surface-raised)',
        border: '1px solid var(--color-border-default)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--shadow-4)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 16px))',
        transition: `opacity var(--duration-fast) var(--easing-accelerate),
                     transform var(--duration-deliberate) var(--easing-decelerate)`,
      }}
    >
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: '1px' }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '18px',
          }}
        >
          {title}
        </p>
        {message && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              lineHeight: '18px',
            }}
          >
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          borderRadius: 'var(--radius-1)',
          flexShrink: 0,
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)'
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
