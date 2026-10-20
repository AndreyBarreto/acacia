// sitemap.xml: every page in the 3 languages, with image:image for its photos. No hreflang here:
// the <link> in the head is the one method (plan §2.2).
import { locales } from '../i18n/locales';
import { routePath, type PageRef } from '../routes';
import { absoluteUrl } from './head';

export interface SitemapEntry {
  path: string;
  /** Root-relative image URLs. */
  images: string[];
  page?: PageRef;
}

export function sitemapPages(propertySlugs: string[]): Required<SitemapEntry>[] {
  const pages: PageRef[] = [
    { id: 'home' },
    { id: 'neighborhood' },
    ...propertySlugs.map((slug) => ({ id: 'property' as const, slug })),
    { id: 'privacy' },
  ];
  return pages.flatMap((page) =>
    locales.map((locale) => ({ page, path: routePath(page, locale), images: [] })),
  );
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function sitemapXml(siteUrl: string, entries: SitemapEntry[]): string {
  const urls = entries.map(({ path, images }) => {
    const imageTags = images.map(
      (src) =>
        `<image:image><image:loc>${escapeXml(absoluteUrl(siteUrl, src))}</image:loc></image:image>`,
    );
    return `<url><loc>${escapeXml(absoluteUrl(siteUrl, path))}</loc>${imageTags.join('')}</url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
