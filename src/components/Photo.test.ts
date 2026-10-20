import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import photo from '../../assets/booking/photos/terreo/01-345300662.jpg';
import Photo from './Photo.astro';

async function render(props: Record<string, unknown>): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Photo, { props: { src: photo, ...props } });
}

describe('Photo', () => {
  it('renders AVIF and WebP sources plus a fallback img with alt, width and height', async () => {
    const html = await render({ alt: 'Sala do apto 6' });

    expect(html).toContain('type="image/avif"');
    expect(html).toContain('type="image/webp"');
    expect(html).toMatch(/<img[^>]*alt="Sala do apto 6"/);
    expect(html).toMatch(/<img[^>]*width="\d+"/);
    expect(html).toMatch(/<img[^>]*height="\d+"/);
    expect(html).toMatch(/<source[^>]*srcset="[^"]+ \d+w/);
    expect(html).toMatch(/<source[^>]*sizes="/);
  });

  it('refuses to render without alt', async () => {
    await expect(render({})).rejects.toThrow(/alt/i);
  });

  it('lazy-loads by default', async () => {
    const html = await render({ alt: 'x' });

    expect(html).toMatch(/<img[^>]*loading="lazy"/);
    expect(html).not.toContain('fetchpriority');
  });

  it('cover is eager with fetchpriority high and never lazy', async () => {
    const html = await render({ alt: 'x', cover: true });

    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
    expect(html).toMatch(/<img[^>]*loading="eager"/);
    expect(html).not.toContain('loading="lazy"');
  });
});
