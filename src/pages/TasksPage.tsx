import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, CheckSquare } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SearchInput } from '../components/SearchInput'
import { Badge, statusToBadgeVariant } from '../components/Badge'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'
import { useData } from '../contexts/DataContext'
import { useDebounce } from '../hooks/useDebounce'
import { CURRENT_USER, USERS } from '../data/mockData'
import type { User } from '../data/mockData'

type FilterMode = 'all' | 'mine'
type SortKey    = 'priority' | 'dueDate'

/** Format date as "12 Mar 2026" — Clearmark content standard */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function isOverdue(iso: string) {
  return new Date(iso) < new Date()
}

// ── Column definitions ────────────────────────────────────────────────────────

const COLS: { key: string; label: string; width: string; className?: string }[] = [
  { key: 'name',       label: 'Task name',        width: '260px' },
  { key: 'project',    label: 'Project',           width: '160px' },
  { key: 'client',     label: 'Client',            width: '160px' },
  { key: 'dueDate',    label: 'Due date',          width: '110px' },
  { key: 'automation', label: 'Automation result', width: '170px' },
  { key: 'priority',   label: 'Priority',          width: '80px',  className: 'num' },
  { key: 'assignee',   label: 'Assignee',          width: '140px' },
]

// Width of the actions column — used for --sticky-right offset on Status
const ACTIONS_COL_WIDTH = 44

// ── Page ──────────────────────────────────────────────────────────────────────

export function TasksPage() {
  const { toast }   = useToast()
  const navigate    = useNavigate()
  const { projects, tasks, updateTask } = useData()

  const [filterMode, setFilterMode] = useState<FilterMode>('mine')
  const [search,     setSearch]     = useState('')
  const [sortKey,    setSortKey]    = useState<SortKey>('priority')
  const debouncedSearch = useDebounce(search, 300)

  // Reassign dropdown
  const [openReassignId, setOpenReassignId] = useState<string | null>(null)
  const reassignRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openReassignId) return
    const handler = (e: MouseEvent) => {
      if (reassignRef.current && !reassignRef.current.contains(e.target as Node))
        setOpenReassignId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openReassignId])

  const handleReassign = (taskId: string, user: User) => {
    updateTask(taskId, { assignee: user })
    setOpenReassignId(null)
    toast({ variant: 'success', title: 'Task reassigned', message: `Now assigned to ${user.name}` })
  }

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase()
    const result = tasks.filter((t) => {
      if (filterMode === 'mine') {
        if (t.assignee.id !== CURRENT_USER.id) return false
        if (t.status === 'Complete') return false
      }
      if (q && !t.name.toLowerCase().includes(q) &&
               !t.project.toLowerCase().includes(q) &&
               !t.client.toLowerCase().includes(q)) return false
      return true
    })
    return [...result].sort((a, b) =>
      sortKey === 'priority'
        ? b.priority - a.priority
        : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  }, [tasks, filterMode, debouncedSearch, sortKey])

  const getProjectAssignees = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.assignees ?? USERS
  }

  const emptyState = useMemo(() => {
    if (debouncedSearch) return (
      <EmptyState icon={Search} title="No results found"
        description="No tasks match your search. Try a different term." minHeight={240} />
    )
    if (filterMode === 'mine') return (
      <EmptyState icon={CheckSquare} title="All caught up"
        description="No pending tasks assigned to you." minHeight={240} />
    )
    return (
      <EmptyState icon={CheckSquare} title="No tasks"
        description="Tasks will appear here once created." minHeight={240} />
    )
  }, [debouncedSearch, filterMode])

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Review and action your assigned extraction tasks."
        action={
          <Button variant="primary" onClick={() => navigate('/tasks/new')}>
            <Plus size={16} strokeWidth={2} /> New task
          </Button>
        }
      />

      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px', gap: '12px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SegmentedToggle
            options={[
              { value: 'mine' as FilterMode, label: 'My tasks'  },
              { value: 'all'  as FilterMode, label: 'All tasks' },
            ]}
            value={filterMode}
            onChange={setFilterMode}
          />
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks…" width={240} />
      </div>

      {/* ── Data table ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? emptyState : (
        <div className="table-scroll">
          <table className="cm-table" style={{ minWidth: '960px' }}>

            {/* ── thead ────────────────────────────────────────────────── */}
            <thead>
              <tr>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    className={col.className}
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}

                {/* Status — sticky right, left hairline */}
                <th
                  className="cm-table__sticky cm-table__sticky--edge"
                  style={{
                    '--sticky-right': `${ACTIONS_COL_WIDTH}px`,
                    minWidth: '140px',
                  } as React.CSSProperties}
                >
                  Status
                </th>

                {/* Actions — sticky right edge */}
                <th
                  className="cm-table__sticky"
                  style={{
                    '--sticky-right': '0',
                    width: `${ACTIONS_COL_WIDTH}px`,
                  } as React.CSSProperties}
                />
              </tr>
            </thead>

            {/* ── tbody ────────────────────────────────────────────────── */}
            <tbody>
              {filtered.map((task) => {
                const overdue        = isOverdue(task.dueDate)
                const assignees      = getProjectAssignees(task.projectId)
                const isReassignOpen = openReassignId === task.id

                return (
                  <tr
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    {/* Task name */}
                    <td style={{ width: '260px' }}>
                      <span style={{
                        fontWeight: 500,
                        color: 'var(--ink)',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '248px',
                      }}>
                        {task.name}
                      </span>
                    </td>

                    {/* Project */}
                    <td style={{ maxWidth: '160px' }}>
                      <span style={{
                        display: 'block', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {task.project}
                      </span>
                    </td>

                    {/* Client */}
                    <td style={{ maxWidth: '160px' }}>
                      <span style={{
                        display: 'block', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {task.client}
                      </span>
                    </td>

                    {/* Due date */}
                    <td style={{
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                      color: overdue ? 'var(--danger)' : 'var(--ink-3)',
                      fontWeight: overdue ? 500 : 400,
                    }}>
                      {formatDate(task.dueDate)}
                    </td>

                    {/* Automation result */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {task.automationResult.clausesExtracted > 0 ? (
                        <>
                          <span style={{ color: 'var(--ink-2)' }}>
                            {task.automationResult.clausesExtracted} clauses
                          </span>
                          <span style={{ color: 'var(--ink-4)', margin: '0 4px' }}>·</span>
                          {task.automationResult.issuesFound > 0 ? (
                            <span style={{ color: 'var(--warning)', fontWeight: 500 }}>
                              {task.automationResult.issuesFound} issues
                            </span>
                          ) : (
                            <span style={{ color: 'var(--ink-3)' }}>0 issues</span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: 'var(--ink-4)' }}>—</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="num">
                      <Badge variant="priority" value={task.priority} />
                    </td>

                    {/* Assignee */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div
                        ref={isReassignOpen ? reassignRef : null}
                        style={{ position: 'relative', display: 'inline-block' }}
                      >
                        <button
                          onClick={() => setOpenReassignId(isReassignOpen ? null : task.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '3px 6px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none', backgroundColor: 'transparent',
                            cursor: 'pointer', fontFamily: 'var(--font-sans)',
                            transition: `background-color var(--dur-fast) var(--ease-out)`,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-3)' }}
                          onMouseLeave={(e) => {
                            if (!isReassignOpen) e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <Avatar initials={task.assignee.initials} name={task.assignee.name} size={22} />
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                            {task.assignee.name.split(' ')[0]}
                          </span>
                        </button>

                        {/* Reassign dropdown */}
                        {isReassignOpen && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                            backgroundColor: 'var(--surface-1)',
                            border: '1px solid var(--rule)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            minWidth: '176px',
                            zIndex: 20, overflow: 'hidden',
                            animation: 'slideDown 120ms var(--ease-out) both',
                          }}>
                            <div style={{
                              padding: '6px 12px 4px',
                              fontSize: 'var(--text-2xs)',
                              color: 'var(--ink-3)',
                              fontWeight: 600,
                              letterSpacing: 'var(--track-wide)',
                              textTransform: 'uppercase',
                              fontFamily: 'var(--font-sans)',
                            }}>
                              Reassign to
                            </div>
                            {assignees.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => handleReassign(task.id, user)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                  width: '100%', padding: '8px 12px',
                                  fontSize: 'var(--text-sm)',
                                  color: user.id === task.assignee.id ? 'var(--ink)' : 'var(--ink-2)',
                                  fontWeight: user.id === task.assignee.id ? 600 : 400,
                                  backgroundColor: 'transparent', border: 'none',
                                  cursor: 'pointer', textAlign: 'left',
                                  fontFamily: 'var(--font-sans)',
                                  transition: `background-color var(--dur-fast) var(--ease-out)`,
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                              >
                                <Avatar initials={user.initials} name={user.name} size={20} />
                                {user.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ── Status — sticky right, left hairline ─────────── */}
                    <td
                      className="cm-table__sticky cm-table__sticky--edge"
                      style={{ '--sticky-right': `${ACTIONS_COL_WIDTH}px` } as React.CSSProperties}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge variant={statusToBadgeVariant(task.status)} label={task.status} dot />
                    </td>

                    {/* ── Actions — sticky right edge ───────────────────── */}
                    <td
                      className="cm-table__sticky"
                      style={{ '--sticky-right': '0' } as React.CSSProperties}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="row-actions" aria-label="Row actions">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="5"  cy="12" r="1" />
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────

interface SortDropdownProps {
  value:    SortKey
  onChange: (v: SortKey) => void
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate',  label: 'Due date'  },
]

function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const current = SORT_OPTIONS.find((o) => o.value === value)!

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          height: '36px', padding: '0 12px',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)', fontWeight: 500,
          color: 'var(--ink)',
          backgroundColor: open ? 'var(--surface-2)' : 'var(--surface-1)',
          border: '1px solid var(--rule-strong)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: `border-color var(--dur-fast) var(--ease-out),
                       background-color var(--dur-fast) var(--ease-out)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-2)'
          e.currentTarget.style.borderColor      = 'var(--ink-3)'
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = 'var(--surface-1)'
            e.currentTarget.style.borderColor      = 'var(--rule-strong)'
          }
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', fontWeight: 500 }}>Sort:</span>
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--ink-3)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          minWidth: '148px', zIndex: 20, overflow: 'hidden',
          animation: 'slideDown 120ms var(--ease-out) both',
        }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '9px 12px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: opt.value === value ? 600 : 400,
                color: opt.value === value ? 'var(--ink)' : 'var(--ink-2)',
                backgroundColor: 'transparent', border: 'none',
                cursor: 'pointer', textAlign: 'left',
                transition: `background-color var(--dur-fast) var(--ease-out)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {opt.value === value && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--accent)', flexShrink: 0 }}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {opt.value !== value && <span style={{ width: '12px', flexShrink: 0 }} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
