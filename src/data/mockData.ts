// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  initials: string
  role: 'Senior Reviewer' | 'Associate' | 'Paralegal' | 'Partner'
}

export type ProjectType =
  | 'Purchase and Sale Agreement'
  | 'NDA'
  | 'Vendor Contract'
  | 'License Agreement'

export type ProjectStatus = 'active' | 'archived'

export interface Project {
  id: string
  name: string
  description: string
  client: string
  type: ProjectType
  effectiveDate: string
  owner: User
  assignees: User[]
  status: ProjectStatus
}

export type TaskStatus =
  | 'Extraction in progress'
  | 'Extraction failed'
  | 'Pending review'
  | 'Complete'

export interface AutomationResult {
  clausesExtracted: number
  issuesFound: number
}

export interface Task {
  id: string
  name: string
  projectId: string
  project: string
  client: string
  dueDate: string
  assignee: User
  status: TaskStatus
  automationResult: AutomationResult
  priority: number
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'user-1', name: 'Sarah Chen',     initials: 'SC', role: 'Senior Reviewer' },
  { id: 'user-2', name: 'James Okafor',   initials: 'JO', role: 'Partner'         },
  { id: 'user-3', name: 'Priya Nair',     initials: 'PN', role: 'Associate'        },
  { id: 'user-4', name: 'Marcus Webb',    initials: 'MW', role: 'Paralegal'        },
  { id: 'user-5', name: 'Elena Sousa',    initials: 'ES', role: 'Senior Reviewer'  },
  { id: 'user-6', name: 'Daniel Reeves',  initials: 'DR', role: 'Associate'        },
]

export const CURRENT_USER = USERS[0] // Sarah Chen

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'State Street Acquisition',
    description: 'Full review of the purchase and sale agreement for the acquisition of Federated Services division.',
    client: 'State Street Global Advisors',
    type: 'Purchase and Sale Agreement',
    effectiveDate: '2025-03-15',
    owner: USERS[0], // Sarah Chen
    assignees: [USERS[0], USERS[2], USERS[3]],
    status: 'active',
  },
  {
    id: 'project-2',
    name: 'GlobalTech NDA Package',
    description: 'Mutual non-disclosure agreement review for strategic partnership discussions with GlobalTech.',
    client: 'GlobalTech Industries',
    type: 'NDA',
    effectiveDate: '2025-02-10',
    owner: USERS[0], // Sarah Chen
    assignees: [USERS[0], USERS[5]],
    status: 'active',
  },
  {
    id: 'project-3',
    name: 'Apex Vendor Services Agreement',
    description: 'Annual vendor contract renewal covering cloud infrastructure and managed services.',
    client: 'Apex Financial Group',
    type: 'Vendor Contract',
    effectiveDate: '2025-01-20',
    owner: USERS[1], // James Okafor
    assignees: [USERS[1], USERS[2], USERS[4]],
    status: 'active',
  },
  {
    id: 'project-4',
    name: 'Meridian Health Systems Acquisition',
    description: 'Cross-border acquisition PSA for the purchase of Meridian Health\'s regional hospital network.',
    client: 'Meridian Health Systems',
    type: 'Purchase and Sale Agreement',
    effectiveDate: '2025-04-01',
    owner: USERS[0], // Sarah Chen
    assignees: [USERS[0], USERS[1], USERS[3], USERS[5]],
    status: 'active',
  },
  {
    id: 'project-5',
    name: 'Horizon SaaS License',
    description: 'Enterprise software license agreement for Horizon analytics platform deployment.',
    client: 'Horizon Capital Partners',
    type: 'License Agreement',
    effectiveDate: '2025-03-01',
    owner: USERS[4], // Elena Sousa
    assignees: [USERS[4], USERS[2]],
    status: 'active',
  },
  {
    id: 'project-6',
    name: 'Vantage NDA — Series B',
    description: 'Confidentiality agreement for Series B funding round due diligence with Vantage Ventures.',
    client: 'Vantage Ventures LLC',
    type: 'NDA',
    effectiveDate: '2025-02-25',
    owner: USERS[0], // Sarah Chen
    assignees: [USERS[0], USERS[3]],
    status: 'active',
  },
  {
    id: 'project-7',
    name: 'Clearwater IT Vendor Contract',
    description: 'Multi-year vendor agreement for IT infrastructure outsourcing and data center management.',
    client: 'Clearwater Asset Management',
    type: 'Vendor Contract',
    effectiveDate: '2024-11-15',
    owner: USERS[1], // James Okafor
    assignees: [USERS[1], USERS[5], USERS[3]],
    status: 'active',
  },
  {
    id: 'project-8',
    name: 'Pinnacle Software License',
    description: 'Perpetual license agreement for Pinnacle financial modeling software suite.',
    client: 'Pinnacle Investment Corp',
    type: 'License Agreement',
    effectiveDate: '2024-10-05',
    owner: USERS[0], // Sarah Chen
    assignees: [USERS[0], USERS[2]],
    status: 'active',
  },
  {
    id: 'project-9',
    name: 'Redwood Capital NDA',
    description: 'Non-disclosure agreement for exploratory merger discussions with Redwood Capital.',
    client: 'Redwood Capital Group',
    type: 'NDA',
    effectiveDate: '2024-08-20',
    owner: USERS[1], // James Okafor
    assignees: [USERS[1], USERS[4]],
    status: 'archived',
  },
  {
    id: 'project-10',
    name: 'Bluerock Acquisition PSA',
    description: 'Asset purchase agreement for the acquisition of Bluerock\'s commercial real estate portfolio.',
    client: 'Bluerock Holdings',
    type: 'Purchase and Sale Agreement',
    effectiveDate: '2024-07-01',
    owner: USERS[4], // Elena Sousa
    assignees: [USERS[4], USERS[3], USERS[2]],
    status: 'archived',
  },
]

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  // Task 1 — the fully wired task
  {
    id: 'task-1',
    name: 'Review PSA — State Street / Federated Services',
    projectId: 'project-1',
    project: 'State Street Acquisition',
    client: 'State Street Global Advisors',
    dueDate: '2025-03-29',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 12, issuesFound: 6 },
    priority: 92,
  },
  // Remaining 24 tasks
  {
    id: 'task-2',
    name: 'GlobalTech NDA — Confidentiality Terms',
    projectId: 'project-2',
    project: 'GlobalTech NDA Package',
    client: 'GlobalTech Industries',
    dueDate: '2025-02-24',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 8, issuesFound: 2 },
    priority: 78,
  },
  {
    id: 'task-3',
    name: 'Apex — Liability & Indemnification Review',
    projectId: 'project-3',
    project: 'Apex Vendor Services Agreement',
    client: 'Apex Financial Group',
    dueDate: '2025-02-03',
    assignee: USERS[2], // Priya Nair
    status: 'Complete',
    automationResult: { clausesExtracted: 10, issuesFound: 0 },
    priority: 55,
  },
  {
    id: 'task-4',
    name: 'Meridian — Representations & Warranties',
    projectId: 'project-4',
    project: 'Meridian Health Systems Acquisition',
    client: 'Meridian Health Systems',
    dueDate: '2025-04-15',
    assignee: USERS[0], // Sarah Chen
    status: 'Extraction in progress',
    automationResult: { clausesExtracted: 0, issuesFound: 0 },
    priority: 88,
  },
  {
    id: 'task-5',
    name: 'Horizon — License Restrictions & Permitted Use',
    projectId: 'project-5',
    project: 'Horizon SaaS License',
    client: 'Horizon Capital Partners',
    dueDate: '2025-03-15',
    assignee: USERS[4], // Elena Sousa
    status: 'Pending review',
    automationResult: { clausesExtracted: 9, issuesFound: 3 },
    priority: 66,
  },
  {
    id: 'task-6',
    name: 'Vantage NDA — Term & Termination Clauses',
    projectId: 'project-6',
    project: 'Vantage NDA — Series B',
    client: 'Vantage Ventures LLC',
    dueDate: '2025-03-11',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 7, issuesFound: 1 },
    priority: 71,
  },
  {
    id: 'task-7',
    name: 'Clearwater — SLA & Performance Obligations',
    projectId: 'project-7',
    project: 'Clearwater IT Vendor Contract',
    client: 'Clearwater Asset Management',
    dueDate: '2024-11-29',
    assignee: USERS[5], // Daniel Reeves
    status: 'Complete',
    automationResult: { clausesExtracted: 11, issuesFound: 0 },
    priority: 42,
  },
  {
    id: 'task-8',
    name: 'Pinnacle — IP Ownership & Assignment',
    projectId: 'project-8',
    project: 'Pinnacle Software License',
    client: 'Pinnacle Investment Corp',
    dueDate: '2024-10-19',
    assignee: USERS[0], // Sarah Chen
    status: 'Complete',
    automationResult: { clausesExtracted: 6, issuesFound: 0 },
    priority: 38,
  },
  {
    id: 'task-9',
    name: 'Meridian — Closing Conditions & Covenants',
    projectId: 'project-4',
    project: 'Meridian Health Systems Acquisition',
    client: 'Meridian Health Systems',
    dueDate: '2025-04-15',
    assignee: USERS[3], // Marcus Webb
    status: 'Pending review',
    automationResult: { clausesExtracted: 14, issuesFound: 5 },
    priority: 83,
  },
  {
    id: 'task-10',
    name: 'State Street — Closing Conditions Review',
    projectId: 'project-1',
    project: 'State Street Acquisition',
    client: 'State Street Global Advisors',
    dueDate: '2025-03-29',
    assignee: USERS[2], // Priya Nair
    status: 'Pending review',
    automationResult: { clausesExtracted: 9, issuesFound: 4 },
    priority: 75,
  },
  {
    id: 'task-11',
    name: 'Apex — Data Processing & Security Addendum',
    projectId: 'project-3',
    project: 'Apex Vendor Services Agreement',
    client: 'Apex Financial Group',
    dueDate: '2025-02-03',
    assignee: USERS[1], // James Okafor
    status: 'Pending review',
    automationResult: { clausesExtracted: 7, issuesFound: 2 },
    priority: 60,
  },
  {
    id: 'task-12',
    name: 'GlobalTech NDA — Governing Law & Jurisdiction',
    projectId: 'project-2',
    project: 'GlobalTech NDA Package',
    client: 'GlobalTech Industries',
    dueDate: '2025-02-24',
    assignee: USERS[5], // Daniel Reeves
    status: 'Pending review',
    automationResult: { clausesExtracted: 5, issuesFound: 1 },
    priority: 48,
  },
  {
    id: 'task-13',
    name: 'Horizon — Maintenance & Support Terms',
    projectId: 'project-5',
    project: 'Horizon SaaS License',
    client: 'Horizon Capital Partners',
    dueDate: '2025-03-15',
    assignee: USERS[2], // Priya Nair
    status: 'Extraction in progress',
    automationResult: { clausesExtracted: 0, issuesFound: 0 },
    priority: 57,
  },
  {
    id: 'task-14',
    name: 'Clearwater — Termination & Exit Rights',
    projectId: 'project-7',
    project: 'Clearwater IT Vendor Contract',
    client: 'Clearwater Asset Management',
    dueDate: '2024-11-29',
    assignee: USERS[1], // James Okafor
    status: 'Pending review',
    automationResult: { clausesExtracted: 8, issuesFound: 3 },
    priority: 50,
  },
  {
    id: 'task-15',
    name: 'Vantage NDA — Residual Knowledge Carve-out',
    projectId: 'project-6',
    project: 'Vantage NDA — Series B',
    client: 'Vantage Ventures LLC',
    dueDate: '2025-03-11',
    assignee: USERS[3], // Marcus Webb
    status: 'Pending review',
    automationResult: { clausesExtracted: 6, issuesFound: 2 },
    priority: 63,
  },
  {
    id: 'task-16',
    name: 'State Street — Representations & Warranties',
    projectId: 'project-1',
    project: 'State Street Acquisition',
    client: 'State Street Global Advisors',
    dueDate: '2025-03-29',
    assignee: USERS[3], // Marcus Webb
    status: 'Extraction failed',
    automationResult: { clausesExtracted: 0, issuesFound: 0 },
    priority: 80,
  },
  {
    id: 'task-17',
    name: 'Pinnacle — Audit & Compliance Rights',
    projectId: 'project-8',
    project: 'Pinnacle Software License',
    client: 'Pinnacle Investment Corp',
    dueDate: '2024-10-19',
    assignee: USERS[4], // Elena Sousa
    status: 'Pending review',
    automationResult: { clausesExtracted: 7, issuesFound: 1 },
    priority: 33,
  },
  {
    id: 'task-18',
    name: 'Meridian — Employee Benefit Obligations',
    projectId: 'project-4',
    project: 'Meridian Health Systems Acquisition',
    client: 'Meridian Health Systems',
    dueDate: '2025-04-15',
    assignee: USERS[5], // Daniel Reeves
    status: 'Pending review',
    automationResult: { clausesExtracted: 10, issuesFound: 4 },
    priority: 76,
  },
  {
    id: 'task-19',
    name: 'Apex — Payment Terms & Invoicing Schedule',
    projectId: 'project-3',
    project: 'Apex Vendor Services Agreement',
    client: 'Apex Financial Group',
    dueDate: '2025-02-03',
    assignee: USERS[2], // Priya Nair
    status: 'Pending review',
    automationResult: { clausesExtracted: 5, issuesFound: 0 },
    priority: 44,
  },
  {
    id: 'task-20',
    name: 'Clearwater — Change Management & Pricing Adjustments',
    projectId: 'project-7',
    project: 'Clearwater IT Vendor Contract',
    client: 'Clearwater Asset Management',
    dueDate: '2024-11-29',
    assignee: USERS[4], // Elena Sousa
    status: 'Complete',
    automationResult: { clausesExtracted: 8, issuesFound: 0 },
    priority: 36,
  },
  {
    id: 'task-21',
    name: 'Horizon — Data Privacy & GDPR Compliance',
    projectId: 'project-5',
    project: 'Horizon SaaS License',
    client: 'Horizon Capital Partners',
    dueDate: '2025-03-15',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 11, issuesFound: 5 },
    priority: 69,
  },
  {
    id: 'task-22',
    name: 'GlobalTech NDA — Non-Solicitation Provisions',
    projectId: 'project-2',
    project: 'GlobalTech NDA Package',
    client: 'GlobalTech Industries',
    dueDate: '2025-02-24',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 6, issuesFound: 2 },
    priority: 55,
  },
  {
    id: 'task-23',
    name: 'State Street — Purchase Price Adjustments',
    projectId: 'project-1',
    project: 'State Street Acquisition',
    client: 'State Street Global Advisors',
    dueDate: '2025-03-29',
    assignee: USERS[5], // Daniel Reeves
    status: 'Pending review',
    automationResult: { clausesExtracted: 13, issuesFound: 7 },
    priority: 85,
  },
  {
    id: 'task-24',
    name: 'Meridian — Real Property & Lease Assignments',
    projectId: 'project-4',
    project: 'Meridian Health Systems Acquisition',
    client: 'Meridian Health Systems',
    dueDate: '2025-04-15',
    assignee: USERS[0], // Sarah Chen
    status: 'Pending review',
    automationResult: { clausesExtracted: 15, issuesFound: 8 },
    priority: 81,
  },
  {
    id: 'task-25',
    name: 'Vantage NDA — Permitted Disclosure Exceptions',
    projectId: 'project-6',
    project: 'Vantage NDA — Series B',
    client: 'Vantage Ventures LLC',
    dueDate: '2025-03-11',
    assignee: USERS[1], // James Okafor
    status: 'Pending review',
    automationResult: { clausesExtracted: 7, issuesFound: 3 },
    priority: 58,
  },
]
