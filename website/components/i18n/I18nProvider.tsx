"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { LOCALE_META, localizePath, type Locale } from "@/lib/i18n/config";

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  /** Localize a site path, e.g. href("/plans#start"). */
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

/** Supplies the active locale and its dictionary (loaded once on the server) to client components. */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir: LOCALE_META[locale].dir,
      t: dictionary,
      href: (path: string) => localizePath(locale, path),
    }),
    [locale, dictionary],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
