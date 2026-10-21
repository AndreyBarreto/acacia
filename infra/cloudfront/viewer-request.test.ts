import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// CloudFront Functions (cloudfront-js-2.0) take a plain `handler`, not a module: load it as-is.
type Request = { uri: string; querystring?: Record<string, { value: string }> };
type Response = { statusCode: number; headers: Record<string, { value: string }> };
const source = readFileSync(new URL('./viewer-request.js', import.meta.url), 'utf8');
const handler = new Function(`${source}; return handler;`)() as (event: {
  request: Request;
}) => Request | Response;

const run = (uri: string) => handler({ request: { uri, querystring: {} } });

describe('viewer-request', () => {
  it('redirects the root to /pt/ with a 301', () => {
    expect(run('/')).toEqual({
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/pt/' } },
    });
  });

  it('adds the trailing slash to page paths with a 301', () => {
    expect(run('/en/jurere')).toMatchObject({
      statusCode: 301,
      headers: { location: { value: '/en/jurere/' } },
    });
  });

  it('serves the index.html of a directory', () => {
    expect(run('/pt/jurere/apto-4/')).toMatchObject({ uri: '/pt/jurere/apto-4/index.html' });
  });

  it('leaves files untouched', () => {
    expect(run('/_astro/photo.avif')).toMatchObject({ uri: '/_astro/photo.avif' });
    expect(run('/sitemap.xml')).toMatchObject({ uri: '/sitemap.xml' });
    expect(run('/404.html')).toMatchObject({ uri: '/404.html' });
  });
});
