"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Signpost,
  Dumbbell,
  Flame,
  PersonStanding,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Fragment } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { AccentLine, BlendedImage, LogoWatermark, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import { GOALS, type Goal } from "@/lib/site";

const GOAL_ICONS: Record<Goal, LucideIcon> = {
  muscle: Dumbbell,
  fat: Flame,
  strength: TrendingUp,
  mobility: PersonStanding,
  confidence: ShieldCheck,
  // uncertainty → direction: a signpost pointing the way
  unsure: Signpost,
};

/** Homepage section 2 — the philosophy statement flowing straight into goal selection. */
export function PhilosophyGoals() {
  const { t } = useI18n();
  const { goal: selected, setGoal, startApplication } = useApplication();
  const h = t.philosophy.headline;
  const words = [
    ...h.before.split(" ").map((w) => ({ w, accent: false })),
    { w: h.accent, accent: true },
    ...h.after.split(" ").map((w) => ({ w, accent: false })),
  ].filter((x) => x.w);

  return (
    <section
      id="goals"
      aria-labelledby="philosophy-title"
      className="section-y surface-silver-right relative overflow-hidden lg:[--section-pt:2rem] lg:[--section-pb:2.75rem]"
    >
      <LogoWatermark className="-left-[30%] top-0 w-[110vw] lg:-left-[14%] lg:w-[52vw]" />

      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        {/*
          Philosophy over the brand banner (#10, banner2).
          Mobile: the banner sits in flow between the copy and the goals (full frame, no crop).
          Desktop: the banner becomes the section's background layer — from the top of the section
          down to the bottom of the goal cards, bleeding off the right edge and reaching well past
          the centre. Its own dark left third dissolves under the copy; content sits on top.
        */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative z-10 lg:col-span-6 rtl:lg:col-start-7 rtl:xl:col-start-8 lg:flex lg:min-h-[min(41vh,23rem)] lg:flex-col lg:justify-center lg:pb-2 xl:col-span-5">
            <Reveal className="eyebrow flex items-center gap-4">
              <AccentLine className="w-10" />
              <span>{t.philosophy.eyebrow}</span>
            </Reveal>

            <h2
              id="philosophy-title"
              className="display mt-5 max-w-[16ch] text-[clamp(2.1rem,7vw,4rem)] leading-[0.95] text-bone lg:mt-4 lg:text-[clamp(2.6rem,min(4.2vw,7.4vh),4rem)]"
            >
              <motion.span
                className="block"
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                {words.map(({ w, accent }, i) => (
                  <Fragment key={i}>
                    {i > 0 && " "}
                    <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                      <motion.span
                        className="inline-block"
                        variants={{
                          hidden: { y: "105%" },
                          show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
                        }}
                      >
                        <span className={accent ? "text-ember" : undefined}>{w}</span>
                      </motion.span>
                    </span>
                  </Fragment>
                ))}
              </motion.span>
            </h2>

            <Reveal delay={0.3}>
              <p className="mt-5 font-display text-xl font-medium uppercase tracking-[0.14em] text-bone sm:text-2xl lg:mt-4 lg:text-xl xl:text-2xl">
                {t.philosophy.support}
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.15}
            className="-mx-5 sm:mx-0 lg:pointer-events-none lg:absolute lg:-top-[var(--section-pt)] lg:bottom-[4.25rem] lg:right-[calc((100%-100vw)/2)] lg:z-0 lg:m-0 lg:w-[min(calc(100vw-15rem),80rem)]"
          >
            <BlendedImage
              src="/images/brand-banner2.webp"
              alt={t.philosophy.imageAlt}
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="aspect-[1672/941] w-full [--fade-b:13%] [--fade-l:5%] [--fade-r:5%] [--fade-t:9%] lg:aspect-auto lg:h-full lg:[--fade-b:6%] lg:[--fade-l:34%] lg:[--fade-r:0%] lg:[--fade-t:8%]"
              imgClassName="object-cover lg:object-[100%_28%]"
              strength={2}
            />
            {/*
              Desktop contrast layers — only where text sits: a soft near-black → charcoal rise under
              the goals, and a light veil on the left behind the philosophy copy. No full overlay.
            */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                background: [
                  "linear-gradient(to top, #050505 0%, rgb(5 5 5 / 0.82) 14%, rgb(17 17 17 / 0.5) 34%, rgb(17 17 17 / 0.12) 50%, transparent 60%)",
                  "linear-gradient(90deg, rgb(5 5 5 / 0.55) 0%, rgb(5 5 5 / 0.25) 30%, transparent 48%)",
                ].join(", "),
              }}
            />
          </Reveal>
        </div>

        {/* Goals */}
        {/* Goals — one continuous composition with the philosophy (no divider) */}
        <div className="relative z-10 mt-9 lg:mt-0">
          {/* Arabic: extra breathing room from the right edge for the heading only (cards unchanged) */}
          <div className="rtl:pr-1 rtl:sm:pr-2 rtl:lg:pr-[clamp(1.5rem,2.2vw,2rem)]">
              <Reveal className="eyebrow flex items-center gap-4">
                <span className="text-ember">{t.philosophy.goalsEyebrow}</span>
                <AccentLine className="w-10" />
              </Reveal>
              <Reveal delay={0.06}>
                <h3 className="display mt-3 text-[clamp(1.9rem,5.4vw,3rem)] text-bone text-balance lg:mt-2 lg:text-[clamp(2.1rem,3.2vw,2.75rem)]">
                  {t.philosophy.goalsTitle}
                </h3>
              </Reveal>
          </div>

          <motion.ul
            role="list"
            className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:mt-7 xl:grid-cols-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {GOALS.map((key) => {
              const Icon = GOAL_ICONS[key];
              const isSelected = selected === key;
              const g = t.goals[key];
              return (
                <motion.li
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                >
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGoal(key)}
                    aria-pressed={isSelected}
                    className={`group relative flex h-full min-h-[12rem] w-full flex-col overflow-hidden border bg-carbon/95 p-4 text-start lg:bg-carbon/90 lg:backdrop-blur-[3px] transition-[border-color,background-color] duration-300 ease-[var(--ease-premium)] sm:min-h-[14rem] sm:p-5 lg:min-h-[13.5rem] lg:p-5 ${
                      isSelected ? "border-ember bg-graphite" : "hairline hover:border-ember/50"
                    }`}
                  >
                    {/* Orange gradient rising from the bottom (hover / focus / selected) */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[70%] transition-[opacity,translate] duration-400 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                        isSelected ? "translate-y-0 opacity-100" : "translate-y-[30%] opacity-0"
                      }`}
                      style={{
                        background:
                          "radial-gradient(100% 80% at 50% 100%, rgba(255,106,0,0.34) 0%, rgba(255,106,0,0.1) 50%, transparent 80%)",
                      }}
                    />
                    {/*
                      Vector — a large editorial graphic embedded in the card's lower trailing area
                      (clipped by the card). Muted silver at rest; brighter FITologist orange on hover.
                    */}
                    <Icon
                      aria-hidden
                      strokeWidth={1}
                      className={`pointer-events-none absolute -bottom-4 -end-4 size-[6rem] transition-[color,opacity,scale] duration-500 ease-[var(--ease-premium)] [mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)] group-hover:scale-105 group-hover:text-ember group-hover:opacity-70 group-focus-visible:text-ember group-focus-visible:opacity-70 sm:size-[9rem] lg:size-[8.5rem] 2xl:size-[9.5rem] ${
                        isSelected ? "text-ember opacity-60" : "text-silver opacity-[0.2]"
                      }`}
                    />
                    <span className="display relative text-[1.45rem] font-bold leading-[1] text-bone sm:text-[1.65rem] xl:text-[1.55rem] 2xl:text-[1.7rem]">
                      {g.label}
                    </span>
                    <span className="relative mt-3 max-w-[15rem] text-[0.8rem] leading-[1.5] text-silver transition-colors duration-300 group-hover:text-bone/85 sm:text-[0.85rem]">
                      {g.body}
                    </span>
                    <span className="relative mt-auto flex items-center gap-2 pt-5 font-display text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-bone/80 transition-colors duration-300 group-hover:text-bone">
                      {isSelected ? t.philosophy.selected : t.philosophy.chooseGoal}
                      {isSelected ? (
                        <Check aria-hidden className="size-4 text-ember" strokeWidth={2.5} />
                      ) : (
                        <ArrowRight
                          aria-hidden
                          className="size-4 text-ember transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                        />
                      )}
                    </span>
                  </motion.button>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Selection → continue into the application (start-aligned, directly under the cards) */}
          <div className="relative z-10 mt-5 flex min-h-12 items-center justify-start">
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.button
                  key="cta"
                  type="button"
                  onClick={() => startApplication({ goal: selected })}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="group relative inline-flex min-h-12 shrink-0 items-center justify-center gap-3 overflow-hidden bg-ember px-6 font-display text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-ink"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
                  />
                  <span className="relative">{t.philosophy.cta}</span>
                  <ArrowRight
                    aria-hidden
                    className="relative size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  />
                </motion.button>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="shrink-0 font-display text-sm font-semibold uppercase tracking-[0.18em] text-silver"
                >
                  {t.philosophy.selectHint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
