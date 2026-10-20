import { describe, expect, it } from 'vitest';
import { contrastRatio, parseTokens, relativeLuminance, resolveToken } from './css-tokens';

const css = `
/* Primitives */
:root {
  --color-forest-800: #1F3B2D; /* Restinga */

  --color-shell-100: #EEF1EA;
  /* --color-ignored: #000000; */
  --color-text: var(--color-forest-800);
  --color-alias: var(--color-text);
  --color-fallback: var(--color-missing, #ffffff);
  --space-4: 1rem;
}
`;

describe('parseTokens', () => {
  it('extracts custom properties from :root, ignoring comments and blank lines', () => {
    const tokens = parseTokens(css);

    expect([...tokens.keys()]).toEqual([
      '--color-forest-800',
      '--color-shell-100',
      '--color-text',
      '--color-alias',
      '--color-fallback',
      '--space-4',
    ]);
    expect(tokens.get('--color-forest-800')).toBe('#1F3B2D');
    expect(tokens.get('--space-4')).toBe('1rem');
  });

  it('ignores declarations outside :root', () => {
    const tokens = parseTokens(':root { --a: 1px; } .card { --b: 2px; }');

    expect([...tokens.keys()]).toEqual(['--a']);
  });
});

describe('resolveToken', () => {
  const tokens = parseTokens(css);

  it('resolves var() chains down to the literal value', () => {
    expect(resolveToken(tokens, '--color-text')).toBe('#1F3B2D');
    expect(resolveToken(tokens, '--color-alias')).toBe('#1F3B2D');
  });

  it('uses the fallback of var(--x, value) when --x does not exist', () => {
    expect(resolveToken(tokens, '--color-fallback')).toBe('#ffffff');
  });

  it('resolves var() nested inside a larger value', () => {
    const nested = parseTokens(':root { --a: 4px; --b: calc(var(--a) + 1px); }');

    expect(resolveToken(nested, '--b')).toBe('calc(4px + 1px)');
  });

  it('fails clearly on a missing reference', () => {
    const broken = parseTokens(':root { --a: var(--nope); }');

    expect(() => resolveToken(broken, '--a')).toThrow('Unknown token --nope (referenced by --a)');
    expect(() => resolveToken(broken, '--zzz')).toThrow('Unknown token --zzz');
  });

  it('fails clearly on a circular reference', () => {
    const circular = parseTokens(':root { --a: var(--b); --b: var(--c); --c: var(--a); }');

    expect(() => resolveToken(circular, '--a')).toThrow(
      'Circular token reference: --a -> --b -> --c -> --a',
    );
  });
});

describe('contrast', () => {
  it('computes the relative luminance of #rrggbb', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#FFFFFF')).toBe(1);
  });

  it('rejects anything that is not #rrggbb', () => {
    expect(() => relativeLuminance('red')).toThrow('Expected a #rrggbb color, got "red"');
  });

  it('matches known contrast ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2);
    // Restinga on Concha and Restinga on Acácia, from docs/brand.md (contrast.py).
    expect(contrastRatio('#1F3B2D', '#EEF1EA')).toBeCloseTo(10.69, 2);
    expect(contrastRatio('#1F3B2D', '#E8B42C')).toBeCloseTo(6.39, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#EEF1EA', '#1F3B2D')).toBe(contrastRatio('#1F3B2D', '#EEF1EA'));
  });
});
