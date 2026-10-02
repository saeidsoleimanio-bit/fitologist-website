export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const LOCALE_META: Record<
  Locale,
  { dir: "ltr" | "rtl"; label: string; htmlLang: string; ogLocale: string }
> = {
  en: { dir: "ltr", label: "English", htmlLang: "en", ogLocale: "en_AE" },
  ar: { dir: "rtl", label: "العربية", htmlLang: "ar", ogLocale: "ar_AE" },
};

/** Site pages (locale-independent paths). */
export const PAGES = {
  home: "/",
  about: "/about",
  method: "/method",
  plans: "/plans",
  bmi: "/bmi",
  start: "/start",
  terms: "/terms",
  privacy: "/privacy",
} as const;

/**
 * Build a localized href. English is unprefixed (`/about`), other locales are
 * prefixed (`/ar/about`). Hashes are preserved (`/#bmi` → `/ar#bmi`).
 */
export function localizePath(locale: Locale, path: string): string {
  const [pathname, hash] = path.split("#");
  const clean = pathname === "" ? "/" : pathname;
  const base = locale === DEFAULT_LOCALE ? clean : `/${locale}${clean === "/" ? "" : clean}`;
  return hash ? `${base}#${hash}` : base;
}

/** Strip a locale prefix from a pathname → locale-independent path. */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname || "/";
}
