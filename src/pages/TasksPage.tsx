import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SearchInput } from '../components/SearchInput'
import { Badge, statusToBadgeVariant } from '../components/Badge'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'
import { TASKS, PROJECTS, CURRENT_USER, USERS } from '../data/mockData'
import type { Task, User } from '../data/mockData'

type FilterMode = 'all' | 'mine'
type SortKey = 'priority' | 'dueDate'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isOverdue(iso: string) {
  return new Date(iso) < new Date()
}

export function TasksPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [filterMode, setFilterMode] = useState<FilterMode>('mine')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [tasks, setTasks] = useState<Task[]>(TASKS)

  // Reassign dropdown state
  const [openReassignId, setOpenReassignId] = useState<string | null>(null)
  const reassignRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openReassignId) return
    const handler = (e: MouseEvent) => {
      if (reassignRef.current && !reassignRef.current.contains(e.target as Node)) {
        setOpenReassignId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openReassignId])

  const handleReassign = (taskId: string, user: User) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: user } : t)),
    )
    setOpenReassignId(null)
    toast({
      variant: 'success',
      title: 'Task reassigned',
      message: `Now assigned to ${user.name}`,
    })
  }

  // Filter
  let filtered = tasks.filter((t) => {
    if (filterMode === 'mine') {
      if (t.assignee.id !== CURRENT_USER.id) return false
      if (t.status === 'Complete') return false
    }
    const q = search.toLowerCase()
    if (
      q &&
      !t.name.toLowerCase().includes(q) &&
      !t.project.toLowerCase().includes(q) &&
      !t.client.toLowerCase().includes(q)
    )
      return false
    return true
  })

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortKey === 'priority') return b.priority - a.priority
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Get assignees for a task's project (for reassign dropdown)
  const getProjectAssignees = (projectId: string) => {
    const project = PROJECTS.find((p) => p.id === projectId)
    return project?.assignees ?? USERS
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Review and action your assigned extraction tasks."
        action={
          <Button variant="primary">
            <Plus size={16} strokeWidth={2.5} />
            New Task
          </Button>
        }
      />

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SegmentedToggle
            options={[
              { value: 'mine' as FilterMode, label: 'My Tasks' },
              { value: 'all'  as FilterMode, label: 'All Tasks' },
            ]}
            value={filterMode}
            onChange={setFilterMode}
          />
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          width={260}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Results Found"
            description="Try a different search term or filter."
            minHeight={240}
          />
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              marginTop: '8px',
            }}
          >
            <thead>
              <tr>
                {[
                  { label: 'Task Name',         width: '260px', sticky: true },
                  { label: 'Project',            width: '160px' },
                  { label: 'Client',             width: '160px' },
                  { label: 'Due Date',           width: '120px' },
                  { label: 'Automation Result',  width: '160px' },
                  { label: 'Priority',           width: '90px'  },
                  { label: 'Assignee',           width: '140px' },
                  { label: 'Status',             width: '170px' },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      height: '40px',
                      padding: '0 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--color-bg-subtle)',
                      borderBottom: '1px solid var(--color-border-strong)',
                      whiteSpace: 'nowrap',
                      width: col.width,
                      // Sticky first column on tablet
                      ...(col.sticky
                        ? {
                            position: 'sticky',
                            left: 0,
                            zIndex: 2,
                            boxShadow: '2px 0 4px -2px rgba(0,0,0,0.06)',
                          }
                        : {}),
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const overdue = isOverdue(task.dueDate)
                const isFailed = task.status === 'Extraction failed'
                const assignees = getProjectAssignees(task.projectId)
                const isReassignOpen = openReassignId === task.id

                return (
                  <tr
                    key={task.id}
                    style={{
                      backgroundColor: isFailed
                        ? 'rgba(255,77,77,0.03)'
                        : 'transparent',
                      cursor: 'default',
                      transition: 'background-color 80ms',
                    }}
                    onMouseEnter={(e) => {
                      const tr = e.currentTarget
                      tr.style.backgroundColor = isFailed
                        ? 'rgba(255,77,77,0.05)'
                        : 'var(--color-bg-subtle)'
                    }}
                    onMouseLeave={(e) => {
                      const tr = e.currentTarget
                      tr.style.backgroundColor = isFailed
                        ? 'rgba(255,77,77,0.03)'
                        : 'transparent'
                    }}
                  >
                    {/* Task Name */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'inherit',
                        boxShadow: '2px 0 4px -2px rgba(0,0,0,0.06)',
                        zIndex: 1,
                      }}
                    >
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/tasks/${task.id}`)}
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--color-text-link)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '240px',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none'
                        }}
                      >
                        {task.name}
                      </span>
                    </td>

                    {/* Project */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '160px',
                      }}
                    >
                      {task.project}
                    </td>

                    {/* Client */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '160px',
                      }}
                    >
                      {task.client}
                    </td>

                    {/* Due Date */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        fontSize: '13px',
                        color: overdue ? 'var(--color-negative)' : 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        fontWeight: overdue ? 500 : 400,
                      }}
                    >
                      {formatDate(task.dueDate)}
                    </td>

                    {/* Automation Result */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.automationResult.clausesExtracted > 0 ? (
                        <>
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            {task.automationResult.clausesExtracted} clauses
                          </span>
                          {task.automationResult.issuesFound > 0 && (
                            <>
                              <span style={{ color: 'var(--color-text-secondary)' }}> · </span>
                              <span style={{ color: 'var(--color-warning)', fontWeight: 500 }}>
                                {task.automationResult.issuesFound} issues
                              </span>
                            </>
                          )}
                          {task.automationResult.issuesFound === 0 && (
                            <>
                              <span style={{ color: 'var(--color-text-secondary)' }}> · </span>
                              <span style={{ color: 'var(--color-text-secondary)' }}>
                                0 issues
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span style={{ color: 'var(--color-text-placeholder)' }}>—</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                      }}
                    >
                      <Badge variant="priority" value={task.priority} />
                    </td>

                    {/* Assignee — with reassign dropdown */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                        position: 'relative',
                      }}
                    >
                      <div
                        ref={isReassignOpen ? reassignRef : null}
                        style={{ position: 'relative', display: 'inline-block' }}
                      >
                        <button
                          onClick={() =>
                            setOpenReassignId(isReassignOpen ? null : task.id)
                          }
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 6px',
                            borderRadius: 'var(--radius-2)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            transition: `background-color var(--duration-fast) var(--easing-standard)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
                          }}
                          onMouseLeave={(e) => {
                            if (!isReassignOpen) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          <Avatar
                            initials={task.assignee.initials}
                            name={task.assignee.name}
                            size={24}
                          />
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-secondary)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {task.assignee.name.split(' ')[0]}
                          </span>
                        </button>

                        {isReassignOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              marginTop: '4px',
                              backgroundColor: 'var(--color-bg-surface-raised)',
                              border: '1px solid var(--color-border-default)',
                              borderRadius: 'var(--radius-3)',
                              boxShadow: 'var(--shadow-3)',
                              minWidth: '180px',
                              zIndex: 20,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                padding: '6px 12px 4px',
                                fontSize: '11px',
                                color: 'var(--color-text-secondary)',
                                fontWeight: 500,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              }}
                            >
                              Reassign to
                            </div>
                            {assignees.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => handleReassign(task.id, user)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 12px',
                                  fontSize: '13px',
                                  color:
                                    user.id === task.assignee.id
                                      ? 'var(--color-text-primary)'
                                      : 'var(--color-text-secondary)',
                                  fontWeight:
                                    user.id === task.assignee.id ? 600 : 400,
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: `background-color var(--duration-fast) var(--easing-standard)`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    'var(--color-bg-subtle)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent'
                                }}
                              >
                                <Avatar
                                  initials={user.initials}
                                  name={user.name}
                                  size={22}
                                />
                                {user.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        height: '52px',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--color-border-default)',
                      }}
                    >
                      <Badge
                        variant={statusToBadgeVariant(task.status)}
                        label={task.status}
                        dot
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────

interface SortDropdownProps {
  value: SortKey
  onChange: (v: SortKey) => void
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate',  label: 'Due Date'  },
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          padding: '0 12px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-2)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: `border-color var(--duration-fast) var(--easing-standard)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = 'var(--color-border-default)'
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Sort:
        </span>
        {current.label}
        <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-3)',
            boxShadow: 'var(--shadow-3)',
            minWidth: '150px',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 12px',
                fontSize: '13px',
                fontWeight: opt.value === value ? 600 : 400,
                color:
                  opt.value === value
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: `background-color var(--duration-fast) var(--easing-standard)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {opt.value === value ? (
                <ChevronUp size={14} style={{ color: 'var(--color-text-primary)' }} />
              ) : (
                <ChevronsUpDown size={14} style={{ color: 'var(--color-text-placeholder)' }} />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
