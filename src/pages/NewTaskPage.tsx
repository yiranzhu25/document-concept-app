// New Task page — /projects/:id/tasks/new  OR  /tasks/new?projectId=:id
// Includes: project context, file upload, extraction simulation (A17)
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileText, Shield, Handshake, Key,
  Sparkles, CheckCircle, XCircle, Circle,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { Button } from '../components/Button'
import { Select } from '../components/Select'
import { FileUploadZone } from '../components/FileUploadZone'
import { ConfirmModal } from '../components/Modal'
import { CURRENT_USER } from '../data/mockData'
import type { ProjectType, Task } from '../data/mockData'
import type { UploadedFile } from '../components/FileUploadZone'

const TYPE_ICONS: Record<ProjectType, React.ElementType> = {
  'Purchase and Sale Agreement': FileText,
  'NDA': Shield,
  'Vendor Contract': Handshake,
  'License Agreement': Key,
}

// ── Extraction step types ─────────────────────────────────────────────────────

interface ExtractionStep {
  id: string
  label: string
  delayMs: number  // cumulative time until this step starts completing
}

const STEPS: ExtractionStep[] = [
  { id: 's1', label: 'Document parsing',          delayMs: 1000  },
  { id: 's2', label: 'Identifying clauses',        delayMs: 3000  },
  { id: 's3', label: 'Extracting values',          delayMs: 5000  },
  { id: 's4', label: 'Validating against rules',   delayMs: 6500  },
  { id: 's5', label: 'Generating citations',       delayMs: 7500  },
]

type StepStatus = 'pending' | 'in-progress' | 'complete'

type PageState = 'upload' | 'extracting' | 'complete' | 'failed'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Spinner component ─────────────────────────────────────────────────────────

function Spinner({ size = 18, color = 'var(--color-info)' }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        border: `2px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}

export function NewTaskPage() {
  const { id: paramId } = useParams()   // present for /projects/:id/tasks/new
  const [searchParams] = useSearchParams()
  const qsProjectId = searchParams.get('projectId')
  const navigate = useNavigate()
  const { projects, addTask } = useData()

  // Determine project
  const rawProjectId = paramId ?? qsProjectId ?? ''
  const [selectedProjectId, setSelectedProjectId] = useState(rawProjectId)
  const project = projects.find((p) => p.id === selectedProjectId)

  // File state
  const [mainFiles, setMainFiles] = useState<UploadedFile[]>([])
  const [supportingFiles, setSupportingFiles] = useState<UploadedFile[]>([])

  // Page state machine
  const [pageState, setPageState] = useState<PageState>('upload')
  const [stepStatuses, setStepStatuses] = useState<Map<string, StepStatus>>(new Map())
  const [showStopModal, setShowStopModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Refs for timers so we can clear them on unmount / stop
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const newTaskIdRef = useRef<string>('')

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const startExtraction = () => {
    if (!project || mainFiles.length === 0) return

    setPageState('extracting')
    const initialMap = new Map<string, StepStatus>()
    STEPS.forEach((s) => initialMap.set(s.id, 'pending'))
    // First step is immediately in-progress
    initialMap.set(STEPS[0].id, 'in-progress')
    setStepStatuses(new Map(initialMap))

    // Schedule each step completing, and the next starting
    STEPS.forEach((step, idx) => {
      const t = setTimeout(() => {
        setStepStatuses((prev) => {
          const next = new Map(prev)
          next.set(step.id, 'complete')
          if (idx + 1 < STEPS.length) next.set(STEPS[idx + 1].id, 'in-progress')
          return next
        })
      }, step.delayMs)
      timers.current.push(t)
    })

    // All complete
    const doneTimer = setTimeout(() => {
      setPageState('complete')
      // Create the new task in data store (for non-project-1 projects)
      if (project.id !== 'project-1') {
        const newId = `task-${Date.now()}`
        newTaskIdRef.current = newId
        const newTask: Task = {
          id: newId,
          name: mainFiles[0].name.replace(/\.pdf$/i, ''),
          projectId: project.id,
          project: project.name,
          client: project.client,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          assignee: CURRENT_USER,
          status: 'Pending review',
          automationResult: { clausesExtracted: 12, issuesFound: 6 },
          priority: 75,
        }
        addTask(newTask)
      }
    }, 7600)
    timers.current.push(doneTimer)
  }

  const handleStop = () => {
    clearTimers()
    setPageState('upload')
    setStepStatuses(new Map())
  }

  const handleRetry = () => {
    setStepStatuses(new Map())
    startExtraction()
  }

  const handleStartReview = () => {
    const targetId = project?.id === 'project-1' ? 'task-1' : newTaskIdRef.current
    navigate(`/tasks/${targetId}`)
  }

  const handleCancel = () => {
    const hasDirtyFiles = mainFiles.length > 0 || supportingFiles.length > 0
    if (hasDirtyFiles) {
      setShowCancelModal(true)
    } else {
      navigateBack()
    }
  }

  const navigateBack = () => {
    if (paramId) navigate(`/projects/${paramId}`)
    else navigate('/tasks')
  }

  // Simulate failed state (debug toggle — press F while extracting)
  useEffect(() => {
    if (pageState !== 'extracting') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        clearTimers()
        setPageState('failed')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [pageState])

  const TypeIcon = project ? TYPE_ICONS[project.type] : FileText
  const allComplete = STEPS.every((s) => stepStatuses.get(s.id) === 'complete')

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-ai { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>

      {/* Project selector (shown when no project is pre-selected) */}
      {!rawProjectId && (
        <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
          <h1 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            New Task
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Project <span style={{ color: 'var(--color-negative)' }}>*</span>
            </label>
            <Select
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              placeholder="Select a project..."
              options={projects
                .filter((p) => p.status === 'active')
                .map((p) => ({ value: p.id, label: p.name }))
              }
            />
          </div>
        </div>
      )}

      {/* Project context card */}
      {project && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-3)',
            padding: '16px',
            marginBottom: '32px',
            maxWidth: '720px',
          }}
        >
          {!rawProjectId && (
            <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
              Project Context
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {project.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TypeIcon size={13} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{project.type}</span>
                </div>
                <span style={{ color: 'var(--color-border-strong)' }}>·</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{project.client}</span>
                <span style={{ color: 'var(--color-border-strong)' }}>·</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Effective {formatDate(project.effectiveDate)}
                </span>
                <span style={{ color: 'var(--color-border-strong)' }}>·</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Owner: {project.owner.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload state ──────────────────────────────────────────────────────── */}
      {pageState === 'upload' && project && (
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            New Task
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Upload the contract document to begin AI extraction.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <FileUploadZone
              label="Main Document"
              required
              helpText="Upload the primary contract document (PDF)"
              multiple={false}
              files={mainFiles}
              onFilesChange={setMainFiles}
              docType="main"
            />
            <FileUploadZone
              label="Supporting Documents"
              helpText="Upload any supplementary materials (PDF)"
              multiple
              files={supportingFiles}
              onFilesChange={setSupportingFiles}
              docType="supporting"
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
              gap: '12px', marginTop: '40px', paddingTop: '24px',
              borderTop: '1px solid var(--color-border-default)',
            }}
          >
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={mainFiles.length === 0}
              onClick={startExtraction}
            >
              Start Extraction
            </Button>
          </div>
        </div>
      )}

      {/* ── Upload state: no project selected yet ─────────────────────────────── */}
      {pageState === 'upload' && !project && rawProjectId && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Project not found.</p>
      )}

      {/* ── Extracting state ──────────────────────────────────────────────────── */}
      {(pageState === 'extracting' || pageState === 'complete' || pageState === 'failed') && (
        <div style={{ maxWidth: '560px', margin: '0 auto', paddingTop: '48px', textAlign: 'center' }}>

          {/* Icon */}
          {pageState === 'extracting' && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-info-subtle)',
                animation: 'pulse-ai 2s ease-in-out infinite',
              }}
            >
              <Sparkles size={28} style={{ color: 'var(--color-info)' }} />
            </div>
          )}
          {pageState === 'complete' && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-positive-subtle)',
              }}
            >
              <CheckCircle size={28} style={{ color: 'var(--color-positive)' }} />
            </div>
          )}
          {pageState === 'failed' && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-negative-subtle)',
              }}
            >
              <XCircle size={28} style={{ color: 'var(--color-negative)' }} />
            </div>
          )}

          {/* Title */}
          <h2
            style={{
              margin: '24px 0 0',
              fontSize: '22px', fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {pageState === 'extracting' && 'Extraction In Progress'}
            {pageState === 'complete' && 'Extraction Complete'}
            {pageState === 'failed' && 'Extraction Failed'}
          </h2>

          {/* Description */}
          <p
            style={{
              margin: '8px auto 0',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              lineHeight: '22px',
              maxWidth: '400px',
            }}
          >
            {pageState === 'extracting' &&
              "This usually takes 1–2 minutes. You can leave this page and we'll notify you when it's done."}
            {pageState === 'complete' &&
              '12 clauses extracted, 6 issues found. Ready for review.'}
            {pageState === 'failed' &&
              'The document could not be processed. This may be due to an unsupported format or corrupted file.'}
          </p>

          {/* Step progress list */}
          {pageState !== 'failed' && (
            <div
              style={{
                marginTop: '32px',
                textAlign: 'left',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-3)',
                overflow: 'hidden',
              }}
            >
              {STEPS.map((step, idx) => {
                const status = stepStatuses.get(step.id) ?? 'pending'
                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      borderBottom: idx < STEPS.length - 1
                        ? '1px solid var(--color-border-default)'
                        : 'none',
                    }}
                  >
                    {/* Status icon */}
                    <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {status === 'complete' && (
                        <CheckCircle size={18} style={{ color: 'var(--color-positive)' }} />
                      )}
                      {status === 'in-progress' && (
                        <Spinner size={18} />
                      )}
                      {status === 'pending' && (
                        <Circle size={18} style={{ color: 'var(--color-border-strong)' }} />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: '13px',
                        fontWeight: status === 'in-progress' ? 500 : 400,
                        color: status === 'pending'
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-primary)',
                      }}
                    >
                      {step.label}
                    </span>

                    {/* Status text */}
                    <span
                      style={{
                        fontSize: '11px',
                        color: status === 'complete'
                          ? 'var(--color-positive)'
                          : status === 'in-progress'
                            ? 'var(--color-info)'
                            : 'var(--color-text-placeholder)',
                      }}
                    >
                      {status === 'complete' ? 'Done' : status === 'in-progress' ? 'Running…' : 'Waiting'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            {pageState === 'extracting' && (
              <>
                <Button variant="primary" onClick={() => navigate('/tasks')}>
                  Back to Dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowStopModal(true)}
                >
                  Stop Extraction
                </Button>
              </>
            )}

            {pageState === 'complete' && (
              <>
                <Button variant="primary" onClick={handleStartReview}>
                  {allComplete ? 'Start Review' : 'Start Review'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/tasks')}>
                  Back to Dashboard
                </Button>
              </>
            )}

            {pageState === 'failed' && (
              <>
                <Button variant="primary" onClick={handleRetry}>
                  Retry
                </Button>
                <button
                  style={{
                    fontSize: '13px', fontWeight: 500,
                    color: 'var(--color-text-link)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px 4px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
                >
                  Contact Support
                </button>
              </>
            )}
          </div>

          {/* Fail trigger hint (small, only visible during extraction) */}
          {pageState === 'extracting' && (
            <p style={{ marginTop: '24px', fontSize: '11px', color: 'var(--color-text-placeholder)' }}>
              Press <kbd style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-bg-subtle)', padding: '1px 4px', borderRadius: '3px', border: '1px solid var(--color-border-default)' }}>F</kbd> to simulate failure
            </p>
          )}
        </div>
      )}

      {/* Stop extraction modal */}
      <ConfirmModal
        open={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirm={handleStop}
        title="Stop extraction in progress?"
        description="This will cancel the current extraction. You'll need to start over to process this document."
        confirmLabel="Stop Extraction"
        cancelLabel="Continue"
        variant="destructive"
      />

      {/* Cancel with files modal */}
      <ConfirmModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={navigateBack}
        title="You have unsaved changes."
        description="Leaving this page will remove the uploaded files."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        variant="neutral"
      />
    </div>
  )
}
