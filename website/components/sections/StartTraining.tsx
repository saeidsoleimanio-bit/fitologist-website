"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import { START_ID } from "@/lib/site";
import { ApplicationForm } from "./Application";

/**
 * Coaching page — "Ready to start?" + the application form. Anchor: #start.
 * The photo in front of the lit logo wall was removed (§2.5); plain dark background.
 */
export function StartTraining() {
  const { t } = useI18n();
  const titleId = "apply-title";

  return (
    <section id={START_ID} aria-labelledby={titleId} className="section-y relative isolate overflow-hidden bg-ink">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10">
        <Reveal className="eyebrow flex items-center gap-4">
          <AccentLine className="w-10" />
          <span className="text-ember">{t.start.eyebrow}</span>
        </Reveal>
        {/* Observe the (unclipped) heading; the line starts hidden inside an overflow-hidden mask. */}
        <motion.h2
          id={titleId}
          className="display mt-4 text-[clamp(2.5rem,9vw,4.25rem)] leading-[0.9] text-bone"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <span className="block overflow-hidden pb-[0.05em]">
            <motion.span
              className="block"
              variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}
            >
              {t.start.title}
            </motion.span>
          </span>
        </motion.h2>
        <p className="mt-3 text-lg leading-relaxed text-silver lg:text-base">{t.start.body}</p>
        <div className="mt-6" data-fab-hide>
          <ApplicationForm titleId={titleId} />
        </div>
      </div>
    </section>
  );
}
