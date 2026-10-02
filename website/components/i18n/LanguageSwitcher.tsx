"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LOCALE_META, LOCALES, localizePath, stripLocale, type Locale } from "@/lib/i18n/config";

/** Short text labels for the switcher (`EN | ع`). Persian (`فا`) is added with the /fa locale. */
const SHORT: Record<Locale, string> = { en: "EN", ar: "ع" };

/** Keeps the current section hash when switching; the active language is a no-op. */
function onSwitch(e: React.MouseEvent<HTMLAnchorElement>, active: boolean, href: string) {
  if (active) {
    e.preventDefault();
    return;
  }
  const hash = window.location.hash;
  if (hash) {
    e.preventDefault();
    window.location.assign(href + hash);
  }
}

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
                  onClick={(e) => onSwitch(e, active, href)}
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

/**
 * Compact mobile header language button (left of the hamburger): shows the current code and opens a
 * small dropdown of languages. Closes on outside tap, Escape, or choosing a language.
 */
export function LanguageMenu({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const path = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.changeLanguage}
        aria-expanded={open}
        aria-controls={listId}
        className="flex size-11 items-center justify-center gap-0.5 font-sans text-[0.9rem] font-semibold text-bone drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
      >
        <span lang={LOCALE_META[locale].htmlLang}>{SHORT[locale]}</span>
        <ChevronDown aria-hidden className={`size-3.5 text-silver transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
      {open && (
        <ul
          id={listId}
          aria-label={t.nav.language}
          className="absolute end-0 top-full z-10 mt-1 min-w-36 border hairline bg-carbon py-1 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]"
        >
          {LOCALES.map((l) => {
            const active = l === locale;
            const href = localizePath(l, path);
            return (
              <li key={l}>
                <a
                  href={href}
                  hrefLang={LOCALE_META[l].htmlLang}
                  lang={LOCALE_META[l].htmlLang}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => {
                    onSwitch(e, active, href);
                    if (active) setOpen(false);
                  }}
                  className={`flex min-h-11 items-center justify-between gap-4 px-4 text-[0.95rem] font-medium ${
                    active ? "text-ember" : "text-bone hover:text-ember-soft"
                  }`}
                >
                  {LOCALE_META[l].label}
                  <span aria-hidden className="text-[0.8rem] text-silver">
                    {SHORT[l]}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
