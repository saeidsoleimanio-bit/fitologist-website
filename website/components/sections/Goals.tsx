"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Dumbbell, Flame, TrendingUp, type LucideIcon } from "lucide-react";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";
import type { Goal } from "@/lib/site";

const GOAL_CARDS: { goal: Goal; icon: LucideIcon; body: string }[] = [
  {
    goal: "Build Muscle",
    icon: Dumbbell,
    body: "Progressive, structured training to build lean muscle.",
  },
  {
    goal: "Lose Fat",
    icon: Flame,
    body: "Training and consistent habits that support sustainable fat loss.",
  },
  {
    goal: "Get Stronger",
    icon: TrendingUp,
    body: "Own the key lifts and build strength with clear progression.",
  },
  {
    goal: "General Fitness",
    icon: Activity,
    body: "Move better, feel more capable and build a routine that lasts.",
  },
];

export function Goals() {
  const { startApplication, goal: selected } = useApplication();

  return (
    <section
      id="goals"
      aria-labelledby="goals-title"
      className="section-y relative overflow-hidden bg-ink"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="04" label="Your goal" title="What are you training for?" id="goals-title" className="max-w-3xl" />
          <Reveal delay={0.1}>
            <p className="max-w-sm text-silver lg:pb-3">
              Choose a goal to start your application. Your program is built around it.
            </p>
          </Reveal>
        </div>

        <motion.ul
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {GOAL_CARDS.map(({ goal, icon: Icon, body }) => {
            const isSelected = selected === goal;
            return (
              <motion.li
                key={goal}
                variants={{
                  hidden: { opacity: 0, y: 36 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
                }}
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startApplication({ goal })}
                  aria-label={`${goal} — start your application with this goal`}
                  aria-pressed={isSelected}
                  className={`group relative flex h-full min-h-[10.5rem] w-full flex-col overflow-hidden border bg-carbon p-5 text-left transition-[border-color] duration-300 ease-[var(--ease-premium)] sm:min-h-[17rem] sm:p-6 lg:min-h-[18rem] ${
                    isSelected ? "border-ember/70" : "hairline hover:border-ember/50"
                  }`}
                >
                  {/* Orange atmosphere rising from the bottom to ~mid-card (hover / focus / tap / selected) */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-[50%] [mask-image:linear-gradient(to_top,#000_55%,transparent)] transition-[opacity,transform] duration-400 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-active:translate-y-0 group-active:opacity-100 ${
                      isSelected ? "translate-y-0 opacity-100" : "translate-y-[35%] opacity-0"
                    }`}
                    style={{
                      background:
                        "radial-gradient(95% 75% at 50% 100%, rgba(255,106,0,0.46) 0%, rgba(255,106,0,0.16) 45%, transparent 78%), linear-gradient(to top, rgba(255,106,0,0.3) 0%, rgba(255,106,0,0.1) 50%, transparent 100%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-400 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />

                  {/* Large background icon on the right — part of the card's atmosphere */}
                  <Icon
                    aria-hidden
                    strokeWidth={1}
                    className="pointer-events-none absolute -right-5 top-1/2 size-32 -translate-y-1/2 text-ember opacity-[0.22] transition-[opacity,scale] duration-400 ease-[var(--ease-premium)] [mask-image:linear-gradient(to_left,#000_45%,transparent_100%)] group-hover:scale-105 group-hover:opacity-[0.42] group-focus-visible:opacity-[0.42] group-active:opacity-[0.42] sm:-right-8 sm:top-auto sm:bottom-6 sm:size-44 sm:translate-y-0 lg:size-48"
                  />

                  {/* Text column on the left, clear of the icon */}
                  <span className="display relative max-w-[72%] text-[1.75rem] font-semibold text-bone sm:max-w-[80%] sm:text-[2.2rem] lg:text-[2.4rem]">
                    {goal}
                  </span>

                  <span className="relative mt-2 max-w-[68%] text-sm leading-relaxed text-silver transition-colors duration-300 group-hover:text-bone/90 sm:mt-3 sm:max-w-[66%] sm:text-[0.95rem]">
                    {body}
                  </span>

                  <span className="relative mt-auto flex items-center gap-2 pt-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-bone sm:pt-6">
                    {isSelected ? "Selected" : "Choose goal"}
                    <ArrowRight
                      aria-hidden
                      className="size-5 text-ember transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        <Reveal delay={0.1}>
          <p className="mt-6 text-sm text-steel">
            Results depend on the individual, consistency and many factors outside training. No
            outcome is guaranteed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
