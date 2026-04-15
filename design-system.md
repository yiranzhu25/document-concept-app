# Synapse Finance — Design System
**Version:** 1.0  
**Stack:** React + Tailwind CSS v3 + CSS Custom Properties  
**Mode:** Light-first, dark mode via `[data-theme="dark"]` on `<html>`  
**Aesthetic:** Elegostra Clean — precision data surfaces, restrained typography, confident negative space.

---

## 0. Guiding Principles

1. **Clarity over decoration.** Every visual element must earn its place by communicating information.
2. **Semantic tokens, not raw values.** Engineers never reference a hex code directly — only token names.
3. **Light is the contract; dark is the inversion.** Every token must resolve in both modes.
4. **Density with breathing room.** High-information layouts need consistent rhythm, not cramped spacing.
5. **State completeness.** Every interactive component must define: default, hover, focus, active, disabled, and error.

---

## 1. Design Tokens

### 1.1 Color Tokens

All tokens are CSS custom properties set on `:root` (light) and `[data-theme="dark"]`.  
Tailwind consumes these via `theme.extend.colors` in `tailwind.config.js`.

#### Primitive Palette (never used directly in components)

```css
/* Neutrals */
--primitive-neutral-0:   #FFFFFF;
--primitive-neutral-50:  #F8F9FA;
--primitive-neutral-100: #EFF0F1;
--primitive-neutral-200: #D9DBDD;
--primitive-neutral-300: #B0B4B8;
--primitive-neutral-400: #6F767E;
--primitive-neutral-500: #4A5057;
--primitive-neutral-700: #1A1D1F;
--primitive-neutral-900: #0F1115;
--primitive-neutral-950: #080A0C;

/* Brand */
--primitive-brand-50:    #EEF1FF;
--primitive-brand-100:   #D9DFFE;
--primitive-brand-500:   #2D46B9;
--primitive-brand-600:   #2339A0;
--primitive-brand-700:   #1B2C80;

/* Positive */
--primitive-green-50:    #E6F9F2;
--primitive-green-500:   #00B37E;
--primitive-green-700:   #007A55;

/* Negative */
--primitive-red-50:      #FFF0F0;
--primitive-red-500:     #FF4D4D;
--primitive-red-700:     #CC2E2E;

/* Warning */
--primitive-amber-50:    #FFF8E6;
--primitive-amber-500:   #F5A623;
--primitive-amber-700:   #C27D0A;

/* Info */
--primitive-blue-50:     #EBF5FF;
--primitive-blue-500:    #1A8CFF;
--primitive-blue-700:    #0060CC;
```

#### Semantic Tokens

```css
:root {
  /* --- Backgrounds --- */
  --color-bg-app:           var(--primitive-neutral-50);   /* Page canvas */
  --color-bg-surface:       var(--primitive-neutral-0);    /* Cards, panels */
  --color-bg-surface-raised:var(--primitive-neutral-0);    /* Modals, dropdowns */
  --color-bg-subtle:        var(--primitive-neutral-50);   /* Inset areas, well */
  --color-bg-inverse:       var(--primitive-neutral-900);  /* Inverse banners */

  /* --- Borders --- */
  --color-border-default:   var(--primitive-neutral-100);
  --color-border-strong:    var(--primitive-neutral-200);
  --color-border-focus:     var(--primitive-brand-500);
  --color-border-error:     var(--primitive-red-500);

  /* --- Text --- */
  --color-text-primary:     var(--primitive-neutral-700);
  --color-text-secondary:   var(--primitive-neutral-400);
  --color-text-placeholder: var(--primitive-neutral-300);
  --color-text-disabled:    var(--primitive-neutral-300);
  --color-text-inverse:     var(--primitive-neutral-0);
  --color-text-link:        var(--primitive-brand-500);

  /* --- Interactive / Brand --- */
  --color-action-primary:         var(--primitive-neutral-900);
  --color-action-primary-hover:   var(--primitive-neutral-700);
  --color-action-primary-text:    var(--primitive-neutral-0);
  --color-action-secondary:       var(--primitive-neutral-0);
  --color-action-secondary-border:var(--primitive-neutral-200);
  --color-action-secondary-hover: var(--primitive-neutral-50);

  /* --- Data Semantic --- */
  --color-positive:         var(--primitive-green-500);
  --color-positive-subtle:  var(--primitive-green-50);
  --color-negative:         var(--primitive-red-500);
  --color-negative-subtle:  var(--primitive-red-50);
  --color-warning:          var(--primitive-amber-500);
  --color-warning-subtle:   var(--primitive-amber-50);
  --color-info:             var(--primitive-blue-500);
  --color-info-subtle:      var(--primitive-blue-50);

  /* --- Elevation (shadows) --- */
  --shadow-1: 0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.04);
  --shadow-2: 0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-3: 0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-4: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);

  /* --- Chart glow (same-hue drop-shadow) --- */
  --glow-positive: drop-shadow(0 0 6px rgba(0,179,126,0.4));
  --glow-negative: drop-shadow(0 0 6px rgba(255,77,77,0.4));
  --glow-brand:    drop-shadow(0 0 6px rgba(45,70,185,0.35));
}

[data-theme="dark"] {
  /* --- Backgrounds --- */
  --color-bg-app:            #0F1115;
  --color-bg-surface:        #16191E;  /* One step up from app bg */
  --color-bg-surface-raised: #1E2229;  /* Two steps — modals, dropdowns */
  --color-bg-subtle:         #12151A;  /* Inset / well */
  --color-bg-inverse:        #FFFFFF;

  /* --- Borders --- */
  --color-border-default:    rgba(255,255,255,0.08);
  --color-border-strong:     rgba(255,255,255,0.14);
  --color-border-focus:      #5A76E8;
  --color-border-error:      #FF6B6B;

  /* --- Text --- */
  --color-text-primary:      #F1F3F5;
  --color-text-secondary:    #868E96;
  --color-text-placeholder:  #4A5057;
  --color-text-disabled:     #4A5057;
  --color-text-inverse:      #0F1115;
  --color-text-link:         #7B96FF;

  /* --- Interactive / Brand --- */
  --color-action-primary:        #FFFFFF;
  --color-action-primary-hover:  #D9DBDD;
  --color-action-primary-text:   #0F1115;
  --color-action-secondary:      transparent;
  --color-action-secondary-border: rgba(255,255,255,0.14);
  --color-action-secondary-hover:  rgba(255,255,255,0.06);

  /* --- Data Semantic (dark-adjusted) --- */
  --color-positive:         #2DD4A0;
  --color-positive-subtle:  rgba(45,212,160,0.12);
  --color-negative:         #FF6B6B;
  --color-negative-subtle:  rgba(255,107,107,0.12);
  --color-warning:          #FFBC42;
  --color-warning-subtle:   rgba(255,188,66,0.12);
  --color-info:             #60AFFE;
  --color-info-subtle:      rgba(96,175,254,0.12);

  /* --- Elevation (darker, more opaque in dark mode) --- */
  --shadow-1: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-2: 0 2px 8px rgba(0,0,0,0.4);
  --shadow-3: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-4: 0 16px 48px rgba(0,0,0,0.6);
}
```

---

### 1.2 Spacing Scale

Base unit: **4px**. All spacing values are multiples.

| Token        | Value | Use                              |
|--------------|-------|----------------------------------|
| `--space-1`  | 4px   | Inline icon gap, tight labels    |
| `--space-2`  | 8px   | Input internal padding (y)       |
| `--space-3`  | 12px  | Chip/badge padding, compact rows |
| `--space-4`  | 16px  | Card padding (mobile), row gap   |
| `--space-5`  | 20px  | Section gap within a card        |
| `--space-6`  | 24px  | Card padding (desktop)           |
| `--space-8`  | 32px  | Between cards in a grid          |
| `--space-10` | 40px  | Section vertical rhythm          |
| `--space-12` | 48px  | Large section breaks             |
| `--space-16` | 64px  | Page-level top padding           |

---

### 1.3 Typography

**Font Stack:**  
- Display/Headlines: `'DM Sans', sans-serif` — geometric but warmer than Inter; reads as modern fintech without being generic  
- Data/Mono values: `'DM Mono', monospace` — for numbers in KPI widgets and data grids  
- Body: `'DM Sans', sans-serif`

**Why DM Sans over Inter:** Gemini's spec defaulted to Inter which is already oversaturated in fintech. DM Sans has comparable legibility, better optical weight at semibold, and slightly more distinct letterforms at small sizes.

```css
:root {
  --font-display: 'DM Sans', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', 'Fira Code', monospace;
}
```

#### Type Scale (Major Third — 1.25 ratio, base 14px for data-dense UI)

| Token             | Size   | Line Height | Weight | Tracking   | Use                         |
|-------------------|--------|-------------|--------|------------|-----------------------------|
| `--text-xs`       | 11px   | 16px        | 500    | 0.02em     | Labels, axis ticks          |
| `--text-sm`       | 12px   | 18px        | 400    | 0          | Secondary body, table cells |
| `--text-base`     | 14px   | 22px        | 400    | 0          | Primary body, inputs        |
| `--text-md`       | 16px   | 24px        | 500    | -0.01em    | Card titles, nav items      |
| `--text-lg`       | 20px   | 28px        | 600    | -0.02em    | Section headers             |
| `--text-xl`       | 24px   | 32px        | 600    | -0.02em    | Page titles                 |
| `--text-2xl`      | 30px   | 38px        | 700    | -0.03em    | KPI values, large numerics  |
| `--text-3xl`      | 38px   | 46px        | 700    | -0.03em    | Hero KPI values             |

**Rule:** KPI numeric values always use `--font-mono` with `font-variant-numeric: tabular-nums` to prevent layout shift during data updates.

---

### 1.4 Border Radius Scale

| Token       | Value  | Use                                    |
|-------------|--------|----------------------------------------|
| `--radius-1`| 4px    | Badges, small pills, inline chips      |
| `--radius-2`| 8px    | Ghost buttons, input fields, tooltips  |
| `--radius-3`| 12px   | Cards, panels, dropdowns               |
| `--radius-4`| 16px   | Large cards, modals                    |
| `--radius-5`| 24px   | Bottom sheets                          |
| `--radius-pill` | 9999px | Primary CTA buttons, status pills  |

---

### 1.5 Elevation Scale

| Level | Token      | Shadow Value                                               | Use                         |
|-------|------------|------------------------------------------------------------|-----------------------------|
| 0     | `--shadow-0`| none                                                      | Flat surfaces, table rows   |
| 1     | `--shadow-1`| `0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.04)`| Cards at rest               |
| 2     | `--shadow-2`| `0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)`| Hovered cards, sticky headers|
| 3     | `--shadow-3`| `0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)`| Dropdowns, popovers        |
| 4     | `--shadow-4`| `0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)`| Modals, drawers          |

---

### 1.6 Motion

**Principle:** Motion confirms state changes, never decorates. One duration per interaction class.

| Token                    | Value                         | Use                              |
|--------------------------|-------------------------------|----------------------------------|
| `--duration-instant`     | 80ms                          | Checkbox, toggle snap            |
| `--duration-fast`        | 150ms                         | Button hover, input focus ring   |
| `--duration-standard`    | 220ms                         | Card hover lift, dropdown open   |
| `--duration-deliberate`  | 350ms                         | Modal enter, toast slide-in      |
| `--easing-standard`      | `cubic-bezier(0.2, 0, 0, 1)`  | Most transitions                 |
| `--easing-decelerate`    | `cubic-bezier(0, 0, 0.2, 1)`  | Elements entering screen         |
| `--easing-accelerate`    | `cubic-bezier(0.4, 0, 1, 1)`  | Elements leaving screen          |

**Card hover lift:** `transform: translateY(-2px)` with `transition: transform var(--duration-standard) var(--easing-standard), box-shadow var(--duration-standard) var(--easing-standard)`.  
Do not apply hover lift to data grid rows or KPI cards that update in real-time — movement during data refresh is disorienting.

---

## 2. Tailwind Configuration

```js
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', ...fontFamily.sans],
        mono:    ['DM Mono', ...fontFamily.mono],
      },
      colors: {
        // Expose semantic tokens as Tailwind classes
        // Usage: bg-surface, text-primary, border-default, etc.
        'bg-app':             'var(--color-bg-app)',
        'bg-surface':         'var(--color-bg-surface)',
        'bg-surface-raised':  'var(--color-bg-surface-raised)',
        'bg-subtle':          'var(--color-bg-subtle)',
        'text-primary':       'var(--color-text-primary)',
        'text-secondary':     'var(--color-text-secondary)',
        'text-placeholder':   'var(--color-text-placeholder)',
        'text-disabled':      'var(--color-text-disabled)',
        'text-inverse':       'var(--color-text-inverse)',
        'text-link':          'var(--color-text-link)',
        'border-default':     'var(--color-border-default)',
        'border-strong':      'var(--color-border-strong)',
        'border-focus':       'var(--color-border-focus)',
        'action-primary':     'var(--color-action-primary)',
        'action-primary-text':'var(--color-action-primary-text)',
        'positive':           'var(--color-positive)',
        'positive-subtle':    'var(--color-positive-subtle)',
        'negative':           'var(--color-negative)',
        'negative-subtle':    'var(--color-negative-subtle)',
        'warning':            'var(--color-warning)',
        'warning-subtle':     'var(--color-warning-subtle)',
        'info':               'var(--color-info)',
        'info-subtle':        'var(--color-info-subtle)',
      },
      boxShadow: {
        '1': 'var(--shadow-1)',
        '2': 'var(--shadow-2)',
        '3': 'var(--shadow-3)',
        '4': 'var(--shadow-4)',
      },
      borderRadius: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        'pill': '9999px',
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        'sm':   ['12px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '22px' }],
        'md':   ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'lg':   ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        'xl':   ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '2xl':  ['30px', { lineHeight: '38px', letterSpacing: '-0.03em' }],
        '3xl':  ['38px', { lineHeight: '46px', letterSpacing: '-0.03em' }],
      },
      transitionDuration: {
        'instant':   '80ms',
        'fast':      '150ms',
        'standard':  '220ms',
        'deliberate':'350ms',
      },
      transitionTimingFunction: {
        'standard':   'cubic-bezier(0.2, 0, 0, 1)',
        'decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
};
```

---

## 3. Global Setup

### 3.1 Theme Provider

```tsx
// src/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('synapse-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('synapse-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### 3.2 Global CSS

```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

html {
  font-feature-settings: "kern" 1, "liga" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--color-bg-app);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 22px;
  transition: background-color var(--duration-standard) var(--easing-standard),
              color var(--duration-standard) var(--easing-standard);
}

/* Numeric values in data contexts */
.tabular-nums {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* Focus visible - global ring */
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-1);
}
```

---

## 4. Layout

### 4.1 App Shell

```
┌─────────────────────────────────────────────────────────┐
│  TopBar (56px fixed)                                     │
├──────────────┬──────────────────────────────────────────┤
│ Sidebar      │  Main Content Area                       │
│ 240px        │  (fluid, min 0, scrollable)              │
│ (collapsed:  │                                          │
│  64px)       │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

- **TopBar:** Fixed, 56px height, `bg-surface`, `border-b border-default`, `shadow-1`. Contains: Logo, global search, notifications, theme toggle, user avatar.
- **Sidebar:** `240px` expanded, `64px` collapsed (icon-only). Transition `width` on `--duration-standard`. Contains: nav items with icon + label, section dividers, collapse toggle at bottom.
- **Main content:** `padding: 24px 32px` desktop, `padding: 16px` mobile. Max content width: `1280px`, centered.

### 4.2 Navigation Item States

```tsx
// Nav item anatomy:
// [Icon 20px] [Label] [Badge?] [Active indicator: 3px left border]

// States:
// default:  text-secondary, no bg
// hover:    bg-subtle, text-primary
// active:   bg-subtle, text-primary, 3px left border in action-primary color
// disabled: text-disabled, cursor-not-allowed
```

### 4.3 Page Grid

```css
/* Dashboard page uses a responsive CSS grid */
.dashboard-grid {
  display: grid;
  gap: 24px; /* --space-6 */
  grid-template-columns: repeat(12, 1fr);
}

/* KPI row: 4 equal columns */
.kpi-row    { grid-column: span 3; }

/* Chart area: 8/12 + sidebar 4/12 */
.chart-main { grid-column: span 8; }
.chart-side { grid-column: span 4; }

/* Full width */
.full-width { grid-column: span 12; }

@media (max-width: 1024px) {
  .kpi-row    { grid-column: span 6; }
  .chart-main { grid-column: span 12; }
  .chart-side { grid-column: span 12; }
}

@media (max-width: 640px) {
  .kpi-row    { grid-column: span 12; }
}
```

---

## 5. Components

### 5.1 Buttons

**Philosophy:** One primary action per view. Primary button is solid black (light) / white (dark). Secondary is outlined. Danger is explicit red — never disguised as primary.

```tsx
// Button variants and their token mappings

// PRIMARY
// bg: var(--color-action-primary)
// text: var(--color-action-primary-text)
// border-radius: var(--radius-pill)  ← pill, not 8px
// padding: 10px 20px (height ~40px)
// hover: bg var(--color-action-primary-hover), shadow-2
// focus: outline 2px var(--color-border-focus) offset 2px
// disabled: opacity 0.4, cursor-not-allowed
// active: transform scale(0.98)

// SECONDARY (Ghost)
// bg: var(--color-action-secondary)
// border: 1px solid var(--color-action-secondary-border)
// border-radius: var(--radius-2)  ← 8px, not pill — distinguishes from primary
// hover: bg var(--color-action-secondary-hover)

// DANGER
// bg: var(--color-negative)
// text: white
// border-radius: var(--radius-pill)
// hover: bg var(--primitive-red-700)

// GHOST (icon-only or text utility)
// No border, no bg
// border-radius: var(--radius-2)
// hover: bg-subtle
// Use for: toolbar actions, table row actions

// SIZES
// sm:  height 32px, padding 6px 14px, font-size 12px
// md:  height 40px, padding 10px 20px, font-size 14px (default)
// lg:  height 48px, padding 12px 24px, font-size 16px

// LOADING STATE
// Replace label with spinner (16px), keep button dimensions stable
// Disabled pointer events during loading
```

**Critical rule:** Primary buttons use `border-radius: pill`. Secondary/ghost buttons use `border-radius: 8px`. This shape language distinguishes intent without relying on color alone — important for accessibility.

---

### 5.2 Form & Text Fields

```tsx
// INPUT ANATOMY
// [Label 12px/500] [optional: helper text]
// [Input container: height 40px] [optional: right icon]
// [optional: error message / character count]

// INPUT STATES
// default:  border var(--color-border-default), bg var(--color-bg-surface)
// hover:    border var(--color-border-strong)
// focus:    border var(--color-border-focus), outline none, inner shadow 0 0 0 3px rgba(brand, 0.15)
// error:    border var(--color-border-error), error message below in --color-negative
// disabled: bg var(--color-bg-subtle), text var(--color-text-disabled), cursor-not-allowed
// readonly: bg var(--color-bg-subtle), border dashed

// SIZING
// border-radius: var(--radius-2) — 8px, consistent with secondary buttons
// padding: 9px 12px (height = 40px with 1px border)
// font-size: 14px (--text-base)

// TEXTAREA
// Same token rules, min-height 80px, resize: vertical only

// LABEL RULES
// Always visible (no placeholder-as-label pattern)
// font-size: 12px, font-weight: 500, color: text-primary
// margin-bottom: 6px

// HELPER TEXT
// font-size: 12px, color: text-secondary
// Error state: color: negative

// REQUIRED INDICATOR
// Red asterisk (*) after label — color: negative
```

---

### 5.3 Select & Dropdown

```tsx
// SELECT (native-style custom component)
// Same dimensions as input field
// Right icon: ChevronDown 16px, color text-secondary
// Dropdown: bg-surface-raised, shadow-3, border border-default, radius-3
// Option height: 36px, padding: 8px 12px
// Option hover: bg-subtle
// Option selected: bg-info-subtle, text-info (left check icon)
// Max dropdown height: 240px, overflow-y: scroll
// Scroll track: thin, color border-default

// MULTI-SELECT
// Selected options render as pills inside the input container
// Pill: bg-subtle, border border-default, radius-1, removable with × icon
// Input grows vertically as pills wrap
```

---

### 5.4 Date Picker

```tsx
// Trigger: standard input field with calendar icon (right)
// Calendar popover: bg-surface-raised, shadow-4, radius-4, padding 16px
// Width: 280px fixed

// Calendar anatomy:
// Header: [<] [Month Year] [>] — navigation arrows ghost buttons
// Day grid: 7 columns, day labels xs/secondary
// Day cell: 32px × 32px, radius-2
//   default:    text-primary
//   hover:      bg-subtle
//   today:      border 1px border-strong
//   selected:   bg action-primary, text action-primary-text, radius-pill
//   in-range:   bg positive-subtle (for date range mode)
//   disabled:   text-disabled, cursor-not-allowed
//   out-of-month: text-placeholder

// Range picker: two calendars side by side on desktop, stacked on mobile
```

---

### 5.5 Cards & Containers

```tsx
// STANDARD CARD
// bg: var(--color-bg-surface)
// border: 1px solid var(--color-border-default)
// border-radius: var(--radius-4) — 16px
// padding: 24px desktop, 16px mobile
// shadow: var(--shadow-1) at rest

// INTERACTIVE CARD (clickable)
// All standard card properties plus:
// hover: shadow-2, transform translateY(-2px)
// transition: transform 220ms standard-easing, box-shadow 220ms standard-easing
// cursor: pointer
// Do NOT apply to: KPI cards with live data, table row cards

// GLASS CARD — only for overlay contexts (e.g., info panel over a chart)
// bg: rgba(255,255,255,0.7) light / rgba(30,34,41,0.7) dark
// backdrop-filter: blur(12px)
// border: 1px solid rgba(255,255,255,0.3) light / rgba(255,255,255,0.08) dark
// shadow: var(--shadow-3)
// DO NOT use for primary data surfaces. Only for: tooltips over charts, floating info panels.

// CARD SECTIONS
// Divider between sections: 1px solid var(--color-border-default), margin 0 -24px (bleed to edges)
// Card header: padding-bottom 16px, border-bottom border-default
// Card footer: padding-top 16px, border-top border-default
```

---

### 5.6 KPI Widgets

```tsx
// KPI CARD ANATOMY
// ┌────────────────────────────────┐
// │ Label [info icon?]       [···] │  ← 12px/secondary, icon-button menu
// │                                │
// │ $42.74B                        │  ← 3xl/700/mono/tabular-nums
// │                                │
// │ ▲ 8.1%  vs last period         │  ← delta pill + secondary label
// └────────────────────────────────┘

// DELTA PILL
// positive: bg positive-subtle, text positive, ▲ icon
// negative: bg negative-subtle, text negative, ▼ icon
// neutral:  bg subtle, text secondary, — icon
// font-size: 12px, font-weight: 500
// padding: 2px 6px, border-radius: radius-1

// SPARKLINE (optional, in bottom 30% of card)
// 48px height, full card width, no axes
// Line color: positive / negative based on trend
// Apply glow filter: var(--glow-positive) or var(--glow-negative)
// No interaction — decorative trend only

// LOADING STATE
// Replace values with skeleton shimmer (see Feedback section)
// Skeleton height matches text height to prevent layout shift

// SIZES
// sm: compact, no sparkline, suitable for sidebar widgets
// md: default, optional sparkline
// lg: full-width with embedded mini chart
```

---

### 5.7 Data Grid / Table

```tsx
// TABLE STRUCTURE
// <table> with full width, border-collapse: separate, border-spacing: 0

// HEADER ROW
// height: 40px
// bg: var(--color-bg-subtle)
// font: 11px/500/secondary with 0.06em letter-spacing uppercase
// border-bottom: 1px solid var(--color-border-strong)
// Sortable column: shows sort icon (up/down arrow) on hover; active sort shows filled arrow

// DATA ROW
// height: 52px (comfortable density)
// border-bottom: 1px solid var(--color-border-default)
// hover: bg var(--color-bg-subtle)
// selected: bg var(--color-info-subtle)
// transition: background-color 80ms instant-easing

// CELLS
// padding: 0 16px (horizontal), vertically centered
// Primary cell (first col): font-weight 500, text-primary
// Secondary cells: text-secondary, font-size 14px
// Numeric cells: font-mono, text-right, tabular-nums
// Action cell (last col): opacity 0 at rest, opacity 1 on row hover

// INLINE STATUS PILL
// Same as delta pill above
// additional semantic: 'active' (info), 'pending' (warning), 'closed' (neutral)

// PAGINATION
// Aligned right below table
// Shows: "Showing 1–25 of 847"
// Controls: [<< First] [< Prev] [page number input] [Next >] [Last >>]
// Rows per page selector: 25 / 50 / 100

// EMPTY STATE
// Centered in table body area
// Icon (40px) + primary message + secondary message + optional CTA
// Height: 240px minimum

// LOADING STATE
// Replace rows with 5 skeleton rows (shimmer animation)
// Maintain column widths during load
```

---

### 5.8 Data Visualization

**Chart library recommendation:** Recharts (built on D3, React-native, composable).

```tsx
// CHART COLOR SEQUENCE (in order of use for multi-series)
// 1. var(--primitive-brand-500)    #2D46B9
// 2. var(--color-positive)         #00B37E / #2DD4A0
// 3. var(--primitive-amber-500)    #F5A623
// 4. var(--primitive-blue-500)     #1A8CFF
// 5. var(--primitive-neutral-400)  #6F767E
// Never use raw positive/negative colors for series — only for explicit up/down data

// LINE CHARTS
// Stroke width: 2px
// Dot: 4px radius, same color, filled
// Active dot: 6px radius, white stroke 2px
// Glow effect: SVG filter drop-shadow same hue as line, 40% opacity, 6px blur
// Grid lines: horizontal only, 1px solid var(--color-border-default)
// No vertical grid lines
// Axes: font-xs, color text-secondary, no axis line (only ticks)

// BAR CHARTS
// Bar radius: 4px top only (radius-1)
// Hover: lighten bar 15%, show tooltip
// Gap between bars: 4px within group, 16px between groups

// AREA CHARTS
// Fill: gradient from line color (40% opacity at top) to transparent
// Used for: trend over time where area volume matters

// DONUT / PIE
// Inner radius: 60% of outer for donut
// Stroke: 2px white between segments (gap effect)
// Center label: value in 2xl/mono, label in xs/secondary

// TOOLTIP
// bg: bg-surface-raised, shadow-4, radius-3, padding 12px 16px
// Border: 1px solid border-default
// Header: label in xs/500/secondary
// Values: series color dot + label text-sm + value mono/500
// Max width: 220px

// AXIS FORMATTING RULES
// Dollar values: abbreviate — $42.74B, $1.2M, $450K
// Percentages: one decimal — 8.1%
// Dates: "Jan 23" for month view, "Q1 '24" for quarterly
// Never show raw large numbers (1234567) — always abbreviated

// RESPONSIVE
// Charts must be wrapped in <ResponsiveContainer width="100%" height={height}>
// Default heights: sm 160px, md 240px, lg 320px, xl 400px
// On mobile (<640px): reduce height by 30%, hide secondary axes
```

---

### 5.9 Modals

```tsx
// OVERLAY
// bg: rgba(0,0,0,0.5) light / rgba(0,0,0,0.7) dark
// backdrop-filter: blur(4px)
// Enter: opacity 0→1, duration-deliberate, easing-decelerate
// Exit:  opacity 1→0, duration-fast, easing-accelerate

// MODAL CONTAINER
// bg: bg-surface-raised
// shadow: shadow-4
// border-radius: radius-4 (16px)
// border: 1px solid border-default
// max-width: sm 480px / md 640px / lg 800px / full (drawer-style)
// Enter: translateY(16px) opacity 0 → translateY(0) opacity 1
// Padding: 24px

// MODAL ANATOMY
// Header: title (text-lg/600) + optional subtitle (text-sm/secondary) + close icon-button (top-right)
// Body: scrollable if content exceeds viewport — max-height: calc(100vh - 200px), overflow-y: auto
// Footer: right-aligned actions. Destructive actions: left-aligned to separate from confirm.
// Dividers: 1px border-default between header/body and body/footer

// CLOSE BEHAVIOR
// Esc key, click backdrop, or × button — all close
// Confirmation modals: disable backdrop click to prevent accidental dismissal
// Trap focus within modal while open (aria-modal, focus-trap)
```

---

### 5.10 Toasts / Notifications

```tsx
// POSITIONING: top-right, 16px from edge, stacked with 8px gap (newest on top)
// WIDTH: 320px fixed, mobile: calc(100vw - 32px)
// ENTER: translateX(calc(100% + 16px)) → translateX(0), duration-deliberate, easing-decelerate
// EXIT:  opacity 1 → 0, translateX(calc(100% + 16px)), duration-fast

// TOAST ANATOMY
// [Icon 20px] [Content column] [Close ×]
// Icon: semantic (check, warning, info, x-circle)
// Title: text-sm/600/primary
// Message: text-sm/regular/secondary
// bg: bg-surface-raised, shadow-4, radius-3, border border-default
// Left border: 3px solid semantic color (positive / negative / warning / info)

// VARIANTS
// success: icon + left-border positive
// error:   icon + left-border negative
// warning: icon + left-border warning
// info:    icon + left-border info

// BEHAVIOR
// Auto-dismiss: 4s default, 6s for error (more time to read)
// Hover pauses timer
// Max stack: 3 toasts — queue additional ones
// Action button (optional): text-link style, inside toast body
```

---

### 5.11 Progress Indicators

```tsx
// LINEAR PROGRESS BAR
// Track: bg-subtle, height 6px, radius-pill
// Fill: action-primary (determinate) or animated shimmer (indeterminate)
// Indeterminate animation: sliding gradient, 1.5s infinite

// With label: show percentage right-aligned, text-xs/500/secondary

// CIRCULAR PROGRESS (for KPI cards)
// SVG-based, stroke-linecap: round
// Track: stroke border-default, fill none
// Progress: stroke positive/negative/info, fill none
// Sizes: sm 32px / md 48px / lg 64px
// Center: show percentage or icon

// STEP INDICATOR (for multi-step forms/flows)
// Horizontal: [●]——[○]——[○] with labels below
// Step states: completed (filled check + brand color), active (filled dot + brand), upcoming (empty circle + muted)
// Connector line: 1px, brand color for completed, border-default for upcoming

// SKELETON SHIMMER
// Base: bg-subtle
// Shimmer: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)
// background-size: 200% 100%, animation: shimmer 1.5s infinite
// Apply to: text lines, card areas, avatar placeholders
// Match skeleton dimensions exactly to the content they replace
```

---

### 5.12 Selection Controls

```tsx
// CHECKBOX
// Size: 18px × 18px, radius-1 (4px)
// Default: border 1.5px border-strong, bg-surface
// Hover:   border border-focus
// Checked: bg action-primary, white checkmark icon, no border
// Indeterminate: bg action-primary, white minus icon
// Disabled: opacity 0.4
// Label: text-base, margin-left 8px, vertically centered

// RADIO
// Size: 18px × 18px, radius-pill (circle)
// Same state pattern as checkbox
// Selected: outer ring (action-primary), inner filled dot (white)

// TOGGLE / SWITCH
// Track: 36px × 20px, radius-pill
//   off: bg-subtle, border border-strong
//   on:  bg action-primary
// Thumb: 16px circle, bg white, shadow-1
// Transition: 150ms, cubic-bezier(0.4, 0, 0.2, 1)
// Disabled: opacity 0.4

// RADIO GROUP / SEGMENTED CONTROL
// Pill-shaped group container: bg-subtle, radius-pill, padding 2px
// Active segment: bg-surface, shadow-1, radius-pill
// Labels: text-sm/500
// Transition: 150ms for active segment slide
```

---

## 6. Accessibility Requirements

Every component must meet these baselines:

1. **Color contrast:** WCAG AA minimum (4.5:1 for body text, 3:1 for large text and UI components). Use semantic colors, not primitives, to ensure both modes pass.
2. **Focus management:** All interactive elements must have visible `:focus-visible` styles. Modals must trap focus. Toasts must be announced via `role="alert"`.
3. **Keyboard navigation:** All interactive components must be fully operable with keyboard (Tab, Enter/Space, Arrow keys for groups, Esc for dismissal).
4. **ARIA:** Use semantic HTML first. Add ARIA only where HTML semantics are insufficient. Required attributes by component:
   - Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
   - Tables: `<caption>` or `aria-label`, sortable columns `aria-sort`
   - Toasts: `role="alert"` or `role="status"` (status for non-urgent)
   - Progress: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
   - Icon-only buttons: `aria-label`
5. **Motion:** Respect `prefers-reduced-motion`. Wrap all transitions in:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Component File Structure

```
src/
├── styles/
│   ├── globals.css          # CSS custom properties + reset
│   └── tokens.css           # Imported by globals.css
├── providers/
│   └── ThemeProvider.tsx
├── components/
│   ├── primitives/          # Atom-level, no business logic
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Toggle/
│   │   └── Badge/
│   ├── feedback/
│   │   ├── Toast/
│   │   ├── Modal/
│   │   ├── Progress/
│   │   └── Skeleton/
│   ├── data/
│   │   ├── DataGrid/
│   │   ├── KPICard/
│   │   ├── Chart/           # Recharts wrappers with design token integration
│   │   └── DeltaPill/
│   └── layout/
│       ├── AppShell/
│       ├── Sidebar/
│       ├── TopBar/
│       └── Card/
└── hooks/
    ├── useTheme.ts
    └── useMediaQuery.ts
```

---

## 8. Implementation Notes for Claude Code

1. **Install dependencies first:**
   ```bash
   npm install recharts @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-toast lucide-react clsx tailwind-merge
   ```
   Use Radix UI primitives for modal, select, checkbox, switch, and toast — they handle accessibility (focus trap, ARIA, keyboard) out of the box. Style them entirely with Tailwind tokens.

2. **Token consumption rule:** Components must reference Tailwind token classes (`bg-surface`, `text-primary`, etc.) — never raw hex values in JSX or component CSS.

3. **Dark mode rule:** Never use Tailwind's `dark:` prefix. All color switching happens at the CSS custom property level via `[data-theme="dark"]`. This ensures a single source of truth.

4. **Chart integration:** Create a `useChartTheme()` hook that reads current theme and returns the correct color array for Recharts. Charts must respond to theme changes without remounting.

5. **Numeric formatting utility:**
   ```ts
   // src/utils/format.ts
   export const formatCurrency = (value: number, compact = true): string => {
     if (compact && Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
     if (compact && Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
     if (compact && Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
   };

   export const formatDelta = (value: number): string =>
     `${value >= 0 ? '▲' : '▼'} ${Math.abs(value).toFixed(1)}%`;
   ```

6. **Avoid hover lifts on:** live-updating KPI cards, table rows, or any element that updates on a timer — the animation conflicts with data refresh and causes visual noise.
