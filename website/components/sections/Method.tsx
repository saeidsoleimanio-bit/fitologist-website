"use client";

import { motion } from "framer-motion";
import { FragmentGallery, type FragmentSlide } from "@/components/ui/FragmentGallery";
import { BrandWord, LogoWatermark, Reveal, SectionHeading } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";

const STAGES = [
  {
    n: "01",
    title: "Assess",
    body: "Where you are now — goals, training history, movement and schedule.",
  },
  {
    n: "02",
    title: "Build",
    body: "A structured program built around you — technique first, clear progression.",
  },
  {
    n: "03",
    title: "Transform",
    body: "Consistent work, regular check-ins and adjustments as you progress.",
  },
  {
    n: "04",
    title: "Transcend",
    body: "Habits, skills and confidence that carry beyond the program.",
  },
];

/* Professional journey: 04 → 01 → 02 → repeat. Natural compositions, never cropped. */
const GALLERY: FragmentSlide[] = [
  {
    src: "/images/method-full.webp",
    alt: "Saeid from behind, arms raised, facing the illuminated FITologist.me sign in a gym",
    width: 941,
    height: 1672,
  },
  {
    src: "/images/method-activeiq.webp",
    alt: "Saeid and another trainer flexing in front of an Active IQ sign in a gym",
    width: 1086,
    height: 1448,
  },
  {
    src: "/images/method-mypt.webp",
    alt: "Saeid standing with another trainer beneath the MyPT Academy sign",
    width: 941,
    height: 1672,
  },
];

export function Method() {
  return (
    <section
      id="method"
      aria-labelledby="method-title"
      className="section-y surface-deep relative overflow-hidden [--glow-x:72%] [--glow-y:45%]"
    >
      <LogoWatermark className="-left-[25%] top-[10%] w-[100vw] lg:-left-[10%] lg:w-[50vw]" opacity={0.025} />

      <div className="relative mx-auto grid max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-12">
        <div className="lg:col-span-7">
          <SectionHeading
            index="03"
            label="The system"
            id="method-title"
            title={
              <>
                The <BrandWord /> Method
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-silver">
              Four stages. One clear process — so you always know where you are and what comes
              next.
            </p>
          </Reveal>

          {/* Editorial 2×2 grid — typography and fine rules only, no cards */}
          <motion.ol
            className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {STAGES.map((s) => (
              <motion.li
                key={s.n}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                }}
                className="relative border-t border-bone/10 pt-5"
              >
                <motion.span
                  aria-hidden
                  className="absolute -top-px left-0 block h-px w-12 origin-left bg-ember"
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } },
                  }}
                />
                <span className="font-display text-xs font-semibold tracking-[0.28em] text-ember">
                  {s.n}
                </span>
                <h3 className="display mt-2 text-[2.1rem] font-semibold text-bone lg:text-[2.5rem]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-silver">{s.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* Journey gallery with a soft charcoal/silver halo */}
        <Reveal delay={0.1} className="relative lg:col-span-5">
          <div aria-hidden className="image-halo pointer-events-none absolute -inset-x-[25%] -inset-y-[6%]" />
          <FragmentGallery
            slides={GALLERY}
            label="Saeid's professional journey"
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 60vw, 90vw"
            className="mx-auto aspect-[3/4] w-full max-w-sm lg:max-h-[min(74vh,42rem)] lg:max-w-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
