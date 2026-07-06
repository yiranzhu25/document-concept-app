---
name: clearmark-design
description: Use this skill to generate well-branded interfaces and assets for Clearmark, a legal document management system that is clear, accurate, and trustworthy, leveraging AI. Contains the brand voice, color and type tokens, component CSS class library, logos, illustrated avatars, and ready-to-copy HTML snippets for every component (sidebar, table, audit trail, PDF viewer, side panel, info card, badges, switcher, etc).
user-invocable: true
---

# Clearmark design system

Use this skill when building **anything that should look or sound like Clearmark** — production UI, a one-off prototype, a slide deck, a mockup, a screenshot for a doc. Whether you are writing throwaway HTML or production React, follow these rules so the output reads as authentically Clearmark.

## How to start

1. **Read `README.md`** end-to-end. It contains the brand voice (Content fundamentals), the visual system (Visual foundations), and the iconography rules. These are not negotiable defaults — they are *the* defaults.
2. **Import the tokens.** In any HTML file:
   ```html
   <link rel="stylesheet" href="colors_and_type.css">
   <link rel="stylesheet" href="components.css">
   ```
   `colors_and_type.css` defines every CSS variable (color, type, spacing, radius, shadow, motion, layout). `components.css` ships ready-to-use classes (`.btn`, `.input`, `.select`, `.badge`, `.toggle`, `.avatar`, `.cm-table`, `.info-card`, `.audit-trail`, `.switcher`, `.tabs`, `.crumbs`, `.progress`, `.side-panel`, `.menu`, etc).
3. **Pick patterns from `preview/`.** Every card in that folder is a complete working snippet for one component. Open the file, copy the HTML, swap the data. Do *not* hand-roll component HTML from scratch — start from a preview card and modify.
4. **Pull assets from `assets/`** — `clearmark-logo.svg`, `clearmark-glyph.svg`, `clearmark-glyph-reverse.svg`, `clearmark-wordmark.svg`, `avatars/p1.svg` … `p6.svg`. Logos are stroked SVGs that inherit `currentColor` via the React `<Logo />` pattern or render at fixed ink/cream via the file variants.
5. **Use the user-fillable avatar pattern** when the avatar should accept a real photo later: wrap `<image-slot id="..." shape="circle" src="assets/avatars/pN.svg">` inside `.avatar`. Requires `<script src="image-slot.js"></script>` and the HTML must sit at the project root for the dropped image to persist.

## What's where

| Path | Use it for |
|---|---|
| `README.md` | Brand voice (Content fundamentals), Visual foundations, Iconography rules |
| `colors_and_type.css` | All CSS custom properties + base type styles (drop-in `<h1>`, `<p>`, `.cap`, `.label`, `code` …) |
| `components.css` | Every component class — `.btn`, `.input`, `.select`, `.badge`, `.badge-num`, `.badge-icon`, `.toggle`, `.avatar`, `.tabs`, `.crumbs`, `.progress`, `.cm-table` (+ `.cm-table__sticky`), `.info-card`, `.info-metric`, `.audit-version`, `.audit-action`, `.audit-comment`, `.switcher`, `.menu` |
| `fonts/Manrope-VariableFont_wght.ttf` | Wired via `@font-face` in `colors_and_type.css` |
| `assets/clearmark-*.svg` | Logos + glyph (light and reversed) |
| `assets/avatars/p1–p6.svg` | Illustrated portrait avatars (use as default `src` for image-slots) |
| `image-slot.js` | Drag-to-fill image placeholder web component (root location is required) |
| `preview/*.html` | One file per component — the canonical copy-paste reference |

## Working rules (re-skim before every task)

**Voice** — Plainspoken, never breezy. Sentence case everywhere. Address the user as *you*; refer to the product as *Clearmark* (never *we* or *I*). No emoji. No exclamation points outside genuinely destructive flows. Smart quotes only.

**Color** — Warm, restrained. Cream is the page, white is the raised card, Cream 2 is the hover/stripe tone. Ink-Indigo (`--accent`) is used **sparingly** — primary buttons, focus, active nav, AI-related dots only. Semantic colors (success, warning, danger, info) come from `--success`, `--warning`, `--danger`, `--info` and their `*-soft` backgrounds. **No gradients. No purple-to-pink. No cool greys.**

**Type** — One family: Manrope, weights 300–800. High-contrast hierarchy. The wordmark is Manrope 500 — *not* bold. Tabular numerals on anything in a column.

**Components** — Borderless table, quiet header, lightest possible hover. Focus state on inputs is a darker border + a soft warm shadow — **never a colored ring**. `<select>` always uses our custom chevron and right padding. Dropdowns match the styled-menu vocabulary (white surface, hairline border, soft shadow, hover rows, Ink Indigo check on selected).

**Iconography** — Lucide style at 1.5px stroke, currentColor. Inline SVGs are fine. Never emoji or unicode glyphs as icons.

**Motion** — Single ease (`cubic-bezier(0.2, 0, 0, 1)`). 120/180/260ms. No bounce, no spring, no parallax.

## When the user invokes this skill without further guidance

Ask what they want to build. Probe for:
- Surface kind (web app screen, marketing site, slide deck, mockup, email, doc)
- The 1–3 key components in scope (table? PDF viewer? audit trail? info cards?)
- Whether they want variations to compare
- Real content vs. placeholder data

Then act as an expert Clearmark designer — output either static HTML artifacts (copy patterns from `preview/`) or production code (import the two CSS files; reuse the classes). When unsure, default to a static HTML artifact at the project root with the two stylesheets imported, and the preview snippets composed.

## What this skill will *not* do

- Invent a different color palette, brand accent, or type family.
- Use emoji, exclamation points, or marketing-speak in product copy.
- Substitute purple/pink gradients, neon semantics, or cool steel-grey for the warm neutral system.
- Recreate any component from memory when there's a working pattern in `preview/` to copy.
