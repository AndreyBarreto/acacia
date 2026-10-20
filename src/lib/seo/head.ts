// Head metadata helpers: absolute URLs, hreflang alternates and the Open Graph locale.
import { defaultLocale, htmlLang, locales, type Locale } from '../i18n/locales';
import { alternates, type PageRef } from '../routes';

export function absoluteUrl(siteUrl: string, path: string): string {
  if (!path.startsWith('/')) throw new Error(`Path "${path}" must start with /`);
  return `${siteUrl}${path}`;
}

/** Each page lists itself, the other 2 versions and x-default (= pt), all absolute. */
export function hreflangLinks(siteUrl: string, page: PageRef) {
  const paths = alternates(page);
  return [
    ...locales.map((locale) => ({
      hreflang: htmlLang(locale),
      href: absoluteUrl(siteUrl, paths[locale]),
    })),
    { hreflang: 'x-default', href: absoluteUrl(siteUrl, paths[defaultLocale]) },
  ];
}

const ogLocales: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US', es: 'es_AR' };

export function ogLocale(locale: Locale): string {
  return ogLocales[locale];
}
