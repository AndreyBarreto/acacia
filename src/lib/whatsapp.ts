// WhatsApp links, prefilled messages and the mini form rules (docs/content/microcopy.md §0, §7, §8).
// No i18n import on purpose: the mini form script imports this file, and the catalog would ship with it.
import type { Locale } from './i18n/locales';

/** Reads a key of the `whatsapp` i18n namespace, e.g. (key, vars) => t(locale, `whatsapp.${key}`, vars). */
export type WhatsAppText = (key: string, vars?: Record<string, string>) => string;

export type MessageContext =
  { page: 'home' | 'neighborhood' | 'generic' } | { page: 'property'; name: string; code: string };

export interface Stay {
  checkIn: string; // YYYY-MM-DD
  checkOut: string;
  guests: number;
}

export function whatsappUrl(phone: string, message: string): string {
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error(`WhatsApp number "${phone}" is not in E.164 format ("+" and digits only)`);
  }
  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(message)}`;
}

/** Opening for the context + space + question (§7.1); the question is filled when a stay is given. */
export function whatsappMessage(
  text: WhatsAppText,
  locale: Locale,
  context: MessageContext,
  stay?: Stay,
): string {
  let intro: string;
  if (context.page === 'property') {
    if (!context.name.trim()) throw new Error('WhatsApp message needs the property name');
    if (!context.code.trim()) throw new Error('WhatsApp message needs the property code');
    intro = text('intro.property', { name: context.name, code: context.code });
  } else {
    intro = text(`intro.${context.page}`);
  }
  if (!stay) return `${intro} ${text('ask.blank')}`;
  const plural = new Intl.PluralRules(locale).select(stay.guests) === 'one' ? 'one' : 'other';
  const ask = text(`ask.filled_${plural}`, {
    checkIn: formatStayDate(locale, stay.checkIn),
    checkOut: formatStayDate(locale, stay.checkOut),
    guests: String(stay.guests),
  });
  return `${intro} ${ask}`;
}

const enMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Fixed formats, whatever the browser settings (§0): 12/11/2026 in pt and es, 12 Nov 2026 in en. */
export function formatStayDate(locale: Locale, iso: string): string {
  const [year, month, day] = iso.split('-');
  return locale === 'en'
    ? `${Number(day)} ${enMonths[Number(month) - 1]} ${year}`
    : `${day}/${month}/${year}`;
}

const DAY_MS = 86_400_000;

function toTime(iso: string): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const time = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Date(time).toISOString().startsWith(iso) ? time : undefined;
}

export function addDays(iso: string, days: number): string {
  return new Date((toTime(iso) ?? NaN) + days * DAY_MS).toISOString().slice(0, 10);
}

export type StayField = 'checkIn' | 'checkOut' | 'guests';

export interface StayResult {
  /** One error per field, as a key under `form.errors.` (§8.2). */
  errors: Partial<Record<StayField, string>>;
  stay?: Stay & { nights: number };
}

export function validateStay(
  input: Record<StayField, string>,
  rules: { minNights: number; maxGuests: number },
  today: string,
): StayResult {
  const errors: StayResult['errors'] = {};
  const checkIn = toTime(input.checkIn);
  const checkOut = toTime(input.checkOut);

  if (!input.checkIn) errors.checkIn = 'checkIn.required';
  else if (checkIn === undefined) errors.checkIn = 'checkIn.invalid';
  else if (input.checkIn < today) errors.checkIn = 'checkIn.past';

  const nights =
    checkIn !== undefined && checkOut !== undefined ? (checkOut - checkIn) / DAY_MS : NaN;
  if (!input.checkOut) errors.checkOut = 'checkOut.required';
  else if (checkOut === undefined) errors.checkOut = 'checkOut.invalid';
  else if (nights <= 0) errors.checkOut = 'checkOut.beforeCheckIn';
  else if (nights < rules.minNights) errors.checkOut = 'checkOut.minNights';

  const guests = /^\d+$/.test(input.guests) ? Number(input.guests) : NaN;
  if (Number.isNaN(guests)) errors.guests = 'guests.required';
  else if (guests < 1) errors.guests = 'guests.min';
  else if (guests > rules.maxGuests) errors.guests = 'guests.max';

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    stay: { checkIn: input.checkIn, checkOut: input.checkOut, guests, nights },
  };
}

/** The only icon on the site (docs/design/directions.md): WhatsApp glyph, 24 × 24 viewBox. */
export const whatsappIconPath =
  'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z';
