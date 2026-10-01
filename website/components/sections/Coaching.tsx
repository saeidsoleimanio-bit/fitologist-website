"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Dumbbell,
  MonitorSmartphone,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { LogoWatermark, Reveal, SectionHeading } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";
import type { CoachingType } from "@/lib/site";

type Visual = "personal" | "online" | "hybrid";

/** Large background visual per coaching mode, composed from line icons (one family with Goals). */
function CoachingVisual({ kind }: { kind: Visual }) {
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

const OPTIONS: {
  type: CoachingType;
  visual: Visual;
  tagline: string;
  points: string[];
}[] = [
  {
    type: "1:1 Personal Training",
    visual: "personal",
    tagline: "Individual coaching in Dubai.",
    points: ["In-person sessions with Saeid", "Technique coached rep by rep", "A program built around you"],
  },
  {
    type: "Online Coaching",
    visual: "online",
    tagline: "Structured coaching wherever you train.",
    points: ["Your individual training plan", "Regular check-ins and adjustments", "Train on your own schedule"],
  },
  {
    type: "Hybrid Coaching",
    visual: "hybrid",
    tagline: "In-person + online support.",
    points: ["In-person sessions in Dubai", "Online programming between sessions", "Ongoing accountability"],
  },
];

export function Coaching() {
  const { startApplication, coaching: selected } = useApplication();

  return (
    <section
      id="coaching"
      aria-labelledby="coaching-title"
      className="section-y surface-deep relative overflow-hidden [--glow-x:20%] [--glow-y:30%]"
    >
      <LogoWatermark className="-right-[35%] bottom-0 w-[110vw] lg:-right-[12%] lg:w-[55vw]" opacity={0.03} />

      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="05"
          label="Coaching"
          title="Choose your coaching"
          id="coaching-title"
          className="max-w-3xl"
        />

        <motion.ul
          className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
        >
          {OPTIONS.map(({ type, visual, tagline, points }, i) => {
            const isSelected = selected === type;
            const titleId = `coaching-${i}`;
            return (
              <motion.li
                key={type}
                aria-labelledby={titleId}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                className={`group relative flex flex-col overflow-hidden border bg-carbon p-6 transition-[border-color,background-color,translate,box-shadow] duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:bg-graphite hover:shadow-[0_24px_60px_-30px_rgba(255,106,0,0.35)] focus-within:bg-graphite sm:p-7 ${
                  isSelected ? "border-ember/70" : "hairline hover:border-ember/40 focus-within:border-ember/40"
                }`}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-400 ease-[var(--ease-premium)] group-focus-within:scale-x-100 group-hover:scale-x-100"
                />
                {/* Orange atmosphere rising from the bottom (~45%) on hover / focus / selected */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-[46%] [mask-image:linear-gradient(to_top,#000_55%,transparent)] transition-[opacity,translate] duration-400 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
                    isSelected ? "translate-y-0 opacity-100" : "translate-y-[30%] opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(95% 75% at 50% 100%, rgba(255,106,0,0.3) 0%, rgba(255,106,0,0.1) 45%, transparent 78%), linear-gradient(to top, rgba(255,106,0,0.2) 0%, rgba(255,106,0,0.06) 50%, transparent 100%)",
                  }}
                />

                {/* Large background visual on the right */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 top-5 size-36 text-silver opacity-[0.16] transition-[opacity,scale,color] duration-400 ease-[var(--ease-premium)] [mask-image:linear-gradient(to_left,#000_50%,transparent_100%)] group-hover:scale-110 group-hover:text-ember group-hover:opacity-[0.42] group-focus-within:text-ember group-focus-within:opacity-[0.42] sm:size-44"
                >
                  <CoachingVisual kind={visual} />
                </span>

                <h3 id={titleId} className="display relative max-w-[78%] text-[2.1rem] font-semibold text-bone sm:text-[2.3rem] lg:min-h-[1.8em] min-[1400px]:min-h-0">
                  {type}
                </h3>
                <p className="relative mt-2 max-w-[78%] text-base text-silver sm:text-lg">{tagline}</p>

                <ul className="relative mt-5 space-y-2.5 border-t hairline pt-5">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-baseline gap-3 text-[0.95rem] text-bone/85">
                      <span aria-hidden className="h-px w-4 shrink-0 -translate-y-1 bg-ember" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Identical CTA on every card: orange at rest → white text + orange tint on card hover/focus */}
                <div className="relative mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => startApplication({ coaching: type })}
                    aria-label={`Apply now for ${type}`}
                    className="relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden border border-ember/60 px-5 font-display text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-ember transition-[color,border-color,transform] duration-300 ease-[var(--ease-premium)] active:scale-[0.97] group-hover:border-ember group-hover:text-bone group-focus-within:border-ember group-focus-within:text-bone"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left scale-x-0 bg-ember/20 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-within:scale-x-100"
                    />
                    <span className="relative">Apply now</span>
                    <ArrowUpRight
                      aria-hidden
                      className="relative size-4 text-ember transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-sm text-steel">
            Not sure which option fits? Choose the closest one — you can discuss it with Saeid
            before you start.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
