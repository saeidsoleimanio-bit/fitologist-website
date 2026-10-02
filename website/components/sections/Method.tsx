"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { AccentLine, BrandWord, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import { START_PATH, whatsappLink } from "@/lib/site";

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

/** The four signature stages — large, editorial, numbered. */
function MethodStages() {
  const { t } = useI18n();
  return (
    <section aria-label={t.method.eyebrow} className="section-y relative overflow-hidden bg-ink">
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
            data-fab-hide
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
