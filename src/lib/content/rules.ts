// Rules that need more than one content file (docs/plan/data-model.md §10). The schemas check each
// file alone; Astro checks references only at runtime, so these run on the loaded collections.
// Each issue reads "<collection>/<id>: <problem>", e.g. 'properties/apto-4: building "x" not found'.

/** A reference after Astro parses it ({ id }), or the plain id in unit tests. */
type Ref = string | { id: string };
/** An image after Astro imports it ({ src }), or the plain path in unit tests. */
type Src = string | { src: string };

interface Geo {
  latitude: number;
  longitude: number;
}

interface Image {
  src: Src;
  category: string;
  cover?: boolean;
}

interface Entry<D> {
  id: string;
  data: D;
}

export interface Content {
  site: Entry<object>[];
  cities: Entry<object>[];
  neighborhoods: Entry<{ city: Ref; geo: Geo }>[];
  buildings: Entry<{ neighborhood: Ref; geo: Geo; amenities?: string[]; images?: Image[] }>[];
  properties: Entry<{
    identifier: string;
    status: 'draft' | 'published';
    neighborhood: Ref;
    building?: Ref;
    amenities: string[];
    images: Image[];
  }>[];
}

const idOf = (ref: Ref) => (typeof ref === 'string' ? ref : ref.id);
const srcOf = (src: Src) => (typeof src === 'string' ? src : src.src);

// data-model §9: languages, site routes and technical folders (privacy/book/... kept as a precaution).
const reservedSlugs = new Set([
  'privacidade',
  'reservar',
  '404',
  'sobre',
  'contato',
  'busca',
  'og',
  'ical',
  'api',
  'assets',
  'images',
  'img',
  'fonts',
  '_astro',
  'admin',
  'sitemap',
  'sitemap-index',
  'robots',
  'favicon',
  'manifest',
  'well-known',
  'privacy',
  'privacidad',
  'book',
  'about',
  'contact',
  'contacto',
]);

/** Distance in km between two points (haversine). */
function distanceKm(a: Geo, b: Geo): number {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

const maxDistanceKm = 5;
const minImages = 8;

// docs/brand.md §8 and CLAUDE.md: it is always "a 50 m da praia", and no generic praise.
const forbiddenTerms = [
  'beira-mar',
  'pé na areia',
  'frente para o mar',
  'frente al mar',
  'beachfront',
  'paraíso',
  'paradise',
  'inesquecível',
  'inolvidable',
  'unforgettable',
  'exclusivo',
  'exclusive',
  'luxo',
  'lujo',
  'luxury',
  'sofisticado',
  'sophisticated',
  'experiência',
  'experiencia',
  'experience',
  'dos sonhos',
  'refúgio',
  'refugio',
  'sanctuary',
  'breathtaking',
  'imperdible',
];
// Allowed only in the neighborhood page ("Tradicional × Internacional").
const neighborhoodOnlyTerms = ['jurerê internacional'];
// Case matters: "todo" is a Portuguese and Spanish word.
const placeholders = [
  /xxxx/i,
  /exemplo\.com/i,
  /example\.com/i,
  /lorem ipsum/i,
  /\bTODO\b/,
  /\bPENDENTE\b/,
];

/** Lowercase, without accents, so "Pe na Areia" matches "pé na areia". */
const plain = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const hasTerm = (text: string, term: string) =>
  new RegExp(
    `(^|[^a-z0-9])${plain(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`,
  ).test(plain(text));

/** Every string in `value` with its dotted path ("images.1.alt.es"). */
function* texts(value: unknown, path: string[] = []): Generator<[string, string]> {
  if (typeof value === 'string') yield [path.join('.'), value];
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) yield* texts(child, [...path, key]);
  }
}

function wordingIssues(collection: string, { id, data }: Entry<unknown>): string[] {
  const terms =
    collection === 'neighborhoods' ? forbiddenTerms : [...forbiddenTerms, ...neighborhoodOnlyTerms];
  const issues: string[] = [];
  for (const [path, text] of texts(data)) {
    for (const term of terms) {
      if (hasTerm(text, term)) {
        issues.push(`${collection}/${id}: ${path} has the forbidden term "${term}"`);
      }
    }
    for (const placeholder of placeholders) {
      const found = text.match(placeholder);
      if (found) issues.push(`${collection}/${id}: ${path} has the placeholder "${found[0]}"`);
    }
  }
  return issues;
}

export function contentIssues(content: Content): string[] {
  const issues: string[] = Object.entries(content).flatMap(([collection, entries]) =>
    (entries as Entry<unknown>[]).flatMap((entry) => wordingIssues(collection, entry)),
  );
  const cities = new Set(content.cities.map((entry) => entry.id));
  const neighborhoods = new Map(content.neighborhoods.map((entry) => [entry.id, entry.data]));
  const buildings = new Map(content.buildings.map((entry) => [entry.id, entry.data]));

  // V20, V21: the folder name is the URL segment.
  const checkSlug = (collection: string, id: string) => {
    const report = (problem: string) => issues.push(`${collection}/${id}: slug "${id}" ${problem}`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) || id.length < 3 || id.length > 40) {
      report('must be 3 to 40 lowercase letters, digits and hyphens');
    } else if (reservedSlugs.has(id) || /^[a-z]{2}$/.test(id)) {
      report('is reserved');
    } else if (collection === 'properties' && neighborhoods.has(id)) {
      report('is already a neighborhood');
    }
  };

  for (const { id, data } of content.neighborhoods) {
    checkSlug('neighborhoods', id);
    if (!cities.has(idOf(data.city))) {
      issues.push(`neighborhoods/${id}: city "${idOf(data.city)}" not found`);
    }
  }

  for (const { id, data } of content.buildings) {
    const where = `buildings/${id}`;
    const neighborhoodId = idOf(data.neighborhood);
    const neighborhood = neighborhoods.get(neighborhoodId);
    if (!neighborhood) {
      issues.push(`${where}: neighborhood "${neighborhoodId}" not found`);
      continue;
    }
    // V43: catches swapped latitude/longitude or a lost minus sign.
    const km = distanceKm(data.geo, neighborhood.geo);
    if (km > maxDistanceKm) {
      const shown = Math.round(km).toLocaleString('en-US');
      issues.push(
        `${where}: geo is ${shown} km from neighborhood "${neighborhoodId}"; check latitude/longitude`,
      );
    }
  }

  const identifiers = new Map<string, string>();
  for (const { id, data } of content.properties) {
    const where = `properties/${id}`;
    checkSlug('properties', id);

    // V23
    const other = identifiers.get(data.identifier);
    if (other) issues.push(`${where}: identifier "${data.identifier}" is also used by ${other}`);
    else identifiers.set(data.identifier, id);

    // V40
    const neighborhoodId = idOf(data.neighborhood);
    if (!neighborhoods.has(neighborhoodId)) {
      issues.push(`${where}: neighborhood "${neighborhoodId}" not found`);
    }

    // V42: the address and geo live only in the building.
    if (!data.building) {
      issues.push(`${where}: building is required (the address and geo come from it)`);
      continue;
    }
    const buildingId = idOf(data.building);
    const building = buildings.get(buildingId);
    if (!building) {
      issues.push(`${where}: building "${buildingId}" not found`);
      continue;
    }

    // V41
    const buildingNeighborhood = idOf(building.neighborhood);
    if (buildingNeighborhood !== neighborhoodId) {
      issues.push(
        `${where}: building is in "${buildingNeighborhood}" but the property is in "${neighborhoodId}"`,
      );
    }

    // V50
    const seen = new Set<string>();
    for (const amenity of data.amenities) {
      if (building.amenities?.includes(amenity)) {
        issues.push(`${where}: amenity "${amenity}" is already in building "${buildingId}"`);
      } else if (seen.has(amenity)) {
        issues.push(`${where}: amenity "${amenity}" appears twice`);
      }
      seen.add(amenity);
    }

    // V52
    const amenities = new Set([...(building.amenities ?? []), ...data.amenities]);
    for (const access of ['stepFree', 'wheelchairAccessible']) {
      if (amenities.has('stairsOnly') && amenities.has(access)) {
        issues.push(`${where}: amenities has both stairsOnly and ${access}`);
      }
    }
    if (amenities.has('balcony') && !data.images.some((image) => image.category === 'balcony')) {
      issues.push(`${where}: amenity "balcony" needs a photo with category balcony`);
    }

    // V54
    const buildingImages = building.images ?? [];
    const total = buildingImages.length + data.images.length;
    if (total < minImages) {
      issues.push(
        `${where}: images: need at least ${minImages} with the building ones, found ${total}`,
      );
    }

    // V55: the property's own photos show a bedroom, a bathroom and a common area.
    const has = (...categories: string[]) =>
      data.images.some((image) => categories.includes(image.category));
    if (!has('bedroom')) issues.push(`${where}: images: need at least 1 bedroom photo`);
    if (!has('bathroom')) issues.push(`${where}: images: need at least 1 bathroom photo`);
    if (!has('living', 'kitchen')) {
      issues.push(`${where}: images: need at least 1 living or kitchen photo`);
    }

    // V56
    const covers = data.images.filter((image) => image.cover).length;
    if (covers !== 1) {
      issues.push(`${where}: images: found ${covers} cover photos, need exactly 1`);
    }

    // V58
    const fromBuilding = new Set(buildingImages.map((image) => srcOf(image.src)));
    const own = new Set<string>();
    for (const image of data.images) {
      const src = srcOf(image.src);
      if (fromBuilding.has(src)) issues.push(`${where}: images: ${src} is also a building photo`);
      else if (own.has(src)) issues.push(`${where}: images: ${src} appears twice`);
      own.add(src);
    }
  }

  return issues;
}
