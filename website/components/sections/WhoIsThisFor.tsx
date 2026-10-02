"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Dumbbell, Footprints } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";

/* Line-art per audience: busy professionals · beginners (first steps) · already training */
const PROFILE_ICONS = [BriefcaseBusiness, Footprints, Dumbbell];

/**
 * "Who I work with" — editorial rows (typography + fine rules, no cards). Each row carries a
 * neon-orange line-art icon with a soft glow in its own right-hand column, on mobile too
 * (owner-approved exception to §2.6), so it never overlaps titles or body text.
 */
export function WhoIsThisFor() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="who-title" className="section-y surface-deep relative overflow-hidden [--glow-x:15%] [--glow-y:35%]">
      <div className="relative mx-auto grid max-w-[88rem] gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div className="lg:col-span-5">
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span>{t.who.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="who-title" className="display mt-4 text-[clamp(2.6rem,8.5vw,5.25rem)] text-bone text-balance">
              {t.who.title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-silver">{t.who.intro}</p>
          </Reveal>
        </div>

        <motion.ol
          className="self-end border-t hairline lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {t.who.profiles.map((p, i) => {
            const Icon = PROFILE_ICONS[i];
            return (
              <motion.li
                key={p.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
                className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_4rem] items-baseline gap-x-3 border-b hairline py-6 sm:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)_5.5rem] sm:gap-x-6 sm:py-7"
              >
                <span
                  aria-hidden
                  className="absolute bottom-0 start-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-x-100 rtl:origin-right"
                />
                <span className="font-display text-sm font-semibold tracking-[0.12em] text-ember">0{i + 1}</span>
                <h3 className="display text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold text-bone transition-colors duration-300 group-hover:text-ember-soft">
                  {p.title}
                </h3>
                <p className="col-start-2 row-start-2 mt-2 text-base leading-relaxed text-silver sm:col-start-3 sm:row-start-1 sm:mt-0">
                  {p.body}
                </p>
                {/* Neon line-art in its own column — never over text */}
                <Icon
                  aria-hidden
                  strokeWidth={1.25}
                  className="col-start-3 row-span-2 row-start-1 size-14 self-center justify-self-end text-[#ff7a1a] opacity-90 transition-[opacity,scale] duration-500 [filter:drop-shadow(0_0_6px_rgb(255_106_0/0.7))_drop-shadow(0_0_16px_rgb(255_106_0/0.35))] group-hover:scale-105 group-hover:opacity-100 sm:col-start-4 sm:row-span-1 sm:size-16 lg:size-[4.5rem]"
                />
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
