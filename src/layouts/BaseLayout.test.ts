// docs/plan/design-tokens.md, section 3: items 26 (layout) and 30 (reduced motion).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const layout = read('./BaseLayout.astro');
const globalCss = read('../styles/global.css');

describe('BaseLayout', () => {
  it('imports tokens, fonts and global styles once each, tokens first', () => {
    const imports = [...layout.matchAll(/import '\.\.\/styles\/([\w-]+\.css)';/g)].map(
      ([, file]) => file,
    );

    expect(imports).toEqual(['tokens.css', 'fonts.css', 'global.css']);
  });

  it('lets env(safe-area-inset-*) work with viewport-fit=cover', () => {
    expect(layout).toMatch(/<meta name="viewport"[^>]*viewport-fit=cover/);
  });

  it('places the header before and the footer after the page content', () => {
    expect(layout).toMatch(/<Header[\s\S]*<slot \/>[\s\S]*<Footer/);
  });
});

describe('global.css', () => {
  it('neutralizes animations and transitions under prefers-reduced-motion: reduce', () => {
    const block = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/.exec(globalCss);

    expect(block?.[1]).toMatch(/animation-duration:\s*0\.01ms !important/);
    expect(block?.[1]).toMatch(/transition-duration:\s*0\.01ms !important/);
    expect(block?.[1]).toMatch(/scroll-behavior:\s*auto !important/);
  });

  it('draws the focus ring from the focus tokens', () => {
    expect(globalCss).toMatch(
      /:focus-visible\s*\{[^}]*outline:\s*var\(--focus-ring-width\) solid var\(--color-focus-ring\)/,
    );
  });
});
