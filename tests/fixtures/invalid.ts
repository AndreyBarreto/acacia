// Invalid fixtures: one valid entry with a single change, and the error it must produce.
// The error is "<path> <message>", the way tests/content/issues.ts formats a Zod issue.
import * as valid from './valid';

export type SchemaName = 'site' | 'city' | 'neighborhood' | 'building' | 'property';

export interface InvalidFixture {
  rule: string;
  case: string;
  schema: SchemaName;
  data: unknown;
  error: string;
}

/** Copy of `base` with the value at a dotted path replaced (`undefined` removes the key). */
function withValue(base: object, path: string, value: unknown): unknown {
  const copy = structuredClone(base) as Record<string, unknown>;
  const keys = path.split('.');
  const last = keys.pop() as string;
  let target = copy;
  for (const key of keys) target = target[key] as Record<string, unknown>;
  if (value === undefined) delete target[last];
  else target[last] = value;
  return copy;
}

export const invalidFixtures: InvalidFixture[] = [
  {
    rule: 'V10',
    case: 'a language is missing',
    schema: 'property',
    data: withValue(valid.property, 'name.es', undefined),
    error: 'name.es is missing',
  },
  {
    rule: 'V10',
    case: 'an unsupported language is present',
    schema: 'property',
    data: withValue(valid.property, 'name.fr', 'Appartement 4'),
    error: 'name has an unsupported language: fr',
  },
  {
    rule: 'V11',
    case: 'a translated text is blank',
    schema: 'property',
    data: withValue(valid.property, 'summary.en', '   '),
    error: 'summary.en must not be empty',
  },
  {
    rule: 'V11',
    case: 'translated lists have different lengths',
    schema: 'property',
    data: withValue(valid.property, 'highlights.en', ['50 m from Jurerê beach', 'Wi-Fi']),
    error: 'highlights.en has 2 items, pt has 3',
  },
  {
    rule: 'V12',
    case: 'a translation is a copy of another language',
    schema: 'property',
    data: withValue(valid.property, 'description.es', valid.property.description.pt),
    error: 'description.es is identical to pt',
  },
  {
    rule: 'V30',
    case: 'a coordinate lost its trailing zeros (YAML number instead of string)',
    schema: 'building',
    data: withValue(valid.building, 'geo.latitude', -27.438),
    error: 'geo.latitude must be a quoted number with 5 to 7 decimals, like "-27.43812"',
  },
  {
    rule: 'V30',
    case: 'a latitude is out of range',
    schema: 'neighborhood',
    data: withValue(valid.neighborhood, 'geo.latitude', '-97.43812'),
    error: 'geo.latitude must be between -90 and 90',
  },
  {
    rule: 'V30',
    case: 'a longitude is out of range',
    schema: 'building',
    data: withValue(valid.building, 'geo.longitude', '-248.49587'),
    error: 'geo.longitude must be between -180 and 180',
  },
  {
    rule: 'V32',
    case: 'a postal code without the hyphen',
    schema: 'building',
    data: withValue(valid.building, 'address.postalCode', '88053682'),
    error: 'address.postalCode must look like 88053-682',
  },
  {
    rule: 'V31',
    case: 'the beds sleep fewer guests than maxGuests',
    schema: 'property',
    data: withValue(valid.property, 'sleepingAreas', [valid.property.sleepingAreas[0]]),
    error: 'sleepingAreas sleep 2 guests but capacity.maxGuests is 3',
  },
  {
    rule: 'V33',
    case: 'bedrooms does not match the bedrooms in sleepingAreas',
    schema: 'property',
    data: withValue(valid.property, 'bedrooms', 2),
    error: 'bedrooms is 2 but sleepingAreas has 1 bedroom',
  },
  {
    rule: 'V34',
    case: 'maxGuests above 20',
    schema: 'property',
    data: withValue(valid.property, 'capacity.maxGuests', 21),
    error: 'capacity.maxGuests must be between 1 and 20',
  },
  {
    rule: 'V34',
    case: 'no bathroom',
    schema: 'property',
    data: withValue(valid.property, 'bathrooms', 0),
    error: 'bathrooms must be at least 1',
  },
  {
    rule: 'V34',
    case: 'a bed count of zero',
    schema: 'property',
    data: withValue(valid.property, 'sleepingAreas', [
      { room: 'bedroom', beds: [{ type: 'double', count: 0 }] },
    ]),
    error: 'sleepingAreas.0.beds.0.count must be at least 1',
  },
  {
    rule: 'V34',
    case: 'a floor size that is not a whole number',
    schema: 'property',
    data: withValue(valid.property, 'floorSizeM2', 44.5),
    error: 'floorSizeM2 must be a whole number',
  },
  {
    rule: 'V35',
    case: 'a time not in HH:MM',
    schema: 'property',
    data: withValue(valid.property, 'rules.checkIn', { from: '14h' }),
    error: 'rules.checkIn.from must be a time like 14:00',
  },
  {
    rule: 'V35',
    case: 'a time range that ends before it starts',
    schema: 'property',
    data: withValue(valid.property, 'rules.checkIn', { from: '14:00', until: '12:00' }),
    error: 'rules.checkIn.until is before checkIn.from (14:00)',
  },
  {
    rule: 'V35',
    case: 'check-out ends after check-in starts',
    schema: 'property',
    data: withValue(valid.property, 'rules.checkOut', { until: '15:00' }),
    error: 'rules.checkOut.until is after checkIn.from (14:00)',
  },
  {
    rule: 'V36',
    case: 'minNights of zero',
    schema: 'property',
    data: withValue(valid.property, 'rules.minNights', 0),
    error: 'rules.minNights must be between 1 and 90',
  },
  {
    rule: 'V57',
    case: 'an alt text over 125 characters',
    schema: 'property',
    data: withValue(valid.property, 'images.0.alt.en', 'a'.repeat(126)),
    error: 'images.0.alt.en is 126 chars (max 125)',
  },
  {
    rule: 'V57',
    case: 'an alt text under 5 characters',
    schema: 'building',
    data: withValue(valid.building, 'images.0.alt.pt', 'Casa'),
    error: 'images.0.alt.pt is 4 chars (min 5)',
  },
  {
    rule: 'V57',
    case: 'an alt text that only repeats the file name',
    schema: 'property',
    data: withValue(valid.property, 'images.0.alt.es', 'Depto 4 Jurerê balcón'),
    error: 'images.0.alt.es only repeats the file name',
  },
  {
    rule: 'V61',
    case: 'seo.title over 60 characters',
    schema: 'property',
    data: withValue(valid.property, 'seo.title.pt', 'a'.repeat(61)),
    error: 'seo.title.pt is 61 chars (max 60)',
  },
  {
    rule: 'V61',
    case: 'seo.description under 70 characters',
    schema: 'neighborhood',
    data: withValue(valid.neighborhood, 'seo.description.en', 'Jurerê beach guide.'),
    error: 'seo.description.en is 19 chars (min 70)',
  },
  {
    rule: 'V61',
    case: 'seo.description over 155 characters',
    schema: 'property',
    data: withValue(valid.property, 'seo.description.es', 'a'.repeat(156)),
    error: 'seo.description.es is 156 chars (max 155)',
  },
  {
    rule: 'V61',
    case: 'summary over 160 characters',
    schema: 'property',
    data: withValue(valid.property, 'summary.pt', 'a'.repeat(161)),
    error: 'summary.pt is 161 chars (max 160)',
  },
  {
    rule: 'V61',
    case: 'name under 3 characters',
    schema: 'property',
    data: withValue(valid.property, 'name.pt', 'A4'),
    error: 'name.pt is 2 chars (min 3)',
  },
  {
    rule: 'V61',
    case: 'a highlight over 80 characters',
    schema: 'property',
    data: withValue(valid.property, 'highlights.en', [
      'a'.repeat(81),
      ...valid.property.highlights.en.slice(1),
    ]),
    error: 'highlights.en.0 is 81 chars (max 80)',
  },
  {
    rule: 'V61',
    case: 'fewer than 3 highlights',
    schema: 'property',
    data: withValue(valid.property, 'highlights', {
      pt: valid.property.highlights.pt.slice(0, 2),
      en: valid.property.highlights.en.slice(0, 2),
      es: valid.property.highlights.es.slice(0, 2),
    }),
    error: 'highlights.pt has 2 items (min 3)',
  },
  {
    rule: 'V62',
    case: 'the global WhatsApp number is not in E.164 format',
    schema: 'site',
    data: withValue(valid.site, 'contact.whatsapp', '(48) 99944-2015'),
    error: 'contact.whatsapp must be in +5548999442015 format',
  },
  {
    rule: 'V62',
    case: 'a property WhatsApp override is not in E.164 format',
    schema: 'property',
    data: withValue(valid.property, 'contact', { whatsapp: '5548999442015' }),
    error: 'contact.whatsapp must be in +5548999442015 format',
  },
  {
    rule: 'V63',
    case: 'siteUrl is not https',
    schema: 'site',
    data: withValue(valid.site, 'siteUrl', 'http://acacia.deyzito.com'),
    error: 'siteUrl must start with https://',
  },
  {
    rule: 'V63',
    case: 'siteUrl ends with a slash',
    schema: 'site',
    data: withValue(valid.site, 'siteUrl', 'https://acacia.deyzito.com/'),
    error: 'siteUrl must not end with a slash',
  },
  {
    rule: 'strict',
    case: 'a property has a misspelled key',
    schema: 'property',
    data: withValue(valid.property, 'capacty', { maxGuests: 3 }),
    error: 'has an unknown key: capacty',
  },
  {
    rule: 'strict',
    case: 'a nested property key is misspelled',
    schema: 'property',
    data: withValue(valid.property, 'rules.selfCheckin', true),
    error: 'rules has an unknown key: selfCheckin',
  },
  {
    rule: 'strict',
    case: 'an image has a misspelled key',
    schema: 'property',
    data: withValue(valid.property, 'images.0.covr', true),
    error: 'images.0 has an unknown key: covr',
  },
  {
    rule: 'strict',
    case: 'a building has an unknown key',
    schema: 'building',
    data: withValue(valid.building, 'adress', { street: 'Rua Luiz Rampa, 70' }),
    error: 'has an unknown key: adress',
  },
  {
    rule: 'strict',
    case: 'a neighborhood has an unknown key',
    schema: 'neighborhood',
    data: withValue(valid.neighborhood, 'geo.lat', '-27.43779'),
    error: 'geo has an unknown key: lat',
  },
];
