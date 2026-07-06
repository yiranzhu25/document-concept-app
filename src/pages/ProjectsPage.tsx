import { useState, useMemo } from 'react'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { SearchInput } from '../components/SearchInput'
import { ProjectCard } from '../components/ProjectCard'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'
import { useData } from '../contexts/DataContext'
import { useDebounce } from '../hooks/useDebounce'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURRENT_USER } from '../data/mockData'

type FilterMode = 'all' | 'mine'

export function ProjectsPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { projects, updateProject } = useData()
  const [filterMode, setFilterMode] = useState<FilterMode>('mine')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const handleArchiveToggle = (id: string) => {
    const project = projects.find((p) => p.id === id)!
    const isCurrentlyArchived = project.status === 'archived'
    updateProject(id, { status: isCurrentlyArchived ? 'active' : 'archived' })
    toast({
      variant: 'success',
      title: isCurrentlyArchived ? 'Project unarchived' : 'Project archived',
      message: project.name,
    })
  }

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase()
    let result = projects.filter((p) => {
      if (filterMode === 'mine' && p.owner.id !== CURRENT_USER.id) return false
      if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q))
        return false
      return true
    })
    // Sort: active first by most recent effectiveDate, then archived
    return [...result].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1
      return new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
    })
  }, [projects, filterMode, debouncedSearch])

  const emptyState = useMemo(() => {
    if (debouncedSearch) {
      return (
        <EmptyState
          icon={Search}
          title="No Results Found"
          description="No projects match your search. Try a different term."
          minHeight={320}
        />
      )
    }
    if (filterMode === 'mine') {
      return (
        <EmptyState
          icon={FolderOpen}
          title="No Projects Yet"
          description="Projects you own will appear here."
          minHeight={320}
        />
      )
    }
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Projects"
        description="Create your first project to get started."
        minHeight={320}
      />
    )
  }, [debouncedSearch, filterMode])

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your legal document review projects."
        action={
          <Button variant="primary" onClick={() => navigate('/projects/new')}>
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
        emptyState
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: isMobile ? '16px' : '24px',
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
