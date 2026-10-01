"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { scrollToSection } from "@/components/providers/ApplicationProvider";
import { InstagramGlyph, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { stripLocale } from "@/lib/i18n/config";
import { EASE } from "@/lib/motion";
import { BMI_PATH, INSTAGRAM, NAV_ITEMS, SITE, START_PATH, WHATSAPP, whatsappLink } from "@/lib/site";

export function Header() {
  const { t, href } = useI18n();
  const pathname = stripLocale(usePathname() ?? "/");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  // Mobile menu: scroll lock, Escape to close, focus trap, close on desktop resize.
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
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const menuItems = [
    ...NAV_ITEMS.map((n) => ({ key: n.key, path: n.path as string, label: t.nav[n.key] })),
    { key: "bmi", path: BMI_PATH, label: t.nav.bmi },
    { key: "start", path: START_PATH, label: t.nav.startTraining },
  ];

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-400 ease-[var(--ease-premium)] ${
          solid
            ? "border-white/[0.08] bg-[rgb(5_5_5/0.72)] backdrop-blur-[14px]"
            : "border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ember focus:px-4 focus:py-2 focus:text-ink"
        >
          {t.nav.skip}
        </a>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className={`mx-auto flex max-w-[88rem] items-center justify-between px-5 transition-[height] duration-500 ease-[var(--ease-premium)] sm:px-8 lg:px-12 rtl:lg:px-[clamp(3.5rem,4.2vw,4.25rem)] ${
            solid ? "h-[var(--header-compact)]" : "h-[var(--header-h)]"
          }`}
        >
          <Link
            href={href("/")}
            onClick={(e) => onNavigate(e, "/")}
            className={`relative flex self-start transition-[margin] duration-500 ease-[var(--ease-premium)] ${
              solid ? "mt-[10px] lg:mt-[4px]" : "mt-3 lg:mt-[11px]"
            }`}
            aria-label={`${SITE.name} — ${t.nav.home}`}
          >
            {/*
              Complete official logo. Rendered at its large "top of page" size (≈1.45×) and scaled
              down to the compact size once scrolling starts (transform only — asset untouched).
              At the top it is allowed to hang slightly below the header.
            */}
            <Image
              src="/images/logo-emblem.png"
              alt={SITE.name}
              width={640}
              height={367}
              preload
              sizes="(min-width: 1024px) 168px, 112px"
              className={`h-[62px] w-auto origin-top-left rtl:origin-top-right drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-[scale] duration-500 ease-[var(--ease-premium)] motion-reduce:transition-none lg:h-[92px] ${
                solid ? "scale-[0.71] lg:scale-[0.7]" : "scale-100"
              }`}
            />
          </Link>

          <div className="flex items-center gap-2 lg:gap-0">
          <nav aria-label={t.nav.primaryLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.key}>
                    <Link
                      href={href(item.path)}
                      onClick={(e) => onNavigate(e, item.path)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex min-h-11 items-center px-4 font-display text-[0.95rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                        isActive ? "text-ember" : "text-silver hover:text-ember-soft"
                      }`}
                    >
                      {t.nav[item.key]}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 bottom-1.5 h-px bg-ember"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="ms-3 xl:ms-5">
                <Link
                  href={href(BMI_PATH)}
                  onClick={(e) => onNavigate(e, BMI_PATH)}
                  className="cta-pulse group relative inline-flex min-h-11 items-center overflow-hidden border border-ember/70 px-5 font-sans text-[0.875rem] font-semibold uppercase tracking-[0.1em] text-bone transition-[border-color] duration-300 hover:border-ember xl:px-6"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-ember/20 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 rtl:origin-right"
                  />
                  <span className="relative">{t.nav.bmi}</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center lg:ms-4">
            <a
              href={INSTAGRAM.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.about.followAria} (${t.common.newTab})`}
              title="Instagram"
              className="flex min-h-11 min-w-9 items-center justify-center text-silver transition-colors duration-300 hover:text-ember-soft"
            >
              <InstagramGlyph className="size-[18px]" />
            </a>
            <span aria-hidden className="mx-1 h-4 w-px bg-bone/15" />
            <LanguageSwitcher size="sm" />
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="relative -me-2 flex size-12 items-center justify-center text-bone lg:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.25 }}
              >
                {open ? (
                  <X className="size-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="size-6" strokeWidth={1.5} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
          </div>
        </motion.div>
      </header>

      {/* Sibling of <header>: its backdrop-filter would otherwise become the containing block for this fixed panel. */}
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
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-compact)] z-40 flex flex-col overflow-y-auto bg-ink px-5 pb-8 sm:px-8 lg:hidden"
          >
            <nav aria-label={t.nav.mobileLabel} className="flex-1 pt-6">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                }}
                className="border-t hairline"
              >
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.key}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="border-b hairline"
                  >
                    <Link
                      href={href(item.path)}
                      onClick={(e) => onNavigate(e, item.path)}
                      aria-current={pathname === item.path ? "page" : undefined}
                      className="flex min-h-16 items-center justify-between py-3 font-display text-[clamp(2rem,10vw,2.75rem)] font-bold uppercase leading-none tracking-tight"
                    >
                      <span className={item.key === "start" ? "text-ember" : "text-bone"}>
                        {item.label}
                      </span>
                      <span className="font-display text-sm font-semibold tracking-[0.2em] text-steel">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35 } }}
              className="mt-10 space-y-4"
            >
              <a
                href={whatsappLink(t.common.defaultWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-center gap-3 bg-ember px-5 font-display text-base font-semibold uppercase tracking-[0.18em] text-ink"
              >
                <WhatsAppIcon className="size-5" />
                {t.common.whatsappSaeid}
              </a>
              <div className="flex items-center justify-between text-sm text-silver">
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 hover:text-bone"
                >
                  <InstagramIcon className="size-4" />
                  {INSTAGRAM.handle}
                </a>
                <span dir="ltr">{WHATSAPP.display}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
