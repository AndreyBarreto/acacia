// Technical SEO over the production build (E13, T32): canonical = sitemap = hreflang self,
// reciprocal alternates with x-default, Open Graph, JSON-LD, robots.txt and the 404.
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const siteUrl = 'https://acaciafloripa.com.br';
const locales = ['pt', 'en', 'es'] as const;
const hreflangOf = { pt: 'pt-BR', en: 'en', es: 'es' } as const;
const groups = ['/', '/jurere/', '/jurere/apto-4/', '/jurere/apto-6/', '/privacidade/'];
const pages = groups.flatMap((rest) => locales.map((locale) => `/${locale}${rest}`));

// Names Google lists for amenityFeature (data-model §6), always in English.
const googleAmenities = new Set([
  'wifi',
  'internetType',
  'parkingType',
  'ac',
  'heating',
  'kitchen',
  'ovenStove',
  'microwave',
  'tv',
  'ironingBoard',
  'washerDryer',
  'balcony',
  'patio',
  'outdoorGrill',
  'wheelchairAccessible',
  'elevator',
  'pool',
  'smokingAllowed',
  'petsAllowed',
  'childFriendly',
  'crib',
  'selfCheckinCheckout',
  'beachAccess',
]);

async function hreflangs(page: Page) {
  const links = page.locator('link[rel="alternate"][hreflang]');
  const entries = await links.evaluateAll((nodes) =>
    nodes.map((node) => [node.getAttribute('hreflang'), node.getAttribute('href')]),
  );
  return Object.fromEntries(entries) as Record<string, string>;
}

async function jsonLd(page: Page) {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.map((text) => JSON.parse(text) as Record<string, unknown> & { '@type': string });
}

const meta = (page: Page, attribute: 'name' | 'property', key: string) =>
  page.locator(`meta[${attribute}="${key}"]`).getAttribute('content');

test.describe('head of every page', () => {
  for (const path of pages) {
    const locale = path.split('/')[1] as (typeof locales)[number];
    const rest = path.slice(locale.length + 1);

    test(`${path}: canonical, hreflang, description and Open Graph`, async ({ page, request }) => {
      await page.goto(path);
      const canonical = `${siteUrl}${path}`;

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      expect(await hreflangs(page)).toEqual({
        'pt-BR': `${siteUrl}/pt${rest}`,
        en: `${siteUrl}/en${rest}`,
        es: `${siteUrl}/es${rest}`,
        'x-default': `${siteUrl}/pt${rest}`,
      });
      expect((await hreflangs(page))[hreflangOf[locale]]).toBe(canonical);

      const description = await meta(page, 'name', 'description');
      expect(description?.length).toBeGreaterThanOrEqual(70);
      expect(description?.length).toBeLessThanOrEqual(155);

      expect(await meta(page, 'property', 'og:title')).toBe(await page.title());
      expect(await meta(page, 'property', 'og:description')).toBe(description);
      expect(await meta(page, 'property', 'og:url')).toBe(canonical);
      expect(await meta(page, 'property', 'og:type')).toBe('website');
      expect(await meta(page, 'property', 'og:site_name')).toBe('Acácia');
      expect(await meta(page, 'property', 'og:locale')).toBe(
        { pt: 'pt_BR', en: 'en_US', es: 'es_AR' }[locale],
      );
      expect(await meta(page, 'name', 'twitter:card')).toBe('summary_large_image');

      const image = await meta(page, 'property', 'og:image');
      expect(image).toMatch(new RegExp(`^${siteUrl}/_astro/.+\\.jpe?g$`));
      expect(await meta(page, 'property', 'og:image:width')).toBe('1200');
      expect(await meta(page, 'property', 'og:image:height')).toBe('630');
      const file = await request.get(image!.slice(siteUrl.length));
      expect(file.ok()).toBe(true);
      expect((await file.body()).byteLength).toBeLessThan(300 * 1024);
    });
  }

  test('titles and descriptions are unique across the pages', async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string | null>();
    for (const path of pages) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add(await meta(page, 'name', 'description'));
    }
    expect(titles.size).toBe(pages.length);
    expect(descriptions.size).toBe(pages.length);
  });

  test('alternates are reciprocal and the OG image is the same in the 3 languages', async ({
    page,
  }) => {
    for (const rest of groups) {
      const seen: { links: Record<string, string>; image: string | null }[] = [];
      for (const locale of locales) {
        await page.goto(`/${locale}${rest}`);
        seen.push({
          links: await hreflangs(page),
          image: await meta(page, 'property', 'og:image'),
        });
      }
      expect(seen[1]).toEqual(seen[0]);
      expect(seen[2]).toEqual(seen[0]);
    }
  });
});

test.describe('sitemap and robots', () => {
  test('the sitemap lists exactly the canonicals, apartment pages with their photos', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const urls = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g)];

    expect(urls.map(([, loc]) => loc).sort()).toEqual(pages.map((p) => `${siteUrl}${p}`).sort());
    for (const [, loc, rest] of urls) {
      const images = [...rest.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(([, src]) => src);
      if (loc.includes('/apto-')) {
        expect(images.length, loc).toBeGreaterThanOrEqual(8);
        for (const src of images) expect(src.startsWith(`${siteUrl}/_astro/`)).toBe(true);
        const first = await request.get(images[0].slice(siteUrl.length));
        expect(first.ok()).toBe(true);
      } else {
        expect(images, loc).toEqual([]);
      }
    }
  });

  test('robots.txt allows everything and points to the sitemap', async ({ request }) => {
    const text = await (await request.get('/robots.txt')).text();
    expect(text).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  });
});

test.describe('JSON-LD', () => {
  test('home has the Organization', async ({ page }) => {
    await page.goto('/pt/');
    const types = (await jsonLd(page)).map((data) => data['@type']);
    expect(types).toEqual(['Organization']);
  });

  test('neighborhood has the BreadcrumbList and the TouristDestination', async ({ page }) => {
    await page.goto('/es/jurere/');
    const [breadcrumb, destination] = await jsonLd(page);
    expect(breadcrumb).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'Inicio', item: `${siteUrl}/es/` },
        { position: 2, name: 'Jurerê' },
      ],
    });
    expect(destination).toMatchObject({
      '@type': 'TouristDestination',
      url: `${siteUrl}/es/jurere/`,
      geo: { latitude: expect.stringMatching(/^-?\d+\.\d{5}$/) },
    });
  });

  for (const slug of ['apto-4', 'apto-6']) {
    test(`${slug} has the BreadcrumbList and a complete VacationRental`, async ({
      page,
      request,
    }) => {
      await page.goto(`/en/jurere/${slug}/`);
      const [breadcrumb, rental] = await jsonLd(page);

      expect(breadcrumb).toMatchObject({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { position: 1, name: 'Home', item: `${siteUrl}/en/` },
          { position: 2, name: 'Jurerê', item: `${siteUrl}/en/jurere/` },
          { position: 3, name: slug === 'apto-4' ? 'Apt 4' : 'Apt 6' },
        ],
      });

      expect(rental).toMatchObject({
        '@type': 'VacationRental',
        identifier: slug === 'apto-4' ? 'acacia-4' : 'acacia-6',
        name: slug === 'apto-4' ? 'Apt 4' : 'Apt 6',
        latitude: expect.stringMatching(/^-?\d+\.\d{5}$/),
        longitude: expect.stringMatching(/^-?\d+\.\d{5}$/),
        containsPlace: {
          '@type': 'Accommodation',
          occupancy: { value: 3 },
          numberOfBedrooms: 1,
          numberOfBathroomsTotal: 1,
        },
      });
      const place = rental.containsPlace as {
        bed: unknown[];
        amenityFeature: { name: string }[];
      };
      expect(place.bed.length).toBeGreaterThan(0);
      expect(place.amenityFeature.length).toBeGreaterThan(0);
      for (const { name } of place.amenityFeature) expect(googleAmenities).toContain(name);
      expect(rental).not.toHaveProperty('aggregateRating');
      expect(rental).not.toHaveProperty('review');

      const images = rental.image as string[];
      expect(images.length).toBeGreaterThanOrEqual(8);
      for (const src of images) expect(src.startsWith(`${siteUrl}/_astro/`)).toBe(true);
      expect((await request.get(images[0].slice(siteUrl.length))).ok()).toBe(true);
    });
  }
});

test.describe('404', () => {
  const headings = {
    pt: 'Não achamos essa página',
    en: "We couldn't find that page",
    es: 'No encontramos esa página',
  };

  for (const locale of locales) {
    test(`an unknown /${locale}/ URL answers 404 in ${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}/nao-existe/`);
      expect(response?.status()).toBe(404);
      for (const other of locales) {
        const heading = page.getByRole('heading', { level: 1, name: headings[other] });
        await (other === locale ? expect(heading).toBeVisible() : expect(heading).toBeHidden());
      }
      await expect(page.locator('html')).toHaveAttribute('lang', hreflangOf[locale]);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    });
  }

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('shows the pt text', async ({ page }) => {
      await page.goto('/es/nao-existe/');
      await expect(page.getByRole('heading', { level: 1, name: headings.pt })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: headings.es })).toBeHidden();
    });
  });
});
