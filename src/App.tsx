import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { NewProjectPage } from './pages/NewProjectPage'
import { NewTaskPage } from './pages/NewTaskPage'
import { TasksPage } from './pages/TasksPage'

// Lazy-load the heaviest page — the task review interface
const TaskDetailPage = lazy(() =>
  import('./pages/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage }))
)

function TaskDetailSkeleton() {
  return (
    <div
      style={{
        margin: '-32px -40px',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-app)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--color-border-default)',
            borderTopColor: 'var(--color-action-primary)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Loading review…
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route element={<AppShell />}>
          <Route path="/projects" element={<ProjectsPage />} />
          {/* /projects/new must come before /projects/:id */}
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route
            path="/tasks/:id"
            element={
              <Suspense fallback={<TaskDetailSkeleton />}>
                <TaskDetailPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
