import { describe, expect, it } from 'vitest';
import { propertyPaths, publicOnly } from '../../src/lib/content/pages';
import { contentIssues, type Content } from '../../src/lib/content/rules';
import { locales } from '../../src/lib/i18n/locales';
import { routePath } from '../../src/lib/routes';
import * as valid from '../fixtures/valid';
import { schemas } from './issues';

const entry = (id: string, status: 'draft' | 'published') => ({
  id,
  data: { ...valid.property, status, neighborhood: 'jurere' },
});

describe('V64: drafts', () => {
  const properties = [entry('apto-4', 'published'), entry('apto-6', 'draft')];

  it('are left out of the production build', () => {
    expect(publicOnly(properties, true).map((p) => p.id)).toEqual(['apto-4']);
  });

  it('still show in development, for preview', () => {
    expect(publicOnly(properties, false).map((p) => p.id)).toEqual(['apto-4', 'apto-6']);
  });
});

describe('V65: adding a property is only a new file', () => {
  // A new folder content/properties/apto-8/property.yaml, with nothing else changed.
  const apto8 = {
    id: 'apto-8',
    data: {
      ...valid.property,
      identifier: 'acacia-8',
      status: 'published',
      images: valid.property.images.map((image) => ({
        ...image,
        src: image.src.replace('./photos/', './photos/apto-8-'),
      })),
    },
  };
  const parsed = (raw: { id: string; data: unknown }, schema: keyof typeof schemas) => ({
    id: raw.id,
    data: schemas[schema].parse(raw.data),
  });
  const content = {
    site: valid.content.site.map((e) => parsed(e, 'site')),
    cities: valid.content.cities.map((e) => parsed(e, 'city')),
    neighborhoods: valid.content.neighborhoods.map((e) => parsed(e, 'neighborhood')),
    buildings: valid.content.buildings.map((e) => parsed(e, 'building')),
    properties: [...valid.content.properties, apto8].map((e) => parsed(e, 'property')),
  } as unknown as Content;

  it('passes every content rule', () => {
    expect(contentIssues(content)).toEqual([]);
  });

  it('gets its page in pt, en and es', () => {
    const urls = propertyPaths(publicOnly(content.properties, true)).map(({ params }) =>
      routePath({ id: 'property', slug: params.property }, params.lang),
    );
    expect(urls).toEqual(['/pt/jurere/apto-8/', '/en/jurere/apto-8/', '/es/jurere/apto-8/']);
  });

  it('passes the entry to its page, with the neighborhood in the params', () => {
    const paths = propertyPaths([content.properties[1]]);
    expect(paths.map((path) => path.params)).toEqual(
      locales.map((lang) => ({ lang, neighborhood: 'jurere', property: 'apto-8' })),
    );
    expect(paths[0].props.property.id).toBe('apto-8');
  });
});
