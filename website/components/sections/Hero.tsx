"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { scrollToSection } from "@/components/providers/ApplicationProvider";
import { ButtonLink } from "@/components/ui/Button";
import { hasAnyCredential } from "@/config/site";
import { stripLocale } from "@/lib/i18n/config";
import { EASE } from "@/lib/motion";
import { BMI_PATH, START_PATH } from "@/lib/site";

/*
 * Composition (photo 05 at every size — no art-directed swap):
 * - < 640px: shorter frame (~50svh) cropped to Saeid, copy directly below on its bottom gradient.
 * - 640–1023px: full 16:9 frame, copy below.
 * - ≥ 1024px: full-bleed; Saeid anchors the left, copy + CTAs share one right-hand column
 *   sitting over the area where the wall logo was.
 *
 * The wall logo is removed with a localized atmospheric veil (moves with the photo),
 * never by dimming the whole image — Saeid stays at full strength.
 */

export function Hero() {
  const { t, href } = useI18n();
  const pathname = stripLocale(usePathname() ?? "/");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink lg:h-[100svh] lg:min-h-[640px] lg:max-h-[1100px] lg:pt-0"
    >
      {/* Mobile: the photo starts at the very top, behind the (transparent) header; it is taller by
          exactly the header height so the copy below keeps its position (§4.1 criterion). */}
      <div className="relative h-[calc(min(50svh,30rem)+var(--header-compact)+env(safe-area-inset-top))] w-full overflow-hidden sm:h-auto sm:aspect-[1672/941] sm:mt-[var(--header-compact)] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
        {/*
          Desktop image layer: nudged ~4% left and lowered so Saeid's hair clears the
          header with breathing room.
        */}
        <motion.div
          className="absolute inset-0 [--hero-drop:clamp(84px,15vh,140px)] max-sm:top-[7%] max-sm:-bottom-[7%] lg:-left-[4%] lg:top-[var(--hero-drop)] lg:-bottom-[var(--hero-drop)]"
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
            className="absolute inset-0 [--veil-x:74%] max-sm:[container-type:size] max-sm:[mask-image:linear-gradient(to_bottom,transparent_0,#000_12%)] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_140px)] lg:[--veil-x:75%] xl:[--veil-x:74%]"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
          >
            <Image
              src="/images/hero-desktop.webp"
              alt={t.hero.alt}
              fill
              preload
              fetchPriority="high"
              quality={90}
              sizes="100vw"
              className="object-cover object-[33%_0%] sm:object-center lg:object-[70%_30%] xl:object-[50%_30%]"
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
            {/*
              Mobile: the same idea for the wall sign at the right edge. This box matches the
              photo's rendered area exactly (object-cover by height, x at 33%), computed with
              container units, so the veil tracks the sign at every phone size. Dark wall tone +
              soft blur, feathered; hard cut-off left of 56.5% of the photo keeps Saeid untouched.
            */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 sm:hidden"
              style={{
                width: "calc(100cqh * 1672 / 941)",
                left: "calc((100cqw - 100cqh * 1672 / 941) * 0.33)",
              }}
            >
              <div
                className="absolute inset-0 backdrop-blur-[10px]"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 25% 32% at 74% 27%, #000 60%, transparent 100%), linear-gradient(to right, transparent 56.5%, #000 58.5%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 25% 32% at 74% 27%, #000 60%, transparent 100%), linear-gradient(to right, transparent 56.5%, #000 58.5%)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 25% 32% at 74% 27%, rgb(30,29,31) 0%, rgb(30,29,31) 64%, rgba(30,29,31,0.75) 82%, transparent 100%)",
                  maskImage: "linear-gradient(to right, transparent 56.5%, #000 58.5%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 56.5%, #000 58.5%)",
                }}
              />
            </div>
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

      {/*
        Copy + CTAs. Mobile: directly under the (shorter) photo, overlapping its bottom gradient, so
        eyebrow, H1, subtitle and the primary button fit the first screen. Desktop: right-hand
        column over the darker side of the photo. One page-load reveal only — no scroll fade.
      */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        className="relative z-10 -mt-16 px-4 pb-6 sm:-mt-20 sm:px-8 md:pb-10 lg:absolute lg:inset-y-0 lg:right-[max(3rem,5vw)] lg:mt-0 lg:flex lg:w-[min(36rem,38vw)] lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pt-[var(--header-h)] rtl:pr-6 rtl:sm:pr-10 rtl:lg:right-[max(5rem,8vw)] rtl:lg:pr-0"
      >
        <p className="eyebrow text-[0.78rem] text-ember">
          {hasAnyCredential ? t.hero.eyebrowCertified : t.hero.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="display mt-2.5 text-[clamp(2rem,8.4vw,2.6rem)] normal-case leading-[1.02] text-bone text-balance sm:text-[3rem] lg:mt-4 lg:text-[clamp(2.6rem,min(3.7vw,6.6vh),4.25rem)]"
        >
          {t.hero.title}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-silver sm:text-lg lg:mt-5">{t.hero.sub}</p>

        <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-8 lg:flex-col lg:items-start lg:gap-4">
          <ButtonLink href={href(START_PATH)} className="w-full sm:w-auto">
            {t.hero.primary}
          </ButtonLink>
          <Link
            href={href(BMI_PATH)}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToSection("bmi");
              }
            }}
            className="inline-flex min-h-11 items-center justify-center font-sans text-[0.95rem] font-semibold text-silver underline decoration-bone/30 underline-offset-[6px] transition-colors duration-300 hover:text-ember-soft hover:decoration-ember sm:justify-start"
          >
            {t.hero.secondary}
          </Link>
        </div>
        <p aria-hidden className="mt-6 hidden font-display text-sm font-semibold uppercase tracking-[0.12em] text-steel lg:block">
          {t.common.tagline.join(" · ")}
        </p>
      </motion.div>
    </section>
  );
}
