import type { MetadataRoute } from "next";
import { LOCALES, PAGES, localizePath } from "@/lib/i18n/config";
import { languageAlternates } from "@/lib/i18n/metadata";
import { SITE } from "@/lib/site";

const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

/** Every page in every language, each listing its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(PAGES) as (keyof typeof PAGES)[]).flatMap((page) =>
    LOCALES.map((locale) => ({
      url: abs(localizePath(locale, PAGES[page])) || SITE.url,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page)).map(([k, v]) => [k, abs(v) || SITE.url]),
        ),
      },
    })),
  );
}
