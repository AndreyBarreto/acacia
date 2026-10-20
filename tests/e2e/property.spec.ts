import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

// A Portuguese browser keeps the language suggestion banner out of these checks.
test.use({ locale: 'pt-BR' });

// Texts from content/properties/apto-4/property.yaml and docs/content/microcopy.md §3, §7, §8.
const pages = {
  pt: {
    name: 'Apto 4',
    subtitle: 'Com varanda e vista para o mar',
    capacity: 'Até 3 pessoas',
    rules: [
      'a partir das 14h',
      'até as 11h',
      '4 noites, o ano todo',
      'Aqui não se fuma, em nenhum cômodo.',
      'Pagamento e cancelamento: combinamos pelo WhatsApp, antes de confirmar a reserva.',
    ],
    breadcrumb: { aria: 'Você está aqui', home: 'Início' },
    other: { label: 'O outro apartamento', name: 'Apto 6' },
    fab: 'Perguntar sobre o Apto 4 no WhatsApp',
    form: {
      checkIn: 'Entrada',
      checkOut: 'Saída',
      guests: 'Pessoas',
      submit: 'Enviar pelo WhatsApp',
    },
    guests: '2 pessoas',
    minNightsError: (earliest: string) =>
      `A estadia mínima é de 4 noites. A primeira saída possível é ${earliest}.`,
    message: (from: string, to: string) =>
      `Olá! Vi o Apto 4 (código acacia-4) no site da Acácia. Tem vaga de ${from} a ${to} para 2 pessoas?`,
  },
  en: {
    name: 'Apt 4',
    subtitle: 'With a sea-view balcony',
    capacity: 'Up to 3 guests',
    rules: [
      'from 2 pm',
      'by 11 am',
      '4 nights, all year',
      'No smoking anywhere in the apartment.',
      'Payment and cancellation are agreed on WhatsApp before we confirm your stay.',
    ],
    breadcrumb: { aria: 'You are here', home: 'Home' },
    other: { label: 'The other apartment', name: 'Apt 6' },
    fab: 'Ask about Apt 4 on WhatsApp',
    form: {
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      submit: 'Send on WhatsApp',
    },
    guests: '2 guests',
    minNightsError: (earliest: string) =>
      `The minimum stay is 4 nights. The earliest check-out is ${earliest}.`,
    message: (from: string, to: string) =>
      `Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from ${from} to ${to} for 2 guests?`,
  },
  es: {
    name: 'Depto 4',
    subtitle: 'Con balcón y vista al mar',
    capacity: 'Hasta 3 personas',
    rules: [
      'desde las 14 h',
      'hasta las 11 h',
      '4 noches, todo el año',
      'No se puede fumar en ningún ambiente.',
      'Pago y cancelación: lo arreglamos por WhatsApp antes de confirmar la reserva.',
    ],
    breadcrumb: { aria: 'Estás acá', home: 'Inicio' },
    other: { label: 'El otro depto', name: 'Depto 6' },
    fab: 'Consultar por el Depto 4 en WhatsApp',
    form: {
      checkIn: 'Entrada',
      checkOut: 'Salida',
      guests: 'Personas',
      submit: 'Enviar por WhatsApp',
    },
    guests: '2 personas',
    minNightsError: (earliest: string) =>
      `La estadía mínima es de 4 noches. La primera salida posible es el ${earliest}.`,
    message: (from: string, to: string) =>
      `¡Hola! Vi el Depto 4 (código acacia-4) en el sitio de Acácia. ¿Tienen lugar del ${from} al ${to} para 2 personas?`,
  },
};

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

/** Today + days, as the YYYY-MM-DD a date input takes and as the message shows it. */
function day(locale: string, days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    iso: `${y}-${pad(m)}-${pad(d)}`,
    shown: locale === 'en' ? `${d} ${months[m - 1]} ${y}` : `${pad(d)}/${pad(m)}/${y}`,
  };
}

for (const [locale, expected] of Object.entries(pages)) {
  const path = `/${locale}/jurere/apto-4/`;

  test.describe(path, () => {
    test('shows the name, type, capacity and rules', async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected.name);
      await expect(page.getByText(expected.subtitle, { exact: true })).toBeVisible();
      await expect(page.getByText(expected.capacity, { exact: true }).first()).toBeVisible();
      for (const rule of expected.rules) {
        await expect(page.getByText(rule, { exact: true })).toBeVisible();
      }
    });

    test('has a breadcrumb back to the home and the neighborhood', async ({ page }) => {
      await page.goto(path);

      const crumbs = page.getByRole('navigation', { name: expected.breadcrumb.aria });
      await expect(crumbs.getByRole('link', { name: expected.breadcrumb.home })).toHaveAttribute(
        'href',
        `/${locale}/`,
      );
      await expect(crumbs.getByRole('link', { name: 'Jurerê' })).toHaveAttribute(
        'href',
        `/${locale}/jurere/`,
      );
      await expect(crumbs.getByText(expected.name)).toHaveAttribute('aria-current', 'page');
    });

    test('links to the other apartment', async ({ page }) => {
      await page.goto(path);

      const other = page.getByRole('link', { name: new RegExp(expected.other.name) });
      await expect(page.getByText(expected.other.label)).toBeVisible();
      await expect(other).toHaveAttribute('href', `/${locale}/jurere/apto-6/`);
      await other.click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected.other.name);
    });

    test('the fixed button asks about this apartment', async ({ page }) => {
      await page.goto(path);

      const href = await page.getByRole('link', { name: expected.fab }).getAttribute('href');
      expect(new URL(href ?? '').searchParams.get('text')).toContain('acacia-4');
    });

    test('the mini form refuses a short stay and opens WhatsApp with the dates', async ({
      page,
    }) => {
      await page.route('https://wa.me/**', (route) => route.fulfill({ body: 'WhatsApp' }));
      await page.goto(path);
      const checkIn = day(locale, 30);
      const tooSoon = day(locale, 32);
      const earliest = day(locale, 34);

      await page.getByLabel(expected.form.checkIn, { exact: true }).fill(checkIn.iso);
      await page.getByLabel(expected.form.checkOut, { exact: true }).fill(tooSoon.iso);
      await page.getByLabel(expected.form.guests, { exact: true }).selectOption(expected.guests);
      await page.getByRole('button', { name: expected.form.submit }).click();

      await expect(page.getByText(expected.minNightsError(earliest.shown))).toBeVisible();
      await expect(page.getByLabel(expected.form.checkOut, { exact: true })).toBeFocused();

      await page.getByLabel(expected.form.checkOut, { exact: true }).fill(earliest.iso);
      await page.getByRole('button', { name: expected.form.submit }).click();

      await page.waitForURL(/^https:\/\/wa\.me\//);
      const url = new URL(page.url());
      expect(url.origin + url.pathname).toBe('https://wa.me/5548999442015');
      expect(url.searchParams.get('text')).toBe(expected.message(checkIn.shown, earliest.shown));
    });
  });
}

for (const locale of Object.keys(pages)) {
  for (const slug of ['apto-4', 'apto-6']) {
    const path = `/${locale}/jurere/${slug}/`;

    test(`${path} has no axe violations`, async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
}

test('/pt/jurere/apto-6/ shows the ground-floor apartment and links back to Apto 4', async ({
  page,
}) => {
  await page.goto('/pt/jurere/apto-6/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Apto 6');
  await expect(page.getByText('Térreo, sem escada', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Apto 4/ })).toHaveAttribute(
    'href',
    '/pt/jurere/apto-4/',
  );
});
