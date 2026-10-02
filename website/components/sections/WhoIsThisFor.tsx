"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Footprints, type LucideProps } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";

/** Barbell line drawing (plates + collar + bar) in the same 24-unit, round-cap style as lucide. */
function Barbell(props: LucideProps) {
  const { strokeWidth = 1, className } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M1.5 12h21" />
      <rect x="3.5" y="7" width="2" height="10" rx="0.6" />
      <rect x="6" y="8.5" width="1.6" height="7" rx="0.5" />
      <rect x="18.5" y="7" width="2" height="10" rx="0.6" />
      <rect x="16.4" y="8.5" width="1.6" height="7" rx="0.5" />
      <path d="M8.6 10.8v2.4M15.4 10.8v2.4" />
    </svg>
  );
}

/* Background vectors per audience: professional workspace · first steps · loaded barbell */
const PROFILE_ICONS = [BriefcaseBusiness, Footprints, Barbell];

/** Editorial audience section — typography and fine rules only, no cards. */
export function WhoIsThisFor() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="who-title" className="section-y surface-deep relative overflow-hidden [--glow-x:15%] [--glow-y:35%]">
      <div className="relative mx-auto grid max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div className="lg:col-span-5">
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <h2 id="who-title">
              {t.who.eyebrow}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="display mt-5 text-[clamp(2.6rem,8.5vw,5.25rem)] text-bone text-balance">
              {t.who.title}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">{t.who.intro}</p>
          </Reveal>
        </div>

        <motion.ol
          className="self-end border-t hairline lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {t.who.profiles.map((p, i) => (
            <motion.li
              key={p.title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
              className="group relative grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 overflow-hidden border-b hairline py-6 sm:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-x-8 sm:py-7 lg:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)_4rem]"
            >
              {(() => {
                const Icon = PROFILE_ICONS[i];
                return (
                  <Icon
                    aria-hidden
                    strokeWidth={0.75}
                    className="pointer-events-none hidden size-16 self-center text-ember opacity-[0.22] transition-opacity duration-500 group-hover:opacity-50 lg:col-start-4 lg:row-start-1 lg:block"
                  />
                );
              })()}
              <span
                aria-hidden
                className="absolute bottom-0 start-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-x-100 rtl:origin-right"
              />
              <span className="relative font-display text-sm font-semibold tracking-[0.12em] text-ember">0{i + 1}</span>
              <h3 className="display relative text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold text-bone transition-colors duration-300 group-hover:text-ember-soft">
                {p.title}
              </h3>
              <p className="relative col-start-2 mt-2 text-[1rem] leading-relaxed text-silver sm:col-start-3 sm:mt-0">
                {p.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
