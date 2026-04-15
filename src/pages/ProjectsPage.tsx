import { Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'

export function ProjectsPage() {
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
    </div>
  )
}
