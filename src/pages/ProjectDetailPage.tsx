// Project detail page — /projects/:id
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Shield, Handshake, Key, MoreHorizontal, Plus, CheckSquare } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { Badge, statusToBadgeVariant } from '../components/Badge'
import { Avatar, AvatarStack } from '../components/Avatar'
import { ActivityLog } from '../components/ActivityLog'
import { Button } from '../components/Button'
import { useToast } from '../contexts/ToastContext'
import { useIsMobile } from '../hooks/useIsMobile'
import type { ProjectType } from '../data/mockData'
import { INITIAL_AUDIT } from '../data/task1Detail'
import type { AuditEntry } from '../data/task1Detail'

const TYPE_ICONS: Record<ProjectType, React.ElementType> = {
  'Purchase and Sale Agreement': FileText,
  'NDA': Shield,
  'Vendor Contract': Handshake,
  'License Agreement': Key,
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function genericAudit(projectName: string, ownerName: string, effectiveDate: string): AuditEntry[] {
  const d = new Date(effectiveDate)
  const fmt = (offset: number) => {
    const dd = new Date(d)
    dd.setDate(dd.getDate() + offset)
    return dd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
  }
  return [
    {
      id: 'g-1', type: 'system', actor: 'System',
      action: `Project created: ${projectName}`,
      timestamp: fmt(0),
    },
    {
      id: 'g-2', type: 'system', actor: 'System',
      action: 'Document extraction completed',
      detail: '9 clauses extracted, 2 issues found',
      timestamp: fmt(1),
    },
    {
      id: 'g-3', type: 'human-verify', actor: ownerName,
      action: 'Started document review',
      timestamp: fmt(2),
    },
  ]
}

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { projects, tasks, updateProject } = useData()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const project = projects.find((p) => p.id === id)
  const projectTasks = tasks
    .filter((t) => t.projectId === id)
    .sort((a, b) => b.priority - a.priority)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  if (!project) {
    return (
      <div>
        <button
          onClick={() => navigate('/projects')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Project not found.</p>
      </div>
    )
  }

  const TypeIcon = TYPE_ICONS[project.type]
  const isArchived = project.status === 'archived'

  const handleArchiveToggle = () => {
    const newStatus = isArchived ? 'active' : 'archived'
    updateProject(project.id, { status: newStatus })
    setMenuOpen(false)
    toast({
      variant: 'success',
      title: isArchived ? 'Project unarchived' : 'Project archived',
      message: project.name,
    })
  }

  const auditEntries: AuditEntry[] = project.id === 'project-1'
    ? INITIAL_AUDIT
    : genericAudit(project.name, project.owner.name, project.effectiveDate)

  return (
    <div>
      {/* Project header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '30px',
              letterSpacing: '-0.02em',
            }}
          >
            {project.name}
          </h1>
          {/* Metadata row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <TypeIcon size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{project.type}</span>
            </div>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{project.client}</span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Effective {formatDate(project.effectiveDate)}
            </span>
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Avatar initials={project.owner.initials} name={project.owner.name} size={20} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{project.owner.name}</span>
            </div>
            <AvatarStack users={project.assignees} max={4} size={20} />
            <Badge variant={statusToBadgeVariant(project.status)} dot />
          </div>
        </div>

        {/* More menu */}
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-2)',
              backgroundColor: menuOpen ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '36px',
                right: 0,
                backgroundColor: 'var(--color-bg-surface-raised)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-3)',
                boxShadow: 'var(--shadow-3)',
                minWidth: '160px',
                overflow: 'hidden',
                zIndex: 20,
              }}
            >
              <button
                onClick={handleArchiveToggle}
                style={{
                  display: 'block', width: '100%', padding: '10px 14px',
                  fontSize: '13px', fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textAlign: 'left', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {isArchived ? 'Unarchive Project' : 'Archive Project'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two-column content (stacks on mobile) */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '24px', alignItems: 'flex-start' }}>

        {/* Left: Task list (65%) */}
        <div style={{ flex: isMobile ? '1 1 auto' : '0 0 calc(65% - 12px)', width: isMobile ? '100%' : undefined, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Tasks
              </h2>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '22px', height: '22px', padding: '0 6px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {projectTasks.length}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/projects/${project.id}/tasks/new`)}
            >
              <Plus size={14} strokeWidth={2.5} /> New Task
            </Button>
          </div>

          {projectTasks.length === 0 ? (
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '240px',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-3)',
                textAlign: 'center', padding: '40px 24px',
              }}
            >
              <CheckSquare size={40} strokeWidth={1.5} style={{ color: 'var(--color-text-placeholder)' }} />
              <p style={{ margin: '16px 0 0', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                No Tasks Yet
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                Create the first task to begin document extraction.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Button variant="primary" size="sm" onClick={() => navigate(`/projects/${project.id}/tasks/new`)}>
                  <Plus size={14} strokeWidth={2.5} /> New Task
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projectTasks.map((task) => {
                const isComplete = task.status === 'Complete'
                return (
                  <Link key={task.id} to={`/tasks/${task.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-3)',
                        padding: '12px 16px',
                        opacity: isComplete ? 0.65 : 1,
                        cursor: 'pointer',
                        transition: `box-shadow var(--duration-fast) var(--easing-standard), border-color var(--duration-fast) var(--easing-standard)`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isComplete) {
                          e.currentTarget.style.boxShadow = 'var(--shadow-2)'
                          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = 'var(--color-border-default)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <span
                          style={{
                            fontSize: '13px', fontWeight: 600, flex: 1,
                            color: isComplete ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                            lineHeight: '20px',
                          }}
                        >
                          {task.name}
                        </span>
                        <Badge variant={statusToBadgeVariant(task.status)} dot={false} />
                      </div>
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginTop: '8px',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          Due {formatDate(task.dueDate)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Avatar initials={task.assignee.initials} name={task.assignee.name} size={18} />
                          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                            {task.assignee.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Activity log (35%) */}
        <div style={{ flex: isMobile ? '1 1 auto' : '0 0 calc(35% - 12px)', width: isMobile ? '100%' : undefined, minWidth: 0 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Activity
          </h2>
          <ActivityLog entries={auditEntries} />
        </div>
      </div>
    </div>
  )
}
