import { Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'

export function TasksPage() {
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
    </div>
  )
}
