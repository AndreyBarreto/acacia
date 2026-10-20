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
];
