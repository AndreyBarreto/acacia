// JSON-LD written by us (no @jdevalk/astro-seo-graph). Field mapping: docs/plan/data-model.md §5–6.
import type { Locale } from '../i18n/locales';

type Localized = Record<Locale, string>;
interface Geo {
  latitude: number;
  longitude: number;
}
interface City {
  name: Localized;
  region: string;
  country: string;
  timeZone: string;
}

const context = 'https://schema.org';

/** Geo always with 5 decimals (data-model §4.3): as text, so trailing zeros are kept. */
const coordinate = (value: number) => value.toFixed(5);

/** "America/Sao_Paulo" → "-03:00" (the offset of today; Brazil has no daylight saving time). */
function utcOffset(timeZone: string): string {
  const name = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value;
  const offset = name?.replace('GMT', '') ?? '';
  return offset === '' ? '+00:00' : offset;
}

const bedTypes: Record<string, string> = {
  double: 'Double',
  queen: 'Queen',
  king: 'King',
  single: 'Single',
  sofaBed: 'Sofa bed',
  bunkBed: 'Bunk bed',
};

// The "Google" column of data-model §6; keys without a Google name are only displayed.
const googleAmenities: Record<string, [string, boolean | string][]> = {
  wifi: [
    ['wifi', true],
    ['internetType', 'Free'],
  ],
  freeParking: [['parkingType', 'Free']],
  airConditioning: [['ac', true]],
  heating: [['heating', true]],
  kitchen: [['kitchen', true]],
  ovenStove: [['ovenStove', true]],
  microwave: [['microwave', true]],
  tv: [['tv', true]],
  ironingBoard: [['ironingBoard', true]],
  washer: [['washerDryer', true]],
  balcony: [['balcony', true]],
  patio: [['patio', true]],
  grill: [['outdoorGrill', true]],
  wheelchairAccessible: [['wheelchairAccessible', true]],
  elevator: [['elevator', true]],
  pool: [['pool', true]],
};

export interface RentalInput {
  locale: Locale;
  site: { brandName: string; hostLanguages: string[] };
  city: City;
  building: {
    address: { street: string; postalCode: string };
    geo: Geo;
    beachDistanceMeters: number;
    amenities?: string[];
  };
  property: {
    identifier: string;
    propertyType: string;
    name: Localized;
    description: Localized;
    unitLabel?: string;
    showUnitPublicly?: boolean;
    capacity: { maxGuests: number };
    bedrooms: number;
    bathrooms: number;
    floorSizeM2?: number;
    sleepingAreas: { room: string; beds: { type: string; count: number }[] }[];
    amenities: string[];
    rules: {
      checkIn: { from: string };
      checkOut: { until: string };
      smoking: boolean;
      pets: boolean;
      children: boolean;
      crib?: boolean;
      selfCheckIn?: boolean;
    };
  };
  /** Absolute URLs, cover first. */
  images: string[];
}

export function vacationRental({ locale, site, city, building, property, images }: RentalInput) {
  const offset = utcOffset(city.timeZone);
  const { rules } = property;

  const beds = new Map<string, number>();
  for (const bed of property.sleepingAreas.flatMap((area) => area.beds)) {
    beds.set(bed.type, (beds.get(bed.type) ?? 0) + bed.count);
  }

  const keys = [...new Set([...(building.amenities ?? []), ...property.amenities])];
  const derived: [string, boolean | undefined][] = [
    ['smokingAllowed', rules.smoking],
    ['petsAllowed', rules.pets],
    ['childFriendly', rules.children],
    ['crib', rules.crib],
    ['selfCheckinCheckout', rules.selfCheckIn],
    ['beachAccess', building.beachDistanceMeters <= 100 || undefined],
  ];
  const features = [
    ...keys.flatMap((key) => googleAmenities[key] ?? []),
    ...derived.filter((entry): entry is [string, boolean] => entry[1] !== undefined),
  ];

  const street =
    property.showUnitPublicly && property.unitLabel
      ? `${building.address.street}, ${property.unitLabel}`
      : building.address.street;

  return {
    '@context': context,
    '@type': 'VacationRental',
    additionalType: property.propertyType,
    identifier: property.identifier,
    name: property.name[locale],
    description: property.description[locale],
    brand: { '@type': 'Brand', name: site.brandName },
    image: images,
    latitude: coordinate(building.geo.latitude),
    longitude: coordinate(building.geo.longitude),
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city.name[locale],
      addressRegion: city.region,
      postalCode: building.address.postalCode,
      addressCountry: city.country,
    },
    checkinTime: `${rules.checkIn.from}:00${offset}`,
    checkoutTime: `${rules.checkOut.until}:00${offset}`,
    knowsLanguage: site.hostLanguages,
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntirePlace',
      occupancy: { '@type': 'QuantitativeValue', value: property.capacity.maxGuests },
      numberOfBedrooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      ...(property.floorSizeM2 && {
        floorSize: { '@type': 'QuantitativeValue', value: property.floorSizeM2, unitCode: 'MTK' },
      }),
      bed: [...beds].map(([type, count]) => ({
        '@type': 'BedDetails',
        numberOfBeds: count,
        typeOfBed: bedTypes[type] ?? type,
      })),
      amenityFeature: features.map(([name, value]) => ({
        '@type': 'LocationFeatureSpecification',
        name,
        value,
      })),
    },
  };
}

export function organization(site: { brandName: string; siteUrl: string }) {
  return {
    '@context': context,
    '@type': 'Organization',
    name: site.brandName,
    url: `${site.siteUrl}/`,
  };
}

/** Items in order; the last one (the current page) may omit url. */
export function breadcrumbList(items: { name: string; url?: string }[]) {
  if (items.length < 2) throw new Error('A BreadcrumbList needs at least 2 items');
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      ...(entry.url && { item: entry.url }),
    })),
  };
}

export function touristDestination(input: {
  locale: Locale;
  url: string;
  name: string;
  description: string;
  geo: Geo;
  city: City;
}) {
  return {
    '@context': context,
    '@type': 'TouristDestination',
    name: input.name,
    description: input.description,
    url: input.url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coordinate(input.geo.latitude),
      longitude: coordinate(input.geo.longitude),
    },
    containedInPlace: {
      '@type': 'City',
      name: input.city.name[input.locale],
      address: {
        '@type': 'PostalAddress',
        addressRegion: input.city.region,
        addressCountry: input.city.country,
      },
    },
  };
}

/** JSON for a <script type="application/ld+json">: "<" escaped so it never closes the tag. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
