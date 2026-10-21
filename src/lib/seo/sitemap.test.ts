import { describe, expect, it } from 'vitest';
import { sitemapPages, sitemapXml } from './sitemap';

const siteUrl = 'https://acacia.deyzito.com';

describe('sitemapPages', () => {
  it('lists home, neighborhood, privacy and every property, each in the 3 languages', () => {
    const pages = sitemapPages(['apto-4', 'apto-6']);

    expect(pages).toHaveLength(15);
    expect(pages.map((p) => p.path)).toContain('/es/jurere/apto-6/');
    expect(pages.map((p) => p.path)).toContain('/en/privacidade/');
    expect(new Set(pages.map((p) => p.path)).size).toBe(15);
  });
});

describe('sitemapXml', () => {
  const xml = sitemapXml(siteUrl, [
    { path: '/pt/', images: [] },
    {
      path: '/pt/jurere/apto-4/',
      images: ['/_astro/a.jpg', '/_astro/b&c.jpg'],
    },
  ]);

  it('is a urlset with the image namespace and absolute locs', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml).toContain('<loc>https://acacia.deyzito.com/pt/</loc>');
    expect(xml).toContain('<loc>https://acacia.deyzito.com/pt/jurere/apto-4/</loc>');
  });

  it('adds one image:image per photo, absolute and XML-escaped', () => {
    expect(xml).toContain(
      '<image:image><image:loc>https://acacia.deyzito.com/_astro/a.jpg</image:loc></image:image>',
    );
    expect(xml).toContain('https://acacia.deyzito.com/_astro/b&amp;c.jpg');
    expect(xml.match(/<image:image>/g)).toHaveLength(2);
  });

  it('has no hreflang (the <link> in the head is the one method, plan §2.2)', () => {
    expect(xml).not.toContain('xhtml:link');
  });
});
