import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const locales = ['pt', 'en', 'es'];

for (const locale of locales) {
  const path = `/${locale}/`;

  test.describe(path, () => {
    test('loads the brand fonts from the site itself, never from Google', async ({ page }) => {
      const fontRequests: string[] = [];
      page.on('request', (request) => {
        if (
          request.resourceType() === 'font' ||
          /fonts\.(googleapis|gstatic)\.com/.test(request.url())
        ) {
          fontRequests.push(request.url());
        }
      });

      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      expect(fontRequests.length).toBeGreaterThan(0);
      for (const url of fontRequests) {
        expect(new URL(url).origin).toBe(new URL(page.url()).origin);
        expect(url).toMatch(/\/fonts\/[a-z0-9-]+\.woff2$/);
      }
      const loaded = await page.evaluate(() => [
        document.fonts.check('1em "Young Serif"'),
        document.fonts.check('1em "Hanken Grotesk"'),
      ]);
      expect(loaded).toEqual([true, true]);
    });

    test('has a header with the logo and the Jurerê link, and a footer', async ({ page }) => {
      await page.goto(path);

      const header = page.getByRole('banner');
      await expect(header.getByRole('link', { name: 'Acácia' })).toHaveAttribute('href', path);
      await expect(header.getByRole('link', { name: 'Jurerê' })).toHaveAttribute(
        'href',
        `${path}jurere/`,
      );
      await expect(
        page.getByRole('contentinfo').getByRole('link', { name: 'Acácia' }),
      ).toBeVisible();
    });

    test('has no axe violations', async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
}

test('shows a visible focus ring on keyboard focus', async ({ page }) => {
  await page.goto('/pt/');

  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveAccessibleName('Acácia');

  const outline = await focused.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  expect(outline.style).toBe('solid');
  expect(outline.width).toBeGreaterThanOrEqual(3);
});

test('has no horizontal scroll at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/pt/');
  await page.evaluate(() => document.fonts.ready);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
