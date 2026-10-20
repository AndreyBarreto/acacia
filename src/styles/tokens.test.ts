// Tests for src/styles/tokens.css (docs/plan/design-tokens.md, section 3, items 5 to 25).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, parseTokens, resolveToken } from '../../tests/support/css-tokens';

const STYLES_DIR = new URL('.', import.meta.url).pathname;
const SRC_DIR = join(STYLES_DIR, '..');
const tokens = parseTokens(readFileSync(join(STYLES_DIR, 'tokens.css'), 'utf8'));
const names = [...tokens.keys()];
const value = (name: string) => resolveToken(tokens, name);

// Every .css/.astro file in src/ except tokens.css: components must only use semantic tokens.
const sources = readdirSync(SRC_DIR, { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(css|astro)$/.test(file) && !file.endsWith('tokens.css'))
  .map((file) => ({ file, text: readFileSync(join(SRC_DIR, file), 'utf8') }));

function offending(pattern: RegExp) {
  return sources.flatMap(({ file, text }) =>
    [...text.matchAll(pattern)].map((match) => `${file}: ${match[0]}`),
  );
}

function rem(literal: string): number {
  const match = /^(-?[\d.]+)rem$/.exec(literal.trim());
  if (!match) throw new Error(`Expected a rem value, got "${literal}"`);
  return Number(match[1]);
}

const CATEGORIES = [
  'color',
  'font',
  'text',
  'leading',
  'tracking',
  'measure',
  'space',
  'gutter',
  'container',
  'radius',
  'border',
  'shadow',
  'bp',
  'z',
  'safe',
  'fab',
  'tap',
  'focus',
  'duration',
  'ease',
  'cookie',
];
const HUES = ['shell', 'sea', 'leaf', 'forest', 'acacia', 'rust'];
const colorNames = names.filter((name) => name.startsWith('--color-'));
const primitiveColors = colorNames.filter((name) =>
  new RegExp(`^--color-(${HUES.join('|')})-\\d{3}$`).test(name),
);
const semanticColors = colorNames.filter((name) => !primitiveColors.includes(name));

// [foreground, background, minimum ratio]: 4.5 for text, 3 for UI components and focus rings.
const TEXT_PAIRS: [string, string, number][] = [
  ['text', 'surface', 4.5],
  ['text-muted', 'surface', 4.5],
  ['text', 'surface-tint', 4.5],
  ['text-muted', 'surface-tint', 4.5],
  ['text-inverse', 'surface-inverse', 4.5],
  ['text-inverse-muted', 'surface-inverse', 4.5],
  ['cta-text', 'cta-bg', 4.5],
  ['focus-ring-inverse', 'surface-inverse', 3],
  ['cta-text', 'cta-bg-hover', 4.5],
  ['focus-ring', 'surface', 3],
  ['border-strong', 'surface', 3],
  ['link', 'surface', 4.5],
  ['link-hover', 'surface', 4.5],
  ['danger', 'surface', 4.5],
  ['danger', 'surface-tint', 4.5],
];

// Pairs that must never be used: tested as failures on purpose.
const FORBIDDEN_PAIRS: [string, string][] = [
  ['accent', 'surface'],
  ['accent', 'surface-tint'],
  ['text-muted', 'surface-inverse'],
  ['text-muted', 'cta-bg'],
];

const DECORATIVE_ONLY = ['accent', 'border'];

// Ratios documented in docs/brand.md (identity A) and CLAUDE.md (error color).
const DOCUMENTED_RATIOS: [string, string, number][] = [
  ['text', 'surface', 10.69],
  ['text-muted', 'surface', 5.7],
  ['text', 'surface-tint', 9.31],
  ['text-muted', 'surface-tint', 4.96],
  ['text-inverse', 'surface-inverse', 10.69],
  ['text-inverse-muted', 'surface-inverse', 9.31],
  ['cta-text', 'cta-bg', 6.39],
  ['focus-ring-inverse', 'surface-inverse', 6.39],
  ['cta-text', 'cta-bg-hover', 7.27],
  ['danger', 'surface', 6.64],
];

const ratio = (fg: string, bg: string) =>
  contrastRatio(value(`--color-${fg}`), value(`--color-${bg}`));

describe('structure and names', () => {
  it('declares tokens', () => {
    expect(names.length).toBeGreaterThan(0);
  });

  it('uses kebab-case names with a known category', () => {
    const invalid = names.filter((name) => {
      const match = /^--([a-z]+)(-[a-z0-9]+)*$/.exec(name);
      return !match || !CATEGORIES.includes(match[1]);
    });

    expect(invalid).toEqual([]);
  });

  it('has hex-only color primitives named after the palette', () => {
    expect(primitiveColors.length).toBeGreaterThan(0);
    for (const name of primitiveColors) {
      expect(tokens.get(name), name).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('has semantic colors without hue names, pointing to primitives through var()', () => {
    for (const name of semanticColors) {
      const raw = tokens.get(name) ?? '';
      expect(
        HUES.some((hue) => name.includes(hue)),
        name,
      ).toBe(false);
      expect(raw, name).toMatch(/var\(--color-/);
      expect(raw, name).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
    }
  });

  it('keeps literal colors and color primitives out of src/ files', () => {
    expect(offending(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g)).toEqual([]);
    expect(offending(new RegExp(`var\\(--color-(${HUES.join('|')})-\\d{3}`, 'g'))).toEqual([]);
  });
});

describe('contrast', () => {
  it.each(TEXT_PAIRS)('%s on %s reaches %d:1', (fg, bg, minimum) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(minimum);
  });

  it.each(DOCUMENTED_RATIOS)('%s on %s matches the documented %d:1', (fg, bg, documented) => {
    expect(ratio(fg, bg)).toBeCloseTo(documented, 2);
  });

  it.each(FORBIDDEN_PAIRS)('%s on %s fails as text', (fg, bg) => {
    expect(ratio(fg, bg)).toBeLessThan(4.5);
  });

  it('covers every semantic color with a pair or the decorative list', () => {
    const covered = new Set([...TEXT_PAIRS.flatMap(([fg, bg]) => [fg, bg]), ...DECORATIVE_ONLY]);
    const uncovered = semanticColors.filter((name) => !covered.has(name.replace('--color-', '')));

    expect(uncovered).toEqual([]);
  });

  it('never uses the accent as a text color', () => {
    expect(offending(/(?<![\w-])color:\s*var\(--color-accent\)/g)).toEqual([]);
  });
});

describe('typography', () => {
  const steps = ['sm', 'base', 'lg', 'xl', '2xl', '3xl'];
  const fluid = names.filter((name) => name.startsWith('--text-'));

  function parseClamp(name: string) {
    const match = /^clamp\(([^,]+),\s*([^,]+),\s*([^,]+)\)$/.exec(value(name));
    if (!match) throw new Error(`${name} is not clamp(min, preferred, max)`);
    const preferred = /^([\d.]+)rem \+ ([\d.]+)vw$/.exec(match[2].trim());
    if (!preferred) throw new Error(`${name}: preferred term must be "Xrem + Yvw"`);
    return {
      min: rem(match[1]),
      max: rem(match[3]),
      at: (viewport: number) => Number(preferred[1]) + (Number(preferred[2]) * viewport) / 1600,
    };
  }

  it('declares the whole scale', () => {
    expect(fluid).toEqual(
      expect.arrayContaining([...steps.map((s) => `--text-${s}`), '--text-cta']),
    );
  });

  it.each(fluid)('%s is a rem clamp() that hits min at 320 px and max at 1280 px', (name) => {
    const { min, max, at } = parseClamp(name);

    expect(min).toBeLessThan(max);
    expect(max / min).toBeLessThanOrEqual(2.5);
    expect(Math.abs(at(320) - min)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(at(1280) - max)).toBeLessThanOrEqual(0.01);
  });

  it('grows strictly from sm to 3xl and keeps body text readable', () => {
    const scale = steps.map((step) => parseClamp(`--text-${step}`));
    for (let i = 1; i < scale.length; i++) {
      expect(scale[i].min).toBeGreaterThan(scale[i - 1].min);
      expect(scale[i].max).toBeGreaterThan(scale[i - 1].max);
    }
    expect(parseClamp('--text-base').min).toBeGreaterThanOrEqual(1);
    expect(Math.min(...scale.map((step) => step.min))).toBeGreaterThanOrEqual(0.875);
  });

  it('uses unitless line heights with body text at 1.5 or more', () => {
    const leading = (name: string) => Number(value(`--leading-${name}`));
    for (const name of names.filter((n) => n.startsWith('--leading-'))) {
      expect(value(name), name).toMatch(/^\d+(\.\d+)?$/);
    }
    expect(leading('body')).toBeGreaterThanOrEqual(1.5);
    expect(leading('tight')).toBeLessThan(leading('heading'));
    expect(leading('heading')).toBeLessThan(leading('body'));
  });

  it.each([
    ['--font-serif', 'Young Serif', 'serif'],
    ['--font-sans', 'Hanken Grotesk', 'sans-serif'],
  ])('%s starts with the brand font and ends with a generic family', (name, brand, generic) => {
    const families = value(name)
      .split(',')
      .map((family) => family.trim().replace(/["']/g, ''));

    expect(families[0]).toBe(brand);
    expect(families.at(-1)).toBe(generic);
  });
});

describe('space, radius, breakpoints and layers', () => {
  it('has a strictly increasing 0.25rem-based spacing scale', () => {
    const scale = Array.from({ length: 9 }, (_, i) => rem(value(`--space-${i + 1}`)));
    for (let i = 0; i < scale.length; i++) {
      expect((scale[i] * 100) % 25).toBe(0);
      if (i > 0) expect(scale[i]).toBeGreaterThan(scale[i - 1]);
    }
  });

  it('keeps touch targets and focus rings large enough', () => {
    expect(rem(value('--tap-min'))).toBeGreaterThanOrEqual(2.75);
    expect(parseFloat(value('--focus-ring-width'))).toBeGreaterThanOrEqual(2);
    expect(value('--focus-ring-width')).toMatch(/px$/);
  });

  it('has a single shadow token and no literal box-shadow in src/', () => {
    expect(names.filter((name) => name.startsWith('--shadow-'))).toEqual(['--shadow-float']);
    expect(offending(/box-shadow:\s*(?!var\(--shadow-|none)(?!\s)[^;]+/g)).toEqual([]);
  });

  it('declares increasing em breakpoints used by every min-width media query', () => {
    const breakpoints = names.filter((name) => name.startsWith('--bp-')).map(value);
    expect(breakpoints.length).toBeGreaterThan(0);
    breakpoints.forEach((bp, i) => {
      expect(bp).toMatch(/^[\d.]+em$/);
      if (i > 0) expect(parseFloat(bp)).toBeGreaterThan(parseFloat(breakpoints[i - 1]));
    });

    const undeclared = sources.flatMap(({ file, text }) =>
      [...text.matchAll(/@media[^{]*min-width:\s*([^)\s]+)/g)]
        .filter(([, width]) => !breakpoints.includes(width))
        .map(([media]) => `${file}: ${media}`),
    );
    expect(undeclared).toEqual([]);
    expect(offending(/@media[^{]*max-width/g)).toEqual([]);
  });

  it('orders z-index layers and keeps the cookie banner above the WhatsApp button', () => {
    const order = [
      'base',
      'raised',
      'header',
      'whatsapp-fab',
      'cookie-banner',
      'modal',
      'skip-link',
    ];
    const layers = order.map((layer) => Number(value(`--z-${layer}`)));

    expect(layers.every(Number.isInteger)).toBe(true);
    expect(new Set(layers).size).toBe(layers.length);
    expect([...layers].sort((a, b) => a - b)).toEqual(layers);
    expect(offending(/z-index:\s*(?!var\(--z-)(?!\s)[^;]+/g)).toEqual([]);
  });

  it.each(['top', 'right', 'bottom', 'left'])(
    '--safe-%s uses env() with a 0px fallback',
    (side) => {
      expect(value(`--safe-${side}`)).toBe(`env(safe-area-inset-${side}, 0px)`);
    },
  );

  it('defaults --cookie-banner-offset to 0px (the banner sets it while visible)', () => {
    expect(value('--cookie-banner-offset')).toBe('0px');
  });
});
