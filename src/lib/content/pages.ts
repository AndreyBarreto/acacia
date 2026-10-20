// Which properties get pages, and their static paths. A new property folder in content/properties/
// becomes /{lang}/{neighborhood}/{slug}/ in the 3 languages with no code change (V65).
import { locales } from '../i18n/locales';

type Ref = string | { id: string };

interface PropertyEntry {
  id: string;
  data: { status: 'draft' | 'published'; neighborhood: Ref };
}

/** V64: a draft never reaches the production build (no page, sitemap, hreflang or link). */
export function publicOnly<T extends PropertyEntry>(properties: T[], production: boolean): T[] {
  return production ? properties.filter((p) => p.data.status === 'published') : properties;
}

/** getStaticPaths() entries for src/pages/[lang]/[neighborhood]/[property]/. */
export function propertyPaths<T extends PropertyEntry>(properties: T[]) {
  return properties.flatMap((property) =>
    locales.map((lang) => ({
      params: {
        lang,
        neighborhood:
          typeof property.data.neighborhood === 'string'
            ? property.data.neighborhood
            : property.data.neighborhood.id,
        property: property.id,
      },
      props: { property },
    })),
  );
}
