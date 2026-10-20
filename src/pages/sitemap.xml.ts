import type { APIRoute } from 'astro';
import { loadContent } from '../lib/content/load';
import { photoUrls } from '../lib/seo/images';
import { sitemapPages, sitemapXml } from '../lib/seo/sitemap';

export const GET: APIRoute = async () => {
  const { site, buildings, properties } = await loadContent();
  const entries = await Promise.all(
    sitemapPages(properties.map((p) => p.id)).map(async (entry) => {
      if (entry.page.id !== 'property') return entry;
      const { slug } = entry.page;
      const property = properties.find((p) => p.id === slug)!.data;
      const building = buildings.find((b) => b.id === property.building?.id)?.data;
      return { ...entry, images: await photoUrls(property, building) };
    }),
  );
  return new Response(sitemapXml(site.siteUrl, entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
