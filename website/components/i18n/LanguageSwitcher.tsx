"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LOCALE_META, LOCALES, localizePath, stripLocale, type Locale } from "@/lib/i18n/config";

/** Short text labels for the switcher (`EN | ع`). Persian (`فا`) is added with the /fa locale. */
const SHORT: Record<Locale, string> = { en: "EN", ar: "ع" };

/**
 * Text language selector (no flags). Links keep the current page (and section hash) in the
 * target language. A full document load is used on purpose: <html lang/dir> and fonts change.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const path = stripLocale(pathname);

  return (
    <nav aria-label={t.nav.language} className={className}>
      <ul className="flex items-center" dir="ltr">
        {LOCALES.map((l, i) => {
          const active = l === locale;
          const href = localizePath(l, path);
          return (
            <Fragment key={l}>
              {i > 0 && (
                <li aria-hidden className="px-0.5 text-bone/40">
                  |
                </li>
              )}
              <li>
                <a
                  href={href}
                  hrefLang={LOCALE_META[l].htmlLang}
                  lang={LOCALE_META[l].htmlLang}
                  aria-label={LOCALE_META[l].label}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => {
                    if (active) {
                      e.preventDefault();
                      return;
                    }
                    const hash = window.location.hash;
                    if (hash) {
                      e.preventDefault();
                      window.location.assign(href + hash);
                    }
                  }}
                  className={`flex min-h-11 min-w-11 items-center justify-center px-1.5 font-sans text-[0.9rem] font-semibold transition-colors duration-300 ${
                    active ? "text-ember" : "text-silver hover:text-bone"
                  }`}
                >
                  {SHORT[l]}
                </a>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
