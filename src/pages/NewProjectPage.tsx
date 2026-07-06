// New Project creation page — /projects/new
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { Select } from '../components/Select'
import { MultiSelect } from '../components/MultiSelect'
import { ConfirmModal } from '../components/Modal'
import { useIsMobile } from '../hooks/useIsMobile'
import { USERS, CURRENT_USER } from '../data/mockData'
import type { Project, ProjectType } from '../data/mockData'

const PROJECT_TYPES: ProjectType[] = [
  'Purchase and Sale Agreement',
  'NDA',
  'Vendor Contract',
  'License Agreement',
]

interface FormErrors {
  name?: string
  type?: string
  client?: string
  effectiveDate?: string
}

export function NewProjectPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { addProject } = useData()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ProjectType | ''>('')
  const [client, setClient] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [ownerId, setOwnerId] = useState(CURRENT_USER.id)
  const [assignees, setAssignees] = useState([CURRENT_USER])
  const [errors, setErrors] = useState<FormErrors>({})
  const [showDiscardModal, setShowDiscardModal] = useState(false)

  const isDirty = name.trim() || description.trim() || type || client.trim() || effectiveDate

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardModal(true)
    } else {
      navigate('/projects')
    }
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!name.trim()) e.name = 'Project name is required.'
    if (!type) e.type = 'Project type is required.'
    if (!client.trim()) e.client = 'Client is required.'
    if (!effectiveDate) e.effectiveDate = 'Effective date is required.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    const owner = USERS.find((u) => u.id === ownerId) ?? CURRENT_USER
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      type: type as ProjectType,
      client: client.trim(),
      effectiveDate,
      owner,
      assignees: assignees.length > 0 ? assignees : [owner],
      status: 'active',
    }

    addProject(newProject)
    toast({ variant: 'success', title: 'Project created', message: newProject.name })
    navigate(`/projects/${newProject.id}`)
  }

  return (
    <div style={{ maxWidth: '680px', width: '100%' }}>
      {/* Title */}
      <h1
        style={{
          margin: '0 0 32px',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          lineHeight: '30px',
          letterSpacing: '-0.02em',
        }}
      >
        New Project
      </h1>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <FormField label="Project Name" required error={errors.name}>
          <Input
            value={name}
            onChange={(v) => { setName(v); if (errors.name) setErrors((e) => ({ ...e, name: undefined })) }}
            placeholder="e.g., Acquisition of Meridian Health"
            error={!!errors.name}
          />
        </FormField>

        <FormField label="Project Description" helpText="Optional · max 200 characters">
          <Textarea
            value={description}
            onChange={setDescription}
            placeholder="Brief description of this project"
            rows={3}
            maxLength={200}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
          <FormField label="Type of Project" required error={errors.type}>
            <Select
              value={type}
              onChange={(v) => { setType(v as ProjectType); if (errors.type) setErrors((e) => ({ ...e, type: undefined })) }}
              placeholder="Select type..."
              error={!!errors.type}
              options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </FormField>

          <FormField label="Client" required error={errors.client}>
            <Input
              value={client}
              onChange={(v) => { setClient(v); if (errors.client) setErrors((e) => ({ ...e, client: undefined })) }}
              placeholder="e.g., State Street Global Advisors"
              error={!!errors.client}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
          <FormField label="Effective Date" required error={errors.effectiveDate}>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(v) => { setEffectiveDate(v); if (errors.effectiveDate) setErrors((e) => ({ ...e, effectiveDate: undefined })) }}
              error={!!errors.effectiveDate}
            />
          </FormField>

          <FormField label="Owner">
            <Select
              value={ownerId}
              onChange={setOwnerId}
              options={USERS.map((u) => ({ value: u.id, label: `${u.name} — ${u.role}` }))}
            />
          </FormField>
        </div>

        <FormField label="Assignees" helpText="Select one or more team members to assign to this project.">
          <MultiSelect
            value={assignees}
            onChange={setAssignees}
            options={USERS}
            placeholder="Select team members..."
          />
        </FormField>

      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-border-default)',
        }}
      >
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Project
        </Button>
      </div>

      {/* Unsaved changes modal */}
      <ConfirmModal
        open={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => navigate('/projects')}
        title="You have unsaved changes."
        description="Leaving this page will discard all changes you've made."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        variant="neutral"
      />
    </div>
  )
}
