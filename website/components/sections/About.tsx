"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { InstagramBrandIcon, WhatsAppGlyph } from "@/components/ui/icons";
import { BlendedImage, Reveal, SectionHeading } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import {
  COACH,
  INSTAGRAM,
  whatsappLink,
} from "@/lib/site";

const row = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Social / contact lockup — identical structure for every brand:
 *   small contextual label            (e.g. FOLLOW ON)
 *   [brand icon] Brand wordmark       (stronger line, official brand colours on the icon)
 * The whole block is one link; an orange underline grows under the lockup on hover/focus.
 */
function SocialAction({
  href,
  ariaLabel,
  context,
  brand,
  icon,
}: {
  href: string;
  ariaLabel: string;
  context: string;
  brand: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group inline-flex flex-col items-start gap-1.5 py-1"
    >
      <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-steel transition-colors duration-300 group-hover:text-silver">
        {context}
      </span>
      <span className="relative inline-flex h-8 items-center gap-2.5">
        <span className="inline-flex size-7 shrink-0 items-center justify-center">{icon}</span>
        <span className="font-sans text-[1.1rem] font-semibold tracking-[-0.01em] text-bone/90 transition-colors duration-300 group-hover:text-white">
          {brand}
        </span>
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-400 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
    </a>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative overflow-hidden bg-ink">
      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-12">
        <Reveal className="lg:col-span-6">
          {/* Frameless portrait: edges dissolve into the black section background */}
          <figure className="relative">
            <div aria-hidden className="image-halo pointer-events-none absolute -inset-[12%]" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[10%] bottom-[8%] top-[20%] rounded-full bg-ember/[0.07] blur-3xl"
            />
            <BlendedImage
              src="/images/about-portrait.webp"
              alt="Portrait of Saeid Soleimani, the coach behind FITologist, in a FITologist t-shirt with arms crossed"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="mx-auto aspect-square w-full max-w-xl lg:max-w-none"
              fade={{ t: "8%", r: "14%", b: "24%", l: "10%" }}
            />
            <figcaption className="absolute bottom-[4%] left-[6%] flex items-center gap-3">
              <span className="h-px w-6 bg-ember" aria-hidden />
              <span className="eyebrow text-[0.7rem] text-bone">Coach, FITologist</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-6 lg:pl-4">
          <SectionHeading index="02" label="The coach" title={COACH.name} id="about-title" />

          {/* Professional credentials — two editorial groups, no boxes */}
          <Reveal delay={0.1} className="mt-7 max-w-xl">
            <h3 className="eyebrow text-[0.7rem] text-ember">Professional credentials</h3>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2 sm:gap-8">
              {COACH.credentials.map((c) => (
                <li key={c.org} className="relative border-t border-bone/10 pt-4">
                  <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-ember" />
                  {/*
                    Small light plate so the exact supplied logo stays legible on black (its dark
                    artwork disappears otherwise). Logo scaled by height only — ratio preserved,
                    never cropped or recoloured.
                  */}
                  <span className="inline-flex h-11 items-center rounded-[3px] bg-[#ededed] px-3">
                    <Image
                      src={c.logo.src}
                      alt={c.logo.alt}
                      width={c.logo.width}
                      height={c.logo.height}
                      unoptimized
                      className={`w-auto max-w-none object-contain ${c.org === "REPs UAE" ? "h-8" : "h-6"}`}
                    />
                  </span>
                  <p className="mt-3 font-sans text-[0.95rem] font-semibold tracking-[0.04em] text-bone">
                    {c.label}
                  </p>
                  <p className="mt-0.5 text-[0.95rem] leading-snug text-silver">
                    <span className="sr-only">{c.fullTitle}. </span>
                    <span aria-hidden>
                      {c.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Educational & professional background */}
          <motion.div
            className="mt-7 max-w-xl"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          >
            <h3 className="eyebrow text-[0.7rem] text-ember">Educational &amp; professional background</h3>
            <ul className="mt-3 border-t border-bone/10 pt-3">
              {COACH.education.map((item) => (
                <motion.li key={item} variants={row} className="flex items-baseline gap-3 py-1 text-[0.98rem] text-bone">
                  <span aria-hidden className="h-px w-3 shrink-0 -translate-y-1 bg-ember/70" />
                  {item}
                </motion.li>
              ))}
              <motion.li variants={row} className="flex flex-wrap items-baseline gap-x-3 py-1 text-[0.98rem] text-bone">
                <span aria-hidden className="h-px w-3 shrink-0 -translate-y-1 bg-ember/70" />
                <span className="text-silver">Multilingual:</span>
                {COACH.languages.map((l, i) => (
                  <span key={l} className="inline-flex items-center gap-3">
                    {l}
                    {i < COACH.languages.length - 1 && (
                      <span aria-hidden className="size-1 rounded-full bg-ember" />
                    )}
                  </span>
                ))}
              </motion.li>
            </ul>
          </motion.div>

          {/* Social / contact actions */}
          <Reveal delay={0.2} className="mt-7 flex flex-col items-start gap-x-12 gap-y-4 sm:flex-row">
            <SocialAction
              href={INSTAGRAM.url}
              ariaLabel="Follow FITologist on Instagram (opens in a new tab)"
              context="Follow on"
              brand="Instagram"
              icon={<InstagramBrandIcon className="size-7" />}
            />
            <SocialAction
              href={whatsappLink()}
              ariaLabel="Contact Saeid on WhatsApp (opens in a new tab)"
              context="Contact on"
              brand="WhatsApp"
              icon={<WhatsAppGlyph className="size-7" />}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
