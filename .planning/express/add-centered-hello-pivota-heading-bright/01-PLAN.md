---
wave: 1
domain: frontend
depends_on: []
files_modified:
  - index.html
  - styles.css
autonomous: true
integration_contracts:
  provides:
    - artifact: hello-pivota-heading
      shape: '{ id: string, textContent: string, color: string }'
      verify: "grep -q 'Hello Pivota' index.html"
  requires: []
---

# Wave 1 — Frontend: Hello Pivota Heading

<objective>
Add a centered "Hello Pivota" heading in bright blue near the top of the landing page (index.html + styles.css). The heading must be visually prominent, horizontally centered, and use a bright blue color.
</objective>

**Features covered:** F1 — Heading display

---

## Task 1: Add "Hello Pivota" heading to `index.html`

**Goal:** Insert a centered `<h2 id="hello-pivota">Hello Pivota</h2>` element near the top of `<main>`, before the existing `<h1>Ada Lovelace</h1>`.

**Specification:**
- Add `<h2 id="hello-pivota">Hello Pivota</h2>` as the **first child** of `<main>`
- The heading must appear above all other content visually

**Acceptance criteria:**
- `grep -q 'Hello Pivota' index.html` passes
- `grep -q 'id="hello-pivota"' index.html` passes

---

## Task 2: Style the heading in `styles.css`

**Goal:** Make the `#hello-pivota` heading centered and bright blue.

**Specification:**
- `text-align: center`
- `color: #0066ff` (bright blue — vivid, accessible)
- `font-size: 1.5rem`
- `margin: 0 0 1rem`
- No special dark-mode override needed (bright blue is visible on both light and dark backgrounds)

**Acceptance criteria:**
- `grep -q 'hello-pivota' styles.css` passes
- `grep -q '0066ff\|#0077ff\|#0055ff\|bright' styles.css` passes (or equivalent bright blue hex)

---

## Commit message

`feat: add centered Hello Pivota heading in bright blue`
