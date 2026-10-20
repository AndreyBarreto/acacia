import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

// A Portuguese browser keeps the language suggestion banner out of these checks.
test.use({ locale: 'pt-BR' });

// Titles from docs/plan/keywords.md §6.1; names from content/properties/*/property.yaml.
// The H1 keeps "50 m" on one line with a no-break space, hence \s.
const homes = {
  pt: {
    title: 'Aluguel de temporada em Jurerê, a 50 m da praia',
    h1: /^50\sm da praia de Jurerê\.$/,
    properties: [
      { link: 'Ver o Apto 4', slug: 'apto-4', name: 'Apto 4' },
      { link: 'Ver o Apto 6', slug: 'apto-6', name: 'Apto 6' },
    ],
    guide: 'Guia do bairro',
  },
  en: {
    title: 'Jurerê Vacation Apartments, 50 m from the Beach',
    h1: /^50\sm from Jurerê beach\.$/,
    properties: [
      { link: 'See Apt 4', slug: 'apto-4', name: 'Apt 4' },
      { link: 'See Apt 6', slug: 'apto-6', name: 'Apt 6' },
    ],
    guide: 'Neighborhood guide',
  },
  es: {
    title: 'Alquiler de departamento en Jurerê, a 50 m de la playa',
    h1: /^50\sm de la playa de Jurerê\.$/,
    properties: [
      { link: 'Ver el Depto 4', slug: 'apto-4', name: 'Depto 4' },
      { link: 'Ver el Depto 6', slug: 'apto-6', name: 'Depto 6' },
    ],
    guide: 'Guía del barrio',
  },
};

for (const [locale, home] of Object.entries(homes)) {
  const path = `/${locale}/`;

  test.describe(`home ${path}`, () => {
    test('has the title and the H1', async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(home.title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(home.h1);
    });

    test('shows a large photo first', async ({ page }) => {
      await page.goto(path);

      const photo = page.getByRole('main').getByRole('img').first();
      await expect(photo).toBeVisible();
      await expect(photo).toHaveAttribute('fetchpriority', 'high');
      await expect(photo).not.toHaveAttribute('alt', '');
    });

    for (const property of home.properties) {
      test(`lists ${property.name} and its link opens its page`, async ({ page }) => {
        await page.goto(path);

        const main = page.getByRole('main');
        await expect(main.getByRole('heading', { level: 3, name: property.name })).toBeVisible();
        const link = main.getByRole('link', { name: property.link });
        await expect(link).toHaveAttribute('href', `${path}jurere/${property.slug}/`);

        await link.click();
        await expect(page).toHaveURL(`${path}jurere/${property.slug}/`);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(property.name);
      });
    }

    test('links to the Jurerê page from the page body', async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole('main').getByRole('link', { name: home.guide })).toHaveAttribute(
        'href',
        `${path}jurere/`,
      );
    });

    test('has no axe violations', async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });

    test('has no horizontal scroll at 320 px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}
