// Texts the property page derives from the structured fields of a property file
// (docs/content/microcopy.md §0 formats, §3 details and rules, §4 amenities).
import type { amenityKeys } from './content/schemas';
import type { Locale } from './i18n/locales';
import { t } from './i18n/t';

type AmenityKey = (typeof amenityKeys)[number];
type Vars = Record<string, string>;

const text = (locale: Locale, key: string, vars?: Vars) => t(locale, `property.${key}`, vars);

const plural = (locale: Locale, count: number) =>
  new Intl.PluralRules(locale).select(count) === 'one' ? 'one' : 'other';

const counted = (locale: Locale, key: string, count: number, vars: Vars = {}) =>
  text(locale, `${key}_${plural(locale, count)}`, { count: String(count), ...vars });

export interface Row {
  label: string;
  value: string;
}

/** "14:00" → 14h (pt) · 2 pm (en) · 14 h (es); "10:30" → 10h30 · 10:30 am · 10:30 h. */
export function formatHour(locale: Locale, time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  if (locale === 'en') {
    const clock = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = hour < 12 ? 'am' : 'pm';
    return minutes === '00' ? `${clock} ${suffix}` : `${clock}:${minutes} ${suffix}`;
  }
  if (locale === 'es') return minutes === '00' ? `${hour} h` : `${hour}:${minutes} h`;
  return minutes === '00' ? `${hour}h` : `${hour}h${minutes}`;
}

interface Rules {
  checkIn: { from: string; until?: string };
  checkOut: { until: string };
  minNights: number;
  smoking: boolean;
  pets: boolean;
  children: boolean;
  crib?: boolean;
  selfCheckIn?: boolean;
  notes?: Partial<Record<Locale, string[]>>;
}

/** Check-in, check-out and minimum stay, as label/value rows. */
export function ruleRows(locale: Locale, rules: Rules): Row[] {
  const from = formatHour(locale, rules.checkIn.from);
  const checkIn = rules.checkIn.until
    ? text(locale, 'rules.checkIn.range', {
        from,
        until: formatHour(locale, rules.checkIn.until),
      })
    : text(locale, 'rules.checkIn.from', { from });
  return [
    { label: text(locale, 'rules.checkIn.label'), value: checkIn },
    {
      label: text(locale, 'rules.checkOut.label'),
      value: text(locale, 'rules.checkOut.until', {
        until: formatHour(locale, rules.checkOut.until),
      }),
    },
    {
      label: text(locale, 'rules.minNights.label'),
      value: counted(locale, 'rules.minNights.value', rules.minNights),
    },
  ];
}

/** The yes/no rules as sentences, followed by the free notes of the property file. */
export function ruleNotes(locale: Locale, rules: Rules): string[] {
  const yesNo = (key: string, value: boolean) =>
    text(locale, `rules.${key}.${value ? 'yes' : 'no'}`);
  const notes = [
    yesNo('smoking', rules.smoking),
    yesNo('pets', rules.pets),
    yesNo('children', rules.children),
  ];
  if (rules.crib !== undefined) notes.push(yesNo('crib', rules.crib));
  if (rules.selfCheckIn) notes.push(text(locale, 'rules.selfCheckIn'));
  return [...notes, ...(rules.notes?.[locale] ?? [])];
}

interface SleepingArea {
  room: 'bedroom' | 'livingRoom' | 'other';
  beds: readonly { type: string; count: number }[];
}

const bedList = (locale: Locale, beds: SleepingArea['beds']) =>
  beds.map((bed) => counted(locale, `bed.${bed.type}`, bed.count)).join(' + ');

/** "No quarto" · "1 cama de casal", one line per room. */
export function bedLines(
  locale: Locale,
  areas: readonly SleepingArea[],
): { room: string; beds: string }[] {
  return areas.map((area) => ({
    room: text(locale, `bed.room.${area.room}`),
    beds: bedList(locale, area.beds),
  }));
}

/** Every bed of the property: "1 cama de casal + 1 sofá-cama". */
export function bedSummary(locale: Locale, areas: readonly SleepingArea[]): string {
  return bedList(
    locale,
    areas.flatMap((area) => area.beds),
  );
}

interface Details {
  capacity: { maxGuests: number };
  bedrooms: number;
  bathrooms: number;
  floorSizeM2?: number;
  floor?: 'ground' | 'upper';
  views?: string[];
}

export function detailRows(locale: Locale, property: Details): Row[] {
  const row = (key: string, value: string) => ({
    label: text(locale, `detail.${key}.label`),
    value,
  });
  const rows = [
    row('capacity', counted(locale, 'detail.capacity.value', property.capacity.maxGuests)),
    row(
      'bedrooms',
      property.bedrooms === 0
        ? text(locale, 'detail.bedrooms.studio')
        : counted(locale, 'detail.bedrooms.value', property.bedrooms),
    ),
    row('bathrooms', counted(locale, 'detail.bathrooms.value', property.bathrooms)),
  ];
  if (property.floorSizeM2) {
    rows.push(row('size', text(locale, 'detail.size.value', { m2: String(property.floorSizeM2) })));
  }
  if (property.floor) rows.push(row('floor', text(locale, `detail.floor.${property.floor}`)));
  if (property.views?.length) {
    rows.push(
      row('view', property.views.map((view) => text(locale, `detail.view.${view}`)).join(', ')),
    );
  }
  return rows;
}

// Categories of docs/plan/data-model.md §6, in the order the page shows them.
const groupOf: Record<AmenityKey, string> = {
  wifi: 'essentials',
  freeParking: 'essentials',
  airConditioning: 'essentials',
  heating: 'essentials',
  fan: 'essentials',
  kitchen: 'kitchen',
  ovenStove: 'kitchen',
  microwave: 'kitchen',
  refrigerator: 'kitchen',
  minibar: 'kitchen',
  coffeeMaker: 'kitchen',
  kitchenware: 'kitchen',
  diningTable: 'kitchen',
  tv: 'leisure',
  streaming: 'leisure',
  desk: 'work',
  bedLinen: 'bedBath',
  towels: 'bedBath',
  hairDryer: 'bedBath',
  wardrobe: 'bedBath',
  iron: 'services',
  ironingBoard: 'services',
  washer: 'services',
  dryingRack: 'services',
  balcony: 'outdoor',
  patio: 'outdoor',
  outdoorFurniture: 'outdoor',
  grill: 'outdoor',
  pool: 'outdoor',
  beachGear: 'beach',
  privateEntrance: 'access',
  wheelchairAccessible: 'access',
  stairsOnly: 'access',
  stepFree: 'access',
  elevator: 'access',
  fireExtinguisher: 'safety',
};

const groupOrder = [
  'essentials',
  'kitchen',
  'leisure',
  'work',
  'bedBath',
  'services',
  'outdoor',
  'beach',
  'access',
  'safety',
];

/** Amenity labels by category, keeping the order of the keys inside each category. */
export function amenityGroups(
  locale: Locale,
  keys: AmenityKey[],
): { title: string; items: string[] }[] {
  return groupOrder
    .map((group) => ({
      title: t(locale, `amenity.group.${group}`),
      items: keys.filter((key) => groupOf[key] === group).map((key) => t(locale, `amenity.${key}`)),
    }))
    .filter((group) => group.items.length > 0);
}
