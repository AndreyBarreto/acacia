// WhatsAppFab, WhatsAppCta and WhatsAppForm (docs/content/microcopy.md §2, §7, §8;
// docs/plan/design-tokens.md item 27).
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WhatsAppCta from './WhatsAppCta.astro';
import WhatsAppFab from './WhatsAppFab.astro';
import WhatsAppForm from './WhatsAppForm.astro';

type Component = Parameters<AstroContainer['renderToString']>[0];

async function render(component: Component, props: Record<string, unknown>): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(component, { props });
}

const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map(([, href]) => href);
const decoded = (href: string) =>
  decodeURIComponent(href.replaceAll('&amp;', '&').replace(/^[^?]+\?text=/, ''));

describe('WhatsAppFab', () => {
  it('links to the site number with the generic blank message of each language', async () => {
    const expected = {
      pt: 'Olá! Vim pelo site da Acácia e quero saber dos apartamentos. Tem vaga de __/__ a __/__ para __ pessoas?',
      en: "Hi! I came through the Acácia website and I'd like to ask about the apartments. Are you free from __/__ to __/__ for __ guests?",
      es: '¡Hola! Vengo del sitio de Acácia y quiero consultar por los deptos. ¿Tienen lugar del __/__ al __/__ para __ personas?',
    };
    for (const [locale, message] of Object.entries(expected)) {
      const [href] = hrefs(await render(WhatsAppFab, { locale }));

      expect(href).toMatch(/^https:\/\/wa\.me\/5548999442015\?text=/);
      expect(decoded(href)).toBe(message);
    }
  });

  it('shows "WhatsApp" and names the link for screen readers', async () => {
    const html = await render(WhatsAppFab, { locale: 'es' });

    expect(html).toMatch(/<a[^>]*aria-label="Escribirle a Acácia por WhatsApp"/);
    expect(html).toMatch(/>WhatsApp<\/span>/);
  });

  it('positions itself with the layer, safe-area and cookie banner tokens', () => {
    const source = readFileSync(new URL('./WhatsAppFab.astro', import.meta.url), 'utf8');

    expect(source).toMatch(/position:\s*fixed/);
    expect(source).toMatch(/z-index:\s*var\(--z-whatsapp-fab\)/);
    expect(source).toContain('var(--safe-bottom)');
    expect(source).toContain('var(--safe-right)');
    expect(source).toContain('var(--cookie-banner-offset)');
  });
});

describe('WhatsAppCta', () => {
  it('cites the property name and code in the page language', async () => {
    const html = await render(WhatsAppCta, { locale: 'en', name: 'Apt 4', code: 'acacia-4' });
    const [href] = hrefs(html);

    expect(href).toMatch(/^https:\/\/wa\.me\/5548999442015\?text=/);
    expect(decoded(href)).toBe(
      'Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from __/__ to __/__ for __ guests?',
    );
    expect(html).toContain('Check my dates on WhatsApp');
  });

  it('uses the property number when it overrides the site number', async () => {
    const html = await render(WhatsAppCta, {
      locale: 'pt',
      name: 'Apto 6',
      code: 'acacia-6',
      phone: '+5548988887777',
    });

    expect(hrefs(html)[0]).toMatch(/^https:\/\/wa\.me\/5548988887777\?text=/);
  });
});

describe('WhatsAppForm', () => {
  const props = { locale: 'pt', name: 'Apto 4', code: 'acacia-4', minNights: 4, maxGuests: 3 };

  it('has labelled date fields and a guests select from 1 to maxGuests', async () => {
    const html = await render(WhatsAppForm, props);

    expect(html).toMatch(/<label[^>]*for="acacia-4-checkIn"[^>]*>Entrada</);
    expect(html).toMatch(/<input[^>]*type="date"[^>]*id="acacia-4-checkIn"/);
    expect(html).toMatch(/<label[^>]*for="acacia-4-checkOut"[^>]*>Saída</);
    expect(html).toMatch(/<input[^>]*type="date"[^>]*id="acacia-4-checkOut"/);
    expect(html).toMatch(/<label[^>]*for="acacia-4-guests"[^>]*>Pessoas</);
    const options = [...html.matchAll(/<option value="(\d*)"[^>]*>([^<]+)</g)].map(
      ([, value, label]) => [value, label],
    );
    expect(options).toEqual([
      ['', 'Escolha'],
      ['1', '1 pessoa'],
      ['2', '2 pessoas'],
      ['3', '3 pessoas'],
    ]);
    expect(html).toContain('Estadia mínima: 4 noites.');
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*>Enviar pelo WhatsApp</);
  });

  it('validates in the browser and never posts to a server', async () => {
    const html = await render(WhatsAppForm, props);
    const form = /<form[^>]*>/.exec(html)?.[0] ?? '';

    expect(form).toContain('novalidate');
    expect(form).not.toContain('action=');
    expect(form).not.toMatch(/method="post"/i);
  });

  it('hands the script the rules, the number and the strings of the page language', async () => {
    const html = await render(WhatsAppForm, { ...props, locale: 'es', name: 'Depto 4' });
    const form = /<form[^>]*>/.exec(html)?.[0] ?? '';
    const strings = JSON.parse(
      (/data-strings="([^"]+)"/.exec(form)?.[1] ?? '{}').replaceAll('&quot;', '"'),
    );

    expect(form).toContain('data-phone="+5548999442015"');
    expect(form).toContain('data-min-nights="4"');
    expect(form).toContain('data-max-guests="3"');
    expect(form).toContain('data-name="Depto 4"');
    expect(form).toContain('data-code="acacia-4"');
    expect(strings['intro.property']).toBe(
      '¡Hola! Vi el {name} (código {code}) en el sitio de Acácia.',
    );
    expect(strings['form.errors.checkOut.minNights']).toMatch(/^La estadía mínima/);
  });

  it('has one hidden error message per field, styled with the error color', async () => {
    const html = await render(WhatsAppForm, props);
    const source = readFileSync(new URL('./WhatsAppForm.astro', import.meta.url), 'utf8');

    for (const field of ['checkIn', 'checkOut', 'guests']) {
      expect(html).toMatch(new RegExp(`<p[^>]*id="acacia-4-${field}-error"[^>]*hidden`));
    }
    expect(source).toMatch(/color:\s*var\(--color-danger\)/);
  });
});
