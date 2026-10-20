import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  buildingSchema,
  citySchema,
  neighborhoodSchema,
  propertySchema,
  siteSchema,
} from './lib/content/schemas';

// Entries kept in a folder per id (content/properties/apto-4/property.yaml) take the folder name as id.
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0];

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './content' }),
  schema: siteSchema,
});

const cities = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/cities' }),
  schema: citySchema,
});

const neighborhoods = defineCollection({
  loader: glob({
    pattern: '*/neighborhood.yaml',
    base: './content/neighborhoods',
    generateId: folderId,
  }),
  schema: neighborhoodSchema({ reference }),
});

const buildings = defineCollection({
  loader: glob({ pattern: '*/building.yaml', base: './content/buildings', generateId: folderId }),
  schema: ({ image }) => buildingSchema({ image, reference }),
});

const properties = defineCollection({
  loader: glob({ pattern: '*/property.yaml', base: './content/properties', generateId: folderId }),
  schema: ({ image }) => propertySchema({ image, reference }),
});

export const collections = { site, cities, neighborhoods, buildings, properties };
