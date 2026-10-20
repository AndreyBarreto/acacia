import { locales, type Locale } from './locales';

type Namespace = Record<string, string>;

const files = import.meta.glob<Namespace>('../../i18n/*/*.json', {
  eager: true,
  import: 'default',
});

// catalog[locale][namespace][key]
export const catalog: Record<Locale, Record<string, Namespace>> = { pt: {}, en: {}, es: {} };

for (const [path, strings] of Object.entries(files)) {
  const [, locale, file] = /\/i18n\/(\w+)\/(\w+)\.json$/.exec(path) ?? [];
  if ((locales as readonly string[]).includes(locale)) {
    catalog[locale as Locale][file] = strings;
  }
}

/** t('en', 'common.lang.label'): first segment is the namespace file, the rest is the key. */
export function t(locale: Locale, fullKey: string, vars: Record<string, string> = {}): string {
  const dot = fullKey.indexOf('.');
  const namespace = fullKey.slice(0, dot);
  const key = fullKey.slice(dot + 1);
  const value = catalog[locale][namespace]?.[key];
  if (value === undefined) {
    throw new Error(`Missing i18n key "${key}" in namespace "${namespace}" (${locale})`);
  }
  return value.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in vars)) throw new Error(`Missing value for {${name}} in "${fullKey}" (${locale})`);
    return vars[name];
  });
}
