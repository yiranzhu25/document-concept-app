import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, CheckCircle, ChevronLeft, ChevronRight,
  FileText, ZoomIn, ZoomOut, Search, X, Check,
  AlertTriangle, Info, Eye,
} from 'lucide-react'
import { TASKS, CURRENT_USER } from '../data/mockData'
import { CLAUSE_SECTIONS, TASK_DOCUMENTS, INITIAL_AUDIT, type ClauseField, type AuditEntry, type Citation } from '../data/task1Detail'
import { PSA_DOCUMENT } from '../data/documentText'
import { TabBar } from '../components/TabBar'
import { Accordion } from '../components/Accordion'
import { ProgressBar } from '../components/ProgressBar'
import { Badge, statusToBadgeVariant } from '../components/Badge'
import { Button } from '../components/Button'
import { ActivityLog } from '../components/ActivityLog'
import { CommentThread, type Comment } from '../components/CommentThread'
import { ConfirmModal } from '../components/Modal'
import { useToast } from '../contexts/ToastContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'review' | 'documents' | 'history' | 'comments'
type FilterMode = 'all' | 'issues' | 'manual'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNow() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function issueLevelColor(level: ClauseField['issueLevel']) {
  if (level === 'critical') return 'var(--color-negative)'
  if (level === 'warning')  return 'var(--color-warning)'
  if (level === 'info')     return 'var(--color-info)'
  return 'var(--color-positive)'
}
function issueLevelSubtle(level: ClauseField['issueLevel']) {
  if (level === 'critical') return 'var(--color-negative-subtle)'
  if (level === 'warning')  return 'var(--color-warning-subtle)'
  if (level === 'info')     return 'var(--color-info-subtle)'
  return 'var(--color-positive-subtle)'
}

// ─── Clause Card ─────────────────────────────────────────────────────────────

interface ClauseCardProps {
  field: ClauseField
  currentValue: string
  isResolved: boolean
  resolvedInfo?: { by: string; at: string }
  isVerifying: boolean
  isEditing: boolean
  isReasoningOpen: boolean
  isSelected: boolean
  isFlashing: boolean
  cardRef: (el: HTMLDivElement | null) => void
  onStartVerify: () => void
  onCancelVerify: () => void
  onConfirmVerify: (note: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (value: string, note: string) => void
  onToggleReasoning: () => void
  onViewCitation: () => void
}

function ClauseCard({
  field, currentValue, isResolved, resolvedInfo,
  isVerifying, isEditing, isReasoningOpen, isSelected, isFlashing,
  cardRef,
  onStartVerify, onCancelVerify, onConfirmVerify,
  onStartEdit, onCancelEdit, onSaveEdit,
  onToggleReasoning, onViewCitation,
}: ClauseCardProps) {
  const [verifyNote, setVerifyNote] = useState('')
  const [editValue, setEditValue] = useState(currentValue)
  const [editNote, setEditNote] = useState('')
  const [showResolvedDetail, setShowResolvedDetail] = useState(false)
  const [showCancelEditConfirm, setShowCancelEditConfirm] = useState(false)

  const handleCancelEditClick = () => {
    if (editValue !== currentValue) {
      setShowCancelEditConfirm(true)
    } else {
      onCancelEdit()
    }
  }

  // Reset edit value when editing starts
  useEffect(() => {
    if (isEditing) setEditValue(currentValue)
  }, [isEditing, currentValue])

  const leftBorderColor = isResolved
    ? 'var(--color-positive)'
    : isFlashing
      ? 'var(--color-action-primary)'
      : 'transparent'

  return (
    <div
      ref={cardRef}
      style={{
        backgroundColor: isSelected ? 'rgba(45,70,185,0.03)' : 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderLeft: `3px solid ${leftBorderColor}`,
        borderRadius: 'var(--radius-3)',
        padding: '14px 16px',
        marginBottom: '8px',
        transition: `border-color var(--duration-fast) var(--easing-standard),
                     background-color var(--duration-fast) var(--easing-standard)`,
      }}
    >
      {/* Top row: label + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {field.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {field.sectionRef && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {field.sectionRef}
            </span>
          )}
          {field.issueLevel === null ? (
            <Badge variant="complete" label="No Issues" dot={false} />
          ) : field.issueLevel === 'critical' ? (
            <Badge variant="critical" label="Critical" dot />
          ) : field.issueLevel === 'warning' ? (
            <Badge variant="warning" label="Warning" dot />
          ) : (
            <Badge variant="info" label="Note" dot />
          )}
        </div>
      </div>

      {/* Issue flag (only for unresolved issues) */}
      {field.issueLevel && field.issueFlag && !isResolved && !isEditing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            backgroundColor: issueLevelSubtle(field.issueLevel),
            border: `1px solid ${issueLevelColor(field.issueLevel)}`,
            borderRadius: 'var(--radius-2)',
            padding: '8px 10px',
            marginTop: '10px',
          }}
        >
          {field.issueLevel === 'critical' ? (
            <AlertTriangle size={14} style={{ color: issueLevelColor(field.issueLevel), flexShrink: 0, marginTop: '1px' }} />
          ) : (
            <Info size={14} style={{ color: issueLevelColor(field.issueLevel), flexShrink: 0, marginTop: '1px' }} />
          )}
          <span style={{ fontSize: '12px', color: issueLevelColor(field.issueLevel), lineHeight: '18px' }}>
            {field.issueFlag}
          </span>
        </div>
      )}

      {/* Value row (or inline edit) */}
      {isEditing ? (
        <div style={{ marginTop: '10px' }}>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            style={{
              width: '100%', minHeight: '60px', padding: '8px 10px',
              fontSize: '13px', lineHeight: '20px',
              border: '1px solid var(--color-border-focus)',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              resize: 'vertical', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(45,70,185,0.12)',
            }}
          />
          <textarea
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Add a note about this change (optional)"
            rows={2}
            style={{
              width: '100%', marginTop: '6px', padding: '8px 10px',
              fontSize: '12px', lineHeight: '18px',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-focus)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-default)' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <Button variant="primary" size="sm" onClick={() => onSaveEdit(editValue, editNote)}>
              Save
            </Button>
            <button
              onClick={handleCancelEditClick}
              style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: '22px' }}>
            {currentValue}
          </span>

          {/* Resolved info */}
          {isResolved && resolvedInfo && (
            <div style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={12} style={{ color: 'var(--color-positive)' }} />
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', letterSpacing: '0.02em' }}>
                  Verified by {resolvedInfo.by} · {resolvedInfo.at}
                </span>
                <button
                  onClick={() => setShowResolvedDetail((v) => !v)}
                  style={{
                    fontSize: '11px', color: 'var(--color-text-link)', background: 'none',
                    border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
                  }}
                >
                  {showResolvedDetail ? 'Hide' : 'View Details'}
                </button>
              </div>
              {showResolvedDetail && field.issueFlag && (
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '18px' }}>
                  Original flag: {field.issueFlag}
                </p>
              )}
            </div>
          )}

          {/* AI Reasoning accordion */}
          <div style={{ marginTop: '8px' }}>
            <Accordion
              title="AI Reasoning"
              open={isReasoningOpen}
              onToggle={onToggleReasoning}
            >
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '18px' }}>
                {field.aiReasoning}
              </p>
            </Accordion>
          </div>

          {/* Actions */}
          {!isResolved && (
            <div style={{ marginTop: '10px' }}>
              {isVerifying ? (
                <div>
                  <textarea
                    value={verifyNote}
                    onChange={(e) => setVerifyNote(e.target.value)}
                    placeholder="Add a note about this verification (optional)"
                    rows={2}
                    autoFocus
                    style={{
                      width: '100%', padding: '8px 10px', fontSize: '12px', lineHeight: '18px',
                      border: '1px solid var(--color-border-focus)',
                      borderRadius: 'var(--radius-2)',
                      backgroundColor: 'var(--color-bg-surface)',
                      color: 'var(--color-text-primary)',
                      resize: 'none', outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(45,70,185,0.12)',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => { onConfirmVerify(verifyNote); setVerifyNote('') }}
                    >
                      <Check size={12} /> Confirm
                    </Button>
                    <button
                      onClick={() => { onCancelVerify(); setVerifyNote('') }}
                      style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {field.citations.length > 0 && (
                    <button
                      onClick={onViewCitation}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        fontSize: '12px', color: 'var(--color-text-secondary)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        transition: `color var(--duration-fast) var(--easing-standard)`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-link)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    >
                      <BookOpen size={13} /> View Citation
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: '6px', marginLeft: field.citations.length > 0 ? 'auto' : undefined }}>
                    {field.issueLevel !== null && (
                      <Button variant="primary" size="sm" onClick={onStartVerify}>
                        Verify
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={onStartEdit}>
                      Manual Update
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={showCancelEditConfirm}
        onClose={() => setShowCancelEditConfirm(false)}
        onConfirm={() => { setShowCancelEditConfirm(false); onCancelEdit() }}
        title="Discard changes?"
        description="You have unsaved edits. Discard them and cancel?"
        confirmLabel="Discard"
        variant="destructive"
      />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const task = TASKS.find((t) => t.id === id)

  // ── State ───────────────────────────────────────────────────────────────────

  const allFields = useMemo(() => CLAUSE_SECTIONS.flatMap((s) => s.fields), [])

  const [activeTab, setActiveTab] = useState<TabId>('review')
  const [taskApproved, setTaskApproved] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)

  // Clause resolution
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(
    () => new Set(allFields.filter((f) => f.resolved).map((f) => f.id)),
  )
  const [resolvedInfoMap, setResolvedInfoMap] = useState<Map<string, { by: string; at: string }>>(
    () => {
      const m = new Map<string, { by: string; at: string }>()
      allFields.filter((f) => f.resolved && f.resolvedBy).forEach((f) => {
        m.set(f.id, { by: f.resolvedBy!, at: f.resolvedAt! })
      })
      return m
    },
  )
  const [overriddenValues, setOverriddenValues] = useState<Map<string, string>>(new Map())

  // Inline actions
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Left panel UI
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(CLAUSE_SECTIONS.map((s) => s.id)),
  )
  const [expandedReasonings, setExpandedReasonings] = useState<Set<string>>(new Set())
  const [flashingId, setFlashingId] = useState<string | null>(null)

  // Right panel
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null)
  const [activeDocId, setActiveDocId] = useState('doc-1')
  const [docViewMode, setDocViewMode] = useState<'citations' | 'full'>('citations')
  const [scrollToExcerpt, setScrollToExcerpt] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [docSearchQuery, setDocSearchQuery] = useState('')
  const [docSearchOpen, setDocSearchOpen] = useState(false)
  const [userCitations, setUserCitations] = useState<(Citation & { fieldId: string })[]>([])
  const [selectionInfo, setSelectionInfo] = useState<{ text: string; top: number; left: number } | null>(null)
  const [irrelevantCitations, setIrrelevantCitations] = useState<Set<string>>(new Set())

  // Split panel
  const [leftPct, setLeftPct] = useState(40)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Audit + comments
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([...INITIAL_AUDIT])
  const [comments, setComments] = useState<Comment[]>([])

  // Refs for scroll-to-field
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const paragraphRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const docContentRef = useRef<HTMLDivElement>(null)

  // ── Computed ────────────────────────────────────────────────────────────────

  const issueFields = useMemo(
    () => allFields.filter((f) => f.issueLevel !== null),
    [allFields],
  )
  const unresolvedIssueFields = useMemo(
    () => issueFields.filter((f) => !resolvedIds.has(f.id)),
    [issueFields, resolvedIds],
  )
  const manualFields = useMemo(
    () => allFields.filter((f) => overriddenValues.has(f.id)),
    [allFields, overriddenValues],
  )

  const filteredFields = useMemo(() => {
    if (filterMode === 'issues') return unresolvedIssueFields
    if (filterMode === 'manual') return manualFields
    return allFields
  }, [filterMode, allFields, unresolvedIssueFields, manualFields])

  const resolvedIssueCount = issueFields.length - unresolvedIssueFields.length
  const issueProgressPct =
    issueFields.length > 0 ? (resolvedIssueCount / issueFields.length) * 100 : 100

  const canApprove = unresolvedIssueFields.length === 0 && !taskApproved
  const allIssuesResolved = unresolvedIssueFields.length === 0 && issueFields.length > 0

  // Pulse the Approve button once when all issues first become resolved
  const [approvePulse, setApprovePulse] = useState(false)
  const prevCanApprove = useRef(false)
  useEffect(() => {
    if (canApprove && !prevCanApprove.current) {
      setApprovePulse(true)
      setTimeout(() => setApprovePulse(false), 700)
    }
    prevCanApprove.current = canApprove
  }, [canApprove])

  // Active citations for right panel
  const activeCitations = useMemo(() => {
    if (!selectedClauseId) return []
    const field = allFields.find((f) => f.id === selectedClauseId)
    if (!field) return []
    const extra = userCitations.filter((c) => c.fieldId === selectedClauseId)
    return [
      ...field.citations.filter((c) => c.documentId === activeDocId),
      ...extra.filter((c) => c.documentId === activeDocId),
    ].filter((c) => !irrelevantCitations.has(c.id))
  }, [selectedClauseId, activeDocId, allFields, userCitations, irrelevantCitations])

  const highlightedExcerpts = useMemo(() => {
    if (!selectedClauseId) return new Set<string>()
    const field = allFields.find((f) => f.id === selectedClauseId)
    if (!field) return new Set<string>()
    const cits = [
      ...field.citations,
      ...userCitations.filter((c) => c.fieldId === selectedClauseId),
    ].filter((c) => c.documentId === activeDocId && !irrelevantCitations.has(c.id))
    return new Set(cits.map((c) => c.excerpt))
  }, [selectedClauseId, activeDocId, allFields, userCitations, irrelevantCitations])

  // Citation counts per document tab
  const citationCountPerDoc = useMemo(() => {
    if (!selectedClauseId) return new Map<string, number>()
    const field = allFields.find((f) => f.id === selectedClauseId)
    if (!field) return new Map<string, number>()
    const m = new Map<string, number>()
    ;[...field.citations, ...userCitations.filter((c) => c.fieldId === selectedClauseId)]
      .filter((c) => !irrelevantCitations.has(c.id))
      .forEach((c) => m.set(c.documentId, (m.get(c.documentId) ?? 0) + 1))
    return m
  }, [selectedClauseId, allFields, userCitations, irrelevantCitations])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleVerify = useCallback(
    (fieldId: string, note: string) => {
      const now = formatNow()
      const field = allFields.find((f) => f.id === fieldId)!
      setResolvedIds((prev) => new Set([...prev, fieldId]))
      setResolvedInfoMap((prev) => new Map([...prev, [fieldId, { by: 'Sarah Chen', at: now }]]))
      setAuditLog((prev) => [
        {
          id: `audit-${Date.now()}`,
          type: 'human-verify',
          actor: 'Sarah Chen',
          action: `Verified: ${field.label}`,
          detail: note || undefined,
          timestamp: now,
        },
        ...prev,
      ])
      setVerifyingId(null)
      toast({ variant: 'success', title: 'Issue verified', message: field.label })
    },
    [allFields, toast],
  )

  const handleSaveEdit = useCallback(
    (fieldId: string, value: string, note: string) => {
      const now = formatNow()
      const field = allFields.find((f) => f.id === fieldId)!
      setOverriddenValues((prev) => new Map([...prev, [fieldId, value]]))
      if (field.issueLevel !== null) {
        setResolvedIds((prev) => new Set([...prev, fieldId]))
        setResolvedInfoMap((prev) => new Map([...prev, [fieldId, { by: 'Sarah Chen', at: now }]]))
      }
      setAuditLog((prev) => [
        {
          id: `audit-${Date.now()}`,
          type: 'human-edit',
          actor: 'Sarah Chen',
          action: `Updated: ${field.label}`,
          detail: note || `New value: "${value}"`,
          timestamp: now,
        },
        ...prev,
      ])
      setEditingId(null)
      toast({ variant: 'success', title: 'Value updated', message: field.label })
    },
    [allFields, toast],
  )

  const handleViewCitation = useCallback((fieldId: string) => {
    setSelectedClauseId(fieldId)
    setDocViewMode('citations')
    const field = allFields.find((f) => f.id === fieldId)
    if (field?.citations[0]) setActiveDocId(field.citations[0].documentId)
  }, [allFields])

  const handleViewInDocument = useCallback((excerpt: string) => {
    setDocViewMode('full')
    setScrollToExcerpt(excerpt)
  }, [])

  const handleSaveCitation = useCallback(() => {
    if (!selectionInfo || !selectedClauseId) return
    const newCit: Citation & { fieldId: string } = {
      id: `user-cit-${Date.now()}`,
      documentId: activeDocId,
      documentName: TASK_DOCUMENTS.find((d) => d.id === activeDocId)?.name ?? '',
      page: 1,
      sectionRef: 'User Selected',
      excerpt: selectionInfo.text,
      relevance: 'relevant',
      userAdded: true,
      fieldId: selectedClauseId,
    }
    setUserCitations((prev) => [...prev, newCit])
    setSelectionInfo(null)
    setDocViewMode('citations')
    toast({ variant: 'success', title: 'Citation saved' })
  }, [selectionInfo, selectedClauseId, activeDocId, toast])

  const handleAddComment = useCallback((text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorInitials: CURRENT_USER.initials,
      body: text,
      timestamp: 'Just now',
    }
    setComments((prev) => [...prev, newComment])
  }, [])

  const handleApprove = useCallback(() => {
    setTaskApproved(true)
    toast({ variant: 'success', title: 'Task approved', message: 'State Street PSA review complete' })
  }, [toast])

  // Navigate to a field by index (in filtered list)
  const navigateToField = useCallback(
    (idx: number) => {
      const field = filteredFields[idx]
      if (!field) return
      setCurrentFieldIdx(idx)
      // Expand the section containing this field
      const section = CLAUSE_SECTIONS.find((s) => s.fields.some((f) => f.id === field.id))
      if (section) setExpandedSections((prev) => new Set([...prev, section.id]))
      // Flash + scroll
      setFlashingId(field.id)
      setTimeout(() => setFlashingId(null), 800)
      setTimeout(() => {
        fieldRefs.current.get(field.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    },
    [filteredFields],
  )

  // Scroll to highlighted paragraph when entering full-doc mode
  useEffect(() => {
    if (docViewMode === 'full' && scrollToExcerpt) {
      const timer = setTimeout(() => {
        paragraphRefs.current.get(scrollToExcerpt)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setScrollToExcerpt(null)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [docViewMode, scrollToExcerpt])

  // j/k / ↓/↑ keyboard navigation between fields on the review tab
  useEffect(() => {
    if (activeTab !== 'review') return
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't fire when focus is inside an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault()
        navigateToField(Math.min(filteredFields.length - 1, currentFieldIdx + 1))
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault()
        navigateToField(Math.max(0, currentFieldIdx - 1))
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeTab, currentFieldIdx, filteredFields.length, navigateToField])

  // Split panel drag
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((ev.clientX - rect.left) / rect.width) * 100
      setLeftPct(Math.min(65, Math.max(28, pct)))
    }
    const onUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Text selection in full doc
  const handleDocMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const sel = window.getSelection()
      const text = sel?.toString().trim()
      if (!text || text.length < 15 || !selectedClauseId) {
        setSelectionInfo(null)
        return
      }
      const range = sel?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      const containerRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      if (rect && containerRect) {
        setSelectionInfo({
          text,
          top: rect.top - containerRect.top - 44,
          left: rect.left - containerRect.left + rect.width / 2,
        })
      }
    },
    [selectedClauseId],
  )

  // Not the wired task — show placeholder
  if (!task || id !== 'task-1') {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <Link to="/tasks" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}
          >
            <ArrowLeft size={14} /> Back to Tasks
          </Link>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
          {task?.name ?? `Task ${id}`}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Full review interface is available for wired tasks only.
        </p>
      </div>
    )
  }

  // ── Layout ──────────────────────────────────────────────────────────────────
  // Escape AppShell's 32px/40px padding and go full-bleed for the split panel

  return (
    <div style={{ margin: '-32px -40px', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Top section ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 40px 0', flexShrink: 0, backgroundColor: 'var(--color-bg-surface)' }}>
        {/* Back nav */}
        <button
          onClick={() => navigate('/tasks')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--color-text-secondary)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px',
            transition: `color var(--duration-fast) var(--easing-standard)`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={14} /> Back to Tasks
        </button>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: '30px', letterSpacing: '-0.02em' }}>
              {task.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{task.project}</span>
              <span style={{ color: 'var(--color-border-strong)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{task.client}</span>
              <span style={{ color: 'var(--color-border-strong)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Badge
              variant={taskApproved ? 'complete' : statusToBadgeVariant(task.status)}
              label={taskApproved ? 'Complete' : task.status}
              dot
            />
            <Button
              variant="primary"
              disabled={!canApprove}
              onClick={() => setShowApproveModal(true)}
              style={approvePulse ? { animation: 'approvePulse 0.7s var(--easing-standard) both' } : undefined}
            >
              {taskApproved ? '✓ Approved' : 'Approve'}
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <TabBar
          tabs={[
            { id: 'review' as TabId,    label: 'Review',    badge: unresolvedIssueFields.length },
            { id: 'documents' as TabId, label: 'Documents' },
            { id: 'history' as TabId,   label: 'History'   },
            { id: 'comments' as TabId,  label: 'Comments', badge: comments.length || undefined },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}

      {/* Review: split panel */}
      {activeTab === 'review' && (
        <div ref={containerRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: 'var(--color-bg-app)' }}>

          {/* ── Left panel ──────────────────────────────────────────────────── */}
          <div
            style={{
              width: `${leftPct}%`,
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--color-bg-surface)',
              borderRight: '1px solid var(--color-border-default)',
              overflow: 'hidden',
            }}
          >
            {/* Filter bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-default)', flexShrink: 0 }}>
              {/* Progress */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: allIssuesResolved ? 'var(--color-positive)' : 'var(--color-text-secondary)', fontWeight: allIssuesResolved ? 600 : 400 }}>
                  {allIssuesResolved
                    ? 'All issues resolved. Ready to approve.'
                    : `${unresolvedIssueFields.length} of ${issueFields.length} issues remaining`}
                </p>
                <ProgressBar value={issueProgressPct} />
              </div>

              {/* Filter pills */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {(
                  [
                    { mode: 'all' as FilterMode,    label: `${allFields.length} Extracted Fields` },
                    { mode: 'issues' as FilterMode,  label: `${unresolvedIssueFields.length} Issues` },
                    { mode: 'manual' as FilterMode,  label: `${manualFields.length} Manual Entries` },
                  ] as { mode: FilterMode; label: string }[]
                ).map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => { setFilterMode(mode); setCurrentFieldIdx(0) }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: filterMode === mode ? 'var(--color-action-primary)' : 'var(--color-bg-subtle)',
                      color: filterMode === mode ? 'var(--color-action-primary-text)' : 'var(--color-text-secondary)',
                      transition: `background-color var(--duration-fast) var(--easing-standard), color var(--duration-fast) var(--easing-standard)`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Field navigator */}
              {filteredFields.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flex: 1 }}>
                    {filterMode === 'issues' ? 'Issue' : filterMode === 'manual' ? 'Entry' : 'Field'}{' '}
                    {currentFieldIdx + 1} of {filteredFields.length}
                  </span>
                  <button
                    onClick={() => navigateToField(Math.max(0, currentFieldIdx - 1))}
                    disabled={currentFieldIdx === 0}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '26px', height: '26px', borderRadius: 'var(--radius-2)',
                      border: '1px solid var(--color-border-default)',
                      backgroundColor: 'transparent', cursor: currentFieldIdx === 0 ? 'not-allowed' : 'pointer',
                      color: currentFieldIdx === 0 ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={(e) => { if (currentFieldIdx > 0) e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => navigateToField(Math.min(filteredFields.length - 1, currentFieldIdx + 1))}
                    disabled={currentFieldIdx === filteredFields.length - 1}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '26px', height: '26px', borderRadius: 'var(--radius-2)',
                      border: '1px solid var(--color-border-default)',
                      backgroundColor: 'transparent',
                      cursor: currentFieldIdx === filteredFields.length - 1 ? 'not-allowed' : 'pointer',
                      color: currentFieldIdx === filteredFields.length - 1 ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={(e) => { if (currentFieldIdx < filteredFields.length - 1) e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Clause list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px' }}>
              {CLAUSE_SECTIONS.map((section) => {
                const sectionFields = section.fields.filter((f) =>
                  filteredFields.some((ff) => ff.id === f.id),
                )
                if (sectionFields.length === 0 && filterMode !== 'all') return null
                const fieldsToShow = filterMode === 'all' ? section.fields : sectionFields
                if (fieldsToShow.length === 0) return null

                return (
                  <div key={section.id} style={{ marginBottom: '4px' }}>
                    <Accordion
                      title={`${section.title} (${fieldsToShow.length})`}
                      open={expandedSections.has(section.id)}
                      onToggle={(open) => {
                        setExpandedSections((prev) => {
                          const next = new Set(prev)
                          open ? next.add(section.id) : next.delete(section.id)
                          return next
                        })
                      }}
                    >
                      {fieldsToShow.map((field) => (
                        <ClauseCard
                          key={field.id}
                          field={field}
                          currentValue={overriddenValues.get(field.id) ?? field.value}
                          isResolved={resolvedIds.has(field.id)}
                          resolvedInfo={resolvedInfoMap.get(field.id)}
                          isVerifying={verifyingId === field.id}
                          isEditing={editingId === field.id}
                          isReasoningOpen={expandedReasonings.has(field.id)}
                          isSelected={selectedClauseId === field.id}
                          isFlashing={flashingId === field.id}
                          cardRef={(el) => {
                            if (el) fieldRefs.current.set(field.id, el)
                            else fieldRefs.current.delete(field.id)
                          }}
                          onStartVerify={() => {
                            setVerifyingId(field.id)
                            setEditingId(null)
                          }}
                          onCancelVerify={() => setVerifyingId(null)}
                          onConfirmVerify={(note) => handleVerify(field.id, note)}
                          onStartEdit={() => {
                            setEditingId(field.id)
                            setVerifyingId(null)
                          }}
                          onCancelEdit={() => setEditingId(null)}
                          onSaveEdit={(value, note) => handleSaveEdit(field.id, value, note)}
                          onToggleReasoning={() => {
                            setExpandedReasonings((prev) => {
                              const next = new Set(prev)
                              prev.has(field.id) ? next.delete(field.id) : next.add(field.id)
                              return next
                            })
                          }}
                          onViewCitation={() => handleViewCitation(field.id)}
                        />
                      ))}
                    </Accordion>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Resize handle ────────────────────────────────────────────────── */}
          <div
            onMouseDown={handleSplitMouseDown}
            onDoubleClick={() => setLeftPct(40)}
            style={{
              width: '8px',
              cursor: 'col-resize',
              flexShrink: 0,
              position: 'relative',
              backgroundColor: 'transparent',
              transition: `background-color var(--duration-fast) var(--easing-standard)`,
              zIndex: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div
              style={{
                position: 'absolute',
                left: '3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2px',
                height: '40px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-border-strong)',
              }}
            />
          </div>

          {/* ── Right panel ──────────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              minWidth: '360px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--color-bg-surface)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Document switcher tabs */}
            <div
              style={{
                height: '44px',
                borderBottom: '1px solid var(--color-border-default)',
                display: 'flex',
                alignItems: 'flex-end',
                overflowX: 'auto',
                flexShrink: 0,
              }}
            >
              {TASK_DOCUMENTS.map((doc) => {
                const isActive = activeDocId === doc.id
                const count = citationCountPerDoc.get(doc.id) ?? 0
                const shortName = doc.name.length > 24 ? doc.name.slice(0, 22) + '…' : doc.name
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--color-action-primary)' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginBottom: '-1px',
                      transition: `color var(--duration-fast) var(--easing-standard), border-color var(--duration-fast) var(--easing-standard)`,
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                  >
                    {shortName}
                    {count > 0 && (
                      <span style={{
                        minWidth: '18px', height: '18px', padding: '0 5px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-info-subtle)',
                        color: 'var(--color-info)',
                        fontSize: '10px', fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

              {docViewMode === 'citations' ? (
                /* Citation viewer mode */
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {!selectedClauseId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center', gap: '8px', padding: '40px 24px' }}>
                      <BookOpen size={36} strokeWidth={1.5} style={{ color: 'var(--color-text-placeholder)' }} />
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>No Citations</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>Select a clause to view citations.</p>
                    </div>
                  ) : activeCitations.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center', gap: '8px', padding: '40px 24px' }}>
                      <BookOpen size={36} strokeWidth={1.5} style={{ color: 'var(--color-text-placeholder)' }} />
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>No Citations</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>No citations for this document.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeCitations.map((cit) => (
                        <div
                          key={cit.id}
                          style={{
                            backgroundColor: 'var(--color-bg-subtle)',
                            border: '1px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-3)',
                            padding: '14px 16px',
                            borderLeft: cit.userAdded ? '3px solid var(--color-positive)' : '3px solid var(--color-info)',
                          }}
                        >
                          {/* Card header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {cit.userAdded ? (
                                <Badge variant="complete" label="User Added" dot={false} />
                              ) : (
                                <Badge
                                  variant={TASK_DOCUMENTS.find(d => d.id === cit.documentId)?.type === 'Main' ? 'doc-main' : 'doc-supporting'}
                                  label={TASK_DOCUMENTS.find(d => d.id === cit.documentId)?.type === 'Main' ? 'Main Document' : 'Supporting'}
                                  dot={false}
                                />
                              )}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                              Page {cit.page} · {cit.sectionRef}
                            </span>
                          </div>

                          {/* Excerpt */}
                          <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-primary)', lineHeight: '20px' }}>
                            "{cit.excerpt.slice(0, 220)}{cit.excerpt.length > 220 ? '…' : ''}"
                          </p>

                          {/* Actions */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <button
                              onClick={() => setIrrelevantCitations((prev) => new Set([...prev, cit.id]))}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-negative)' }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                            >
                              Mark Irrelevant
                            </button>
                            {activeDocId === 'doc-1' && !cit.userAdded && (
                              <button
                                onClick={() => handleViewInDocument(cit.excerpt)}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-link)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
                              >
                                <Eye size={13} /> View in Document
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Full document view mode */
                <>
                  {/* Show Citations sticky button */}
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 5,
                    display: 'flex', justifyContent: 'flex-end',
                    padding: '8px 16px',
                    backgroundColor: 'var(--color-bg-surface)',
                    borderBottom: '1px solid var(--color-border-default)',
                    flexShrink: 0,
                  }}>
                    <Button variant="secondary" size="sm" onClick={() => setDocViewMode('citations')}>
                      Show Citations ({activeCitations.length})
                    </Button>
                  </div>

                  {/* Document content */}
                  <div
                    ref={docContentRef}
                    onMouseUp={handleDocMouseUp}
                    onClick={() => setSelectionInfo(null)}
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '24px 32px',
                      position: 'relative',
                      fontSize: `${zoomLevel}%`,
                    }}
                  >
                    {/* Search highlights */}
                    {PSA_DOCUMENT.map((node) => {
                      const isHighlighted = highlightedExcerpts.has(node.text)
                      const matchesSearch =
                        docSearchQuery.length > 2 &&
                        node.text.toLowerCase().includes(docSearchQuery.toLowerCase())

                      if (node.type === 'article') {
                        return (
                          <h2
                            key={node.id}
                            style={{
                              fontSize: '15px', fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              margin: '24px 0 12px',
                              letterSpacing: '-0.01em',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {node.text}
                          </h2>
                        )
                      }
                      if (node.type === 'section') {
                        return (
                          <h3
                            key={node.id}
                            style={{
                              fontSize: '13px', fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              margin: '16px 0 6px',
                            }}
                          >
                            {node.text}
                          </h3>
                        )
                      }
                      return (
                        <p
                          key={node.id}
                          ref={(el) => {
                            if (el) paragraphRefs.current.set(node.text, el)
                            else paragraphRefs.current.delete(node.text)
                          }}
                          onClick={() => {
                            if (isHighlighted && selectedClauseId) {
                              fieldRefs.current.get(selectedClauseId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                            }
                          }}
                          style={{
                            margin: '0 0 14px',
                            fontSize: '13.5px',
                            lineHeight: '26px',
                            color: 'var(--color-text-primary)',
                            backgroundColor: isHighlighted
                              ? 'rgba(45,70,185,0.10)'
                              : matchesSearch
                                ? 'rgba(245,166,35,0.15)'
                                : 'transparent',
                            borderRadius: isHighlighted || matchesSearch ? '3px' : undefined,
                            padding: isHighlighted || matchesSearch ? '2px 4px' : undefined,
                            cursor: isHighlighted ? 'pointer' : 'text',
                            transition: `background-color var(--duration-fast) var(--easing-standard)`,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {node.text}
                        </p>
                      )
                    })}
                  </div>

                  {/* Floating "Save as Citation" button */}
                  {selectionInfo && selectedClauseId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${selectionInfo.top}px`,
                        left: `${selectionInfo.left}px`,
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        pointerEvents: 'auto',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={handleSaveCitation}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: 'var(--color-action-primary)',
                          color: 'var(--color-action-primary-text)',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-3)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Save as Citation
                      </button>
                    </div>
                  )}

                  {/* Floating island toolbar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-bg-surface-raised)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: 'var(--shadow-4)',
                      padding: '4px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                      title="Zoom out"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', border: 'none', borderRadius: 'var(--radius-2)', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', minWidth: '36px', textAlign: 'center' }}>
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                      title="Zoom in"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', border: 'none', borderRadius: 'var(--radius-2)', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <ZoomIn size={14} />
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border-default)', margin: '0 2px' }} />
                    {docSearchOpen ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          autoFocus
                          value={docSearchQuery}
                          onChange={(e) => setDocSearchQuery(e.target.value)}
                          placeholder="Search document…"
                          style={{
                            width: '160px', height: '26px', padding: '0 8px',
                            fontSize: '12px', border: '1px solid var(--color-border-focus)',
                            borderRadius: 'var(--radius-pill)', outline: 'none',
                            backgroundColor: 'var(--color-bg-surface)',
                            color: 'var(--color-text-primary)',
                          }}
                        />
                        <button
                          onClick={() => { setDocSearchOpen(false); setDocSearchQuery('') }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', border: 'none', borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDocSearchOpen(true)}
                        title="Search"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', border: 'none', borderRadius: 'var(--radius-2)', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <Search size={14} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documents tab */}
      {activeTab === 'documents' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Documents
          </h2>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Document Name', 'Type', 'Size', 'Uploaded'].map((col) => (
                  <th
                    key={col}
                    style={{
                      height: '40px', padding: '0 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      backgroundColor: 'var(--color-bg-subtle)',
                      borderBottom: '1px solid var(--color-border-strong)',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASK_DOCUMENTS.map((doc) => (
                <tr
                  key={doc.id}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  style={{ transition: 'background-color 80ms' }}
                >
                  <td style={{ height: '52px', padding: '0 16px', borderBottom: '1px solid var(--color-border-default)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ height: '52px', padding: '0 16px', borderBottom: '1px solid var(--color-border-default)' }}>
                    <Badge
                      variant={doc.type === 'Main' ? 'doc-main' : 'doc-supporting'}
                      label={doc.type}
                      dot={false}
                    />
                  </td>
                  <td style={{ height: '52px', padding: '0 16px', borderBottom: '1px solid var(--color-border-default)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {doc.size}
                  </td>
                  <td style={{ height: '52px', padding: '0 16px', borderBottom: '1px solid var(--color-border-default)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {doc.uploaded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Activity History
          </h2>
          <ActivityLog entries={auditLog} />
        </div>
      )}

      {/* Comments tab */}
      {activeTab === 'comments' && (
        <div style={{ flex: 1, overflow: 'hidden', padding: '24px 40px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', flexShrink: 0 }}>
            Comments
          </h2>
          <CommentThread comments={comments} onAddComment={handleAddComment} />
        </div>
      )}

      {/* Approve confirmation modal */}
      <ConfirmModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve this review?"
        description="This will mark the extraction review as complete. All verified issues will be recorded in the audit trail."
        confirmLabel="Approve"
        cancelLabel="Keep Reviewing"
        variant="neutral"
      />
    </div>
  )
}
