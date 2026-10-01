"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { WHATSAPP_GREEN, WhatsAppGlyph } from "@/components/ui/icons";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";

/**
 * Compact floating "Chat on WhatsApp" button (bottom corner on the reading-end side).
 * Stays hidden at the very top (where the hero CTAs are) and fades in once the visitor is about a
 * third of the way through the first screen.
 */
export function FloatingWhatsApp() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.35);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="wa-fab"
          href={whatsappLink(t.common.defaultWhatsAppMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.common.chatOnWhatsApp} (${t.common.newTab})`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-30 flex h-12 items-center gap-2.5 rounded-full p-1 pe-1 text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] transition-[padding] duration-300 sm:end-6 sm:pe-4"
          style={{ backgroundColor: WHATSAPP_GREEN }}
        >
          <span className="flex size-10 items-center justify-center">
            <WhatsAppGlyph className="size-7" color="#fff" handset={WHATSAPP_GREEN} />
          </span>
          <span className="hidden font-sans text-[0.85rem] font-semibold tracking-[0.01em] sm:inline">
            {t.common.chatOnWhatsApp}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
