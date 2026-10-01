"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { AccentLine, BrandWord, LogoWatermark, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import { START_PATH, whatsappLink } from "@/lib/site";

/** Method page hero: the brand banner full-bleed, title set in its dark left third. */
function MethodHero() {
  const { t } = useI18n();
  const m = t.method;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="method-title"
      className="relative isolate overflow-hidden bg-ink pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,1000px)] lg:items-center lg:pt-[var(--header-h)]"
    >
      {/* Image: in flow on mobile (16:9), full-bleed behind the title on desktop */}
      <div className="relative aspect-[1672/941] w-full overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <Image
              src="/images/brand-banner2.webp"
              alt={m.imageAlt}
              fill
              preload
              quality={90}
              sizes="100vw"
              className="object-cover object-[70%_50%] lg:object-center"
            />
          </motion.div>
        </motion.div>
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-ink/70 to-transparent lg:h-40" />
        <div aria-hidden className="absolute inset-x-0 -bottom-px h-[30%] bg-linear-to-t from-ink to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.55) 28%, transparent 46%)" }}
        />
      </div>

      {/* Title — physically on the left on desktop (the banner's dark area) in every language */}
      <div className="relative z-10 -mt-10 px-5 pb-4 sm:px-8 lg:absolute lg:inset-y-0 lg:left-[max(3rem,calc((100vw-88rem)/2+3rem))] lg:mt-0 lg:flex lg:w-[min(34rem,36vw)] lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pt-[var(--header-h)]">
        <Reveal className="eyebrow flex items-center gap-4">
          <AccentLine className="w-10" />
          <span className="text-ember">{m.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 id="method-title" className="display mt-5 text-[clamp(3rem,10vw,6.5rem)] leading-[0.88] text-bone">
            {m.titleBefore} <BrandWord />
            {m.titleAfter && <> {m.titleAfter}</>}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">{m.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** The four signature stages — large, editorial, numbered. */
function MethodStages() {
  const { t } = useI18n();
  return (
    <section aria-label={t.method.eyebrow} className="section-y relative overflow-hidden bg-ink">
      <LogoWatermark className="-right-[25%] top-[5%] w-[100vw] lg:-right-[8%] lg:w-[46vw]" opacity={0.025} />
      <motion.ol
        className="relative mx-auto grid max-w-[88rem] gap-x-10 gap-y-10 px-5 sm:grid-cols-2 sm:px-8 lg:px-12 xl:grid-cols-4 xl:gap-x-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
      >
        {t.method.stages.map((s, i) => (
          <motion.li
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
            }}
            className="group relative border-t border-bone/10 pt-6"
          >
            <motion.span
              aria-hidden
              className="absolute -top-px start-0 block h-px w-16 origin-left bg-ember rtl:origin-right"
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } },
              }}
            />
            <span
              aria-hidden
              className="block font-display text-[clamp(4rem,9vw,6rem)] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_106_0/0.7)] transition-colors duration-500 group-hover:text-ember/15"
            >
              0{i + 1}
            </span>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,2.9rem)] font-semibold text-bone">
              <span className="sr-only">0{i + 1}. </span>
              {s.title}
            </h2>
            <p className="mt-3 max-w-xs text-[1.02rem] leading-relaxed text-silver">{s.body}</p>
            {i < 3 && (
              <ArrowRight
                aria-hidden
                className="absolute end-0 top-8 hidden size-5 text-ember/50 xl:block rtl:-scale-x-100"
              />
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

/** Closing CTA leading into the application. */
function MethodCta() {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="method-cta-title" className="section-y surface-deep relative overflow-hidden [--glow-x:25%] [--glow-y:50%]">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <motion.h2
          id="method-cta-title"
          className="display text-[clamp(3rem,11vw,6.5rem)] leading-[0.88] text-bone"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } }}
        >
          {t.method.ctaTitle}
        </motion.h2>
        <Reveal delay={0.15} className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <ButtonLink
            href={href(START_PATH)}
            icon={<ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2} />}
            className="w-full sm:w-auto"
          >
            {t.method.ctaButton}
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(t.common.defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            icon={<WhatsAppGlyph className="size-5" />}
            className="w-full sm:w-auto"
          >
            {t.common.whatsappSaeid}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function MethodPage() {
  return (
    <>
      <MethodHero />
      <MethodStages />
      <MethodCta />
    </>
  );
}
