import { describe, expect, it } from 'vitest';
import { locales } from './i18n/locales';
import { alternates, routePath, type PageRef } from './routes';

const pages: PageRef[] = [
  { id: 'home' },
  { id: 'neighborhood' },
  { id: 'privacy' },
  { id: 'property', slug: 'apto-4' },
  { id: 'property', slug: 'apto-6' },
];

describe('routePath', () => {
  it('maps each page to its URL, with locale prefix and trailing slash', () => {
    expect(routePath({ id: 'home' }, 'pt')).toBe('/pt/');
    expect(routePath({ id: 'neighborhood' }, 'en')).toBe('/en/jurere/');
    expect(routePath({ id: 'property', slug: 'apto-4' }, 'es')).toBe('/es/jurere/apto-4/');
  });

  it('never translates slugs, privacy included', () => {
    expect(routePath({ id: 'privacy' }, 'pt')).toBe('/pt/privacidade/');
    expect(routePath({ id: 'privacy' }, 'en')).toBe('/en/privacidade/');
    expect(routePath({ id: 'privacy' }, 'es')).toBe('/es/privacidade/');
  });

  it('gives every page a distinct, lowercase URL ending in a slash per locale', () => {
    const all = pages.flatMap((page) => locales.map((locale) => routePath(page, locale)));
    expect(new Set(all).size).toBe(all.length);
    for (const url of all) {
      expect(url).toMatch(/^\/(pt|en|es)\/[a-z0-9/-]*\/$|^\/(pt|en|es)\/$/);
    }
  });
});

describe('alternates', () => {
  it('lists the equivalent URL in every locale', () => {
    expect(alternates({ id: 'property', slug: 'apto-6' })).toEqual({
      pt: '/pt/jurere/apto-6/',
      en: '/en/jurere/apto-6/',
      es: '/es/jurere/apto-6/',
    });
  });
});
