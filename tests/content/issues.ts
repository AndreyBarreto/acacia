import { z } from 'astro/zod';
import {
  buildingSchema,
  citySchema,
  neighborhoodSchema,
  propertySchema,
  siteSchema,
} from '../../src/lib/content/schemas';
import type { SchemaName } from '../fixtures/invalid';

// Outside Astro there is no image() nor reference(): plain strings stand in for both.
const helpers = { image: () => z.string(), reference: () => z.string() };

export const schemas: Record<SchemaName, z.ZodType> = {
  site: siteSchema,
  city: citySchema,
  neighborhood: neighborhoodSchema(helpers),
  building: buildingSchema(helpers),
  property: propertySchema(helpers),
};

/** Every validation error as "<path> <message>", e.g. "name.es is missing". */
export function issuesOf(schema: z.ZodType, data: unknown): string[] {
  const result = schema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((issue) => [issue.path.join('.'), issue.message].join(' ').trim());
}
