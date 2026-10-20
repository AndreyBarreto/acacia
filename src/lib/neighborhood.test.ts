import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { locales } from './i18n/locales';
import { propertiesIn } from './neighborhood';

const root = 'content/neighborhoods';
const guides = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((dir) =>
    locales.map((lang) => ({ file: `${root}/${dir.name}/guide.${lang}.md`, lang })),
  );

describe('neighborhood guides', () => {
  it('exist in every locale', () => {
    expect(guides.length).toBeGreaterThanOrEqual(locales.length);
    for (const { file } of guides) {
      expect(() => readFileSync(file, 'utf8'), file).not.toThrow();
    }
  });

  it('never publish a fact still marked TODO, nor keep review comments', () => {
    for (const { file } of guides) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/\bTODO\b|<!--/);
    }
  });
});

describe('propertiesIn', () => {
  const entry = (id: string, neighborhood: string, order: number) => ({
    id,
    data: { neighborhood: { id: neighborhood }, order },
  });

  it('keeps only the neighborhood properties, sorted by order', () => {
    const list = [entry('b', 'jurere', 2), entry('x', 'other', 1), entry('a', 'jurere', 1)];
    expect(propertiesIn(list, 'jurere').map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('accepts a plain string reference', () => {
    const list = [{ id: 'a', data: { neighborhood: 'jurere', order: 1 } }];
    expect(propertiesIn(list, 'jurere')).toHaveLength(1);
  });
});
