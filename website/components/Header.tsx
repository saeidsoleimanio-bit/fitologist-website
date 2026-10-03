"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageMenu, LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { scrollToSection } from "@/components/providers/ApplicationProvider";
import { InstagramGlyph, WhatsAppGlyph } from "@/components/ui/icons";
import { stripLocale } from "@/lib/i18n/config";
import { EASE } from "@/lib/motion";
import { INSTAGRAM, NAV_ITEMS, SITE, WHATSAPP, startPathFor, whatsappLink } from "@/lib/site";

/**
 * Header (§2.1).
 * - Desktop (xl+): logo · menu · primary button · Instagram · text language switcher. Transparent at
 *   the very top of the page, glass once scrolled; the logo compacts on scroll.
 * - Below xl: always solid; compact 40px logo (same size at top and on scroll); short primary button
 *   (hidden below 360px); language button; hamburger. Instagram and the text switcher live in the drawer.
 */
export function Header() {
  const { t, href } = useI18n();
  const pathname = stripLocale(usePathname() ?? "/");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  /**
   * Links to a section of the current page scroll there directly (and, from the open menu,
   * release the scroll lock first — otherwise the jump is swallowed). Other links navigate.
   */
  const onNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    const [p, hash] = path.split("#");
    document.documentElement.style.overflow = "";
    setOpen(false);
    if (p === pathname) {
      e.preventDefault();
      if (hash) scrollToSection(hash);
      else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  // Drawer: scroll lock, Escape to close, focus trap, close when switching to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const solid = scrolled || open;
  /**
   * Every page (owner revision), below xl, at the very top: transparent header (top gradient for
   * legibility), larger logo, no header CTA. Solid, compact logo and the CTA fades in once scrolled
   * or with the menu open. Hero photos are positioned so these never sit over Saeid's face.
   */
  const homeOverlay = !scrolled && !open;
  const ctaHidden = homeOverlay;
  const startPath = startPathFor(pathname);
  const isActive = (path: string) => !path.includes("#") && pathname === path;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-[240ms] ease-out xl:pt-0 xl:duration-400 ${
          homeOverlay ? "border-transparent bg-transparent" : "border-white/[0.08] bg-ink"
        } ${
          solid
            ? "xl:border-white/[0.08] xl:bg-[rgb(5_5_5/0.72)] xl:backdrop-blur-[14px]"
            : "xl:border-transparent xl:bg-transparent"
        }`}
      >
        {/* Home top state (mobile): black → transparent gradient keeps logo and menu readable over the photo */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+1.5rem)] bg-linear-to-b from-black/60 to-transparent transition-opacity duration-[240ms] ease-out xl:hidden ${
            homeOverlay ? "opacity-100" : "opacity-0"
          }`}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ember focus:px-4 focus:py-2 focus:text-ink"
        >
          {t.nav.skip}
        </a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={`relative mx-auto flex h-[var(--header-compact)] max-w-[88rem] items-center justify-between gap-3 px-4 transition-[height] duration-500 ease-[var(--ease-premium)] sm:px-8 xl:px-12 rtl:lg:px-[clamp(3.5rem,4.2vw,4.25rem)] ${
            solid ? "xl:h-[var(--header-compact)]" : "xl:h-[var(--header-h)]"
          }`}
        >
          <Link
            href={href("/")}
            onClick={(e) => onNavigate(e, "/")}
            className={`relative flex shrink-0 transition-[margin] duration-500 ease-[var(--ease-premium)] xl:self-start ${
              solid ? "xl:mt-[4px]" : "xl:mt-[11px]"
            }`}
            aria-label={`${SITE.name} — ${t.nav.home}`}
          >
            {/*
              Layout size is always 40px below xl; on the Home top state it is scaled up (~68px) by
              transform only, so nothing shifts. Desktop keeps the large-at-top logo that compacts
              on scroll (transform only — asset untouched).
            */}
            <Image
              src="/images/logo-emblem.png"
              alt={SITE.name}
              width={640}
              height={367}
              preload
              sizes="(min-width: 1280px) 168px, 120px"
              className={`h-10 w-auto origin-top-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-[scale] duration-[240ms] ease-out motion-reduce:transition-none rtl:origin-top-right xl:h-[92px] xl:duration-500 ${
                ctaHidden ? "scale-[1.7]" : "scale-100"
              } ${solid ? "xl:scale-[0.7]" : "xl:scale-100"}`}
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label={t.nav.primaryLabel} className="hidden xl:block">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.key}>
                    <Link
                      href={href(item.path)}
                      onClick={(e) => onNavigate(e, item.path)}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex min-h-11 items-center px-3 font-display text-[0.92rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 2xl:px-4 ${
                        active ? "text-ember" : "text-silver hover:text-ember-soft"
                      }`}
                    >
                      {t.nav[item.key]}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 bottom-1.5 h-px bg-ember 2xl:inset-x-4"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-0">
            {/* Primary button — full label on desktop, short label below xl (hidden under 360px) */}
            <Link
              href={href(startPath)}
              onClick={(e) => onNavigate(e, startPath)}
              data-cta="header"
              aria-hidden={ctaHidden ? true : undefined}
              tabIndex={ctaHidden ? -1 : undefined}
              className={`group relative hidden min-h-11 items-center overflow-hidden bg-ember px-3.5 transition-[opacity,visibility] duration-[240ms] ease-out xl:visible xl:pointer-events-auto xl:opacity-100 ${
                ctaHidden ? "pointer-events-none invisible opacity-0" : "visible opacity-100"
              } font-sans text-[0.8rem] font-semibold tracking-[0.01em] text-ink min-[360px]:inline-flex sm:px-4 sm:text-[0.85rem] xl:ms-4 xl:px-5`}
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 rtl:origin-right"
              />
              <span className="relative xl:hidden">{t.nav.ctaShort}</span>
              <span className="relative hidden xl:inline">{t.nav.cta}</span>
            </Link>

            <div className="hidden items-center xl:ms-3 xl:flex">
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.nav.instagram} (${t.common.newTab})`}
                className="flex min-h-11 min-w-11 items-center justify-center text-silver transition-colors duration-300 hover:text-ember-soft"
              >
                <InstagramGlyph className="size-[18px]" />
              </a>
              <span aria-hidden className="mx-1 h-4 w-px bg-bone/15" />
              <LanguageSwitcher />
            </div>

            {/* Mobile language button — left of the hamburger, both header states */}
            <LanguageMenu className="xl:hidden" />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="relative -me-2 flex size-11 items-center justify-center text-bone xl:hidden"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.25 }}
                >
                  {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Drawer — sibling of <header>: its backdrop-filter would otherwise contain this fixed panel. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[calc(var(--header-compact)+env(safe-area-inset-top))] z-40 flex flex-col overflow-y-auto bg-ink px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8 xl:hidden"
          >
            <nav aria-label={t.nav.mobileLabel} className="pt-4">
              <ul className="border-t hairline">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key} className="border-b hairline">
                    <Link
                      href={href(item.path)}
                      onClick={(e) => onNavigate(e, item.path)}
                      aria-current={isActive(item.path) ? "page" : undefined}
                      className={`flex min-h-14 items-center py-2 font-display text-[clamp(1.6rem,7vw,2.1rem)] font-bold uppercase leading-none ${
                        isActive(item.path) ? "text-ember" : "text-bone"
                      }`}
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 space-y-3">
              <Link
                href={href(startPath)}
                onClick={(e) => onNavigate(e, startPath)}
                data-cta="menu"
                className="flex min-h-13 items-center justify-center bg-ember px-5 font-sans text-[0.95rem] font-semibold tracking-[0.01em] text-ink"
              >
                {t.nav.cta}
              </Link>
              <a
                href={whatsappLink(t.common.defaultWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                data-wa="menu"
                className="flex min-h-13 items-center justify-center gap-3 border hairline px-5 font-sans text-[0.95rem] font-semibold tracking-[0.01em] text-bone"
              >
                <WhatsAppGlyph className="size-5" />
                {t.common.whatsappSaeid}
              </a>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.nav.instagram} (${t.common.newTab})`}
                className="flex min-h-11 items-center gap-2 text-silver hover:text-bone"
              >
                <InstagramGlyph className="size-5" />
                <span dir="ltr">{INSTAGRAM.handle}</span>
              </a>
              <LanguageSwitcher />
            </div>
            <p className="mt-2 text-sm text-silver" dir="ltr">
              {WHATSAPP.display}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
