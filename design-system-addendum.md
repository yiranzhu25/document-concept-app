# Design System Addendum — LegalIQ
**Patches the base design system for a legal document review app.**
**Apply this file alongside the base design system. Where conflicts exist, this addendum wins.**

---

## A0. Scope Adjustments

### Remove from base system (not used in this app)
- Section 5.6 KPI Widgets (no KPIs in this app)
- Section 5.8 Data Visualization / Charts (no charts)
- Chart glow tokens (`--glow-positive`, `--glow-negative`, `--glow-brand`)
- `formatCurrency` and `formatDelta` utilities
- Sparkline references
- Delta pill component (replaced by Status Badge below)

### Rename
- App name: **LegalIQ** (not Synapse Finance)
- Aesthetic label: "Precision legal workspace — high-density data surfaces, restrained typography, confident negative space."

### Mode
- **Light mode only for this build.** Keep the dark token definitions in the CSS for future use, but do not build a theme toggle. Remove the theme toggle from the sidebar and TopBar specs.

### App Shell Override
- **No TopBar.** This app uses a sidebar-only layout. Remove the 56px fixed TopBar from section 4.1.
- The sidebar contains: logo, primary nav, and user profile. See section A1 below.

---

## A1. Sidebar Navigation

```tsx
// SIDEBAR LAYOUT
// Width: 240px expanded, 64px collapsed
// Height: 100vh, fixed position left
// bg: var(--color-bg-surface)
// border-right: 1px solid var(--color-border-default)
// Display: flex column, justify-content: space-between
// Transition: width var(--duration-standard) var(--easing-standard)

// SIDEBAR SECTIONS (top to bottom):
// ┌──────────────────────┐
// │ Logo area (56px h)   │  ← App logo + name, padding 16px
// ├──────────────────────┤
// │                      │
// │ Primary nav          │  ← Projects, Tasks
// │                      │
// ├──────────────────────┤
// │ Bottom area          │  ← User profile
// └──────────────────────┘

// LOGO AREA
// Height: 56px, padding: 0 16px, display: flex, align-items: center
// Logo icon: 24px × 24px
// App name: text-md/600/primary, margin-left: 12px
// Collapsed: icon only, centered
// Border-bottom: 1px solid var(--color-border-default)

// PRIMARY NAV
// Padding: 12px 8px
// Gap between items: 2px
// Each item: see Nav Item spec below

// NAV ITEM ANATOMY
// Height: 40px, padding: 0 12px, border-radius: var(--radius-2)
// [Icon 20px] [Label text-base/500] [Badge count?]
// Icon color follows text color for each state
// Gap between icon and label: 12px
//
// States:
// default:  text-secondary, bg transparent
// hover:    text-primary, bg var(--color-bg-subtle)
// active:   text-primary, bg var(--color-bg-subtle), font-weight 600
//           Left indicator: 3px wide, 20px tall, border-radius pill,
//           bg var(--color-action-primary), positioned on left edge of item
// disabled: text-disabled, cursor-not-allowed
//
// Collapsed state: icon only, centered, tooltip on hover showing label
// Tooltip: appears to the right of the sidebar, delay 300ms

// BADGE COUNT (optional, on nav item)
// Positioned right side of nav item, auto margin-left
// bg: var(--color-negative), text: white, font-size 11px/600
// min-width: 20px, height: 20px, border-radius: pill
// padding: 0 6px, text-align center
// Only show for non-zero counts

// BOTTOM AREA
// Border-top: 1px solid var(--color-border-default)
// Padding: 12px 8px

// USER PROFILE ROW
// Height: 44px, padding: 0 12px, border-radius: var(--radius-2)
// [Avatar 28px circle] [Name text-sm/500 + Role text-xs/secondary]
// Hover: bg var(--color-bg-subtle)
// Collapsed: avatar only, centered

// COLLAPSE TOGGLE
// Position: absolute, right edge of sidebar, vertically centered
// A small icon button (28px circle) that sits half-outside the sidebar
// bg: var(--color-bg-surface), border: 1px solid var(--color-border-default), shadow-1
// Icon: ChevronLeft 16px when expanded, ChevronRight when collapsed
// Hover: bg var(--color-bg-subtle)
// Only visible on hover of sidebar edge area
```

---

## A2. App Shell (Override of Section 4.1)

```
┌──────────────┬──────────────────────────────────────────┐
│ Sidebar      │  Main Content Area                       │
│ 240px        │  (fluid, min 0, scrollable)              │
│ (collapsed:  │                                          │
│  64px)       │                                          │
│              │                                          │
│              │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

- **No TopBar.** The sidebar is the only persistent navigation element.
- **Main content:** `padding: 32px 40px` desktop, `padding: 24px` tablet. No max content width — content should fill available space for data-dense views.
- **Tablet (≤1024px):** Sidebar collapses to 64px by default. Main content adjusts.
- **Mobile:** Out of scope for this build.

---

## A3. Page Header Pattern

Every top-level page (Projects, Tasks) and detail page uses this header pattern:

```tsx
// PAGE HEADER
// margin-bottom: var(--space-8) (32px)
//
// Title row: display flex, align-items center, justify-content space-between
// Left side: Page title (text-xl/600) + optional description (text-base/secondary, margin-top 4px)
// Right side: Primary action button (e.g., "+ New Project")
//
// Below title row (margin-top 16px): filter bar
// Filter bar contains: search input + toggle buttons + sort dropdown (as applicable)
// All filter elements on one row, gap 12px, flex-wrap on tablet
```

---

## A4. Status Badges

Unified badge component for all status types in the app. Replaces delta pill and inline status pill from base system.

```tsx
// BADGE ANATOMY
// Display: inline-flex, align-items center, gap 6px
// Padding: 4px 10px
// Border-radius: var(--radius-pill)
// Font: text-xs/600, uppercase letter-spacing 0.04em
// Optional leading dot: 6px circle, same color as text

// BADGE VARIANTS — Status
// active:               bg var(--color-positive-subtle), text var(--color-positive), dot positive
// archived:             bg var(--color-bg-subtle), text var(--color-text-secondary), dot secondary
// extraction-progress:  bg var(--color-info-subtle), text var(--color-info), dot info
// extraction-failed:    bg var(--color-negative-subtle), text var(--color-negative), dot negative
// pending-review:       bg var(--color-warning-subtle), text var(--color-warning), dot warning
// complete:             bg var(--color-positive-subtle), text var(--color-positive), dot positive

// BADGE VARIANTS — Severity (for validation flags)
// critical:  bg var(--color-negative-subtle), text var(--color-negative)
// warning:   bg var(--color-warning-subtle), text var(--color-warning)
// info:      bg var(--color-info-subtle), text var(--color-info)

// BADGE VARIANTS — Confidence
// high:    bg var(--color-positive-subtle), text var(--color-positive)
// medium:  bg var(--color-warning-subtle), text var(--color-warning)
// low:     bg var(--color-negative-subtle), text var(--color-negative)

// BADGE VARIANTS — Priority
// Display as a numeric score in a small pill
// bg: var(--color-bg-subtle), text: var(--color-text-primary), font-mono
// Border: 1px solid var(--color-border-default)

// BADGE VARIANTS — Document type tag
// main:       bg var(--color-action-primary), text var(--color-action-primary-text)
// supporting: bg var(--color-bg-subtle), text var(--color-text-secondary), border 1px solid border-default
```

---

## A5. Split Panel Layout

Used on the task review page. Two resizable side-by-side panels.

```tsx
// SPLIT PANEL CONTAINER
// Display: flex, height: calc(100vh - [page header height])
// Overflow: hidden (each panel scrolls independently)

// LEFT PANEL (Review)
// Default width: 40%, min-width: 360px, max-width: 60%
// bg: var(--color-bg-surface)
// border-right: 1px solid var(--color-border-default)
// overflow-y: auto
// padding: 24px

// RIGHT PANEL (Document/Citation)
// Default width: 60%, min-width: 400px
// bg: var(--color-bg-surface)
// overflow-y: auto
// padding: 24px

// RESIZE HANDLE
// Width: 8px, cursor: col-resize
// bg: transparent at rest
// Visible indicator: 2px wide line, centered, height 40px, border-radius pill
//   color: var(--color-border-strong), vertically centered in handle
// Hover: indicator becomes var(--color-action-primary), full height
// Active (dragging): bg var(--color-info-subtle) on entire handle width
// Double-click: reset to default 40/60 split

// TABLET (≤1024px)
// Panels stack vertically instead of side-by-side
// Each panel: width 100%
// Top panel (Review): max-height 50vh, overflow-y auto
// Bottom panel (Document): remaining height
// No resize handle — fixed split
// Optional: a tab bar to toggle between panels instead of stacking
```

---

## A6. Horizontal Tab Bar

Used within pages for sub-navigation (e.g., Review / Documents / History / Comments on task page).

```tsx
// TAB BAR CONTAINER
// Height: 44px, border-bottom: 1px solid var(--color-border-default)
// Display: flex, align-items: flex-end, gap: 0
// bg: var(--color-bg-surface)
// Sticky: top 0, z-index 10 (stays visible when content scrolls)

// TAB ITEM
// Padding: 10px 16px, cursor: pointer
// Font: text-sm/500
// Position: relative (for active indicator)
//
// States:
// default:  text-secondary
// hover:    text-primary
// active:   text-primary, font-weight 600
//           Bottom indicator: 2px solid var(--color-action-primary),
//           positioned at bottom edge, full tab width, border-radius 1px at top
// disabled: text-disabled, cursor-not-allowed
//
// Transition: color var(--duration-fast), border-color var(--duration-fast)

// TAB BADGE (optional)
// Inline after tab label, margin-left 6px
// Same as nav badge but smaller: height 18px, min-width 18px, font-size 10px
// Used for: issue counts, comment counts

// OVERFLOW (if tabs don't fit)
// Horizontal scroll with fade gradient on right edge
// No wrapping — single row always
```

---

## A7. Accordion / Collapsible Section

Used for clause sections in review panel, AI reasoning expansion, and resolved items.

```tsx
// ACCORDION HEADER (trigger)
// Display: flex, align-items center, justify-content space-between
// Padding: 12px 0
// Cursor: pointer
// Border-bottom: 1px solid var(--color-border-default) when collapsed
//
// Left side: [Optional icon 18px] [Section title text-base/600] [Count badge?]
// Right side: ChevronDown icon 16px, text-secondary
//
// Hover: title text becomes text-link
// Transition: chevron rotates 180° on toggle, var(--duration-fast) var(--easing-standard)

// ACCORDION BODY
// Padding: 12px 0 16px 0 (no left indent unless nested)
// max-height animation: 0 → auto with var(--duration-standard) easing
// Overflow: hidden during animation
// Border-bottom: 1px solid var(--color-border-default) when expanded

// ACCORDION VARIANTS
// default: as above
// subtle: header bg var(--color-bg-subtle), padding 12px 16px, border-radius var(--radius-2)
// nested: left padding 24px to indicate hierarchy, lighter title weight (500 instead of 600)

// ACCORDION GROUP (multiple sections)
// Gap between accordion items: 0 (dividers create separation)
// Allow multiple open simultaneously (not exclusive)
```

---

## A8. File Upload / Drop Zone

```tsx
// DROP ZONE
// Border: 2px dashed var(--color-border-strong)
// Border-radius: var(--radius-3) (12px)
// bg: var(--color-bg-subtle)
// Padding: 40px
// Text-align: center
// Min-height: 160px
// Display: flex column, align-items center, justify-content center

// DROP ZONE CONTENT
// Icon: Upload cloud, 40px, text-secondary
// Title: text-base/500/primary — "Drag and drop your file here"
// Subtitle: text-sm/secondary — "or click to browse · PDF files only"
// Clickable: entire zone is a click target for file picker

// DROP ZONE STATES
// default:   as above
// hover:     border-color var(--color-border-focus), bg var(--color-info-subtle)
// drag-over: border-color var(--color-info), bg var(--color-info-subtle),
//            border-style solid (not dashed), scale 1.01
//            transition: var(--duration-fast)
// error:     border-color var(--color-border-error), error message below
// disabled:  opacity 0.5, cursor-not-allowed
// has-file:  border-style solid, border-color var(--color-border-default),
//            content replaced with file list item

// DESIGNATED UPLOAD SLOTS (for Main vs Supporting)
// Label above drop zone: text-sm/600/primary + required badge if applicable
// Helper text: text-xs/secondary below label
// Main document slot: single file only
// Supporting documents slot: multi-file, stacks vertically

// FILE LIST ITEM (after upload)
// Display: flex, align-items center, gap 12px
// Padding: 12px 16px
// bg: var(--color-bg-surface)
// Border: 1px solid var(--color-border-default)
// Border-radius: var(--radius-2)
// margin-top: 8px between items
//
// [File icon 20px] [Name text-sm/500 + Size text-xs/secondary] [Type badge] [Remove × icon-button]
//
// Type badge: "Main" or "Supporting" — uses document type badge variant from A4
// Remove button: ghost icon button, 28px, text-secondary, hover text-negative
// Hover on row: bg var(--color-bg-subtle)
```

---

## A9. Tooltip

```tsx
// TOOLTIP
// bg: var(--color-bg-inverse) (dark bg in light mode)
// text: var(--color-text-inverse)
// font: text-xs/500
// padding: 6px 10px
// border-radius: var(--radius-1)
// shadow: var(--shadow-2)
// max-width: 220px
// z-index: 50

// ARROW
// 6px triangle, same bg as tooltip body
// Points toward trigger element

// POSITIONING
// Preferred: top-center
// Fallback: auto-flip to bottom/left/right if clipped by viewport
// Offset from trigger: 8px

// BEHAVIOR
// Delay: 400ms before showing (prevent tooltip flash on mouse-through)
// Hide: immediate on mouse leave
// Keyboard: show on focus, hide on blur
// No interaction inside tooltip (use popover for interactive content)
```

---

## A10. Activity Log / Timeline

Used for project activity and task audit trail.

```tsx
// TIMELINE CONTAINER
// Display: flex column
// Padding: 0
// Position: relative

// TIMELINE LINE
// Position: absolute, left 15px (centered on avatar/icon), top 0, bottom 0
// Width: 1px, bg var(--color-border-default)

// TIMELINE ENTRY
// Display: flex, gap 12px
// padding: 12px 0
// position: relative (to sit on top of the line)
//
// Left: Avatar circle (30px) or system icon (30px circle, bg var(--color-bg-subtle))
//       Border: 2px solid var(--color-bg-surface) (to mask the line behind it)
// Right: Content column
//   Actor + action: text-sm/primary — "[Name] verified [clause name]"
//   Timestamp: text-xs/secondary — "2 hours ago" or "Jan 15, 2024 at 3:42 PM"
//   Optional detail: text-sm/secondary — field value change, comment text
//   Optional diff: old value (strikethrough, text-negative) → new value (text-positive)

// ENTRY ICON VARIANTS
// system/ai:    bg var(--color-info-subtle), icon color info, icon: sparkles or cpu
// human-verify: bg var(--color-positive-subtle), icon color positive, icon: check
// human-edit:   bg var(--color-warning-subtle), icon color warning, icon: pencil
// comment:      bg var(--color-bg-subtle), icon color secondary, icon: message-square

// EMPTY STATE
// Icon: clock, 32px, text-placeholder
// Text: text-sm/secondary — "No activity yet"
// Centered within container, min-height 120px
```

---

## A11. Comment Thread

```tsx
// COMMENT CONTAINER
// Display: flex column, gap 16px

// SINGLE COMMENT
// Display: flex, gap 12px
// [Avatar 28px circle] [Content column]
//
// Content column:
// Header row: [Name text-sm/600] [Timestamp text-xs/secondary] — display flex, gap 8px, align-items baseline
// Body: text-sm/primary, margin-top 4px, white-space pre-wrap
// Actions row: margin-top 8px, display flex, gap 16px
//   Each action: text-xs/500/secondary, hover text-link, cursor pointer
//   Actions: "Reply" | "Edit" | "Delete"

// COMMENT INPUT
// Position: sticky bottom of comment section, or at bottom of comment list
// bg: var(--color-bg-surface), border-top: 1px solid var(--color-border-default)
// Padding: 16px
// Textarea: standard input styling, min-height 60px, resize vertical
// Submit button: primary button, "Add Comment", aligned right, margin-top 8px
// Keyboard: Cmd+Enter to submit

// EMPTY STATE
// Icon: message-square, 32px, text-placeholder
// Text: text-sm/secondary — "No comments yet. Start the conversation."
// Centered, min-height 120px
```

---

## A12. Document Viewer

The right panel of the task review page. Renders document text with citation highlights.

```tsx
// DOCUMENT VIEWER LAYOUT
// Display: flex column, height 100%
//
// Top: Document switcher bar (fixed within panel)
// Middle: Content area (scrollable)
// Bottom: Floating island toolbar

// DOCUMENT SWITCHER BAR
// Height: 44px, border-bottom: 1px solid var(--color-border-default)
// Display: flex, gap 0, overflow-x auto
// bg: var(--color-bg-surface)
//
// Each tab: padding 10px 16px, text-sm/500
//   Label: document filename (truncate with ellipsis if >20 chars)
//   Badge: citation count for this document, same as tab badge from A6
//   States: same as horizontal tab bar (A6)
//   Active: bottom 2px indicator

// CONTENT AREA — Citation Viewer Mode (default when viewing a clause)
// Padding: 20px
// Display: flex column, gap 12px
//
// CITATION CARD
// bg: var(--color-bg-subtle)
// border: 1px solid var(--color-border-default)
// border-radius: var(--radius-3)
// padding: 16px
// border-left: 3px solid var(--color-info) (default) or var(--color-warning) for user-added
//
// Card content:
// Header row: [Badge: "Main Document"] [Page reference text-xs/secondary: "Page 12, §6.2"]
// Body: Citation excerpt text — text-sm/primary, font-style italic
//   Highlighted words within excerpt: bg var(--color-warning-subtle)
// Footer row: display flex, justify-content space-between, margin-top 12px
//   Left: [ThumbsDown icon + "Mark Irrelevant" text-xs/secondary]
//   Right: [Expand icon + "View in Document" text-xs/text-link]
//
// User-added citation: same card but border-left color var(--color-positive)
//   Additional badge: "User Added" — bg positive-subtle, text positive

// CONTENT AREA — Full Document View Mode
// Padding: 24px 32px
// Font: text-base, line-height 26px (slightly more generous for readability)
// Paragraph spacing: margin-bottom 16px
// Section headers within document: text-md/600
//
// CITATION HIGHLIGHT (in full doc view)
// bg: rgba(var(--primitive-brand-500-rgb), 0.12) — brand tint at low opacity
// border-radius: 2px
// padding: 2px 0
// Cursor: pointer
// Hover: bg opacity increases to 0.22
// Click: scrolls left panel to corresponding clause
//
// TEXT SELECTION → "Save as Citation" action
// On text selection (mouseup), show floating action button above selection:
// bg: var(--color-action-primary), text: var(--color-action-primary-text)
// Text: "Save as Citation", text-xs/600
// border-radius: var(--radius-pill), padding 6px 14px, shadow-3
// Position: absolute, above selection midpoint, offset -40px top
// Click: saves citation, shows success toast, returns to citation viewer

// "SHOW CITATIONS" BUTTON (in full doc view)
// Position: top-right of content area, sticky
// Secondary button style: "Show Citations (N)"
// Returns to citation viewer mode

// FLOATING ISLAND TOOLBAR (bottom of document viewer)
// Position: fixed to bottom of right panel, centered horizontally
// Margin-bottom: 16px from panel bottom
// bg: var(--color-bg-surface-raised), shadow-4, border-radius var(--radius-pill)
// border: 1px solid var(--color-border-default)
// Padding: 6px 12px
// Display: flex, align-items center, gap 8px
//
// Controls: [Zoom out −] [100% text] [Zoom in +] [Divider 1px] [Search icon]
// Each control: ghost icon button, 32px
// Zoom percentage: text-xs/mono/secondary
// Divider: 1px solid var(--color-border-default), height 20px
// Search: opens an inline search input that expands within the island
```

---

## A13. Empty States

Reusable pattern for any container that has no content yet.

```tsx
// EMPTY STATE PATTERN
// Display: flex column, align-items center, justify-content center
// Text-align: center
// Min-height: varies by context (see below)
// Padding: 40px 24px

// Anatomy:
// [Icon 40px, text-placeholder, stroke-width 1.5]
// [Title text-base/500/primary — margin-top 16px]
// [Description text-sm/secondary — margin-top 4px, max-width 320px]
// [Optional CTA button — margin-top 16px, secondary or primary depending on context]

// CONTEXT-SPECIFIC HEIGHTS
// Full page (e.g., no projects):      min-height calc(100vh - 200px)
// Card/panel (e.g., no tasks):         min-height 240px
// Inline section (e.g., no comments):  min-height 120px
// Table body (e.g., no search results): min-height 240px (matches 4-5 empty rows)

// COMMON EMPTY STATES TO IMPLEMENT
// No projects:     icon FolderOpen,     title "No Projects Yet",           cta "+ New Project"
// No tasks:        icon CheckSquare,    title "No Tasks",                  cta "+ New Task"
// No documents:    icon FileText,       title "No Documents Uploaded",     cta "Upload Document"
// No comments:     icon MessageSquare,  title "No Comments Yet",           description "Start the conversation."
// No activity:     icon Clock,          title "No Activity Yet",           no cta
// No citations:    icon BookOpen,       title "No Citations",              description "Select a clause to view citations."
// No search results: icon Search,       title "No Results Found",          description "Try a different search term."
// Awaiting docs:   icon Upload,         title "Waiting for Documents",     description "Upload a main document to begin extraction."
```

---

## A14. Confirmation Modal

Specific variant of the base modal for destructive or interruptive confirmations.

```tsx
// Uses base modal spec (section 5.9) with these specifics:

// SIZE: sm (480px max-width)
// BACKDROP CLICK: disabled (must use buttons or Esc)

// ANATOMY
// Icon: top-center, 48px circle bg
//   Destructive: bg negative-subtle, icon AlertTriangle color negative
//   Neutral: bg warning-subtle, icon AlertCircle color warning
// Title: text-lg/600, text-align center, margin-top 16px
// Description: text-sm/secondary, text-align center, margin-top 8px, max-width 360px
// Actions: centered row, gap 12px, margin-top 24px
//   Cancel: secondary button
//   Confirm: primary button (or danger button if destructive)

// TRIGGER CONTEXTS
// Cancel form with partial input: "You have unsaved changes. Discard changes?"
//   Cancel label: "Keep Editing", Confirm label: "Discard"
// Stop extraction: "Stop extraction in progress?"
//   Cancel label: "Continue", Confirm label: "Stop Extraction"
// Archive project: "Archive this project?"
//   Cancel label: "Cancel", Confirm label: "Archive"
```

---

## A15. Banner / Status Strip

Persistent informational banner within a page or section.

```tsx
// BANNER
// Display: flex, align-items center, gap 12px
// Padding: 12px 16px
// border-radius: var(--radius-2)
// border: 1px solid (semantic color at 30% opacity)

// VARIANTS
// info:    bg info-subtle, border-color info, icon Info 18px color info
// warning: bg warning-subtle, border-color warning, icon AlertTriangle 18px color warning
// success: bg positive-subtle, border-color positive, icon CheckCircle 18px color positive
// error:   bg negative-subtle, border-color negative, icon XCircle 18px color negative

// CONTENT
// Message: text-sm/500/primary, flex 1
// Optional action: text-sm/600/text-link, cursor pointer
// Optional dismiss: ghost icon button ×, 24px, text-secondary

// ANIMATED BANNER (for extraction progress)
// Same as info variant but with:
// Left icon: animated spinner (16px) instead of static icon
// Pulsing left border: 3px solid var(--color-info), opacity animation 1→0.4→1, 2s infinite
```

---

## A16. Project Card

Used in the Projects list page (card view).

```tsx
// PROJECT CARD — interactive card variant
// Uses base interactive card spec (section 5.5) with specific anatomy:
//
// ┌─────────────────────────────────────┐
// │ [Type icon 24px]  [Status badge]    │  ← header row, space-between
// │                                     │
// │ Project Name                        │  ← text-md/600/primary
// │ Client Name                         │  ← text-sm/secondary, margin-top 2px
// │                                     │
// │ Effective: Jan 15, 2024             │  ← text-xs/secondary, margin-top 12px
// │                                     │
// │ ┌───────────────────────────┐       │
// │ │ Owner: [avatar] J. Smith  │       │  ← metadata row, text-xs
// │ │ Assignees: [avatars] +2   │       │
// │ └───────────────────────────┘       │
// │                         [⋯]        │  ← more menu icon, bottom-right
// └─────────────────────────────────────┘
//
// Type icon: unique per project type, 24px, text-secondary
//   PSA: FileText, NDA: Shield, Vendor Contract: Handshake, License: Key
// Status badge: from A4
// More menu: ghost icon button, visible on hover
//   Menu items: "Archive Project" (or "Unarchive" if archived)
//
// ARCHIVED STATE
// Entire card: opacity 0.6
// Status badge: "Archived"
// No hover lift effect

// CARD GRID LAYOUT
// display: grid
// grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))
// gap: var(--space-6) (24px)
// When card hits min-width (320px), wraps to next row
```

---

## A17. Extraction Progress View

Full-page view shown during extraction simulation.

```tsx
// LAYOUT
// Centered within main content area
// Max-width: 560px, margin: 0 auto
// Padding-top: var(--space-16) (64px)

// ANATOMY
// [AI icon — 48px, animated pulse, color info]           ← centered
// [Title: "Extraction In Progress" — text-xl/600]        ← centered, margin-top 24px
// [Description — text-base/secondary, text-align center]  ← margin-top 8px, max-width 400px
//   "This usually takes 1–2 minutes. You can leave this page
//    and we'll notify you when it's done."
//
// [Section progress list — margin-top 32px]
//   Each section row: display flex, gap 12px, align-items center, padding 10px 0
//   [Check circle / Spinner / Empty circle 18px] [Section name text-sm/primary] [Status text-xs/secondary right-aligned]
//   Completed: icon Check, color positive
//   In progress: animated spinner, color info
//   Pending: empty circle, color border-strong
//   Border-bottom: 1px solid var(--color-border-default) between rows
//
// [Action buttons — margin-top 32px, display flex, gap 12px, justify-content center]
//   Primary: "Back to Dashboard" — primary button
//   Secondary: "Stop Extraction" — secondary button, text-negative on hover

// FAILED STATE
// Replace AI icon with XCircle 48px, color negative
// Title: "Extraction Failed"
// Description: error message
// Actions: "Retry" (primary) + "Contact Support" (secondary/text-link)
```

---

## A18. Inline Edit Field

Used when overriding an extracted value in the review panel.

```tsx
// TRIGGER: user clicks "Manual Update" on a clause field
// The extracted value area transforms into an editable state

// EDIT STATE
// The value text becomes a textarea (standard input styling)
// Pre-filled with current extracted value
// Auto-focus, select all text
// Below textarea: comment input (text-sm, placeholder "Add a note about this change (optional)")
// Action row: [Cancel — ghost button] [Save — primary button sm]
//
// Cancel: reverts to display state, no changes
// Save: updates value, logs audit trail entry, collapses to display state with updated value

// DISPLAY STATE (after edit)
// Shows new value with a subtle left border: 3px solid var(--color-warning)
// Below value: "Updated by [Name] · [timestamp]" — text-xs/secondary
// Expandable: click to see previous value (strikethrough)
```

---

## A19. Segmented Toggle (Button Group Filter)

Used for "All Projects / My Projects" and similar toggles.

```tsx
// Uses the Radio Group / Segmented Control from section 5.12 in base system
// Additional specifics:

// Container: bg var(--color-bg-subtle), padding 3px, border-radius var(--radius-pill)
// border: 1px solid var(--color-border-default)
// Display: inline-flex

// Segment:
// Padding: 6px 16px, border-radius var(--radius-pill)
// Font: text-sm/500
// Default: text-secondary, bg transparent
// Active: text-primary, bg var(--color-bg-surface), shadow-1, font-weight 600
// Hover (inactive): text-primary
// Transition: var(--duration-fast) for background and shadow
```

---

## A20. Search Input

```tsx
// Uses base input spec (section 5.2) with:
// Leading icon: Search 16px, text-secondary, inside input, padding-left 36px
// Trailing icon (when has value): X circle 16px, text-secondary, clears input on click
// Placeholder: "Search [context]..." e.g., "Search projects..."
// Width: 280px default, can be overridden per context
// No label (icon serves as affordance)
// Border-radius: var(--radius-pill) — pill shape distinguishes from form inputs
```
