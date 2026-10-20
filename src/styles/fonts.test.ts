// Fonts are self-hosted woff2 files, never loaded from a CDN (CLAUDE.md, T05/T20).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = new URL('../..', import.meta.url).pathname;
const css = readFileSync(join(ROOT, 'src/styles/fonts.css'), 'utf8');
const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => body);

describe('fonts.css', () => {
  it('declares Young Serif 400 and Hanken Grotesk 400 to 600', () => {
    const declared = faces.map((face) => [
      /font-family:\s*['"]([^'"]+)['"]/.exec(face)?.[1],
      /font-weight:\s*([^;]+);/.exec(face)?.[1].trim(),
    ]);

    expect(declared).toEqual([
      ['Young Serif', '400'],
      ['Hanken Grotesk', '400 600'],
    ]);
  });

  it.each(faces.map((face, i) => [i, face]))(
    '@font-face %i loads a local woff2 file',
    (_, face) => {
      const sources = [...face.matchAll(/url\(([^)]+)\)/g)].map(([, url]) =>
        url.replace(/['"]/g, ''),
      );

      expect(face).toMatch(/font-display:\s*swap;/);
      expect(sources.length).toBe(1);
      expect(sources[0]).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(existsSync(join(ROOT, 'public', sources[0])), sources[0]).toBe(true);
    },
  );

  it('never references a font CDN', () => {
    expect(css).not.toMatch(/fonts\.(googleapis|gstatic)\.com|https?:/);
  });

  it.each(['OFL-young-serif.txt', 'OFL-hanken-grotesk.txt'])('ships the license %s', (file) => {
    const license = readFileSync(join(ROOT, 'public/fonts', file), 'utf8');

    expect(license).toContain('SIL Open Font License, Version 1.1');
  });
});
