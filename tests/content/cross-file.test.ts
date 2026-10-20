import { describe, expect, it } from 'vitest';
import { contentIssues, type Content } from '../../src/lib/content/rules';
import type { SchemaName } from '../fixtures/invalid';
import * as valid from '../fixtures/valid';
import { schemas } from './issues';

type Raw = typeof valid.content;

const schemaOf: Record<keyof Raw, SchemaName> = {
  site: 'site',
  cities: 'city',
  neighborhoods: 'neighborhood',
  buildings: 'building',
  properties: 'property',
};

/** The valid site after `change`, parsed by the schemas the way Astro does before the rules run. */
function contentWith(change: (raw: Raw) => void = () => {}): Content {
  const raw = structuredClone(valid.content);
  change(raw);
  return Object.fromEntries(
    Object.entries(raw).map(([collection, entries]) => [
      collection,
      entries.map(({ id, data }) => ({
        id,
        data: schemas[schemaOf[collection as keyof Raw]].parse(data),
      })),
    ]),
  ) as unknown as Content;
}

const apto4 = (raw: Raw) => raw.properties[0].data;
const secondProperty = (raw: Raw, id = 'apto-6') => {
  const copy = structuredClone(raw.properties[0]);
  copy.id = id;
  copy.data.identifier = 'acacia-6';
  raw.properties.push(copy);
  return copy.data;
};

describe('cross-file rules', () => {
  it('the valid site has no issues', () => {
    expect(contentIssues(contentWith())).toEqual([]);
  });

  it.each([
    {
      rule: 'V20',
      case: 'a property folder is not a lowercase slug',
      change: (raw: Raw) => (raw.properties[0].id = 'Apto_4'),
      error:
        'properties/Apto_4: slug "Apto_4" must be 3 to 40 lowercase letters, digits and hyphens',
    },
    {
      rule: 'V21',
      case: 'a neighborhood slug is reserved',
      change: (raw: Raw) => (raw.neighborhoods[0].id = 'privacidade'),
      error: 'neighborhoods/privacidade: slug "privacidade" is reserved',
    },
    {
      rule: 'V21',
      case: 'a property slug equals a neighborhood slug',
      change: (raw: Raw) => (raw.properties[0].id = 'jurere'),
      error: 'properties/jurere: slug "jurere" is already a neighborhood',
    },
    {
      rule: 'V23',
      case: 'two properties share an identifier',
      change: (raw: Raw) => (secondProperty(raw).identifier = 'acacia-4'),
      error: 'properties/apto-6: identifier "acacia-4" is also used by apto-4',
    },
    {
      rule: 'V40',
      case: 'the neighborhood of a property does not exist',
      change: (raw: Raw) => (apto4(raw).neighborhood = 'jurere-int'),
      error: 'properties/apto-4: neighborhood "jurere-int" not found',
    },
    {
      rule: 'V40',
      case: 'the building of a property does not exist',
      change: (raw: Raw) => (apto4(raw).building = 'residencial'),
      error: 'properties/apto-4: building "residencial" not found',
    },
    {
      rule: 'V40',
      case: 'the city of a neighborhood does not exist',
      change: (raw: Raw) => (raw.neighborhoods[0].data.city = 'floripa'),
      error: 'neighborhoods/jurere: city "floripa" not found',
    },
    {
      rule: 'V40',
      case: 'the neighborhood of a building does not exist',
      change: (raw: Raw) => (raw.buildings[0].data.neighborhood = 'canasvieiras'),
      error: 'buildings/residencial-acacia: neighborhood "canasvieiras" not found',
    },
    {
      rule: 'V41',
      case: 'the building is in another neighborhood',
      change: (raw: Raw) => {
        raw.neighborhoods.push({ id: 'canasvieiras', data: raw.neighborhoods[0].data });
        apto4(raw).neighborhood = 'canasvieiras';
      },
      error: 'properties/apto-4: building is in "jurere" but the property is in "canasvieiras"',
    },
    {
      rule: 'V42',
      case: 'a property has no building, so no address nor geo',
      change: (raw: Raw) => delete (apto4(raw) as { building?: string }).building,
      error: 'properties/apto-4: building is required (the address and geo come from it)',
    },
    {
      rule: 'V43',
      case: 'the building geo has latitude and longitude swapped',
      change: (raw: Raw) =>
        (raw.buildings[0].data.geo = { latitude: '-48.49587', longitude: '-27.43812' }),
      error:
        'buildings/residencial-acacia: geo is 2,961 km from neighborhood "jurere"; check latitude/longitude',
    },
    {
      rule: 'V50',
      case: 'an amenity is in both the building and the property',
      change: (raw: Raw) => apto4(raw).amenities.push('wifi'),
      error: 'properties/apto-4: amenity "wifi" is already in building "residencial-acacia"',
    },
    {
      rule: 'V50',
      case: 'an amenity is repeated in the property',
      change: (raw: Raw) => apto4(raw).amenities.push('kitchen'),
      error: 'properties/apto-4: amenity "kitchen" appears twice',
    },
    {
      rule: 'V52',
      case: 'stairsOnly together with stepFree',
      change: (raw: Raw) => apto4(raw).amenities.push('stepFree'),
      error: 'properties/apto-4: amenities has both stairsOnly and stepFree',
    },
    {
      rule: 'V52',
      case: 'balcony amenity without a balcony photo',
      change: (raw: Raw) => (apto4(raw).images[0].category = 'living'),
      error: 'properties/apto-4: amenity "balcony" needs a photo with category balcony',
    },
    {
      rule: 'V54',
      case: 'fewer than 8 photos counting the building',
      change: (raw: Raw) => raw.buildings[0].data.images.pop(),
      error: 'properties/apto-4: images: need at least 8 with the building ones, found 7',
    },
    {
      rule: 'V55',
      case: 'no bathroom photo',
      change: (raw: Raw) =>
        (apto4(raw).images = apto4(raw).images.filter((i) => i.category !== 'bathroom')),
      error: 'properties/apto-4: images: need at least 1 bathroom photo',
    },
    {
      rule: 'V55',
      case: 'no living room or kitchen photo',
      change: (raw: Raw) =>
        (apto4(raw).images = apto4(raw).images.filter(
          (i) => i.category !== 'living' && i.category !== 'kitchen',
        )),
      error: 'properties/apto-4: images: need at least 1 living or kitchen photo',
    },
    {
      rule: 'V56',
      case: 'no cover photo',
      change: (raw: Raw) => delete (apto4(raw).images[0] as { cover?: boolean }).cover,
      error: 'properties/apto-4: images: found 0 cover photos, need exactly 1',
    },
    {
      rule: 'V56',
      case: 'two cover photos',
      change: (raw: Raw) => Object.assign(apto4(raw).images[1], { cover: true }),
      error: 'properties/apto-4: images: found 2 cover photos, need exactly 1',
    },
    {
      rule: 'V58',
      case: 'the same photo twice in the property',
      change: (raw: Raw) => (apto4(raw).images[2].src = './photos/living.jpg'),
      error: 'properties/apto-4: images: ./photos/living.jpg appears twice',
    },
    {
      rule: 'V58',
      case: 'a property photo repeats a building photo',
      change: (raw: Raw) => (apto4(raw).images[2].src = './photos/beach.jpg'),
      error: 'properties/apto-4: images: ./photos/beach.jpg is also a building photo',
    },
  ])('$rule: $case', ({ change, error }) => {
    expect(contentIssues(contentWith(change))).toContain(error);
  });
});
