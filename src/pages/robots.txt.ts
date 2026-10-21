import type { APIRoute } from 'astro';
import { loadContent } from '../lib/content/load';

export const GET: APIRoute = async () => {
  const { site } = await loadContent();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
