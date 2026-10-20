// docs/content/microcopy.md §0 (number, date formats), §7 (messages) and §8.2 (form validation).
import { describe, expect, it } from 'vitest';
import type { Locale } from './i18n/locales';
import { t } from './i18n/t';
import {
  addDays,
  formatStayDate,
  siteWhatsApp,
  validateStay,
  whatsappMessage,
  whatsappUrl,
  type MessageContext,
} from './whatsapp';

const message = (
  locale: Locale,
  context: MessageContext,
  stay?: Parameters<typeof whatsappMessage>[3],
) => whatsappMessage((key, vars) => t(locale, `whatsapp.${key}`, vars), locale, context, stay);

const text = (url: string) => decodeURIComponent(new URL(url).search.replace(/^\?text=/, ''));

const apt4 = {
  pt: { page: 'property', name: 'Apto 4', code: 'acacia-4' },
  en: { page: 'property', name: 'Apt 4', code: 'acacia-4' },
  es: { page: 'property', name: 'Depto 4', code: 'acacia-4' },
} as const;

describe('whatsappUrl', () => {
  it('turns the E.164 number into a wa.me link', () => {
    expect(whatsappUrl('+5548999442015', 'Oi')).toBe('https://wa.me/5548999442015?text=Oi');
  });

  it('uses the number it is given, so a property can override the site number', () => {
    expect(whatsappUrl('+5548988887777', 'Oi')).toBe('https://wa.me/5548988887777?text=Oi');
    expect(siteWhatsApp).toBe('+5548999442015');
  });

  it('refuses a number that is not in E.164 format', () => {
    expect(() => whatsappUrl('(48) 99944-2015', 'Oi')).toThrow(/E\.164/);
    expect(() => whatsappUrl('5548999442015', 'Oi')).toThrow(/E\.164/);
  });

  it('URL-encodes the whole message with encodeURIComponent', () => {
    const url = whatsappUrl(siteWhatsApp, '¡Hola! ¿Del 12/11 al __/__ en Acácia?');

    expect(url).toBe(
      'https://wa.me/5548999442015?text=%C2%A1Hola!%20%C2%BFDel%2012%2F11%20al%20__%2F__%20en%20Ac%C3%A1cia%3F',
    );
    expect(text(url)).toBe('¡Hola! ¿Del 12/11 al __/__ en Acácia?');
  });
});

describe('whatsappMessage (§7.3, blank version)', () => {
  it('cites the property name and identifier in the page language', () => {
    expect(message('pt', apt4.pt)).toBe(
      'Olá! Vi o Apto 4 (código acacia-4) no site da Acácia. Tem vaga de __/__ a __/__ para __ pessoas?',
    );
    expect(message('en', apt4.en)).toBe(
      'Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from __/__ to __/__ for __ guests?',
    );
    expect(message('es', apt4.es)).toBe(
      '¡Hola! Vi el Depto 4 (código acacia-4) en el sitio de Acácia. ¿Tienen lugar del __/__ al __/__ para __ personas?',
    );
  });

  it('builds the home message', () => {
    expect(message('pt', { page: 'home' })).toBe(
      'Olá! Vi o site da Acácia e quero saber dos apartamentos em Jurerê. Tem vaga de __/__ a __/__ para __ pessoas?',
    );
    expect(message('en', { page: 'home' })).toBe(
      "Hi! I saw the Acácia website and I'd like to ask about the apartments in Jurerê. Are you free from __/__ to __/__ for __ guests?",
    );
    expect(message('es', { page: 'home' })).toBe(
      '¡Hola! Vi el sitio de Acácia y quiero consultar por los deptos en Jurerê. ¿Tienen lugar del __/__ al __/__ para __ personas?',
    );
  });

  it('builds the neighborhood message', () => {
    expect(message('pt', { page: 'neighborhood' })).toBe(
      'Olá! Estava lendo o guia de Jurerê no site da Acácia e quero saber dos apartamentos. Tem vaga de __/__ a __/__ para __ pessoas?',
    );
    expect(message('en', { page: 'neighborhood' })).toBe(
      "Hi! I was reading the Jurerê guide on the Acácia website and I'd like to ask about the apartments. Are you free from __/__ to __/__ for __ guests?",
    );
    expect(message('es', { page: 'neighborhood' })).toBe(
      '¡Hola! Estaba leyendo la guía de Jurerê en el sitio de Acácia y quiero consultar por los deptos. ¿Tienen lugar del __/__ al __/__ para __ personas?',
    );
  });

  it('builds the generic message used by the fixed button', () => {
    expect(message('pt', { page: 'generic' })).toBe(
      'Olá! Vim pelo site da Acácia e quero saber dos apartamentos. Tem vaga de __/__ a __/__ para __ pessoas?',
    );
    expect(message('en', { page: 'generic' })).toBe(
      "Hi! I came through the Acácia website and I'd like to ask about the apartments. Are you free from __/__ to __/__ for __ guests?",
    );
    expect(message('es', { page: 'generic' })).toBe(
      '¡Hola! Vengo del sitio de Acácia y quiero consultar por los deptos. ¿Tienen lugar del __/__ al __/__ para __ personas?',
    );
  });

  it('refuses an empty property name or identifier', () => {
    expect(() => message('pt', { page: 'property', name: '', code: 'acacia-4' })).toThrow(/name/);
    expect(() => message('pt', { page: 'property', name: 'Apto 4', code: ' ' })).toThrow(/code/);
  });
});

describe('whatsappMessage (§7.3, filled by the mini form)', () => {
  const stay = { checkIn: '2026-11-12', checkOut: '2026-11-16', guests: 3 };

  it('fills dates in the fixed format of each language and the number of guests', () => {
    expect(message('pt', apt4.pt, stay)).toBe(
      'Olá! Vi o Apto 4 (código acacia-4) no site da Acácia. Tem vaga de 12/11/2026 a 16/11/2026 para 3 pessoas?',
    );
    expect(message('en', apt4.en, stay)).toBe(
      'Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from 12 Nov 2026 to 16 Nov 2026 for 3 guests?',
    );
    expect(message('es', apt4.es, stay)).toBe(
      '¡Hola! Vi el Depto 4 (código acacia-4) en el sitio de Acácia. ¿Tienen lugar del 12/11/2026 al 16/11/2026 para 3 personas?',
    );
  });

  it('uses the singular for 1 guest', () => {
    const one = { ...stay, guests: 1 };

    expect(message('pt', apt4.pt, one)).toMatch(/para 1 pessoa\?$/);
    expect(message('en', apt4.en, one)).toMatch(/for 1 guest\?$/);
    expect(message('es', apt4.es, one)).toMatch(/para 1 persona\?$/);
  });
});

describe('formatStayDate (§0)', () => {
  it('writes dd/mm/yyyy in pt and es, and "d Mon yyyy" in en', () => {
    expect(formatStayDate('pt', '2026-01-05')).toBe('05/01/2026');
    expect(formatStayDate('es', '2026-01-05')).toBe('05/01/2026');
    expect(formatStayDate('en', '2026-01-05')).toBe('5 Jan 2026');
    expect(formatStayDate('en', '2026-12-31')).toBe('31 Dec 2026');
  });
});

describe('addDays', () => {
  it('adds days across months and years', () => {
    expect(addDays('2026-11-12', 4)).toBe('2026-11-16');
    expect(addDays('2026-12-30', 4)).toBe('2027-01-03');
  });
});

describe('validateStay (§8.2)', () => {
  const rules = { minNights: 4, maxGuests: 3 };
  const today = '2026-10-20';
  const valid = { checkIn: '2026-11-12', checkOut: '2026-11-16', guests: '2' };
  const errors = (input: Partial<typeof valid>) =>
    validateStay({ ...valid, ...input }, rules, today).errors;

  it('accepts a valid stay and counts the nights', () => {
    expect(validateStay(valid, rules, today)).toEqual({
      errors: {},
      stay: { checkIn: '2026-11-12', checkOut: '2026-11-16', guests: 2, nights: 4 },
    });
  });

  it('accepts a check-in today', () => {
    expect(errors({ checkIn: today, checkOut: '2026-10-24' })).toEqual({});
  });

  it('requires the three fields', () => {
    expect(validateStay({ checkIn: '', checkOut: '', guests: '' }, rules, today)).toEqual({
      errors: {
        checkIn: 'checkIn.required',
        checkOut: 'checkOut.required',
        guests: 'guests.required',
      },
    });
  });

  it('rejects dates that do not exist', () => {
    expect(errors({ checkIn: '2026-02-30' })).toMatchObject({ checkIn: 'checkIn.invalid' });
    expect(errors({ checkOut: 'amanhã' })).toMatchObject({ checkOut: 'checkOut.invalid' });
  });

  it('rejects a check-in in the past', () => {
    expect(errors({ checkIn: '2026-10-19', checkOut: '2026-10-25' })).toEqual({
      checkIn: 'checkIn.past',
    });
  });

  it('rejects a check-out on or before the check-in', () => {
    expect(errors({ checkOut: '2026-11-12' })).toEqual({ checkOut: 'checkOut.beforeCheckIn' });
    expect(errors({ checkOut: '2026-11-10' })).toEqual({ checkOut: 'checkOut.beforeCheckIn' });
  });

  it('enforces the minimum of 4 nights', () => {
    expect(errors({ checkOut: '2026-11-15' })).toEqual({ checkOut: 'checkOut.minNights' });
  });

  it('only checks the check-out against a valid check-in', () => {
    expect(errors({ checkIn: '', checkOut: '2026-11-13' })).toEqual({
      checkIn: 'checkIn.required',
    });
  });

  it('accepts 1 to 3 guests only', () => {
    expect(errors({ guests: '1' })).toEqual({});
    expect(errors({ guests: '3' })).toEqual({});
    expect(errors({ guests: '0' })).toEqual({ guests: 'guests.min' });
    expect(errors({ guests: '4' })).toEqual({ guests: 'guests.max' });
    expect(errors({ guests: 'dois' })).toEqual({ guests: 'guests.required' });
  });
});
