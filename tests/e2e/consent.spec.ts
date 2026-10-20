import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ locale: 'pt-BR' });

const copy = {
  pt: {
    accept: 'Aceitar',
    decline: 'Recusar',
    prefs: 'Preferências de cookies',
    link: 'Política de privacidade',
  },
  en: { accept: 'Accept', decline: 'Decline', prefs: 'Cookie preferences', link: 'Privacy policy' },
  es: {
    accept: 'Aceptar',
    decline: 'Rechazar',
    prefs: 'Preferencias de cookies',
    link: 'Política de privacidad',
  },
} as const;

for (const locale of ['pt', 'en', 'es'] as const) {
  const c = copy[locale];
  const banner = (page: import('@playwright/test').Page) => page.locator('[data-consent-banner]');

  test.describe(`/${locale}/ consent`, () => {
    test('shows the banner on the first visit with equal buttons', async ({ page }) => {
      await page.goto(`/${locale}/`);
      await expect(banner(page)).toBeVisible();
      const accept = banner(page).getByRole('button', { name: c.accept });
      const decline = banner(page).getByRole('button', { name: c.decline });
      const a = await accept.boundingBox();
      const d = await decline.boundingBox();
      expect(Math.abs(a!.height - d!.height)).toBeLessThan(1);
      expect(Math.abs(a!.width - d!.width)).toBeLessThan(40);
      const offset = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-offset'),
      );
      expect(parseFloat(offset)).toBeGreaterThan(0);
    });

    for (const choice of ['accept', 'decline'] as const) {
      test(`${choice} hides the banner for good and resets the offset`, async ({ page }) => {
        await page.goto(`/${locale}/`);
        await banner(page).getByRole('button', { name: c[choice] }).click();
        await expect(banner(page)).toBeHidden();
        const offset = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-offset'),
        );
        expect(parseFloat(offset)).toBe(0);
        await page.reload();
        await expect(banner(page)).toBeHidden();
      });
    }

    test('the footer link reopens the banner', async ({ page }) => {
      await page.goto(`/${locale}/`);
      await banner(page).getByRole('button', { name: c.decline }).click();
      await page.getByRole('button', { name: c.prefs }).click();
      await expect(banner(page)).toBeVisible();
    });

    test('links to the privacy page in the same locale', async ({ page }) => {
      await page.goto(`/${locale}/`);
      await banner(page).getByRole('link', { name: c.link }).click();
      await expect(page).toHaveURL(`/${locale}/privacidade/`);
    });

    test('works with the keyboard', async ({ page }) => {
      await page.goto(`/${locale}/`);
      const decline = banner(page).getByRole('button', { name: c.decline });
      await decline.focus();
      await page.keyboard.press('Enter');
      await expect(banner(page)).toBeHidden();
      await page.getByRole('button', { name: c.prefs }).focus();
      await page.keyboard.press('Enter');
      await expect(banner(page)).toBeVisible();
      await expect(banner(page).getByRole('button', { name: c.accept })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(banner(page)).toBeHidden();
    });

    test('privacy page renders and has no axe violations', async ({ page }) => {
      await page.goto(`/${locale}/privacidade/`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', /./);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}
