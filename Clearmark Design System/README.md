# Clearmark Design System

Clearmark is a legal document management system built on three promises: **clarity, accuracy, and trust**. It uses AI to help legal teams ingest, redline, cross-reference, and audit large bodies of contractual and case material — but the product surface itself is calm, plainspoken, and deliberately quiet so the documents remain the loudest thing on the screen.

This repository is the source of truth for Clearmark's visual identity, written voice, and interface vocabulary.

---

## Sources

No external codebase, Figma file, or brand book was attached for this initial pass. The system was designed from the written brief:

> *Legal document management system that is clear, accurate and trustworthy, leveraging AI. Main palette neutral, cream white and warm black. Typography: Manrope. High-contrast hierarchy. Components: collapsable vertical side nav, button, input, select, dropdown, search, toggle, data table, badge, avatar, card, metric, audit trail, breadcrumb, tab, progress bar, collapsable side panel, pdf viewer with zoom.*

If/when production code, Figma libraries, or finalized logo files become available, re-import them and reconcile any divergence with this document.

---

## Index

| File / Folder | Purpose |
|---|---|
| `README.md` | This file — brand context, content & visual foundations, iconography |
| `SKILL.md` | Agent-skill manifest so this system can be invoked from Claude Code |
| `colors_and_type.css` | All CSS variables + base type styles (drop-in `<h1>`, `<p>`, `.cap`, `.label`, etc) |
| `components.css` | Component class library — buttons, inputs, selects, badges, tables, audit trail, info cards, switcher, side panel, menu |
| `fonts/Manrope-VariableFont_wght.ttf` | Manrope variable font, wired via `@font-face` |
| `image-slot.js` | Drag-to-fill image placeholder web component (used for avatars and image regions) |
| `assets/` | Logos (`clearmark-*.svg`) + illustrated portrait avatars (`avatars/p1–p6.svg`) |
| `preview/` | One HTML card per component — the canonical copy-paste reference for every pattern in the system |

---

## Content fundamentals

Clearmark's voice is **plainspoken, precise, and quietly confident**. It reads like a senior associate who has already done the work and is telling you what they found — not a salesperson, not a chatbot, not a marketer.

**Tone & posture**
- Direct, never breezy. We don't use exclamation points. We don't say "Awesome!" or "Great choice!".
- Address the user as *you*. Refer to the product or AI as *Clearmark*, never as *we* or *I*. ("Clearmark found 4 inconsistencies in this clause." Not "I found…")
- Plain English over legalese in UI copy. Legalese is the document's job, not ours.
- We never hedge with marketing softeners ("simply", "easily", "just"). If something is two clicks, say two clicks.

**Casing**
- Sentence case everywhere: buttons, menu items, table headers, page titles. "Upload document", not "Upload Document".
- Acronyms stay uppercase: PDF, NDA, MSA, OCR, ID.
- Proper nouns of internal features get capitalized: Audit Trail, Smart Redlines, Cross-References.

**Numbers, dates, money**
- Always render dates as `12 Mar 2026` — unambiguous across jurisdictions.
- Money uses the symbol then digits with thousands separators: `$1,240,000.00`. Currency code follows only when ambiguous: `$1,240,000.00 USD`.
- Counts spell out one–nine in prose; numerals everywhere in UI chrome (badges, tables, metrics).

**Examples**

| ✗ Don't | ✓ Do |
|---|---|
| "Awesome! We've uploaded 3 docs 🎉" | "3 documents uploaded." |
| "Oops, something went wrong!" | "Upload failed — file exceeds 200 MB. Split or compress and retry." |
| "Click here to view your audit log" | "Open audit trail" |
| "We think this clause might be risky" | "Clause 14.2 conflicts with the precedent in *Acme v. Borden*." |
| "Get started today!" | "Upload your first document." |

**Emoji & ornament**
- No emoji in product UI, ever. They read as informal in a legal context.
- No exclamation points except in genuinely destructive confirmation flows ("This action can't be undone.").
- Em dashes are fine. Smart quotes are required (`"` and `'`, never `"` or `'`).

---

## Visual foundations

The system reads like **a well-set legal brief from a modern publisher** — generous margins, restrained palette, deliberate hierarchy, no decoration that isn't earned.

**Palette**
- Built on warm neutrals. The page is cream (`#F6F2EA`), the ink is warm near-black (`#1B1813`). Mid-greys are warm-toned (`oklch`-mixed toward the cream), never cool steel-grey. This is intentional: cool greys feel like SaaS, warm greys feel like paper.
- One brand accent — **Ink Indigo** (`#2A2F4F`) — used sparingly: primary actions, the active sidebar item, and the focus ring. Saved like a stamp; never used for decoration.
- Semantic colors are muted, never neon: `#7A5B1F` warning amber, `#8B2A2A` danger ox-blood, `#3C6B4A` success moss. They feel printed, not screen-native.
- No gradients. No glassmorphism. No purple-to-pink. If a surface needs to step forward, it does so with elevation and tone, not with a gradient.

**Typography**
- One family: **Manrope** (variable, weights 300–800). Self-hosted in `fonts/`.
- High-contrast ramp: display weights jump to 700–800 at 48–64px; body sits at 400 / 14–16px. There is deliberate empty space *between* type sizes in the ramp — no 18px between 16 and 20 — so hierarchy reads instantly.
- Tabular numerals (`font-variant-numeric: tabular-nums`) everywhere numbers live in columns: tables, metrics, audit timestamps, page counters.
- Tracking: display sizes tighten (`-0.02em`), body is neutral, UI labels and overline loosen (`+0.04em` to `+0.08em`).

**Backgrounds & imagery**
- Default page is flat cream. No background images, no patterns, no noise.
- Document previews show the document itself — that's the imagery. The product gets out of the way.
- Marketing/empty states may use a single thin hairline rule (`1px solid var(--rule)`) as ornament. Never illustrations of cartoon lawyers.

**Borders & rules**
- A single warm hairline color (`--rule: #E4DDD0`) does ~90% of separation work.
- Borders are always 1px. We do not use 2px borders.
- Cards: 1px hairline border on cream, `--radius-md` (8px), no shadow at rest. Hover lifts with the tiniest shadow (`--shadow-sm`) — a single 1px offset of warm black at 4% opacity.

**Shadows**
- Three rungs only: `--shadow-sm` (hover lift), `--shadow-md` (menus, popovers), `--shadow-lg` (modals, command palette). All shadows are warm-tinted (built from `oklch(20% 0.02 60 / α)`), never pure black-on-white.
- No inner shadows. No drop shadows on text. Ever.

**Corner radii**
- `--radius-xs: 4px` (badges, tags)
- `--radius-sm: 6px` (inputs, buttons)
- `--radius-md: 8px` (cards, popovers)
- `--radius-lg: 12px` (modal, side panel)
- Never fully-rounded "pills" except for the Status badge on a single-line summary row.

**Spacing**
- 4px base unit. Scale: `4, 8, 12, 16, 20, 24, 32, 40, 56, 80`. Anything else gets rounded.
- Document-dense surfaces (tables, audit trails) use the 8/12/16 tier. Marketing-style surfaces use 24/32/56.

**Hover, press, focus**
- Hover: background shifts one tone warmer (e.g. cream → `--surface-2`). No color change on text. No scale. No transform.
- Press: background shifts *another* tone warmer; no shrink, no transform. Buttons get `transform: translateY(0.5px)` only in the primary variant.
- Focus: 2px outline in Ink Indigo at 40% opacity, offset 2px. Always visible — never `outline: none` without replacement. Buttons get a soft ring; inputs get a border swap to Ink Indigo plus the ring.

**Motion**
- Easing: `cubic-bezier(0.2, 0, 0, 1)` — a calm, decisive ease-out. Used universally.
- Duration: 120ms for hover/press, 180ms for menus/popovers, 260ms for panels/modals.
- No bounces. No springs. No parallax. Things appear and disappear with quiet confidence.
- The collapsable side nav animates width over 220ms; labels fade out before width collapses so they don't squash.

**Transparency & blur**
- Used in exactly one place: the floating PDF zoom toolbar uses a 92%-opacity cream surface with 12px backdrop blur, so it sits over document content without obscuring it.
- Nowhere else. No "glassy" sidebars or modals.

**Layout rules**
- Top of every app page is a fixed 56px header (breadcrumb + workspace switcher + avatar).
- Left rail is the collapsable nav (264px expanded, 64px collapsed). Right side panel, when invoked, is 380px and pushes content rather than overlays it.
- Content max-width inside any reading view is 920px. Tables can go full-bleed within the content column.

**Imagery vibe (if used)**
- Photography is warm-toned, slightly grainy, lit like a quiet study — wood, paper, brass, parchment. Not stock photos of glass office buildings. Not glossy renders.
- The only illustrations we use are reproductions of document fragments (clauses, signatures, stamps) — i.e. things the product itself works with.

---

## Iconography

**Set:** [**Lucide**](https://lucide.dev) — linked from CDN. Lucide's stroked, 1.5px, geometric style matches Clearmark's quiet-precision posture. No filled icons, no duotone, no neon-accent icons.

**Stroke & sizing**
- All icons: **1.5px stroke**, currentColor.
- Sizes: 14px (inline text), 16px (UI default — buttons, menu items, table cells), 20px (page header / empty state), 24px (only for hero/feature blocks).
- Pair an icon with a label whenever space allows. Icon-only buttons require a tooltip.

**Colors**
- Icons inherit color from text (`stroke: currentColor`). Never tint icons differently from their adjacent label.
- The single exception: status icons in the Audit Trail use semantic color (`--success`, `--warning`, `--danger`) at their semantic moments.

**No emoji. No unicode symbols as UI** (no `✓`, `→`, `★`). Use Lucide's `check`, `arrow-right`, `star`.

**Substitution flag** — Lucide was chosen as the closest CDN-available match to the system's stated posture. If Clearmark adopts a bespoke icon set, drop the SVGs into `assets/icons/` and update this section. Lucide should be considered the default until then.

**Logo & marks**
- Primary logo: `assets/clearmark-logo.svg` (wordmark + check-mark glyph)
- Glyph only: `assets/clearmark-glyph.svg` (for the collapsed sidebar, favicons, social avatars)
- Logos are always rendered in `--ink` on cream surfaces, or `--cream` on ink surfaces. Never coloured.

---

## Manrope font

Manrope is wired as a self-hosted variable font at `fonts/Manrope-VariableFont_wght.ttf`. The `@font-face` declaration lives in `colors_and_type.css`. Fallback stack is `ui-sans-serif, system-ui, sans-serif`.

---

## Using this system

For an agent or designer building a new screen:
1. Link `colors_and_type.css` (or copy the tokens into your stylesheet).
2. Open `ui_kits/app/index.html` to see the components in context.
3. Pull JSX components from `ui_kits/app/*.jsx` directly — they're written to be cosmetic-only and easy to recompose.
4. When in doubt about voice, re-read the Content Fundamentals table above.

When something feels wrong, it usually is — Clearmark's calm comes from restraint, not addition.
