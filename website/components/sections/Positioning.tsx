"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { AccentLine, BlendedImage, LogoWatermark, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";

const STATEMENT = ["Build with structure.", "Stay consistent.", "Train with purpose."];

const HEADLINE = "Training is about building a stronger you.";

export function Positioning() {
  return (
    <section aria-labelledby="positioning-title" className="section-y surface-silver-right relative overflow-hidden lg:[--section-pt:3.5rem]">
      <LogoWatermark className="-left-[30%] top-0 w-[110vw] lg:-left-[14%] lg:w-[52vw]" />

      <div className="relative mx-auto grid max-w-[88rem] items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-7">
          <Reveal className="eyebrow flex items-center gap-4">
            <span className="text-ember">01</span>
            <AccentLine className="w-10" />
            <span>Philosophy</span>
          </Reveal>

          <h2
            id="positioning-title"
            className="display mt-6 max-w-[16ch] text-[clamp(2.1rem,7vw,4rem)] leading-[0.95] text-bone"
          >
            <motion.span
              className="block"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {HEADLINE.split(" ").map((w, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: "105%" },
                        show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
                      }}
                    >
                      <span className={/^stronger$/i.test(w) ? "text-ember" : undefined}>{w}</span>
                    </motion.span>
                  </span>
                </Fragment>
              ))}
            </motion.span>
          </h2>

          <Reveal delay={0.3}>
            <p className="mt-6 font-display text-xl font-medium uppercase tracking-[0.14em] text-bone sm:text-2xl">
              With structure, consistency and purpose.
            </p>
          </Reveal>

          {/* Editorial statement — typography only, no boxes */}
          <motion.p
            className="mt-10 border-l border-ember/70 pl-5 font-display text-lg font-semibold uppercase leading-[1.55] tracking-[0.2em] text-silver sm:text-xl"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } } }}
          >
            {STATEMENT.map((line) => (
              <motion.span
                key={line}
                className="block"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
                }}
              >
                {line}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* Frameless brand visual dissolving into the section background */}
        <Reveal delay={0.15} className="lg:col-span-5">
          <BlendedImage
            src="/images/brand-banner.webp"
            alt="FITologist.me brand visual: the logo above a dumbbell on a dark gym floor"
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 90vw"
            className="mx-auto aspect-[4/5] w-[88%] max-w-[30rem] sm:w-[62%] lg:w-full"
            imgClassName="object-cover object-[50%_42%]"
            fade={{ t: "12%", r: "14%", b: "14%", l: "14%" }}
          />
        </Reveal>
      </div>
    </section>
  );
}
