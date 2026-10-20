// Zod schemas for the files in content/ (docs/plan/data-model.md §4 and the rules in §10).
// Error messages read after the field path: "name.es is missing".
import { z } from 'astro/zod';
import { locales, type Locale } from '../i18n/locales';

/** Astro's image() and reference(), injected so the schemas also run in Vitest. */
interface Helpers<I extends z.ZodType, R extends z.ZodType> {
  image: () => I;
  reference: (collection: 'cities' | 'neighborhoods' | 'buildings') => R;
}

const text = z.string().trim().min(1, 'must not be empty');

/** L<T>: the value in pt, en and es, all required, no other language (V10, V11). */
export function localized<T extends z.ZodType>(value: T) {
  const required = z
    .any()
    .refine((input) => input !== undefined, { error: 'is missing', abort: true })
    .pipe(value);
  return z
    .strictObject(
      { pt: required, en: required, es: required },
      {
        error: (issue) =>
          issue.code === 'unrecognized_keys'
            ? `has an unsupported language: ${issue.keys.join(', ')}`
            : undefined,
      },
    )
    .superRefine((input, ctx) => {
      const byLang = input as Record<Locale, unknown>;
      for (const lang of locales) {
        const list = byLang[lang];
        const ptList = byLang.pt;
        if (Array.isArray(list) && Array.isArray(ptList) && list.length !== ptList.length) {
          ctx.addIssue({
            code: 'custom',
            path: [lang],
            message: `has ${list.length} items, pt has ${ptList.length}`,
          });
        }
      }
    });
}

/** L<T> for texts that must really be translated: no language may copy another (V12). */
export function translated<T extends z.ZodType>(value: T) {
  return localized(value).superRefine((input, ctx) => {
    const byLang = input as Record<Locale, unknown>;
    locales.forEach((lang, i) => {
      const copied = locales
        .slice(0, i)
        .find((other) => JSON.stringify(byLang[other]) === JSON.stringify(byLang[lang]));
      if (copied) {
        ctx.addIssue({ code: 'custom', path: [lang], message: `is identical to ${copied}` });
      }
    });
  });
}

const geo = z.object({ latitude: z.string(), longitude: z.string() });

const seo = z.object({ title: translated(text), description: translated(text) });

export const amenityKeys = [
  'wifi',
  'freeParking',
  'airConditioning',
  'heating',
  'fan',
  'kitchen',
  'ovenStove',
  'microwave',
  'refrigerator',
  'minibar',
  'coffeeMaker',
  'kitchenware',
  'diningTable',
  'tv',
  'streaming',
  'desk',
  'bedLinen',
  'towels',
  'hairDryer',
  'wardrobe',
  'iron',
  'ironingBoard',
  'washer',
  'dryingRack',
  'balcony',
  'patio',
  'outdoorFurniture',
  'grill',
  'beachGear',
  'privateEntrance',
  'wheelchairAccessible',
  'stairsOnly',
  'stepFree',
  'elevator',
  'fireExtinguisher',
  'pool',
] as const;

const amenities = z.array(z.enum(amenityKeys));

const imageCategories = [
  'bedroom',
  'bathroom',
  'living',
  'kitchen',
  'balcony',
  'exterior',
  'beach',
  'neighborhood',
  'other',
] as const;

function imageSchema<I extends z.ZodType>(image: () => I) {
  return z.object({
    src: image(),
    alt: translated(text),
    category: z.enum(imageCategories),
    cover: z.boolean().optional(),
    provisional: z.boolean().optional(),
    fileName: localized(text).optional(),
  });
}

export const siteSchema = z.object({
  brandName: text,
  siteUrl: z.string(),
  defaultLocale: z.enum(locales),
  hostLanguages: z.array(text).min(1),
  contact: z.object({ whatsapp: z.string() }),
});

export const citySchema = z.object({
  name: localized(text),
  region: text,
  country: text,
  timeZone: text,
});

export function neighborhoodSchema<R extends z.ZodType>({
  reference,
}: Pick<Helpers<z.ZodType, R>, 'reference'>) {
  return z.object({
    city: reference('cities'),
    name: localized(text),
    geo,
    seo,
    order: z.number().int().optional(),
  });
}

export function buildingSchema<I extends z.ZodType, R extends z.ZodType>({
  image,
  reference,
}: Helpers<I, R>) {
  return z.object({
    name: text,
    neighborhood: reference('neighborhoods'),
    address: z.object({ street: text, postalCode: z.string() }),
    geo,
    beachDistanceMeters: z.number(),
    amenities: amenities.optional(),
    images: z.array(imageSchema(image)).optional(),
  });
}

const timeRange = z.object({ from: z.string().optional(), until: z.string().optional() });

export function propertySchema<I extends z.ZodType, R extends z.ZodType>({
  image,
  reference,
}: Helpers<I, R>) {
  return z.object({
    identifier: z.string().regex(/^[a-z0-9-]+$/, 'must use only a-z, 0-9 and hyphens'),
    status: z.enum(['published', 'draft']).default('published'),
    order: z.number().int().optional(),
    neighborhood: reference('neighborhoods'),
    building: reference('buildings').optional(),
    unitLabel: text.optional(),
    showUnitPublicly: z.boolean().default(false),
    propertyType: z.enum(['Apartment', 'House', 'Cottage', 'Villa', 'Bungalow', 'Cabin', 'Chalet']),
    name: localized(text),
    subtitle: localized(text).optional(),
    summary: translated(text),
    description: translated(text),
    highlights: translated(z.array(text)),
    seo,
    capacity: z.object({ maxGuests: z.number() }),
    bedrooms: z.number(),
    bathrooms: z.number(),
    floorSizeM2: z.number().optional(),
    sleepingAreas: z.array(
      z.object({
        room: z.enum(['bedroom', 'livingRoom', 'other']),
        beds: z.array(
          z.object({
            type: z.enum(['double', 'queen', 'king', 'single', 'sofaBed', 'bunkBed']),
            count: z.number(),
          }),
        ),
      }),
    ),
    floor: z.enum(['ground', 'upper']).optional(),
    views: z.array(z.enum(['sea', 'mountain', 'garden', 'courtyard', 'street'])).optional(),
    amenities,
    rules: z.object({
      checkIn: timeRange,
      checkOut: timeRange,
      minNights: z.number(),
      smoking: z.boolean(),
      pets: z.boolean(),
      children: z.boolean(),
      crib: z.boolean().optional(),
      selfCheckIn: z.boolean().optional(),
      notes: localized(z.array(text)).optional(),
    }),
    images: z.array(imageSchema(image)),
    ogImage: image().optional(),
    contact: z.object({ whatsapp: z.string() }).optional(),
  });
}
