import { useState } from 'react'
import { Plus, FolderOpen, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SearchInput } from '../components/SearchInput'
import { ProjectCard } from '../components/ProjectCard'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'
import { PROJECTS, CURRENT_USER } from '../data/mockData'
import type { Project } from '../data/mockData'

type FilterMode = 'all' | 'mine'

export function ProjectsPage() {
  const { toast } = useToast()
  const [filterMode, setFilterMode] = useState<FilterMode>('mine')
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState<Project[]>(PROJECTS)

  const handleArchiveToggle = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'archived' : 'active' }
          : p,
      ),
    )
    const project = projects.find((p) => p.id === id)!
    const isCurrentlyArchived = project.status === 'archived'
    toast({
      variant: 'success',
      title: isCurrentlyArchived
        ? 'Project unarchived'
        : 'Project archived',
      message: project.name,
    })
  }

  // Filter
  let filtered = projects.filter((p) => {
    if (filterMode === 'mine' && p.owner.id !== CURRENT_USER.id) return false
    const q = search.toLowerCase()
    if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q))
      return false
    return true
  })

  // Sort: active first by most recent effectiveDate, then archived
  filtered = [...filtered].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1
    return new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  })

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your legal document review projects."
        action={
          <Button variant="primary">
            <Plus size={16} strokeWidth={2.5} />
            New Project
          </Button>
        }
      />

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <SegmentedToggle
          options={[
            { value: 'mine' as FilterMode, label: 'My Projects' },
            { value: 'all'  as FilterMode, label: 'All Projects' },
          ]}
          value={filterMode}
          onChange={setFilterMode}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
          width={260}
        />
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Results Found"
          description="Try a different search term or filter."
          minHeight={320}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onArchiveToggle={handleArchiveToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
