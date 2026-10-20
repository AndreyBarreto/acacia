import { describe, expect, it } from 'vitest';
import { defaultLocale, htmlLang, locales } from './locales';

describe('locales', () => {
  it('supports pt, en and es, with pt as the default', () => {
    expect(locales).toEqual(['pt', 'en', 'es']);
    expect(defaultLocale).toBe('pt');
  });

  it('maps each locale to its html lang attribute', () => {
    expect(htmlLang('pt')).toBe('pt-BR');
    expect(htmlLang('en')).toBe('en');
    expect(htmlLang('es')).toBe('es');
  });
});
