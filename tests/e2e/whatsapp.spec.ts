import { expect, test } from './fixtures';

// A Portuguese browser keeps the language suggestion banner out of the way.
test.use({ locale: 'pt-BR' });

// docs/content/microcopy.md §2 (aria label) and §7 (generic blank message).
const fab = {
  pt: {
    name: 'Falar com a Acácia no WhatsApp',
    text: 'Olá! Vim pelo site da Acácia e quero saber dos apartamentos. Tem vaga de __/__ a __/__ para __ pessoas?',
  },
  en: {
    name: 'Chat with Acácia on WhatsApp',
    text: "Hi! I came through the Acácia website and I'd like to ask about the apartments. Are you free from __/__ to __/__ for __ guests?",
  },
  es: {
    name: 'Escribirle a Acácia por WhatsApp',
    text: '¡Hola! Vengo del sitio de Acácia y quiero consultar por los deptos. ¿Tienen lugar del __/__ al __/__ para __ personas?',
  },
};

for (const [locale, expected] of Object.entries(fab)) {
  test(`/${locale}/ fixed button opens WhatsApp with the message in ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);

    const button = page.getByRole('link', { name: expected.name });
    await expect(button).toBeVisible();
    const href = new URL((await button.getAttribute('href')) ?? '');
    expect(href.origin + href.pathname).toBe('https://wa.me/5548999442015');
    expect(href.searchParams.get('text')).toBe(expected.text);
  });
}

test.describe('at 390 px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the fixed button stays on screen and never covers the end of the page', async ({
    page,
  }) => {
    await page.goto('/pt/');
    const button = page.getByRole('link', { name: fab.pt.name });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

    await expect(button).toBeInViewport({ ratio: 1 });
    const bar = await button.evaluate((el) => el.parentElement!.getBoundingClientRect().top);
    const footer = await page
      .getByRole('contentinfo')
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(footer).toBeLessThanOrEqual(bar);
  });

  test('the bar sits on top of the cookie banner and drops back when it closes', async ({
    page,
  }) => {
    await page.goto('/pt/');
    const bar = page.getByRole('complementary', { name: 'WhatsApp' });
    const banner = page.locator('[data-consent-banner]');
    const barBottom = () => bar.evaluate((el) => el.getBoundingClientRect().bottom);

    await expect(banner).toBeVisible();
    const bannerTop = await banner.evaluate((el) => el.getBoundingClientRect().top);
    // ConsentBanner publishes offsetHeight, a whole number, so allow 1 px of rounding.
    await expect.poll(async () => Math.abs((await barBottom()) - bannerTop)).toBeLessThanOrEqual(1);

    await banner.getByRole('button', { name: 'Aceitar' }).click();

    await expect.poll(barBottom).toBe(844);
  });
});
