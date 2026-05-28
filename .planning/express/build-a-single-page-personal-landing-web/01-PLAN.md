---
wave: 1
domain: frontend
depends_on: []
files_modified:
  - index.html
  - styles.css
  - script.js
autonomous: true
---

# Wave 1 — Frontend: Static Landing Page

**Objective:** Build the complete Ada Lovelace personal landing page — HTML structure, light/dark CSS themes, and vanilla JavaScript theme toggle with localStorage persistence.

**Features covered:** F0, F1, F2, F3

---

## Task 1: Create `index.html`

**Goal:** Write the HTML skeleton with correct structure, content, and wiring to CSS and JS.

<feature_dependencies>
  <requires>nothing — wave 1 is self-contained</requires>
  <features>F0, F1</features>
</feature_dependencies>

**Specification:**
- `<!DOCTYPE html>` with `lang="en"`
- `<head>`: charset UTF-8, viewport meta, `<title>Ada Lovelace</title>`, link to `styles.css`
- `<body>`: the JS will add class `dark` when dark mode is active (default: no class = light)
- Visible content (inside a `<main>` or centered wrapper):
  - `<h1>Ada Lovelace</h1>`
  - `<p>Mathematician &amp; first programmer.</p>`
  - `<button id="theme-toggle">Toggle theme</button>`
- `<script src="script.js"></script>` at bottom of `<body>`

**Acceptance criteria:**
- Opening `index.html` in a browser shows the name, bio, and button
- Page validates as HTML5 (no stray tags, correct nesting)
- No inline styles, no external CDN links

**Verify:**
```bash
grep -q 'Ada Lovelace' index.html && grep -q 'Mathematician' index.html && grep -q 'theme-toggle' index.html && echo CONTRACT_OK
```

---

## Task 2: Create `styles.css`

**Goal:** Define clean, minimal light and dark theme styles. Light is default (no class on `<body>`); dark activates with `body.dark`.

<feature_dependencies>
  <requires>index.html (Task 1) must exist for class wiring to make sense</requires>
  <features>F3</features>
</feature_dependencies>

**Specification:**

Light theme (default — no class):
```css
body {
  background-color: #ffffff;
  color: #111111;
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  padding: 1rem;
  box-sizing: border-box;
}
```

Dark theme (`body.dark`):
```css
body.dark {
  background-color: #111111;
  color: #f0f0f0;
}
```

Button:
```css
button {
  margin-top: 1.5rem;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  border-radius: 4px;
}
button:hover {
  opacity: 0.75;
}
```

Typography:
```css
h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}
p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.8;
}
```

**Constraints:** No external fonts, no `@import`, no CDN. All self-contained.

**Acceptance criteria:**
- Light mode: white background, dark text
- Dark mode (`body.dark`): dark background, light text
- Button inherits theme colors

**Verify:**
```bash
grep -q 'body.dark' styles.css && grep -q 'background-color' styles.css && echo CONTRACT_OK
```

---

## Task 3: Create `script.js`

**Goal:** Implement theme toggle with localStorage persistence.

<feature_dependencies>
  <requires>index.html with id="theme-toggle" button; styles.css with body.dark class</requires>
  <features>F1, F2</features>
</feature_dependencies>

**Specification — exact behavior:**

1. On page load: read `localStorage.getItem('theme')`. If value is `'dark'`, add class `dark` to `document.body`.
2. On button click: toggle class `dark` on `document.body`. Write current state to localStorage:
   - If `document.body.classList.contains('dark')` → `localStorage.setItem('theme', 'dark')`
   - Else → `localStorage.setItem('theme', 'light')`

**Implementation:**
```javascript
(function () {
  // Restore persisted theme on load
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  });
}());
```

**Constraints:**
- No frameworks, no modules (`type="module"` is allowed but not required)
- No external scripts
- Must work with `python3 -m http.server 8000` (no server-side processing)

**Acceptance criteria:**
- Clicking "Toggle theme" visually switches between light and dark
- Reloading the page preserves the selected theme
- No console errors on load or click

**Verify:**
```bash
grep -q 'localStorage' script.js && grep -q 'classList.toggle' script.js && grep -q 'theme-toggle' script.js && echo CONTRACT_OK
```

---

## must_haves

- [ ] `index.html` exists at repository root with "Ada Lovelace", "Mathematician & first programmer.", and a button with `id="theme-toggle"`
- [ ] `styles.css` exists at repository root with light (default) and `body.dark` theme rules
- [ ] `script.js` exists at repository root; reads localStorage on load and writes on toggle
- [ ] No `package.json`, no `node_modules`, no build artifacts
- [ ] `python3 -m http.server 8000` serves the page without errors

## verification_criteria

```bash
# All three files exist
ls index.html styles.css script.js && echo FILES_OK

# HTML has required content
grep -q 'Ada Lovelace' index.html && grep -q 'Mathematician' index.html && grep -q 'theme-toggle' index.html && echo HTML_OK

# CSS has dark theme class
grep -q 'body.dark' styles.css && echo CSS_OK

# JS has localStorage and toggle
grep -q 'localStorage' script.js && grep -q 'classList.toggle' script.js && echo JS_OK
```

---

## integration_contracts

```yaml
requires: []

provides:
  - artifact: index.html
    location: ./index.html
    shape: "HTML5 page with h1 'Ada Lovelace', p bio, button#theme-toggle, links to styles.css and script.js"
  - artifact: styles.css
    location: ./styles.css
    shape: "CSS with body (light default) and body.dark (dark theme) rules, no external imports"
  - artifact: script.js
    location: ./script.js
    shape: "IIFE reading localStorage on load, toggling body.dark and writing localStorage on button click"
```
