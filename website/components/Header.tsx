"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { scrollToSection } from "@/components/providers/ApplicationProvider";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { EASE } from "@/lib/motion";
import {
  BMI_SECTION,
  CTA_SECTION,
  DEFAULT_WHATSAPP_MESSAGE,
  INSTAGRAM,
  NAV_ITEMS,
  SITE,
  WHATSAPP,
  whatsappLink,
} from "@/lib/site";

const SECTION_IDS = [...NAV_ITEMS.map((n) => n.id), BMI_SECTION.id, CTA_SECTION.id];

function useActiveSection() {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  /** Menu links: release the scroll lock first, otherwise the anchor jump is swallowed. */
  const navigateFromMenu = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!open) return;
    e.preventDefault();
    document.documentElement.style.overflow = "";
    setOpen(false);
    scrollToSection(id);
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
          Skip to content
        </a>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className={`mx-auto flex max-w-[88rem] items-center justify-between px-5 transition-[height] duration-500 ease-[var(--ease-premium)] sm:px-8 lg:px-12 ${
            solid ? "h-[var(--header-compact)]" : "h-[var(--header-h)]"
          }`}
        >
          <a
            href="#home"
            onClick={(e) => navigateFromMenu(e, "home")}
            className={`relative flex self-start transition-[margin] duration-500 ease-[var(--ease-premium)] ${
              solid ? "mt-[10px] lg:mt-[4px]" : "mt-3 lg:mt-[11px]"
            }`}
            aria-label={`${SITE.name} — back to top`}
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
              className={`h-[62px] w-auto origin-top-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-[scale] duration-500 ease-[var(--ease-premium)] motion-reduce:transition-none lg:h-[92px] ${
                solid ? "scale-[0.71] lg:scale-[0.7]" : "scale-100"
              }`}
            />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative flex min-h-11 items-center px-4 font-display text-[0.95rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                        isActive ? "text-ember" : "text-silver hover:text-ember-soft"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 bottom-1.5 h-px bg-ember"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
              <li className="ml-5">
                <a
                  href={`#${BMI_SECTION.id}`}
                  aria-current={active === BMI_SECTION.id ? "location" : undefined}
                  className="cta-pulse group relative inline-flex min-h-11 items-center overflow-hidden border border-ember/70 px-6 font-sans text-[0.875rem] font-semibold uppercase tracking-[0.1em] text-bone transition-[border-color] duration-300 hover:border-ember aria-[current]:border-ember"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-ember/20 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 group-aria-[current]:scale-x-100"
                  />
                  <span className="relative">{BMI_SECTION.label}</span>
                </a>
              </li>
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2 flex size-12 items-center justify-center text-bone lg:hidden"
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
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-compact)] z-40 flex flex-col overflow-y-auto bg-ink px-5 pb-8 sm:px-8 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex-1 pt-6">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                }}
                className="border-t hairline"
              >
                {[...NAV_ITEMS, BMI_SECTION, CTA_SECTION].map((item, i) => (
                  <motion.li
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="border-b hairline"
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => navigateFromMenu(e, item.id)}
                      aria-current={active === item.id ? "location" : undefined}
                      className="flex min-h-16 items-center justify-between py-3 font-display text-[clamp(2rem,10vw,2.75rem)] font-bold uppercase leading-none tracking-tight"
                    >
                      <span className={item.id === CTA_SECTION.id ? "text-ember" : "text-bone"}>
                        {item.label}
                      </span>
                      <span className="font-display text-sm font-semibold tracking-[0.2em] text-steel">
                        0{i + 1}
                      </span>
                    </a>
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
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-center gap-3 bg-ember px-5 font-display text-base font-semibold uppercase tracking-[0.18em] text-ink"
              >
                <WhatsAppIcon className="size-5" />
                WhatsApp Saeid
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
                <span>{WHATSAPP.display}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
