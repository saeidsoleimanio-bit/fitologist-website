"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { WHATSAPP_GREEN, WhatsAppGlyph } from "@/components/ui/icons";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";

/** Buttons the floating button must never sit on: the form submit, "Check my numbers" and the Body Check result buttons. */
const AVOID_SELECTOR = "[data-fab-avoid]";
/** Fields that open the on-screen keyboard. */
const TEXT_ENTRY =
  "textarea, select, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=range])";

/**
 * Floating "Chat with Saeid on WhatsApp" button — 56px, fixed bottom corner, safe-area aware,
 * visible at all times while scrolling. Only two exceptions (owner revision of §2.3):
 * (a) hidden while a text input / textarea is focused (keyboard open);
 * (b) hidden while it would sit directly over the form submit, the Body Check "Check my numbers"
 *     button or the Body Check result buttons.
 */
export function FloatingWhatsApp() {
  const { t } = useI18n();
  const pathname = usePathname();
  const footprint = useRef<HTMLSpanElement>(null);
  const [typing, setTyping] = useState(false);
  const [overButton, setOverButton] = useState(false);

  // (a) Keyboard open
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      // after focusout, activeElement settles on the next frame
      raf = requestAnimationFrame(() => setTyping(!!document.activeElement?.matches?.(TEXT_ENTRY)));
    };
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  // (b) Overlap with the protected buttons — checked on scroll, resize and DOM changes
  useEffect(() => {
    let raf = 0;
    const check = () => {
      const f = footprint.current?.getBoundingClientRect();
      if (!f) return;
      const hit = Array.from(document.querySelectorAll(AVOID_SELECTOR)).some((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left < f.right && r.right > f.left && r.top < f.bottom && r.bottom > f.top;
      });
      setOverButton(hit);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const visible = !typing && !overButton;
  const position = "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-30 size-14 rounded-full sm:end-6";

  return (
    <>
      <span ref={footprint} aria-hidden className={`pointer-events-none invisible ${position}`} />
      <AnimatePresence>
        {visible && (
          <motion.a
            key="wa-fab"
            data-fab
            href={whatsappLink(t.common.defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.chatOnWhatsApp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: EASE }}
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
