import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('F0: Page displays Ada Lovelace content', () => {
  test("h1 with text 'Ada Lovelace' is visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Ada Lovelace');
  });

  test("Bio text 'Mathematician & first programmer.' is visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    const bio = page.locator('p');
    await expect(bio).toBeVisible();
    await expect(bio).toHaveText('Mathematician & first programmer.');
  });

  test("Page title is 'Ada Lovelace'", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Ada Lovelace');
  });
});

test.describe('F1: Theme toggle button exists and toggles dark class', () => {
  test("Button with id='theme-toggle' and text 'Toggle theme' is visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    const button = page.locator('#theme-toggle');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Toggle theme');
  });

  test("Clicking toggle adds 'dark' class to body", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    await page.locator('#theme-toggle').click();
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(true);
  });

  test("Clicking toggle again removes 'dark' class from body", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    await page.locator('#theme-toggle').click();
    await page.locator('#theme-toggle').click();
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(false);
  });
});

test.describe('F2: Theme persists across reloads via localStorage', () => {
  test('After clicking toggle to dark, reloading page keeps dark class on body', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    await page.locator('#theme-toggle').click();
    await page.reload();
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(true);
  });

  test('After clicking toggle back to light, reloading page keeps light (no dark class)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.goto(BASE_URL);
    await page.locator('#theme-toggle').click();
    await page.reload();
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(false);
  });
});

test.describe('F3: CSS light and dark themes applied correctly', () => {
  test('Light theme: body has no dark class on fresh load (default)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL);
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(false);
  });

  test('Dark theme: body.dark class is applied when theme is dark', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.goto(BASE_URL);
    const hasDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(hasDark).toBe(true);
  });
});
