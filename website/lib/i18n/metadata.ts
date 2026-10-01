import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALE_META, LOCALES, PAGES, localizePath, type Locale } from "./config";
import { getDictionary } from "./index";

export type PageKey = keyof typeof PAGES;

/** hreflang alternates for one page: every locale + x-default (English). */
export function languageAlternates(page: PageKey): Record<string, string> {
  const path = PAGES[page];
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_META[l].htmlLang] = localizePath(l, path);
  languages["x-default"] = localizePath(DEFAULT_LOCALE, path);
  return languages;
}

/** Title/description, canonical, hreflang and Open Graph for a localized page. */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const t = getDictionary(locale);
  const { title, description } =
    page === "home" ? { title: t.meta.siteTitle, description: t.meta.siteDescription } : t.meta[page];
  const url = localizePath(locale, PAGES[page]);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(page) },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title,
      description,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale),
      images: [
        {
          url: "/images/og.jpg",
          width: 1200,
          height: 630,
          alt: "Saeid, personal trainer, in a gym in front of the FITologist.me logo",
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/og.jpg"] },
  };
}
