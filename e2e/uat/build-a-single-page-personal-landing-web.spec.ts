import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
});

test.describe('F0: Landing page shows Ada Lovelace name and bio', () => {
  test("Opening index.html shows the name 'Ada Lovelace' on screen", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1')).toHaveText('Ada Lovelace');
  });

  test("Opening index.html shows the bio text 'Mathematician & first programmer.'", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('p')).toHaveText('Mathematician & first programmer.');
  });

  test('Page validates as HTML5 — correct nesting, no stray tags', async ({ page }) => {
    await page.goto(BASE_URL);
    // Verify essential structural elements are present and correctly nested
    await expect(page.locator('html')).toHaveCount(1);
    await expect(page.locator('head')).toHaveCount(1);
    await expect(page.locator('body')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main p')).toHaveCount(1);
    await expect(page.locator('main button#theme-toggle')).toHaveCount(1);
    // DOCTYPE must be present (accessible via document.doctype)
    const hasDoctype = await page.evaluate(() => document.doctype?.name === 'html');
    expect(hasDoctype).toBe(true);
  });

  test('No inline styles, no external CDN links', async ({ page }) => {
    await page.goto(BASE_URL);
    // No inline style attributes on any element
    const inlineStyles = await page.evaluate(() =>
      document.querySelectorAll('[style]').length
    );
    expect(inlineStyles).toBe(0);

    // No external CDN <link> or <script> tags (all src/href must be relative or empty)
    const externalLinks = await page.evaluate(() => {
      const cdnPattern = /^https?:\/\//;
      const links = Array.from(document.querySelectorAll('link[href]'));
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return (
        links.filter(el => cdnPattern.test((el as HTMLLinkElement).href) &&
          !((el as HTMLLinkElement).href.startsWith(window.location.origin))).length +
        scripts.filter(el => cdnPattern.test((el as HTMLScriptElement).src) &&
          !((el as HTMLScriptElement).src.startsWith(window.location.origin))).length
      );
    });
    expect(externalLinks).toBe(0);
  });
});

test.describe("F1: Theme toggle button is present and functional", () => {
  test("A 'Toggle theme' button with id='theme-toggle' is visible on the page", async ({ page }) => {
    await page.goto(BASE_URL);
    const button = page.locator('#theme-toggle');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Toggle theme');
  });

  test("Clicking 'Toggle theme' switches the page between light and dark mode", async ({ page }) => {
    await page.goto(BASE_URL);
    // Initially no dark class
    const initialDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(initialDark).toBe(false);

    // Click to enable dark mode
    await page.locator('#theme-toggle').click();
    const afterFirstClick = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(afterFirstClick).toBe(true);
  });

  test("Clicking 'Toggle theme' again switches back to the original mode", async ({ page }) => {
    await page.goto(BASE_URL);
    // Click once → dark
    await page.locator('#theme-toggle').click();
    const afterFirstClick = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(afterFirstClick).toBe(true);

    // Click again → back to light
    await page.locator('#theme-toggle').click();
    const afterSecondClick = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(afterSecondClick).toBe(false);
  });
});

test.describe('F2: Theme choice persists across page reloads via localStorage', () => {
  test('After clicking Toggle theme to dark mode, reloading the page keeps dark mode active', async ({ page }) => {
    // Start fresh
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);

    // Switch to dark
    await page.locator('#theme-toggle').click();
    const isDarkBeforeReload = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isDarkBeforeReload).toBe(true);

    // Reload and verify persistence
    await page.reload();
    const isDarkAfterReload = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isDarkAfterReload).toBe(true);
  });

  test('After clicking Toggle theme to light mode, reloading the page keeps light mode active', async ({ page }) => {
    // Pre-seed dark theme in localStorage, then toggle back to light
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.goto(BASE_URL);

    // Page should load dark due to localStorage
    const isDarkOnLoad = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isDarkOnLoad).toBe(true);

    // Toggle back to light
    await page.locator('#theme-toggle').click();
    const isLightAfterToggle = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isLightAfterToggle).toBe(false);

    // Reload and verify light persists
    await page.reload();
    const isLightAfterReload = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isLightAfterReload).toBe(false);
  });
});

test.describe('F3: CSS themes: light default, body.dark for dark mode', () => {
  test("On initial load (no localStorage), the body does NOT have class 'dark' (light mode is default)", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(false);
  });

  test("After clicking toggle, the body element has class 'dark'", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    await page.locator('#theme-toggle').click();
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(true);
  });

  test('No external fonts, no @import, no CDN links in stylesheet', async ({ page }) => {
    await page.goto(BASE_URL);

    // Fetch the stylesheet content and verify no @import or CDN URLs
    const stylesheetContent = await page.evaluate(async () => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const texts: string[] = [];
      for (const link of links) {
        const href = (link as HTMLLinkElement).href;
        if (href) {
          try {
            const res = await fetch(href);
            texts.push(await res.text());
          } catch {
            // ignore fetch errors
          }
        }
      }
      return texts.join('\n');
    });

    // No @import rules
    expect(stylesheetContent).not.toMatch(/@import/);
    // No CDN URLs (http/https) in the stylesheet
    expect(stylesheetContent).not.toMatch(/https?:\/\//);

    // No external CDN <link> tags for fonts or other resources
    const externalLinkCount = await page.evaluate(() => {
      const cdnPattern = /^https?:\/\//;
      return Array.from(document.querySelectorAll('link[href]')).filter(el => {
        const href = (el as HTMLLinkElement).getAttribute('href') || '';
        return cdnPattern.test(href);
      }).length;
    });
    expect(externalLinkCount).toBe(0);
  });
});
