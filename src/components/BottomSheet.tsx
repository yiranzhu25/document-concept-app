import { useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  /** Content of the always-visible peek bar (drag handle is added automatically). */
  peekLabel?: string
  header?: ReactNode
  /** Sheet body — shown when expanded, scrollable. */
  children: ReactNode
  /** Height of the sheet when expanded. Default 85dvh. */
  expandedHeight?: string
  /** Height of the collapsed peek bar. Default 52px. */
  peekHeight?: number
  /** Controlled expanded state (optional). */
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

/**
 * Reusable pull-up drawer / bottom sheet for mobile.
 * Snaps between a collapsed "peek" bar and an expanded sheet.
 * Tap the bar to toggle; drag it up/down to snap.
 */
export function BottomSheet({
  peekLabel,
  header,
  children,
  expandedHeight = '85dvh',
  peekHeight = 52,
  expanded: expandedProp,
  onExpandedChange,
}: BottomSheetProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const expanded = expandedProp ?? internalExpanded

  const setExpanded = (next: boolean) => {
    if (onExpandedChange) onExpandedChange(next)
    if (expandedProp === undefined) setInternalExpanded(next)
  }

  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)
  const [dragDy, setDragDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const moved = useRef(false)

  // Collapsed = pushed down so only the peek bar shows.
  const collapsedTranslate = `calc(100% - ${peekHeight}px)`
  const base = expanded ? 0 : null // 0px when expanded, else collapsedTranslate string

  const onPointerDown = (e: ReactPointerEvent) => {
    dragStartY.current = e.clientY
    moved.current = false
    setDragging(true)
    setDragDy(0)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragStartY.current === null) return
    const dy = e.clientY - dragStartY.current
    if (Math.abs(dy) > 4) moved.current = true
    const sheetH = sheetRef.current?.offsetHeight ?? 400
    const maxDown = sheetH - peekHeight
    // When expanded, only allow dragging down (0..maxDown).
    // When collapsed, only allow dragging up (-maxDown..0).
    const clamped = expanded
      ? Math.max(0, Math.min(dy, maxDown))
      : Math.min(0, Math.max(dy, -maxDown))
    setDragDy(clamped)
  }

  const onPointerUp = () => {
    setDragging(false)
    if (dragStartY.current === null) return
    dragStartY.current = null
    const threshold = 48
    if (!moved.current) {
      // Treat as a tap → toggle.
      setExpanded(!expanded)
    } else if (expanded && dragDy > threshold) {
      setExpanded(false)
    } else if (!expanded && dragDy < -threshold) {
      setExpanded(true)
    }
    setDragDy(0)
  }

  const translateY =
    base === 0
      ? `${dragDy}px`
      : `calc(${collapsedTranslate} + ${dragDy}px)`

  // Portal to <body> so position:fixed resolves against the viewport, not an
  // ancestor with a transform / will-change (which would let it scroll away).
  return createPortal(
    <>
      {/* Backdrop — only when expanded */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--backdrop)',
            zIndex: 39,
          }}
        />
      )}

      <div
        ref={sheetRef}
        role="dialog"
        aria-label={peekLabel ?? 'Panel'}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: expandedHeight,
          transform: `translateY(${translateY})`,
          transition: dragging ? 'none' : 'transform 260ms var(--ease-out)',
          backgroundColor: 'var(--surface-1)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          borderTop: '1px solid var(--rule)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {/* Peek bar / drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            flexShrink: 0,
            height: `${peekHeight}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 16px',
            cursor: 'grab',
            userSelect: 'none',
            borderBottom: expanded ? '1px solid var(--rule)' : 'none',
          }}
        >
          {/* grab handle */}
          <span
            style={{
              width: '36px',
              height: '4px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--rule-strong)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '8px',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {header ?? (
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  {peekLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  )
}
