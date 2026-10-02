"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Dumbbell,
  MonitorSmartphone,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import type { TrainingType } from "@/lib/lead";
import { COACHING_TYPES, type CoachingType } from "@/lib/site";

/** Coaching card → form training type. */
const CARD_TO_TYPE: Record<CoachingType, TrainingType> = { personal: "1to1", online: "online", hybrid: "hybrid" };

/** Large background visual per coaching mode, composed from line icons (one family with Goals). */
function CoachingVisual({ kind }: { kind: CoachingType }) {
  const stroke = { strokeWidth: 1, "aria-hidden": true } as const;
  if (kind === "personal")
    return (
      <span className="relative block size-full">
        <UserRound {...stroke} className="absolute left-0 top-0 size-[78%]" />
        <Dumbbell {...stroke} className="absolute bottom-0 right-0 size-[52%] -rotate-[30deg]" />
      </span>
    );
  if (kind === "online")
    return <MonitorSmartphone {...stroke} className="block size-full" />;
  return (
    <span className="relative block size-full">
      <UserRound {...stroke} className="absolute bottom-0 left-0 size-[62%]" />
      <Smartphone {...stroke} className="absolute right-0 top-0 size-[58%]" />
      <ArrowLeftRight {...stroke} className="absolute left-[34%] top-[30%] size-[30%] -rotate-[35deg]" />
    </span>
  );
}

/** Coaching page, section 1 — "Choose how you train" (page h1). */
export function Coaching() {
  const { t } = useI18n();
  const c = t.coaching;
  const { startApplication } = useApplication();

  return (
    <section
      id="coaching"
      aria-labelledby="coaching-title"
      className="section-y surface-deep relative overflow-hidden pt-[calc(var(--header-h)+1.5rem)] [--glow-x:20%] [--glow-y:30%] lg:pt-[calc(var(--header-h)+2.5rem)]"
    >

      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <Reveal className="eyebrow flex items-center gap-4">
          <AccentLine className="w-10" />
          <span className="text-ember">{c.eyebrow}</span>
        </Reveal>
        <motion.h1
          id="coaching-title"
          className="display mt-4 max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)] text-bone text-balance"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
        >
          {c.title}
        </motion.h1>

        <motion.ul
          className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
        >
          {COACHING_TYPES.map((type, i) => {
            const o = c.options[type];
            const titleId = `coaching-${i}`;
            return (
              <motion.li
                key={type}
                aria-labelledby={titleId}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                className={`group relative flex flex-col overflow-hidden border bg-carbon p-6 transition-[border-color,background-color,translate,box-shadow] duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:bg-graphite hover:shadow-[0_24px_60px_-30px_rgba(255,106,0,0.35)] focus-within:bg-graphite sm:p-7 hairline hover:border-ember/40 focus-within:border-ember/40`}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left rtl:origin-right scale-x-0 bg-ember transition-transform duration-400 ease-[var(--ease-premium)] group-focus-within:scale-x-100 group-hover:scale-x-100"
                />
                {/* Orange atmosphere rising from the bottom (~45%) on hover / focus / selected */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-[46%] [mask-image:linear-gradient(to_top,#000_55%,transparent)] transition-[opacity,translate] duration-400 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 translate-y-[30%] opacity-0`}
                  style={{
                    background:
                      "radial-gradient(95% 75% at 50% 100%, rgba(255,106,0,0.3) 0%, rgba(255,106,0,0.1) 45%, transparent 78%), linear-gradient(to top, rgba(255,106,0,0.2) 0%, rgba(255,106,0,0.06) 50%, transparent 100%)",
                  }}
                />

                {/* Title row — the decorative visual sits beside the title on desktop only (never over text) */}
                <div className="relative flex items-start justify-between gap-4">
                  <h3 id={titleId} className="display text-[2.1rem] font-semibold text-bone sm:text-[2.3rem] lg:min-h-[1.8em] min-[1400px]:min-h-0">
                    {o.title}
                  </h3>
                  <span
                    aria-hidden
                    className="pointer-events-none hidden size-16 shrink-0 text-silver opacity-30 transition-[opacity,color] duration-400 ease-[var(--ease-premium)] group-hover:text-ember group-hover:opacity-80 group-focus-within:text-ember group-focus-within:opacity-80 lg:block"
                  >
                    <CoachingVisual kind={type} />
                  </span>
                </div>
                <p className="relative mt-2 text-base text-silver sm:text-lg">{o.tagline}</p>

                <p className="eyebrow relative mt-5 border-t hairline pt-5 text-[0.75rem] text-bone/80">{c.includesLabel}</p>
                <ul className="relative mt-3 space-y-2.5">
                  {o.includes.map((pt) => (
                    <li key={pt} className="flex items-baseline gap-3 text-base text-bone/85">
                      <span aria-hidden className="h-px w-4 shrink-0 -translate-y-1 bg-ember" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Identical CTA on every card: orange at rest → white text + orange tint on card hover/focus */}
                <div className="relative mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => startApplication({ type: CARD_TO_TYPE[type] })}
                    aria-label={`${c.applyAria} ${o.title}`}
                    data-fab-hide
                    className="relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden border border-ember/60 px-5 font-sans text-[0.95rem] font-semibold tracking-[0.01em] text-ember transition-[color,border-color,transform] duration-300 ease-[var(--ease-premium)] active:scale-[0.97] group-hover:border-ember group-hover:text-bone group-focus-within:border-ember group-focus-within:text-bone"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left rtl:origin-right scale-x-0 bg-ember/20 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-within:scale-x-100"
                    />
                    <span className="relative">{c.apply}</span>
                  </button>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        <Reveal delay={0.15} className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="max-w-xl text-base font-semibold text-bone">
            {c.pricing}
          </p>
          <p className="max-w-md text-sm text-steel">{c.unsure}</p>
        </Reveal>
      </div>
    </section>
  );
}
