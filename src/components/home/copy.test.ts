import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/i18n/t';
import { locales } from '../../lib/i18n/locales';

// The home copy (src/i18n/{pt,en,es}/home.json) and the brand rules from docs/brand.md §7–8.
const forbidden = [
  'beira-mar',
  'frente al mar',
  'frente para o mar',
  'beachfront',
  'pé na areia',
  'paraíso',
  'paraiso',
  'paradise',
  'inesquecível',
  'inolvidable',
  'unforgettable',
  'exclusiv',
  'luxo',
  'lujo',
  'luxury',
  'refúgio',
  'refugio',
  'experiência',
  'experiencia',
  'experience',
  'internacional',
  'mbps',
  'lajota',
  'adoquin',
  'adoquín',
  'paved lane',
];

describe('home copy', () => {
  it('exists with the same keys in pt, en and es', () => {
    const keys = (locale: (typeof locales)[number]) => Object.keys(catalog[locale].home ?? {});
    expect(keys('pt').length).toBeGreaterThan(0);
    for (const locale of locales) {
      expect(keys(locale).sort(), locale).toEqual(keys('pt').sort());
    }
  });

  it('uses the titles from docs/plan/keywords.md §6.1', () => {
    expect(catalog.pt.home['seo.title']).toBe('Aluguel de temporada em Jurerê, a 50 m da praia');
    expect(catalog.en.home['seo.title']).toBe('Jurerê Vacation Apartments, 50 m from the Beach');
    expect(catalog.es.home['seo.title']).toBe(
      'Alquiler de departamento en Jurerê, a 50 m de la playa',
    );
  });

  it('never uses a forbidden brand term', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(catalog[locale].home ?? {})) {
        for (const term of forbidden) {
          expect(value.toLowerCase(), `${locale} home.${key}`).not.toContain(term);
        }
      }
    }
  });
});
