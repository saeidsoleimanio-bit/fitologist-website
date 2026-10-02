"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, BrandWord, Reveal } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";
import { CtaBlock } from "./CtaBlock";

/** Method page hero — plain dark background (the composite banner image was removed, §2.5). */
function MethodHero() {
  const { t } = useI18n();
  const m = t.method;
  return (
    <section
      aria-labelledby="method-title"
      className="relative isolate overflow-hidden bg-ink pb-2 pt-[calc(var(--header-compact)+2rem)] lg:pb-4 lg:pt-[calc(var(--header-h)+3rem)]"
    >
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12">
        <Reveal className="eyebrow flex items-center gap-4">
          <AccentLine className="w-10" />
          <span className="text-ember">{m.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 id="method-title" className="display mt-4 text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.92] text-bone">
            {m.titleBefore} <BrandWord />
            {m.titleAfter && <> {m.titleAfter}</>}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-silver">{m.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** The four stages (§5.1) — stage label, title and text; on mobile the outlined number is smaller and inline. */
function MethodStages() {
  const { t } = useI18n();
  return (
    <section aria-label={t.method.eyebrow} className="section-y relative overflow-hidden bg-ink">
      <motion.ol
        className="relative mx-auto grid max-w-[88rem] gap-x-10 gap-y-8 px-4 sm:grid-cols-2 sm:px-8 lg:px-12 xl:grid-cols-4 xl:gap-x-8 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {t.method.stages.map((s, i) => (
          <motion.li
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="group relative border-t border-bone/10 pt-5"
          >
            <span aria-hidden className="absolute -top-px start-0 block h-px w-16 bg-ember" />
            <div className="flex items-baseline gap-3 sm:block">
              <span
                aria-hidden
                className="font-display text-[2.4rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_106_0/0.75)] sm:block sm:text-[clamp(3.5rem,7vw,5rem)]"
              >
                0{i + 1}
              </span>
              <div className="sm:mt-3">
                <p className="eyebrow text-[0.75rem] text-ember">{s.label}</p>
                <h2 className="display mt-1 text-[clamp(1.8rem,4.4vw,2.4rem)] font-semibold text-bone">
                  <span className="sr-only">0{i + 1}. </span>
                  {s.title}
                </h2>
              </div>
            </div>
            <p className="mt-3 text-base leading-relaxed text-silver">{s.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

/** Your first 30 days (§5.2), progress tracking (§5.3) and nutrition (§5.4). */
function MethodDetails() {
  const { t } = useI18n();
  const m = t.method;
  return (
    <section aria-labelledby="first30-title" className="section-y surface-deep relative overflow-hidden">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div>
          <h2 id="first30-title" className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">
            {m.first30Title}
          </h2>
          <ol className="mt-5 border-s border-ember/40">
            {m.first30.map((d) => (
              <li key={d.when} className="relative ps-5 pb-5 last:pb-0">
                <span aria-hidden className="absolute -start-[5px] top-2 size-2.5 rounded-full bg-ember" />
                <p className="text-base leading-relaxed text-silver">
                  <strong className="font-semibold text-bone">{d.when}:</strong> {d.what}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-10">
          <div>
            <h2 className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">{m.trackTitle}</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {m.track.map((x) => (
                <li key={x} className="border hairline bg-carbon px-4 py-2.5 text-base font-medium text-bone">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">{m.nutritionTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-silver lg:text-lg">{m.nutrition}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodPage() {
  return (
    <>
      <MethodHero />
      <MethodStages />
      <MethodDetails />
      <CtaBlock />
    </>
  );
}
