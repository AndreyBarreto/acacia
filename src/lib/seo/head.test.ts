import { describe, expect, it } from 'vitest';
import { absoluteUrl, hreflangLinks, ogLocale } from './head';

const siteUrl = 'https://acacia.deyzito.com';

describe('absoluteUrl', () => {
  it('joins the site URL and a root-relative path', () => {
    expect(absoluteUrl(siteUrl, '/pt/jurere/')).toBe('https://acacia.deyzito.com/pt/jurere/');
  });

  it('rejects a path without the leading slash', () => {
    expect(() => absoluteUrl(siteUrl, 'pt/')).toThrow(/must start with \//);
  });
});

describe('hreflangLinks', () => {
  it('lists pt-BR, en, es and x-default (= pt), absolute and with the trailing slash', () => {
    expect(hreflangLinks(siteUrl, { id: 'property', slug: 'apto-4' })).toEqual([
      { hreflang: 'pt-BR', href: 'https://acacia.deyzito.com/pt/jurere/apto-4/' },
      { hreflang: 'en', href: 'https://acacia.deyzito.com/en/jurere/apto-4/' },
      { hreflang: 'es', href: 'https://acacia.deyzito.com/es/jurere/apto-4/' },
      { hreflang: 'x-default', href: 'https://acacia.deyzito.com/pt/jurere/apto-4/' },
    ]);
  });
});

describe('ogLocale', () => {
  it('uses the language_TERRITORY form', () => {
    expect(ogLocale('pt')).toBe('pt_BR');
    expect(ogLocale('en')).toBe('en_US');
    expect(ogLocale('es')).toBe('es_AR');
  });
});
