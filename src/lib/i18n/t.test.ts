import { describe, expect, it } from 'vitest';
import { locales } from './locales';
import { catalog, t } from './t';

describe('t', () => {
  it('reads a string from the namespace file of the locale', () => {
    expect(t('pt', 'common.lang.label')).toBe('Idioma');
    expect(t('en', 'common.lang.label')).toBe('Language');
  });

  it('replaces {placeholders}', () => {
    expect(t('en', 'common.lang.switchTo.aria', { language: 'Español' })).toBe(
      'View this page in Español',
    );
  });

  it('throws on a missing key or unknown namespace', () => {
    expect(() => t('pt', 'common.nope')).toThrow(/nope/);
    expect(() => t('pt', 'missing.key')).toThrow(/missing/);
  });

  it('throws when a placeholder value is not given', () => {
    expect(() => t('pt', 'common.lang.switchTo.aria')).toThrow(/language/);
  });
});

describe('catalog', () => {
  it('has the same namespaces and keys in every locale', () => {
    const [first, ...rest] = locales;
    for (const locale of rest) {
      expect(Object.keys(catalog[locale]).sort()).toEqual(Object.keys(catalog[first]).sort());
      for (const ns of Object.keys(catalog[first])) {
        expect(Object.keys(catalog[locale][ns]).sort(), `${locale}/${ns}`).toEqual(
          Object.keys(catalog[first][ns]).sort(),
        );
      }
    }
  });

  it('uses the same placeholders in every locale and has no empty strings', () => {
    const holders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const ns of Object.keys(catalog.pt)) {
      for (const [key, pt] of Object.entries(catalog.pt[ns])) {
        for (const locale of locales) {
          const value = catalog[locale][ns][key];
          expect(value.trim(), `${locale}/${ns}/${key}`).not.toBe('');
          expect(holders(value), `${locale}/${ns}/${key}`).toEqual(holders(pt));
        }
      }
    }
  });
});
