# LegalIQ — Sequenced Build Prompts for Claude Code

**How to use this document:**
This contains 5 sequential prompts. Run them in order in a single Claude Code session. Each prompt builds on the previous one. Do not skip ahead. After each prompt completes and you've verified the result, paste the next prompt.

Before starting, push the initial commit to your GitHub repo. After each prompt completes, commit and push with the message indicated at the end of each prompt.

---

---

# Prompt 1 of 5 — Project scaffold, design system, sidebar navigation, and routing

## What to build

Set up a new React project and implement the global app shell: a vertical sidebar with navigation and page routing. No page content yet — just the skeleton.

## Tech stack

Choose the best modern React stack for a polished single-page app prototype. Use TypeScript. Use Tailwind CSS v3 with CSS custom properties for theming. Use a file-based or declarative router. The app is client-only — no backend, no SSR needed.

## Design system

This app uses a custom design system. Apply the design tokens and component specs from the two design system files included in this project:
- `design-system.md` — base tokens, typography, spacing, elevation, motion, and core component specs (buttons, inputs, selects, modals, toasts, tables, etc.)
- `design-system-addendum.md` — app-specific component specs (sidebar nav, split panel, badges, file upload, tabs, tooltips, activity log, document viewer, etc.)

**Critical rules from the design system:**
- All colors use CSS custom properties (semantic tokens). Never use raw hex values in components.
- Tailwind classes reference these tokens via `theme.extend.colors` in tailwind config.
- Font stack: DM Sans (body/display) + DM Mono (numeric/mono values). Import from Google Fonts.
- Base font size: 14px. See type scale in design system.
- Light mode only for this build. Keep dark token definitions in CSS but do not build a theme toggle.
- Motion: use the duration and easing tokens. All interactive elements need transitions.
- Buttons: primary = pill radius, secondary = 8px radius. This shape distinction is intentional.
- Every interactive element must define: default, hover, focus-visible, active, disabled states.

## App shell layout

No TopBar. Sidebar-only layout:

```
┌──────────────┬──────────────────────────────────────────┐
│ Sidebar      │  Main Content Area                       │
│ 240px        │  (fluid, scrollable)                     │
│              │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Sidebar spec (from design-system-addendum.md section A1)

- Width: 240px expanded, 64px collapsed. Animate transition.
- Fixed position, full viewport height.
- bg: surface color. Right border.
- Three vertical sections: logo area (top), primary nav (middle), user profile (bottom).

**Logo area** (56px height):
- App name: "LegalIQ"
- Use a simple scale/balance icon (from lucide-react: `Scale`) as the logo, 24px.
- App name text: text-md/600.
- Collapsed: icon only, centered.
- Border-bottom separating from nav.

**Primary nav** (2 items):
- Projects (icon: `FolderOpen`) — routes to `/projects`
- Tasks (icon: `CheckSquare`) — routes to `/tasks`
- Follow nav item states from addendum A1: default, hover, active (with 3px left indicator bar).
- Active state determined by current route.

**User profile** (bottom):
- Mock user: "Sarah Chen", role "Senior Reviewer"
- Avatar: 28px circle with initials "SC", bg action-primary, text action-primary-text
- Name + role stacked text.
- Border-top separating from nav.
- Collapsed: avatar only.

**Collapse toggle:**
- Small icon button on sidebar right edge, half outside.
- Chevron icon flips direction.
- Only visible on sidebar edge hover.

### Routing

Set up routes:
- `/` → redirect to `/projects`
- `/projects` → Projects page (placeholder content for now: just the page header)
- `/projects/:id` → Project detail page (placeholder)
- `/tasks` → Tasks page (placeholder)
- `/tasks/:id` → Task review page (placeholder)

Each placeholder page should show the page title and a brief description, styled per the Page Header pattern (addendum A3):
- Projects: title "Projects", description "Manage your legal document review projects."
- Tasks: title "Tasks", description "Review and action your assigned extraction tasks."

### Global action button

Add a `+ New Project` button in the Projects page header (right side). No functionality yet — just the button.

Add a `+ New Task` button in the Tasks page header (right side). No functionality yet — just the button.

### What NOT to do
- Do not build page content beyond the header placeholder
- Do not build dark mode toggle
- Do not install chart libraries
- Do not add any mock data yet

### Git
After completing this prompt:
```
git init
git remote add origin [YOUR_GITHUB_URL]
git add .
git commit -m "feat: project scaffold, design system, sidebar nav, routing"
git push -u origin main
```

---

---

# Prompt 2 of 5 — Mock data, Projects page, and Tasks page

## What to build

Create the mock data layer and build out the Projects and Tasks list pages with full content.

## Mock data

Create a single data file (`src/data/mockData.ts`) that exports all mock data. Use TypeScript interfaces for all types.

### Projects (10 total)

Generate 10 projects in the legal document domain. Each project has:
- `id`: string
- `name`: string (realistic legal project names, e.g., "Acquisition of Meridian Health Systems", "GlobalTech NDA Package")
- `description`: string (1 sentence)
- `client`: string (realistic company names)
- `type`: one of "Purchase and Sale Agreement" | "NDA" | "Vendor Contract" | "License Agreement"
- `effectiveDate`: string (ISO date, spread across 2024-2025)
- `owner`: user object (use "Sarah Chen" for 5 projects, other mock names for 5)
- `assignees`: array of user objects (2-4 per project)
- `status`: "active" | "archived" (8 active, 2 archived)

### Users (6 total)

Create 6 mock users with realistic names, roles (Senior Reviewer, Associate, Paralegal, Partner), and initials for avatars. Sarah Chen is the current/logged-in user.

### Tasks (25 total)

Generate 25 tasks spread across the 10 projects. Each task has:
- `id`: string
- `name`: string (realistic task names, e.g., "Review PSA — Indemnification & Liability", "NDA Clause Extraction — Confidentiality Terms")
- `projectId`: reference to parent project
- `project`: project name (denormalized for display)
- `client`: client name (denormalized)
- `dueDate`: string (ISO date, 10 business days after project effective date)
- `assignee`: single user object
- `status`: "Extraction in progress" | "Extraction failed" | "Pending review" | "Complete"
- `automationResult`: object with `clausesExtracted`: number (5-15), `issuesFound`: number (0-8)
- `priority`: number 1-100 (pre-set, higher = more urgent)

**Task 1 must be the fully wired task** — this is the one reviewers can click into. Set it up as:
- Name: "Review PSA — State Street / Federated Services"
- Project: "State Street Acquisition" (make this project ID "project-1")
- Client: "State Street Global Advisors"
- Type: Purchase and Sale Agreement
- Status: "Pending review"
- Priority: 92
- automationResult: { clausesExtracted: 12, issuesFound: 6 }
- assignee: Sarah Chen

The other 24 tasks: mix of statuses, priorities 15-88, various assignees. At least 3 should be "Complete", 2 "Extraction in progress", 1 "Extraction failed", rest "Pending review".

### Type icons mapping

Create a mapping of project type → lucide-react icon:
- Purchase and Sale Agreement: `FileText`
- NDA: `Shield`
- Vendor Contract: `Handshake`
- License Agreement: `Key`

## Projects page (`/projects`)

### Page header
- Title: "Projects"
- Description: "Manage your legal document review projects."
- Right side: `+ New Project` button (primary, no functionality yet)

### Filter bar (below header, margin-top 16px)
- Left side: Segmented toggle with two options: "All Projects" | "My Projects" (default: "My Projects")
  - Use the segmented toggle spec from addendum A19
  - "My Projects" filters to projects where Sarah Chen is owner
  - "All Projects" shows all
- Right side: Search input (addendum A20), placeholder "Search projects...", filters by project name or client name

### Project cards grid
- Use the Project Card spec from addendum A16
- Grid: `repeat(auto-fill, minmax(320px, 1fr))`, gap 24px
- Cards are clickable — navigate to `/projects/:id` (project detail page is still placeholder for now)
- Sort order: active projects first (by most recent effective date), then archived projects
- Archived cards: opacity 0.6, no hover lift
- Each card shows: type icon, status badge, project name, client, effective date, owner avatar + name, assignee avatars (stacked, max 3 visible + "+N" overflow), more menu icon (hover only)

### More menu
- Dropdown on click of the "⋯" icon on each card
- One option: "Archive Project" (or "Unarchive" if archived)
- On click: toggles the project status. Show a success toast.
- Use base dropdown spec (section 5.3)

### Empty state
- If search/filter results in no projects: show empty state from A13 (No Results Found variant)

## Tasks page (`/tasks`)

### Page header
- Title: "Tasks"
- Description: "Review and action your assigned extraction tasks."
- Right side: `+ New Task` button (primary, no functionality yet)

### Filter bar
- Left side: Segmented toggle: "All Tasks" | "My Tasks" (default: "My Tasks")
  - "My Tasks" filters to tasks assigned to Sarah Chen
- Right side: Search input, placeholder "Search tasks..."
- Below toggle/search row: Sort dropdown — "Priority" (default, high to low) | "Due Date" (earliest first)

### Task table
- Use the Data Grid / Table spec from base design system section 5.7
- Full-width table
- Columns: Task Name (primary cell, font-weight 500), Project, Client, Due Date, Automation Result, Priority, Assignee, Status

**Column details:**
- Task Name: clickable text-link style, navigates to `/tasks/:id`
- Project: text-secondary
- Client: text-secondary
- Due Date: formatted as "Jan 15, 2024". If overdue, text-negative.
- Automation Result: "{N} clauses · {N} issues" — if issues > 0, the issues part uses text-warning
- Priority: numeric badge from A4 (font-mono, pill background)
- Assignee: avatar (28px) + name. Click opens a dropdown of project assignees to reassign. On reassign, show success toast.
- Status: status badge from A4

**Table behaviors:**
- Rows sorted by priority (high to low) by default
- Hover: row bg subtle
- "Extraction failed" rows: subtle negative-subtle background tint
- "Complete" status tasks: do not show in "My Tasks" filter (only visible in "All Tasks")
- Do NOT show rows that are "Complete" by default — only when "All Tasks" is selected

### Empty state
- If filter/search yields no results: empty state from A13

## Responsive behavior (tablet ≤1024px)
- Sidebar collapses to 64px
- Project cards: grid adjusts (cards wrap to fewer columns)
- Task table: horizontal scroll enabled, first column (Task Name) sticky

## What NOT to do
- Do not build the project detail page content yet (keep placeholder)
- Do not build the task review page content yet (keep placeholder)
- Do not build any create/new flows yet
- Do not add the fully detailed extraction data for task-1 yet — that comes in Prompt 3

### Git
```
git add .
git commit -m "feat: mock data, Projects page with cards, Tasks page with table"
git push
```

---

---

# Prompt 3 of 5 — Task review page (the core screen)

## What to build

Build the full task review page for task-1 (the State Street PSA task). This is the most important screen in the app — it's the core workflow.

## Extraction data for task-1

Add detailed extraction data to the mock data file. This is for the State Street / Federated Services Purchase and Sale Agreement.

### Document text

Create a mock document text file or string constant — approximately 30-40 paragraphs of realistic (but fake) legal contract text organized into sections. Include sections that correspond to the clause references below. This text renders in the document viewer. It does not need to be legally accurate — it needs to look realistic and have enough content to scroll through.

Sections to include (in order):
- Article 1: Definitions
- Article 2: Purchase and Sale
- Article 3: Representations and Warranties of Seller
- Article 4: Covenants (include §4.2 with non-compete subsection e)
- Article 5: Conditions to Closing
- Article 6: Indemnification (include §6.2a, §6.5, §6.6)
- Article 7: General Provisions (include §7.2a, §7.15, §7.16)

### Extracted clauses (12 total)

Create 12 extracted data fields, grouped into these sections:

**Section: Deal Terms** (4 fields)
1. Purchase Price — value: "$42,500,000", no issue
2. Closing Date — value: "March 15, 2024", no issue
3. Earnest Money Deposit — value: "$2,125,000 (5% of purchase price)", no issue
4. Payment Structure — value: "Cash at closing, wire transfer", no issue

**Section: Indemnification** (3 fields)
5. Indemnity Cap — value: "Limited to purchase price", issue: Warning, flag: "Indemnity cap equals purchase price only — no multiplier. Industry standard is 1.5-2x for transactions of this size.", section ref: §6.2(a)
6. Aggregate Threshold — value: "$425,000 (1% of purchase price)", issue: Warning, flag: "Basket threshold may be too high — could prevent recovery of smaller but significant claims.", section ref: §6.2(a)
7. Consequential Damages — value: "Waived by both parties", issue: Critical, flag: "Complete waiver of consequential damages removes ability to recover lost profits and business interruption losses.", section ref: §6.5

**Section: Liability & Remedies** (3 fields)
8. Exclusive Remedy — value: "Indemnification is sole remedy post-closing", issue: Info, flag: "Exclusive remedy clause limits all post-closing recourse to the indemnification provisions.", section ref: §6.6, **pre-set as Resolved** (verified by Sarah Chen, Jan 20 2024 2:15 PM)
9. Breach Cure Window — value: "30 calendar days", issue: Warning, flag: "30-day cure period is shorter than the 60-day standard. May not provide adequate time to remedy complex breaches.", section ref: §7.2(a)
10. Jury Trial Waiver — value: "Both parties waive right to jury trial", issue: Critical, flag: "Complete jury trial waiver. Ensure client is aware this limits litigation options to bench trial only.", section ref: §7.16

**Section: Covenants & Restrictions** (2 fields)
11. Non-Compete — value: "36 months, continental United States", issue: Info, flag: "Non-compete references a separate Side Agreement dated January 2024 — verify that this agreement is included in the document package.", section ref: §4.2(e), **pre-set as Resolved** (verified by Sarah Chen, Jan 22 2024 10:30 AM)
12. Litigation Venue — value: "State courts of Delaware OR federal courts of New York", issue: Warning, flag: "Conflicting venue provisions — specifying both Delaware state and New York federal courts creates ambiguity in forum selection.", section ref: §7.15

### AI reasoning (mock text for each field)

For each extracted field, generate 2-3 sentences of mock AI reasoning explaining how the value was identified. Example: "This value was extracted from Section 6.2(a), paragraph 3. The clause explicitly states the indemnification obligation 'shall not exceed the Purchase Price.' No additional cap multiplier or separate limitation was identified in the surrounding provisions."

### Citations

Each extracted field links to 1-2 citation passages in the document text. A citation is:
- `documentId`: reference to the main document
- `page`: number (mock)
- `sectionRef`: string (e.g., "§6.2(a)")
- `excerpt`: 2-4 sentences of text pulled from the document (should exist verbatim in the document text so highlighting works)
- `relevance`: "relevant" | "irrelevant" (default all to "relevant")

### Documents list for this task

- Main document: "PSA_StateStreet_Federated_2024.pdf", type: "Main", size: "2.4 MB", uploaded: "Jan 18, 2024"
- Supporting document: "Disclosure_Schedules_Exhibit_A.pdf", type: "Supporting", size: "890 KB", uploaded: "Jan 18, 2024"
- Supporting document: "Side_Agreement_NonCompete.pdf", type: "Supporting", size: "156 KB", uploaded: "Jan 19, 2024"

### Audit trail (pre-seeded entries for task-1)

Create these entries:
1. System — "Extraction started" — Jan 18, 2024 3:00 PM
2. System — "Extraction completed — 12 clauses extracted, 6 issues found" — Jan 18, 2024 3:04 PM
3. System — "Task assigned to Sarah Chen" — Jan 18, 2024 3:04 PM
4. Sarah Chen — "Verified: Non-compete tied to external agreement" — Jan 22, 2024 10:30 AM
5. Sarah Chen — "Verified: Exclusive remedy limits recourse" — Jan 20, 2024 2:15 PM

## Task review page layout (`/tasks/:id`)

### Top section
- Back button (left arrow icon + "Back to Tasks") — navigates to `/tasks`
- Left side: Task name as page title (text-xl/600). Below: key identifiers in a row — project name, client, effective date (text-sm/secondary, separated by dots or pipes)
- Right side: Status badge ("Pending Review") + primary action button "Approve" (disabled until all issues are resolved)

### Horizontal tab bar (addendum A6)
Below top section. Four tabs:
- **Review** (default active) — shows extraction review interface
- **Documents** — shows document list
- **History** — shows audit trail
- **Comments** — shows comment thread

Tab badges: Review tab shows issue count (e.g., "4" for unresolved issues). Comments tab shows comment count if > 0.

---

### Review tab — Left panel (clause review)

Use the split panel layout from addendum A5 (40% left / 60% right).

**Quick filter bar** at top of left panel:
- Three clickable filter pills: "12 Extracted Fields" (default active) | "4 Issues" | "0 Manual Entries"
- These filter which clauses are visible in the list below
- Active pill: bg action-primary, text action-primary-text. Inactive: bg subtle, text secondary.

**Quick nav** below filter bar:
- "Field 1 of 12" with prev/next arrow buttons
- Clicking prev/next scrolls to and highlights the corresponding field in the list below
- Numbers update based on active filter (e.g., if "Issues" filter is active, shows "Issue 1 of 4")

**Clause list** — scrollable, grouped by section:
- Each section is an accordion (addendum A7): "Deal Terms (4)", "Indemnification (3)", etc.
- All sections expanded by default

**Each clause field card:**
- Top row: Clause name (text-sm/600) + confidence badge (addendum A4)
  - No issue: badge "No Issues Detected" (positive variant)
  - Issue found: badge with severity — "Critical" / "Warning" / "Info"
- Value row: extracted value (text-base/primary), margin-top 4px
- AI reasoning: accordion below value, collapsed by default. Header: "AI Reasoning" with expand chevron. Body: 2-3 sentences, text-sm/secondary.
- Citation link: icon button "View Citation" (BookOpen icon) — when clicked, loads citations in right panel and scrolls right panel to relevant citation card
- **Bottom actions:**
  - For "No Issues Detected" fields: one action — "Manual Update" (secondary/ghost button)
  - For issue fields: two actions — "Verify" (primary button sm) + "Manual Update" (ghost button)
  - For resolved fields: show resolved state instead of actions

**Verify action:**
- Click opens an inline comment prompt below the card: textarea "Add a note about this verification (optional)" + "Confirm" button + "Cancel" text button
- On confirm: status changes to Resolved. Card shows audit trail entry: "Verified by Sarah Chen · [timestamp]". Add entry to History. Toast: "Issue verified."
- Card visual change: left border becomes 3px solid positive color. Actions replaced by resolved badge.

**Manual Update action:**
- Click transforms the value into an editable textarea (addendum A18)
- Pre-filled with current value. Below: optional comment textarea.
- Save + Cancel buttons.
- On save: value updates, status becomes Resolved (if it was an issue). Audit trail entry added. Toast: "Value updated."

**Resolved fields** (issues 6 and 8 are pre-set):
- Card has left border 3px solid positive
- Value shown normally
- Below value: "Verified by Sarah Chen · Jan 22, 2024" (text-xs/secondary)
- No action buttons. Instead: text link "View Details" that expands the audit trail for this specific field.

**Progress indicator** above the clause list:
- "4 of 6 issues remaining" — text-sm/secondary
- Linear progress bar (base system section 5.11): track showing resolution progress

### Review tab — Right panel (document / citation viewer)

Use document viewer spec from addendum A12.

**Document switcher bar** at top:
- Three tabs: "PSA_StateStreet_Federated_2024.pdf" (active by default) | "Disclosure_Schedules_Exhibit_A.pdf" | "Side_Agreement_NonCompete.pdf"
- Each tab shows citation badge count for the selected clause

**Default state (citation viewer mode):**
- When a clause is selected in the left panel (or user clicks "View Citation"), show citation cards
- Each citation card (spec in A12): document badge, section reference, excerpt text (italic), "Mark Irrelevant" action, "View in Document" action
- If multiple citations for one clause, show multiple cards stacked

**"View in Document" action:**
- Switches panel to full document view mode
- Scrolls to and highlights the citation passage in the full document text
- Highlight: brand color at 12% opacity background on the relevant text block
- Show "Show Citations" button (secondary, top-right, sticky) to return to citation viewer mode

**Full document view:**
- Render the mock document text as scrollable styled content
- Section headers: text-md/600
- Body paragraphs: text-base, line-height 26px
- Paragraph spacing: margin-bottom 16px
- Citation highlights visible (brand tint background)
- Clicking a highlight scrolls left panel to the corresponding clause

**Text selection → Save as Citation:**
- When user selects text in full document view, show floating "Save as Citation" button above selection (spec in A12)
- On click: creates a new citation card tagged "User Added" (border-left positive color), shows toast "Citation saved", returns to citation viewer

**Floating island toolbar** at bottom of panel:
- Zoom in/out buttons + percentage display + search icon
- Zoom: adjusts font-size of document text (90% / 100% / 110% / 125%)
- Search: expands inline search input within island, highlights matching text in document

---

### Documents tab

Simple document list:
- Table with columns: Document Name, Type (Main/Supporting badge from A4), Size, Uploaded Date
- 3 rows (the documents listed above)
- No actions for this prototype beyond display

### History tab

Activity log / timeline from addendum A10:
- Show all pre-seeded audit trail entries
- Most recent at top
- Each entry: icon (system=sparkles, human-verify=check, human-edit=pencil), actor, action description, timestamp

### Comments tab

Comment thread from addendum A11:
- Empty state initially: "No comments yet. Start the conversation."
- Comment input at bottom (sticky)
- When user adds a comment: it appears in the list, authored by Sarah Chen, timestamped "Just now"

---

### Approve flow

When all 6 issues are resolved (4 remaining + 2 pre-resolved):
- The "Approve" button in the top section becomes enabled (was disabled/grayed out)
- On click: confirmation modal (addendum A14) — "Approve this extraction review? This will mark the task as complete."
  - Cancel: "Keep Reviewing"
  - Confirm: "Approve"
- On confirm: status badge changes to "Complete", toast "Task approved", button becomes disabled "Approved ✓"

## Responsive (tablet ≤1024px)
- Split panels stack vertically: review panel on top (max-height 50vh), document panel below
- Or: provide a tab toggle between "Review" and "Document" to switch which panel is visible (your call on which approach — pick what feels better)

## What NOT to do
- Do not build real PDF rendering — render text directly
- Do not make the other 24 tasks clickable into a review page — only task-1 is fully wired
- Do not build the project detail page yet
- Do not build New Project or New Task flows yet

### Git
```
git add .
git commit -m "feat: task review page with extraction data, citations, split panel"
git push
```

---

---

# Prompt 4 of 5 — Project detail page + New Project and New Task flows

## What to build

Build the project detail page and the two creation flows: New Project and New Task.

## Project detail page (`/projects/:id`)

### Top section
- Back button: "Back to Projects" → navigates to `/projects`
- Project name (text-xl/600)
- Below name: metadata row — type icon + type name, client, effective date, owner avatar + name, assignee avatars, status badge
- Right side: more menu (⋯) with "Archive Project" option

### Main content: two-column layout
- Left column (65%): task list
- Right column (35%): activity log

**Task list:**
- Section title: "Tasks" with count badge + "+ New Task" button (right-aligned)
- List of tasks belonging to this project, as compact cards (not full table)
- Each task card (within project context):
  - Task name (clickable → `/tasks/:id`), due date, assignee avatar + name, status badge
  - Compact layout: single row or two rows per card, bg-surface, border, radius-3, padding 12px 16px
  - Gap between cards: 8px
- Sort: by priority (high to low)
- For tasks with status "Complete": subtle visual treatment (text-secondary, no hover)

**Activity log:**
- Section title: "Activity"
- Timeline component from addendum A10
- Shows audit trail entries for all tasks in this project
- If project-1 (State Street): show the pre-seeded entries from Prompt 3
- For other projects: show 2-3 generic entries ("Project created", "Task created", "Extraction completed")

### Empty project state
- If a project has no tasks: show empty state in task list area — "No tasks yet" + "+ New Task" CTA

## New Project flow

Triggered by "+ New Project" button on the Projects page.

### Screen: `/projects/new`

**Top section:**
- Back button: "Back to Projects"
- Title: "New Project"

**Form** (use input specs from base design system section 5.2, select from 5.3, date picker from 5.4):

Fields:
1. Project Name — text input, required, placeholder "e.g., Acquisition of Meridian Health"
2. Project Description — textarea, optional, placeholder "Brief description of this project", max 200 chars with character count
3. Type of Project — select dropdown: Purchase and Sale Agreement, NDA, Vendor Contract, License Agreement. Required.
4. Client — text input, required, placeholder "e.g., State Street Global Advisors"
5. Effective Date — date picker, required
6. Owner — select dropdown, pre-filled with "Sarah Chen", selectable from mock user list
7. Assignees — multi-select (spec from section 5.3), select from mock user list. Pills render inside input.

All labels are title case. Required fields show red asterisk.

**Actions (bottom of form):**
- Primary: "Create Project" — pill radius, right-aligned
- Secondary: "Cancel" — ghost/secondary button, left of primary
- Cancel with partial input: show confirmation modal (addendum A14) — "You have unsaved changes. Discard changes?" / "Keep Editing" / "Discard"
- On submit: validate required fields. If valid, add project to mock data (in-memory), navigate to the new project's detail page (`/projects/:newId`), show success toast "Project created".

## New Task flow

Triggered by "+ New Task" button on Project detail page or Tasks page.

### Screen: `/projects/:id/tasks/new` (or `/tasks/new?projectId=:id`)

If triggered from Tasks page and no project is pre-selected, first show a project selector dropdown at the top.

**Top section — project context:**
- Show the parent project's key info: project name, type icon + type, client, effective date, owner
- Styled as a subtle card (bg-subtle, border, radius-3, padding 16px)
- This is read-only context, not editable here

**Document upload section:**

Two upload zones stacked vertically (use file upload spec from addendum A8):

1. **Main Document** (required)
   - Label: "Main Document" with required indicator
   - Helper text: "Upload the primary contract document (PDF)"
   - Single file only. If a file is already uploaded and user drops another, replace it.

2. **Supporting Documents** (optional)
   - Label: "Supporting Documents"
   - Helper text: "Upload any supplementary materials (PDF)"
   - Multi-file. Each uploaded file appears as a file list item below the drop zone.

**File list items** (after upload):
- File name, file size, type badge (Main/Supporting), remove button
- Since this is a prototype, accept any file drop/selection — don't validate file type. Just show the file name and a mock size.

**Actions:**
- Primary: "Start Extraction" — disabled until main document is uploaded. Enabled once main doc is present.
- Secondary: "Cancel" — with confirmation modal if files have been uploaded

### Extraction in progress screen

After clicking "Start Extraction", the page transitions (same URL, different state):

**Top section stays** (project context card remains visible).

**Main content becomes the extraction progress view** (addendum A17):
- AI icon (animated pulse)
- Title: "Extraction In Progress"
- Description: "This usually takes 1–2 minutes. You can leave this page and we'll notify you when it's done."
- Section progress list (simulate these sections appearing one by one):
  1. "Document parsing" — completes after 1s
  2. "Identifying clauses" — completes after 2s
  3. "Extracting values" — completes after 2s
  4. "Validating against rules" — completes after 1.5s
  5. "Generating citations" — completes after 1s
  Each row transitions from pending → in progress (spinner) → complete (check) with the timing above.

- Actions: "Back to Dashboard" (primary) → navigates to `/tasks`, "Stop Extraction" (secondary) → confirmation modal, then back to upload step

**After all sections complete** (~7.5s total):
- Title changes to "Extraction Complete"
- Icon changes to check circle (positive color)
- Description: "12 clauses extracted, 6 issues found. Ready for review."
- Actions change to: "Start Review" (primary) → navigates to `/tasks/[new-task-id]`, "Back to Dashboard" (secondary)

**Important:** Only for the task-1 scenario (project-1) should "Start Review" actually navigate to a working review page. For any other project, the new task should appear in the Tasks table with a "Pending review" status, and clicking into it shows a simplified placeholder review page.

### Extraction failed state

Add a button somewhere (maybe a hidden keyboard shortcut or a small toggle) to test the failed state:
- Icon: XCircle, negative color
- Title: "Extraction Failed"
- Description: "The document could not be processed. This may be due to an unsupported format or corrupted file."
- Actions: "Retry" (primary) → restarts extraction progress, "Contact Support" (text-link)

## What NOT to do
- Do not build real file upload — mock the file metadata on drop/selection
- Do not persist data across page refreshes (in-memory state is fine)
- Do not build a full review page for newly created tasks — only task-1 has the full review experience

### Git
```
git add .
git commit -m "feat: project detail page, new project flow, new task flow with extraction progress"
git push
```

---

---

# Prompt 5 of 5 — Polish, transitions, and edge cases

## What to build

This final prompt is about polish, consistency, and covering edge cases. No new screens — just refining everything that exists.

## Transitions and animations

Audit every page and ensure:

1. **Page transitions:** When navigating between routes, content should fade in (opacity 0→1, translateY(8px)→0, duration-deliberate, easing-decelerate). No jarring content pops.

2. **Card hover:** All project cards have the hover lift effect (translateY(-2px) + shadow-2). Verify timing matches design system (duration-standard, easing-standard).

3. **Sidebar:** Collapse/expand animation is smooth. Nav item active indicator transitions. Tooltip appears on collapsed state hover with 300ms delay.

4. **Split panel resize handle:** Verify the handle visual states (rest, hover, active) all work. Double-click resets to 40/60.

5. **Accordion expand/collapse:** Content height animates smoothly (no jumps). Chevron rotates.

6. **Toast notifications:** Slide in from right (spec in base system 5.10). Auto-dismiss after 4s (6s for errors). Stack max 3.

7. **Modal enter/exit:** Overlay fade + modal translateY animation (spec in base system 5.9).

8. **Extraction progress:** Section items transition smoothly from pending → in progress → complete. Spinner animation is smooth. Pulsing banner animation works.

9. **Tab bar:** Active indicator transitions when switching tabs (not instant jump — slide the underline).

10. **Button states:** Every button has hover, focus-visible (2px outline, offset 2px, brand color), active (scale 0.98), disabled (opacity 0.4), and loading (spinner replacing label) states defined.

11. **Status badge appearance:** When a status changes (e.g., resolving an issue), the badge should transition (brief scale pulse: 1→1.1→1, duration-fast).

## Focus management and keyboard navigation

1. **Tab order:** Verify logical tab order on every page. Sidebar nav items → main content. Within review page: left panel fields are tabbable, right panel separately.

2. **Modal focus trap:** When a modal opens, focus moves to the first focusable element. Tab cycles within modal. Esc closes.

3. **Keyboard shortcuts:**
   - Review page: `j`/`k` or `↓`/`↑` to navigate between clause fields
   - Review page: `Enter` on a field opens verify/edit action
   - `Esc` closes any open modal, dropdown, or inline edit

## Edge cases to handle

1. **Long text truncation:**
   - Project names that exceed card width: truncate with ellipsis
   - Task names in table: truncate with ellipsis, full name on hover (title attribute or tooltip)
   - Client names: same treatment
   - Document filenames in tabs: truncate after 25 chars with ellipsis, full name on hover

2. **Assignee overflow:**
   - On project cards: show max 3 avatars stacked, then "+N" pill
   - In task table assignee cell: single avatar + name, no overflow needed

3. **Stale state indicators:**
   - If user navigates away from extraction progress and comes back, the progress should resume (or show completed if time has elapsed). Handle this gracefully — don't restart the animation.

4. **Cancel confirmation:**
   - Verify all cancel buttons that could lose user input show the confirmation modal
   - This includes: New Project form (if any field has input), New Task (if any file uploaded), Manual Update (if textarea has changes)

5. **Empty search results:**
   - Projects page: "No projects match your search."
   - Tasks page: "No tasks match your search."
   - Both should show the A13 empty state pattern

6. **Task table — no pending tasks:**
   - If "My Tasks" filter shows no pending tasks: "You're all caught up! No pending tasks." with a more encouraging empty state

7. **Review page — all issues resolved:**
   - Progress bar at 100%
   - Message changes to: "All issues resolved. Ready to approve."
   - Approve button pulses subtly once (scale animation) to draw attention

## Visual consistency audit

1. **Spacing:** Verify all padding and margins use the spacing scale tokens (multiples of 4px). No arbitrary values.

2. **Typography:** Verify all text uses the type scale. No custom font sizes. All labels are title case.

3. **Border radius:** Verify primary buttons use pill radius, secondary use radius-2, cards use radius-4 (or radius-3 for compact cards), badges use radius-pill.

4. **Color usage:** No raw hex values anywhere in components. All colors reference semantic tokens.

5. **Icon sizing:** All icons are 16px, 18px, 20px, or 24px — nothing in between. Verify consistency.

6. **Shadows:** Cards at rest use shadow-1. Hovered cards use shadow-2. Dropdowns use shadow-3. Modals use shadow-4. Verify.

## Performance

1. **Lazy load** the task review page (it's the heaviest). Use React.lazy + Suspense with a skeleton loading state.

2. **Debounce** search inputs (300ms) to prevent filter thrashing.

3. **Memoize** filtered/sorted lists (useMemo) so they don't recompute on every render.

## Final check

After completing all polish items, manually verify this demo flow works smoothly end-to-end:

1. App loads → sidebar visible → Projects page with card grid
2. Switch to "All Projects" → shows all 10 (including archived)
3. Click on State Street project → project detail page loads
4. See task list with the PSA review task
5. Click task → review page loads with split panel
6. Scroll through clause list → click "View Citation" → right panel shows citation
7. Click "View in Document" → full document view with highlight
8. Go back to citation viewer
9. Verify an issue → comment prompt → confirm → card shows resolved state
10. Override an issue → edit value → save → card updates
11. Check History tab → entries appear
12. Check Comments tab → add a comment → it appears
13. Navigate back to Tasks page → task is still "Pending review" (not all issues resolved yet)
14. Navigate to Projects page → click "+ New Project" → fill form → create
15. New project appears in card grid
16. Click into new project → click "+ New Task" → upload mock file → start extraction
17. Watch extraction progress → completes → click "Back to Dashboard"
18. New task appears in Tasks table

### Git
```
git add .
git commit -m "feat: polish, transitions, keyboard nav, edge cases"
git push
```
