import { locales, type Locale } from './i18n/locales';

// Single route map, shared by the language switcher, hreflang and the sitemap.
// Slugs are never translated; every URL has a locale prefix and a trailing slash.
export type PageRef =
  { id: 'home' } | { id: 'neighborhood' } | { id: 'privacy' } | { id: 'property'; slug: string };

const neighborhoodSlug = 'jurere';

function segments(page: PageRef): string[] {
  switch (page.id) {
    case 'home':
      return [];
    case 'neighborhood':
      return [neighborhoodSlug];
    case 'privacy':
      return ['privacidade'];
    case 'property':
      return [neighborhoodSlug, page.slug];
  }
}

export function routePath(page: PageRef, locale: Locale): string {
  return `/${[locale, ...segments(page)].join('/')}/`;
}

export function alternates(page: PageRef): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, routePath(page, l)])) as Record<Locale, string>;
}
