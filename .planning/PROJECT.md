# Ada Lovelace Personal Landing Page

## What This Is

A single-page static personal landing website for Ada Lovelace. It displays her name, a one-line bio, and a theme toggle button. The page requires no build tools, no frameworks, and no external dependencies — pure HTML, CSS, and vanilla JavaScript.

## Core Value

A clean, minimal personal landing page that works instantly in any browser with zero setup.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] `index.html` displays name "Ada Lovelace" and bio "Mathematician & first programmer."
- [ ] A "Toggle theme" button switches between light and dark themes by toggling a CSS class on `<body>`
- [ ] Theme preference persists across page reloads via `localStorage`
- [ ] Minimal, clean styling with no external assets or CDNs
- [ ] All files at repository root: `index.html`, `styles.css`, `script.js`

### Out of Scope

- Build tooling (webpack, vite, etc.) — hard constraint: plain static files only
- npm / package.json — hard constraint: no package manager
- External CDNs or asset downloads — hard constraint: no external dependencies
- Backend or server-side logic — static files only, served via `python3 -m http.server 8000`
- Multiple pages — single-page only

## Context

- Dev server command: `python3 -m http.server 8000`
- Technology: plain HTML5, CSS3, vanilla JavaScript (ES6+)
- No framework, no build step
- All output files live at the repository root

## Constraints

- **Tech Stack**: Plain static HTML/CSS/JS only — no frameworks, no build tools, no npm
- **File Layout**: All files at repository root (`index.html`, `styles.css`, `script.js`)
- **Dev Server**: `python3 -m http.server 8000` — no node server, no other tooling
- **Assets**: No external assets or CDNs — everything self-contained

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| CSS class toggle on `<body>` for theming | Simple, idiomatic, no JS style manipulation | — Pending |
| `localStorage` for theme persistence | Standard browser API, no cookies needed | — Pending |

---
*Last updated: 2026-05-28 after initialization*
