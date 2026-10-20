import { readdirSync, readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

// A Portuguese browser keeps the language suggestion banner out of these checks.
test.use({ locale: 'pt-BR' });

// Drafts are not in the production build, so only published apartments are expected in the list.
const published = readdirSync('content/properties').filter((slug) =>
  /^status:\s*published/m.test(readFileSync(`content/properties/${slug}/property.yaml`, 'utf8')),
);

const expected = {
  pt: {
    sections: [
      'As praias',
      'Jurerê Tradicional e Jurerê Internacional',
      'Como chegar',
      'Melhor época, mês a mês',
      'Dicas práticas',
      'Os apartamentos',
    ],
    maps: 'Abrir no Google Maps',
  },
  en: {
    sections: [
      'The beaches',
      'Jurerê Tradicional vs. Jurerê Internacional',
      'Getting here',
      'When to come, month by month',
      'Practical tips',
      'The apartments',
    ],
    maps: 'Open in Google Maps',
  },
  es: {
    sections: [
      'Las playas',
      'Jurerê Tradicional y Jurerê Internacional',
      'Cómo llegar',
      'Cuándo ir, mes por mes',
      'Datos prácticos',
      'Los deptos',
    ],
    maps: 'Abrir en Google Maps',
  },
} as const;

for (const locale of ['pt', 'en', 'es'] as const) {
  const path = `/${locale}/jurere/`;
  const { sections, maps } = expected[locale];

  test.describe(path, () => {
    test('has a single h1 and the guide sections', async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      for (const name of sections.slice(0, 5)) {
        await expect(page.getByRole('heading', { name: new RegExp(`^${name}`) })).toBeVisible();
      }
    });

    test('gives the address and a Google Maps link', async ({ page }) => {
      await page.goto(path);

      await expect(page.getByText('Rua Luiz Rampa, 70').first()).toBeVisible();
      const link = page.getByRole('link', { name: maps });
      const href = (await link.getAttribute('href')) ?? '';
      expect(new URL(href).hostname).toBe('www.google.com');
      expect(new URL(href).pathname).toMatch(/^\/maps\//);
    });

    test('lists the published apartments, each linked to its page', async ({ page }) => {
      await page.goto(path);

      const heading = page.getByRole('heading', { name: sections[5], exact: true });
      if (published.length === 0) {
        // Nothing to list yet: the section stays out instead of showing an empty list.
        await expect(heading).toHaveCount(0);
        return;
      }
      await expect(heading).toBeVisible();
      for (const slug of published) {
        await expect(page.locator(`main a[href="/${locale}/jurere/${slug}/"]`)).toBeVisible();
      }
    });

    test('has no axe violations', async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
}
