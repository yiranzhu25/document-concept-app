import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function ProjectDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <PageHeader
        title={`Project ${id}`}
        description="View and manage this project's documents and extraction tasks."
      />
    </div>
  )
}
