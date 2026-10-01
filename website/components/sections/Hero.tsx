"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";

const HERO_ALT = "Saeid, personal trainer, smiling with arms crossed in a Dubai gym";

/*
 * Composition (photo 05 at every size — no art-directed swap):
 * - < 640px: 3:4 crop centred on Saeid (the wall logo falls outside the frame).
 * - 640–1023px: full 16:9 frame, copy below.
 * - ≥ 1024px: full-bleed; Saeid anchors the left, copy + CTAs share one right-hand column
 *   sitting over the area where the wall logo was.
 *
 * The wall logo is removed with a localized atmospheric veil (moves with the photo),
 * never by dimming the whole image — Saeid stays at full strength.
 */

const line = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: EASE, delay: 0.55 + i * 0.14 },
  }),
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink pt-[var(--header-h)] lg:h-[100svh] lg:min-h-[640px] lg:max-h-[1100px] lg:pt-0"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[1672/941] lg:absolute lg:inset-0 lg:aspect-auto lg:h-auto">
        {/*
          Desktop image layer: nudged ~4% left and lowered so Saeid's hair clears the
          header with breathing room.
        */}
        <motion.div
          className="absolute inset-0 [--hero-drop:clamp(84px,15vh,140px)] lg:-left-[4%] lg:top-[var(--hero-drop)] lg:-bottom-[var(--hero-drop)]"
          style={reduce ? undefined : { y: imgY, scale: imgScale }}
        >
          {/*
            Scene extension behind the transparent header: the photograph's top rows (gym
            ceiling, above Saeid's hair) stretched upward and softened. Horizontally aligned with
            the sharp photo; Saeid never appears in it.
          */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[calc(var(--hero-drop)*-1)] hidden h-6 origin-top scale-y-[12] overflow-hidden opacity-90 blur-[3px] lg:block"
          >
            <div className="absolute inset-x-0 top-0 h-[100svh] max-h-[1100px] min-h-[640px]">
              <Image
                src="/images/hero-desktop.webp"
                alt=""
                fill
                quality={40}
                sizes="100vw"
                className="object-cover object-[70%_0%] xl:object-[50%_0%]"
              />
            </div>
          </div>
          <motion.div
            className="absolute inset-0 [--veil-x:74%] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_140px)] lg:[--veil-x:75%] xl:[--veil-x:74%]"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
          >
            <Image
              src="/images/hero-desktop.webp"
              alt={HERO_ALT}
              fill
              preload
              quality={90}
              sizes="100vw"
              className="object-cover object-[31%_30%] sm:object-center lg:object-[70%_30%] xl:object-[50%_30%]"
            />
            {/*
              Localized veil over the wall logo (travels with the photo). Masked so it only acts
              right of Saeid (~56% of the frame) — he is never darkened.
            */}
            <div
              aria-hidden
              className="absolute inset-0 hidden [mask-image:linear-gradient(to_right,transparent_56.5%,#000_58.5%)] sm:block"
              style={{
                background:
                  "radial-gradient(ellipse 34% 36% at var(--veil-x) 26%, rgba(5,5,5,0.99) 0%, rgba(5,5,5,0.97) 62%, rgba(5,5,5,0.7) 82%, transparent 100%)",
              }}
            />
          </motion.div>
          {/* Fade-from-black veil (keeps the LCP image itself fully opaque) */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-ink"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </motion.div>

        {/* Cinematic grade */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-ink/60 to-transparent lg:h-56 lg:from-ink/55" />
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[30%] bg-linear-to-t from-ink from-10% via-ink/70 via-45% to-transparent lg:h-[26%] lg:from-0% lg:via-ink/40"
        />
        {/* Mobile: soften the right edge of the tight crop */}
        <div aria-hidden className="absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-ink/70 to-transparent sm:hidden" />
        {/* Desktop: darker atmosphere behind the right-hand copy */}
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to left, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.72) 18%, rgba(5,5,5,0.36) 31%, transparent 41%)",
          }}
        />
      </div>

      {/* Copy + CTAs — one column (right-hand on desktop) */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 -mt-[18vw] px-5 pb-14 sm:-mt-20 sm:px-8 md:pb-16 lg:absolute lg:inset-y-0 lg:right-[max(3rem,5vw)] lg:mt-0 lg:flex lg:w-[min(34rem,34vw)] lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pt-[var(--header-h)]"
      >
        <h1
          id="hero-title"
          className="display text-[clamp(3rem,15.5vw,5.75rem)] leading-[0.86] text-bone sm:text-[clamp(4.25rem,10vw,6.25rem)] lg:text-[clamp(3.5rem,min(5.6vw,9.6vh),7.25rem)]"
        >
          {["Train.", "Transform.", "Transcend."].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 2 ? "text-ember" : ""}`}
                initial="hidden"
                animate="show"
                custom={i}
                variants={line}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.span
          aria-hidden
          className="mt-6 block h-px w-24 origin-left bg-ember sm:w-28"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.1 }}
        />

        <motion.p
          initial="hidden"
          animate="show"
          custom={1.2}
          variants={fade}
          className="mt-5 font-display text-[1.05rem] font-semibold uppercase tracking-[0.08em] text-bone min-[360px]:text-[1.35rem] min-[360px]:tracking-[0.12em] lg:text-[1.5rem]"
        >
          Personal Training by Saeid
          <span className="mt-1.5 block text-[1.05rem] font-medium tracking-[0.24em] text-silver lg:text-lg">
            Dubai, UAE
          </span>
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={1.35}
          variants={fade}
          className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-4"
        >
          <ButtonLink href="#start-training" className="w-full sm:w-auto">
            Start your transformation
          </ButtonLink>
          <a
            href="#coaching"
            className="group inline-flex min-h-11 items-center justify-center gap-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-silver transition-colors duration-300 hover:text-ember-soft sm:justify-start"
          >
            <span className="border-b border-bone/25 pb-0.5 transition-colors duration-300 group-hover:border-ember">
              View coaching
            </span>
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
