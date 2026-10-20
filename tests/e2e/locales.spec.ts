import { expect, test } from './fixtures';

const pages = [
  { path: '/pt/', lang: 'pt-BR' },
  { path: '/en/', lang: 'en' },
  { path: '/es/', lang: 'es' },
];

for (const { path, lang } of pages) {
  test(`${path} responds with html lang "${lang}"`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
  });
}
