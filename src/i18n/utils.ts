import de from './de.json';
import en from './en.json';
import nl from './nl.json';

export type Locale = 'de' | 'en' | 'nl';
export const locales: Locale[] = ['de', 'en', 'nl'];
export const defaultLocale: Locale = 'de';

const dictionaries = { de, en, nl } as const;

export type Dictionary = typeof de;

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) return lang as Locale;
  return defaultLocale;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/(de|en|nl)/, '');
  return `/${locale}${cleanPath || '/'}`;
}

export function getAlternateLinks(
  currentPath: string,
  siteUrl: string
): Array<{ locale: string; href: string }> {
  const cleanPath = currentPath.replace(/^\/(de|en|nl)/, '');
  const links: Array<{ locale: string; href: string }> = locales.map((locale) => ({
    locale,
    href: `${siteUrl}/${locale}${cleanPath || '/'}`,
  }));
  links.push({ locale: 'x-default', href: `${siteUrl}/` });
  return links;
}

/** Map locale to OpenGraph locale string */
export function getOgLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    de: 'de_AT',
    en: 'en_US',
    nl: 'nl_NL',
  };
  return map[locale];
}

/** Get the privacy page path for a locale */
export function getPrivacyPath(locale: Locale): string {
  if (locale === 'de') return `/${locale}/datenschutz`;
  return `/${locale}/privacy`;
}

/** Get the imprint page path for a locale */
export function getImprintPath(locale: Locale): string {
  if (locale === 'de') return `/${locale}/impressum`;
  if (locale === 'en') return `/${locale}/imprint`;
  return `/${locale}/impressum`;
}
