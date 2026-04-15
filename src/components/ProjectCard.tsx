// Project card (A16)
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Shield, Handshake, Key, MoreHorizontal } from 'lucide-react'
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

  // Close menu on outside click
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

  const formattedDate = new Date(project.effectiveDate).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' },
  )

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-4)',
        padding: '20px',
        cursor: isArchived ? 'default' : 'pointer',
        opacity: isArchived ? 0.6 : 1,
        boxShadow: hovered && !isArchived ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transform: hovered && !isArchived ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform var(--duration-standard) var(--easing-standard),
                     box-shadow var(--duration-standard) var(--easing-standard),
                     opacity var(--duration-fast) var(--easing-standard)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header row: type icon + status badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TypeIcon
          size={24}
          strokeWidth={1.5}
          style={{ color: 'var(--color-text-secondary)' }}
        />
        <Badge
          variant={statusToBadgeVariant(project.status)}
          dot
        />
      </div>

      {/* Project name + client */}
      <div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: '22px',
            letterSpacing: '-0.01em',
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            marginTop: '2px',
            lineHeight: '18px',
          }}
        >
          {project.client}
        </div>
      </div>

      {/* Effective date */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.02em',
        }}
      >
        Effective: {formattedDate}
      </div>

      {/* Owner + assignees row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Avatar
            initials={project.owner.initials}
            name={project.owner.name}
            size={22}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            {project.owner.name.split(' ')[1]}
          </span>
        </div>

        <AvatarStack
          users={project.assignees}
          max={3}
          size={22}
        />
      </div>

      {/* More menu — visible on hover */}
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
        }}
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
            borderRadius: 'var(--radius-2)',
            backgroundColor: menuOpen
              ? 'var(--color-bg-subtle)'
              : 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            opacity: hovered || menuOpen ? 1 : 0,
            transition: `opacity var(--duration-fast) var(--easing-standard),
                         background-color var(--duration-fast) var(--easing-standard)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            if (!menuOpen) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }
          }}
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: 0,
              backgroundColor: 'var(--color-bg-surface-raised)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-3)',
              boxShadow: 'var(--shadow-3)',
              minWidth: '160px',
              overflow: 'hidden',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => {
                setMenuOpen(false)
                onArchiveToggle(project.id)
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `background-color var(--duration-fast) var(--easing-standard)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {isArchived ? 'Unarchive Project' : 'Archive Project'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
