import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Shield, Handshake, Key, MoreHorizontal, Archive, ArchiveRestore } from 'lucide-react'
import type { Project, ProjectType } from '../data/mockData'
import { Badge, statusToBadgeVariant } from './Badge'
import { Avatar, AvatarStack } from './Avatar'

const TYPE_ICONS: Record<ProjectType, React.ElementType> = {
  'Purchase and Sale Agreement': FileText,
  'NDA':                         Shield,
  'Vendor Contract':             Handshake,
  'License Agreement':           Key,
}

interface ProjectCardProps {
  project: Project
  onArchiveToggle: (id: string) => void
}

export function ProjectCard({ project, onArchiveToggle }: ProjectCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isArchived = project.status === 'archived'
  const TypeIcon = TYPE_ICONS[project.type]

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Format date as "12 Mar 2026" per Clearmark content standards
  const formattedDate = new Date(project.effectiveDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      onClick={() => !isArchived && navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        cursor: isArchived ? 'default' : 'pointer',
        opacity: isArchived ? 0.55 : 1,
        boxShadow: hovered && !isArchived ? 'var(--shadow-sm)' : 'none',
        transition: `box-shadow var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header row: type icon + status badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-2)',
            color: 'var(--ink-3)',
          }}
        >
          <TypeIcon size={16} strokeWidth={1.5} />
        </span>
        <Badge variant={statusToBadgeVariant(project.status)} dot />
      </div>

      {/* Project name + client */}
      <div>
        <div
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--track-snug)',
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-3)',
            marginTop: '3px',
          }}
        >
          {project.client}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--rule)', margin: '0 -18px' }} />

      {/* Effective date + owner row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Avatar initials={project.owner.initials} name={project.owner.name} size={22} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)' }}>
            {project.owner.name.split(' ')[0]}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: 'var(--text-2xs)',
              color: 'var(--ink-4)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formattedDate}
          </span>
          <AvatarStack users={project.assignees} max={3} size={20} />
        </div>
      </div>

      {/* More menu — visible on hover */}
      <div
        ref={menuRef}
        style={{ position: 'absolute', top: '14px', right: '14px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
          aria-label="More options"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: menuOpen ? 'var(--surface-2)' : 'transparent',
            color: 'var(--ink-3)',
            cursor: 'pointer',
            opacity: hovered || menuOpen ? 1 : 0,
            transition: `opacity var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-2)'
            e.currentTarget.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            if (!menuOpen) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--ink-3)'
            }
          }}
        >
          <MoreHorizontal size={15} strokeWidth={1.5} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              right: 0,
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '168px',
              overflow: 'hidden',
              zIndex: 10,
              animation: 'slideDown 120ms var(--ease-out) both',
            }}
          >
            <button
              onClick={() => { setMenuOpen(false); onArchiveToggle(project.id) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 12px',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--ink-2)',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `background-color var(--dur-fast) var(--ease-out)`,
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {isArchived
                ? <><ArchiveRestore size={14} strokeWidth={1.5} /> Unarchive project</>
                : <><Archive size={14} strokeWidth={1.5} /> Archive project</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
