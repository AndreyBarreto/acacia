// Tiny parser for the custom properties in src/styles/tokens.css, used only by tests.
// It relies on the controlled format of that file: one `--name: value;` per declaration,
// all inside `:root { ... }` blocks.

export type Tokens = Map<string, string>;

const COMMENT = /\/\*[\s\S]*?\*\//g;
const ROOT_BLOCK = /:root\s*\{([^}]*)\}/g;
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;
const VAR_REFERENCE = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/;

export function parseTokens(css: string): Tokens {
  const tokens: Tokens = new Map();
  const source = css.replace(COMMENT, '');

  for (const [, body] of source.matchAll(ROOT_BLOCK)) {
    for (const [, name, value] of body.matchAll(DECLARATION)) {
      tokens.set(name, value.trim());
    }
  }
  return tokens;
}

export function resolveToken(tokens: Tokens, name: string, chain: string[] = []): string {
  if (chain.includes(name)) {
    throw new Error(`Circular token reference: ${[...chain, name].join(' -> ')}`);
  }
  const value = tokens.get(name);
  if (value === undefined) {
    const referrer = chain.at(-1);
    throw new Error(`Unknown token ${name}${referrer ? ` (referenced by ${referrer})` : ''}`);
  }

  let resolved = value;
  let match: RegExpExecArray | null;
  while ((match = VAR_REFERENCE.exec(resolved))) {
    const [whole, reference, fallback] = match;
    const replacement =
      fallback !== undefined && !tokens.has(reference)
        ? fallback.trim()
        : resolveToken(tokens, reference, [...chain, name]);
    resolved = resolved.replace(whole, replacement);
  }
  return resolved;
}

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

// WCAG 2.x relative luminance.
export function relativeLuminance(hex: string): number {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #rrggbb color, got "${hex}"`);

  const [r, g, b] = match.slice(1).map((part) => channel(parseInt(part, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}
