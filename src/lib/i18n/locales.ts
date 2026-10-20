export const locales = ['pt', 'en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

const htmlLangByLocale: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

export function htmlLang(locale: Locale): string {
  return htmlLangByLocale[locale];
}
