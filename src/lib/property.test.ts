// Texts derived from the structured fields of a property (docs/content/microcopy.md §3, §4).
import { describe, expect, it } from 'vitest';
import { amenityKeys } from './content/schemas';
import { locales } from './i18n/locales';
import { catalog } from './i18n/t';
import {
  amenityGroups,
  bedLines,
  bedSummary,
  detailRows,
  formatHour,
  ruleNotes,
  ruleRows,
} from './property';

const rules = {
  checkIn: { from: '14:00' },
  checkOut: { until: '11:00' },
  minNights: 4,
  smoking: false,
  pets: false,
  children: true,
  crib: false,
  selfCheckIn: true,
  notes: {
    pt: ['O apartamento fica no andar de cima.'],
    en: ['The apartment is upstairs.'],
    es: ['El depto está en la planta alta.'],
  },
};

const sleepingAreas = [
  { room: 'bedroom', beds: [{ type: 'double', count: 1 }] },
  { room: 'livingRoom', beds: [{ type: 'sofaBed', count: 1 }] },
] as const;

describe('formatHour', () => {
  it('uses the fixed formats of each language (microcopy §0)', () => {
    expect(['pt', 'en', 'es'].map((l) => formatHour(l as 'pt', '14:00'))).toEqual([
      '14h',
      '2 pm',
      '14 h',
    ]);
    expect(['pt', 'en', 'es'].map((l) => formatHour(l as 'pt', '10:30'))).toEqual([
      '10h30',
      '10:30 am',
      '10:30 h',
    ]);
    expect(formatHour('en', '11:00')).toBe('11 am');
    expect(formatHour('en', '12:00')).toBe('12 pm');
    expect(formatHour('en', '00:15')).toBe('12:15 am');
  });
});

describe('ruleRows', () => {
  it('shows check-in, check-out and the minimum stay in pt', () => {
    expect(ruleRows('pt', rules)).toEqual([
      { label: 'Check-in', value: 'a partir das 14h' },
      { label: 'Check-out', value: 'até as 11h' },
      { label: 'Mínimo de noites', value: '4 noites, o ano todo' },
    ]);
  });

  it('shows them in en and es', () => {
    expect(ruleRows('en', rules).map((row) => row.value)).toEqual([
      'from 2 pm',
      'by 11 am',
      '4 nights, all year',
    ]);
    expect(ruleRows('es', rules).map((row) => row.value)).toEqual([
      'desde las 14 h',
      'hasta las 11 h',
      '4 noches, todo el año',
    ]);
  });

  it('shows a check-in range when it has an end, and a 1-night minimum without "all year"', () => {
    const rows = ruleRows('pt', {
      ...rules,
      checkIn: { from: '14:00', until: '18:00' },
      minNights: 1,
    });

    expect(rows[0].value).toBe('das 14h às 18h');
    expect(rows[2].value).toBe('1 noite');
  });
});

describe('ruleNotes', () => {
  it('turns the yes/no rules into sentences, then adds the free notes of the file', () => {
    expect(ruleNotes('pt', rules)).toEqual([
      'Aqui não se fuma, em nenhum cômodo.',
      'Não aceitamos pets.',
      'Crianças são bem-vindas.',
      'Não temos berço.',
      'Self check-in: mandamos as instruções pelo WhatsApp.',
      'O apartamento fica no andar de cima.',
    ]);
  });

  it('uses the language of the page and skips what the file does not say', () => {
    const bare = { checkIn: rules.checkIn, checkOut: rules.checkOut, minNights: 4 };

    expect(ruleNotes('es', { ...bare, smoking: true, pets: true, children: false })).toEqual([
      'Se puede fumar.',
      'Se aceptan mascotas.',
      'No es apto para chicos.',
    ]);
  });
});

describe('beds', () => {
  it('lists the beds of each room', () => {
    expect(bedLines('pt', sleepingAreas)).toEqual([
      { room: 'No quarto', beds: '1 cama de casal' },
      { room: 'Na sala', beds: '1 sofá-cama' },
    ]);
    expect(
      bedLines('es', [
        {
          room: 'other',
          beds: [
            { type: 'single', count: 2 },
            { type: 'bunkBed', count: 1 },
          ],
        },
      ]),
    ).toEqual([{ room: 'En otro ambiente', beds: '2 camas individuales + 1 cucheta' }]);
  });

  it('sums up every bed with " + "', () => {
    expect(bedSummary('en', sleepingAreas)).toBe('1 double bed + 1 sofa bed');
  });
});

describe('detailRows', () => {
  const property = {
    capacity: { maxGuests: 3 },
    bedrooms: 1,
    bathrooms: 1,
    floorSizeM2: 44,
    floor: 'upper',
    views: ['sea', 'mountain'],
  } as const;

  it('shows capacity, bedrooms, bathroom, size, floor and view', () => {
    expect(detailRows('pt', { ...property, views: [...property.views] })).toEqual([
      { label: 'Capacidade', value: 'Até 3 pessoas' },
      { label: 'Quartos', value: '1 quarto' },
      { label: 'Banheiro', value: '1 banheiro' },
      { label: 'Área', value: '44 m²' },
      { label: 'Andar', value: 'Andar de cima' },
      { label: 'Vista', value: 'Mar, Morros' },
    ]);
  });

  it('calls a property with no bedroom a studio and leaves out what the file does not say', () => {
    expect(detailRows('es', { capacity: { maxGuests: 1 }, bedrooms: 0, bathrooms: 2 })).toEqual([
      { label: 'Capacidad', value: '1 persona' },
      { label: 'Dormitorios', value: 'Monoambiente' },
      { label: 'Baño', value: '2 baños' },
    ]);
  });
});

describe('amenities', () => {
  it('has a label in the 3 languages for every amenity key, and for every group', () => {
    for (const locale of locales) {
      for (const key of amenityKeys) {
        expect(catalog[locale].amenity?.[key], `${locale}/amenity.${key}`).toBeTruthy();
      }
    }
    const groups = amenityGroups('pt', [...amenityKeys]);
    expect(groups.flatMap((group) => group.items)).toHaveLength(amenityKeys.length);
  });

  it('groups the building and property amenities in the fixed category order', () => {
    expect(amenityGroups('pt', ['tv', 'wifi', 'beachGear', 'microwave', 'freeParking'])).toEqual([
      { title: 'Essenciais', items: ['Wi-Fi grátis', 'Garagem grátis'] },
      { title: 'Cozinha', items: ['Micro-ondas'] },
      { title: 'Lazer', items: ['Smart TV de tela plana'] },
      { title: 'Praia', items: ['Cadeiras e guarda-sol de praia'] },
    ]);
  });
});
