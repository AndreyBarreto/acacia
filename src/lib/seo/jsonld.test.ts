import { describe, expect, it } from 'vitest';
import { building, city, property, site } from '../../../tests/fixtures/valid';
import {
  breadcrumbList,
  jsonLdScript,
  organization,
  touristDestination,
  vacationRental,
} from './jsonld';

// After the schema: geo strings become numbers (here with trailing zeros lost, -27.4381).
const parsedBuilding = { ...building, geo: { latitude: -27.4381, longitude: -48.49587 } };
const images = Array.from({ length: 9 }, (_, i) => `https://acacia.deyzito.com/_astro/${i}.jpg`);

const rental = (locale: 'pt' | 'en' | 'es') =>
  vacationRental({ locale, site, city, building: parsedBuilding, property, images });

describe('vacationRental', () => {
  const es = rental('es');

  it('has the Google required fields', () => {
    expect(es).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'VacationRental',
      name: 'Depto 4',
      identifier: 'acacia-4',
      image: images,
      containsPlace: {
        '@type': 'Accommodation',
        occupancy: { '@type': 'QuantitativeValue', value: 3 },
      },
    });
  });

  it('writes geo with 5 decimals, even when the number lost its trailing zeros', () => {
    expect(es.latitude).toBe('-27.43810');
    expect(es.longitude).toBe('-48.49587');
  });

  it('maps the recommended fields from the data model §5', () => {
    expect(es).toMatchObject({
      additionalType: 'Apartment',
      brand: { '@type': 'Brand', name: 'Acácia' },
      description: property.description.es,
      checkinTime: '14:00:00-03:00',
      checkoutTime: '11:00:00-03:00',
      knowsLanguage: ['pt-BR', 'es'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua Luiz Rampa, 70',
        addressLocality: 'Florianópolis',
        addressRegion: 'SC',
        postalCode: '88053-682',
        addressCountry: 'BR',
      },
      containsPlace: {
        additionalType: 'EntirePlace',
        numberOfBedrooms: 1,
        numberOfBathroomsTotal: 1,
        floorSize: { '@type': 'QuantitativeValue', value: 44, unitCode: 'MTK' },
        bed: [
          { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Double' },
          { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Sofa bed' },
        ],
      },
    });
  });

  it('adds the unit to the street only when showUnitPublicly is set', () => {
    const shown = vacationRental({
      locale: 'pt',
      site,
      city,
      building: parsedBuilding,
      property: { ...property, showUnitPublicly: true },
      images,
    });
    expect(shown.address.streetAddress).toBe('Rua Luiz Rampa, 70, Apto 4');
  });

  it('sums beds of the same type across rooms', () => {
    const twoDoubles = vacationRental({
      locale: 'pt',
      site,
      city,
      building: parsedBuilding,
      property: {
        ...property,
        sleepingAreas: [
          { room: 'bedroom', beds: [{ type: 'double', count: 1 }] },
          { room: 'other', beds: [{ type: 'double', count: 1 }] },
        ],
      },
      images,
    });
    expect(twoDoubles.containsPlace.bed).toEqual([
      { '@type': 'BedDetails', numberOfBeds: 2, typeOfBed: 'Double' },
    ]);
  });

  it('lists amenityFeature with the Google names (English), building + property + rules', () => {
    const features = Object.fromEntries(
      es.containsPlace.amenityFeature.map((f) => [f.name, f.value]),
    );
    expect(features).toEqual({
      wifi: true,
      internetType: 'Free',
      parkingType: 'Free',
      ac: true,
      kitchen: true,
      balcony: true,
      smokingAllowed: false,
      petsAllowed: false,
      childFriendly: true,
      crib: false,
      selfCheckinCheckout: true,
      beachAccess: true,
    });
    for (const feature of es.containsPlace.amenityFeature) {
      expect(feature['@type']).toBe('LocationFeatureSpecification');
    }
  });

  it('is the same listing in every language: identifier, images, geo and numbers', () => {
    const pt = rental('pt');
    expect(pt.identifier).toBe(es.identifier);
    expect(pt.image).toEqual(es.image);
    expect([pt.latitude, pt.longitude]).toEqual([es.latitude, es.longitude]);
    expect(pt.containsPlace).toEqual(es.containsPlace);
    expect(pt.name).toBe('Apto 4');
  });

  it('never has ratings or reviews', () => {
    expect(es).not.toHaveProperty('aggregateRating');
    expect(es).not.toHaveProperty('review');
  });
});

describe('organization', () => {
  it('names the brand and its site', () => {
    expect(organization(site)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Acácia',
      url: 'https://acacia.deyzito.com/',
    });
  });
});

describe('breadcrumbList', () => {
  it('numbers the items from 1, absolute URLs, the last one without item', () => {
    expect(
      breadcrumbList([
        { name: 'Início', url: 'https://acacia.deyzito.com/pt/' },
        { name: 'Jurerê', url: 'https://acacia.deyzito.com/pt/jurere/' },
        { name: 'Apto 4' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: 'https://acacia.deyzito.com/pt/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Jurerê',
          item: 'https://acacia.deyzito.com/pt/jurere/',
        },
        { '@type': 'ListItem', position: 3, name: 'Apto 4' },
      ],
    });
  });

  it('needs at least 2 items (Google)', () => {
    expect(() => breadcrumbList([{ name: 'Início' }])).toThrow(/at least 2/);
  });
});

describe('touristDestination', () => {
  it('describes the neighborhood in the page language, with geo and the city', () => {
    expect(
      touristDestination({
        locale: 'en',
        url: 'https://acacia.deyzito.com/en/jurere/',
        name: 'Jurerê',
        description: 'Beaches, where to eat.',
        geo: { latitude: -27.43779, longitude: -48.4827 },
        city,
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: 'Jurerê',
      description: 'Beaches, where to eat.',
      url: 'https://acacia.deyzito.com/en/jurere/',
      geo: { '@type': 'GeoCoordinates', latitude: '-27.43779', longitude: '-48.48270' },
      containedInPlace: {
        '@type': 'City',
        name: 'Florianópolis',
        address: { '@type': 'PostalAddress', addressRegion: 'SC', addressCountry: 'BR' },
      },
    });
  });
});

describe('jsonLdScript', () => {
  it('escapes "<" so the text can never close the script tag', () => {
    expect(jsonLdScript({ name: '</script><b>' })).toBe('{"name":"\\u003c/script>\\u003cb>"}');
  });
});
