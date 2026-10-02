"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { WHATSAPP_GREEN, WhatsAppGlyph } from "@/components/ui/icons";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";

/**
 * Elements that make the floating button redundant while visible (§2.3): inline WhatsApp links,
 * primary CTAs (`[data-fab-hide]`), the form and the BMI result card (also `[data-fab-hide]`),
 * and the footer.
 */
const HIDE_SELECTOR = 'a[href^="https://wa.me"]:not([data-fab]), [data-fab-hide], footer';
/** Interactive controls the button must never sit on top of (links, buttons, inputs, chips). */
const CONTROL_SELECTOR = "a, button, input, label, select, textarea, summary, [role='button']";

/**
 * Floating "Chat with Saeid on WhatsApp" button — 56px, reading-end corner, safe-area aware.
 * Visible by default. Hidden while any HIDE_SELECTOR element is in
 * view, or when it would sit over an interactive control (it may pass over plain text and photos).
 * Reappears after a short settle delay so it doesn't flicker while scrolling.
 */
export function FloatingWhatsApp() {
  const { t } = useI18n();
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);
  const footprint = useRef<HTMLSpanElement>(null);
  const [blockingInView, setBlockingInView] = useState(false);
  const [overControl, setOverControl] = useState(false);

  // Observe every hide-trigger element; re-collect when the page or its content changes.
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setBlockingInView(visible.size > 0);
      },
      { threshold: 0 },
    );
    const collect = () => {
      io.disconnect();
      visible.clear();
      document.querySelectorAll(HIDE_SELECTOR).forEach((el) => io.observe(el));
    };
    collect();
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(collect);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Scroll position + "is an interactive control underneath the button's footprint?"
  useEffect(() => {
    let raf = 0;
    let settle = 0;
    const check = () => {
      // Footprint = an invisible sentinel with the button's exact position (incl. safe area).
      const r = footprint.current?.getBoundingClientRect();
      if (!r) return;
      const pts = [
        [r.left + r.width / 2, r.top + r.height / 2],
        [r.left + 4, r.top + 4],
        [r.right - 4, r.top + 4],
        [r.left + 4, r.bottom - 4],
        [r.right - 4, r.bottom - 4],
      ];
      const hit = pts.some(([x, y]) =>
        document.elementsFromPoint(x, y).some((el) => {
          if (ref.current?.contains(el) || el.closest("[data-fab]")) return false;
          return !!el.closest(CONTROL_SELECTOR);
        }),
      );
      // Hide immediately; reappear only once the spot has stayed clear briefly (no flicker).
      window.clearTimeout(settle);
      if (hit) setOverControl(true);
      else settle = window.setTimeout(() => setOverControl(false), 250);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const visible = !blockingInView && !overControl;

  const position =
    "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-30 size-14 rounded-full sm:end-6";

  return (
    <>
    <span ref={footprint} aria-hidden className={`pointer-events-none invisible ${position}`} />
    <AnimatePresence>
      {visible && (
        <motion.a
          key="wa-fab"
          ref={ref}
          data-fab
          href={whatsappLink(t.common.defaultWhatsAppMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.common.chatOnWhatsApp}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`${position} flex items-center justify-center text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]`}
          style={{ backgroundColor: WHATSAPP_GREEN }}
        >
          <WhatsAppGlyph className="size-8" color="#fff" handset={WHATSAPP_GREEN} />
        </motion.a>
      )}
    </AnimatePresence>
    </>
  );
}
