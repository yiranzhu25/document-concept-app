// Shared in-memory data store — persists across navigations within the session
import { createContext, useContext, useState, type ReactNode } from 'react'
import { PROJECTS, TASKS } from '../data/mockData'
import type { Project, Task, User } from '../data/mockData'

interface DataContextValue {
  projects: Project[]
  tasks: Task[]
  addProject: (p: Project) => void
  addTask: (t: Task) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [tasks, setTasks] = useState<Task[]>(TASKS)

  const addProject = (p: Project) => setProjects((prev) => [p, ...prev])
  const addTask = (t: Task) => setTasks((prev) => [t, ...prev])
  const updateProject = (id: string, updates: Partial<Project>) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  const updateTask = (id: string, updates: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))

  return (
    <DataContext.Provider value={{ projects, tasks, addProject, addTask, updateProject, updateTask }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

// Re-export types so callers can import from here
export type { Project, Task, User }
