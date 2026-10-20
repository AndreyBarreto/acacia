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
    data: withValue(valid.site, 'siteUrl', 'http://acaciafloripa.com.br'),
    error: 'siteUrl must start with https://',
  },
  {
    rule: 'V63',
    case: 'siteUrl ends with a slash',
    schema: 'site',
    data: withValue(valid.site, 'siteUrl', 'https://acaciafloripa.com.br/'),
    error: 'siteUrl must not end with a slash',
  },
];
