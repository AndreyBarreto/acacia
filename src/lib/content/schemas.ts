// Zod schemas for the files in content/ (docs/plan/data-model.md §4 and the rules in §10).
// Error messages read after the field path: "name.es is missing".
import { z } from 'astro/zod';
import { locales, type Locale } from '../i18n/locales';

/** Astro's image() and reference(), injected so the schemas also run in Vitest. */
interface Helpers<I extends z.ZodType, R extends z.ZodType> {
  image: () => I;
  reference: (collection: 'cities' | 'neighborhoods' | 'buildings') => R;
}

const text = z.string().trim().min(1, { error: 'must not be empty', abort: true });

/** Text with a length range, reporting the actual length (V61). */
const sized = (min: number, max: number) =>
  text
    .min(min, { error: (issue) => `is ${String(issue.input).length} chars (min ${min})` })
    .max(max, { error: (issue) => `is ${String(issue.input).length} chars (max ${max})` });

/** Whole number from `min`, up to `max` if given (V34, V36). */
function whole(min: number, max?: number) {
  const range = max === undefined ? `must be at least ${min}` : `must be between ${min} and ${max}`;
  const number = z.number().int('must be a whole number').min(min, range);
  return max === undefined ? number : number.max(max, range);
}

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

// Quoted on purpose: YAML reads -27.43800 as the number -27.438 and the decimals are lost (V30).
const decimals = 'must be a quoted number with 5 to 7 decimals, like "-27.43812"';
const coordinate = (limit: number) =>
  z
    .string({ error: decimals })
    .regex(/^-?\d{1,3}\.\d{5,7}$/, { error: decimals, abort: true })
    .refine((value) => Math.abs(Number(value)) <= limit, `must be between -${limit} and ${limit}`)
    .transform(Number);

/** An object that rejects unknown keys, so a misspelled optional field is not silently ignored. */
function strict<T extends z.ZodRawShape>(shape: T) {
  return z.strictObject(shape, {
    error: (issue) =>
      issue.code === 'unrecognized_keys'
        ? `has an unknown key: ${issue.keys.join(', ')}`
        : undefined,
  });
}

const geo = strict({ latitude: coordinate(90), longitude: coordinate(180) });

const whatsapp = z.string().regex(/^\+[1-9]\d{7,14}$/, 'must be in +5548999442015 format');

const seo = strict({ title: translated(sized(1, 60)), description: translated(sized(70, 155)) });

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

/** "Depto 4 Jurerê balcón" → "depto-4-jurere-balcon", to compare an alt with a file name. */
const slug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function imageSchema<I extends z.ZodType>(image: () => I) {
  return strict({
    src: image(),
    alt: translated(sized(5, 125)),
    category: z.enum(imageCategories),
    cover: z.boolean().optional(),
    provisional: z.boolean().optional(),
    fileName: localized(text).optional(),
  }).superRefine(({ alt, fileName }, ctx) => {
    for (const lang of locales) {
      if (fileName && slug(alt[lang]) === slug(fileName[lang])) {
        ctx.addIssue({
          code: 'custom',
          path: ['alt', lang],
          message: 'only repeats the file name',
        });
      }
    }
  });
}

export const siteSchema = z.object({
  brandName: text,
  siteUrl: z
    .string()
    .regex(/^https:\/\//, 'must start with https://')
    .regex(/[^/]$/, 'must not end with a slash'),
  defaultLocale: z.enum(locales),
  hostLanguages: z.array(text).min(1),
  contact: z.object({ whatsapp }),
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
  return strict({
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
  return strict({
    name: text,
    neighborhood: reference('neighborhoods'),
    address: strict({
      street: text,
      postalCode: z.string().regex(/^\d{5}-\d{3}$/, 'must look like 88053-682'),
    }),
    geo,
    beachDistanceMeters: whole(1),
    amenities: amenities.optional(),
    images: z.array(imageSchema(image)).optional(),
  });
}

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'must be a time like 14:00');

/** Guests each bed sleeps (data-model §4.5; a sofa bed counts as 1). */
const bedPlaces = { double: 2, queen: 2, king: 2, single: 1, sofaBed: 1, bunkBed: 2 } as const;

const highlights = z
  .array(sized(1, 80))
  .min(3, { error: (issue) => `has ${(issue.input as unknown[]).length} items (min 3)` })
  .max(6, { error: (issue) => `has ${(issue.input as unknown[]).length} items (max 6)` });

// Check-in and check-out ranges (V35). The texts only show when check-in starts and check-out ends.
const rules = strict({
  checkIn: strict({ from: time, until: time.optional() }),
  checkOut: strict({ from: time.optional(), until: time }),
  minNights: whole(1, 90),
  smoking: z.boolean(),
  pets: z.boolean(),
  children: z.boolean(),
  crib: z.boolean().optional(),
  selfCheckIn: z.boolean().optional(),
  notes: localized(z.array(text)).optional(),
}).superRefine(({ checkIn, checkOut }, ctx) => {
  if (checkIn.until && checkIn.until < checkIn.from) {
    ctx.addIssue({
      code: 'custom',
      path: ['checkIn', 'until'],
      message: `is before checkIn.from (${checkIn.from})`,
    });
  }
  if (checkOut.from && checkOut.until < checkOut.from) {
    ctx.addIssue({
      code: 'custom',
      path: ['checkOut', 'until'],
      message: `is before checkOut.from (${checkOut.from})`,
    });
  }
  if (checkOut.until > checkIn.from) {
    ctx.addIssue({
      code: 'custom',
      path: ['checkOut', 'until'],
      message: `is after checkIn.from (${checkIn.from})`,
    });
  }
});

export function propertySchema<I extends z.ZodType, R extends z.ZodType>({
  image,
  reference,
}: Helpers<I, R>) {
  return strict({
    identifier: z.string().regex(/^[a-z0-9-]+$/, 'must use only a-z, 0-9 and hyphens'),
    status: z.enum(['published', 'draft']).default('published'),
    order: z.number().int().optional(),
    neighborhood: reference('neighborhoods'),
    building: reference('buildings').optional(),
    unitLabel: text.optional(),
    showUnitPublicly: z.boolean().default(false),
    propertyType: z.enum(['Apartment', 'House', 'Cottage', 'Villa', 'Bungalow', 'Cabin', 'Chalet']),
    name: localized(sized(3, 60)),
    subtitle: localized(text).optional(),
    summary: translated(sized(1, 160)),
    description: translated(text),
    highlights: translated(highlights),
    seo,
    capacity: strict({ maxGuests: whole(1, 20) }),
    bedrooms: whole(0),
    bathrooms: whole(1),
    floorSizeM2: whole(1).optional(),
    sleepingAreas: z.array(
      strict({
        room: z.enum(['bedroom', 'livingRoom', 'other']),
        beds: z.array(
          strict({
            type: z.enum(['double', 'queen', 'king', 'single', 'sofaBed', 'bunkBed']),
            count: whole(1),
          }),
        ),
      }),
    ),
    floor: z.enum(['ground', 'upper']).optional(),
    views: z.array(z.enum(['sea', 'mountain', 'garden', 'courtyard', 'street'])).optional(),
    amenities,
    rules,
    images: z.array(imageSchema(image)),
    ogImage: image().optional(),
    contact: strict({ whatsapp }).optional(),
  }).superRefine((property, ctx) => {
    const beds = property.sleepingAreas.flatMap((area) => area.beds);
    const places = beds.reduce((sum, bed) => sum + bedPlaces[bed.type] * bed.count, 0);
    if (places < property.capacity.maxGuests) {
      ctx.addIssue({
        code: 'custom',
        path: ['sleepingAreas'],
        message: `sleep ${places} guests but capacity.maxGuests is ${property.capacity.maxGuests}`,
      });
    }
    const bedrooms = property.sleepingAreas.filter((area) => area.room === 'bedroom').length;
    if (bedrooms !== property.bedrooms) {
      ctx.addIssue({
        code: 'custom',
        path: ['bedrooms'],
        message: `is ${property.bedrooms} but sleepingAreas has ${bedrooms} bedroom${bedrooms === 1 ? '' : 's'}`,
      });
    }
  });
}
