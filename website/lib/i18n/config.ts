/** Switcher order: EN | فا | ع */
export const LOCALES = ["en", "fa", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const LOCALE_META: Record<
  Locale,
  { dir: "ltr" | "rtl"; label: string; htmlLang: string; ogLocale: string }
> = {
  en: { dir: "ltr", label: "English", htmlLang: "en", ogLocale: "en_AE" },
  fa: { dir: "rtl", label: "فارسی", htmlLang: "fa", ogLocale: "fa_IR" },
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

/**
 * Strip a locale prefix from a pathname → locale-independent path. `/en/...` is stripped too:
 * English pages are prerendered at `/en/...` (proxy rewrite), so that is what usePathname()
 * returns on the server, while the browser sees the clean URL; both must give the same path.
 */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname || "/";
}
