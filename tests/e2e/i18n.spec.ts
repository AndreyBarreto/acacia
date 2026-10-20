import { expect, test } from './fixtures';

const homes = { pt: '/pt/', en: '/en/', es: '/es/' } as const;

test.describe('language switcher', () => {
  for (const [from, fromPath] of Object.entries(homes)) {
    for (const [to, toPath] of Object.entries(homes)) {
      if (from === to) continue;
      test(`${fromPath} switches to ${toPath}`, async ({ page }) => {
        await page.goto(fromPath);
        await page.locator(`nav a[hreflang="${to}"]`).click();
        await expect(page).toHaveURL(toPath);
        await expect(page.locator('html')).toHaveAttribute('lang', to === 'pt' ? 'pt-BR' : to);
      });
    }
  }

  test('marks the current language and does not link to it', async ({ page }) => {
    await page.goto('/en/');
    const nav = page.getByRole('navigation', { name: /language/i });
    await expect(nav.locator('[aria-current="page"]')).toHaveText('EN');
    await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
    await expect(nav.getByRole('link')).toHaveCount(2);
  });
});

test.describe('language banner, browser in Spanish', () => {
  test.use({ locale: 'es-AR' });

  test('suggests Spanish on a pt page without redirecting', async ({ page }) => {
    await page.goto('/pt/');
    const banner = page.getByRole('region', { name: 'Sugerencia de idioma' });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('¿Querés ver el sitio en español?');
    await expect(banner.getByRole('link', { name: 'Ver en español' })).toHaveAttribute(
      'href',
      '/es/',
    );
    await expect(page).toHaveURL(/\/pt\/$/);
  });

  test('accepting leads to the Spanish page', async ({ page }) => {
    await page.goto('/pt/');
    await page.getByRole('link', { name: 'Ver en español' }).click();
    await expect(page).toHaveURL(/\/es\/$/);
  });

  test('does not show on a Spanish page', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('[data-lang-banner]')).toBeHidden();
  });

  test('dismissing hides it for the session', async ({ page }) => {
    await page.goto('/en/');
    const banner = page.getByRole('region', { name: 'Sugerencia de idioma' });
    await expect(banner).toBeVisible();
    await page.getByRole('button', { name: 'Ahora no' }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(banner).toBeHidden();
    await page.goto('/pt/');
    await expect(page.locator('[data-lang-banner]')).toBeHidden();
  });
});

test.describe('language banner, other browsers', () => {
  test.use({ locale: 'en-US' });

  test('suggests English on a pt page', async ({ page }) => {
    await page.goto('/pt/');
    await expect(page.getByText('This site is also available in English.')).toBeVisible();
  });
});

test.describe('language banner, unsupported browser language', () => {
  test.use({ locale: 'de-DE' });

  test('shows nothing', async ({ page }) => {
    await page.goto('/pt/');
    await expect(page.locator('[data-lang-banner]')).toBeHidden();
  });
});

test.describe('language banner, browser matches the page', () => {
  test.use({ locale: 'pt-BR' });

  test('shows nothing', async ({ page }) => {
    await page.goto('/pt/');
    await expect(page.locator('[data-lang-banner]')).toBeHidden();
  });
});
