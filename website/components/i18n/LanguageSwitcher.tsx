"use client";

import { usePathname } from "next/navigation";
import { useId } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LOCALE_META, LOCALES, localizePath, stripLocale, type Locale } from "@/lib/i18n/config";

/* Compact inline flags (3:2) — no external assets. */
function Flag({ locale }: { locale: Locale }) {
  const uid = `flag${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const common = { viewBox: "0 0 30 20", className: "block h-full w-full", "aria-hidden": true } as const;
  if (locale === "en")
    return (
      <svg {...common}>
        <clipPath id={`${uid}c`}>
          <path d="M0 0v20h30V0z" />
        </clipPath>
        <clipPath id={`${uid}t`}>
          <path d="M15 10h15v10zv10H0zH0V0zV0h15z" />
        </clipPath>
        <g clipPath={`url(#${uid}c)`}>
          <path d="M0 0v20h30V0z" fill="#012169" />
          <path d="M0 0l30 20m0-20L0 20" stroke="#fff" strokeWidth="4" />
          <path d="M0 0l30 20m0-20L0 20" clipPath={`url(#${uid}t)`} stroke="#C8102E" strokeWidth="2.6" />
          <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6.6" />
          <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="4" />
        </g>
      </svg>
    );
  if (locale === "ar")
    return (
      <svg {...common}>
        <path fill="#00732F" d="M0 0h30v6.67H0z" />
        <path fill="#fff" d="M0 6.67h30v6.66H0z" />
        <path fill="#000" d="M0 13.33h30V20H0z" />
        <path fill="#FF0000" d="M0 0h8v20H0z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path fill="#fff" d="M0 0h30v6.67H0z" />
      <path fill="#0039A6" d="M0 6.67h30v6.66H0z" />
      <path fill="#D52B1E" d="M0 13.33h30V20H0z" />
    </svg>
  );
}

/**
 * Flag language selector. Links keep the current page (and section hash) in the target language.
 * A full document load is used on purpose: <html lang/dir> and fonts change with the locale.
 */
export function LanguageSwitcher({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const path = stripLocale(pathname);
  const box = size === "sm" ? "h-[14px] w-[21px]" : "h-4 w-6";

  return (
    <nav aria-label={t.nav.language} className={className}>
      <ul className="flex items-center gap-1" dir="ltr">
        {LOCALES.map((l) => {
          const active = l === locale;
          const href = localizePath(l, path);
          return (
            <li key={l}>
              <a
                href={href}
                hrefLang={LOCALE_META[l].htmlLang}
                lang={LOCALE_META[l].htmlLang}
                aria-label={LOCALE_META[l].label}
                aria-current={active ? "true" : undefined}
                title={LOCALE_META[l].label}
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
                className="group flex min-h-11 min-w-9 items-center justify-center"
              >
                <span
                  className={`${box} overflow-hidden rounded-[2px] ring-1 transition-[opacity,filter,box-shadow] duration-300 ${
                    active
                      ? "opacity-100 ring-ember shadow-[0_0_0_2px_rgb(5_5_5)] saturate-100"
                      : "opacity-55 ring-white/20 saturate-[0.6] group-hover:opacity-100 group-hover:saturate-100 group-focus-visible:opacity-100"
                  }`}
                >
                  <Flag locale={l} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
