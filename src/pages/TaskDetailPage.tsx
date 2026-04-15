import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function TaskDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <PageHeader
        title={`Task ${id}`}
        description="Review extracted fields and validate document citations."
      />
    </div>
  )
}
