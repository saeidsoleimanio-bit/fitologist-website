"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/components/i18n/I18nProvider";
import { InstagramBrandIcon, WhatsAppGlyph } from "@/components/ui/icons";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE } from "@/lib/motion";
import { COACH_NAME, CREDENTIALS, INSTAGRAM, whatsappLink } from "@/lib/site";

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
      className="group inline-flex flex-col items-start gap-2 py-1"
    >
      <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-steel transition-colors duration-300 group-hover:text-silver">
        {context}
      </span>
      <span className="relative inline-flex h-10 items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center">{icon}</span>
        <span className="font-sans text-[1.4rem] font-semibold tracking-[-0.01em] text-bone/90 transition-colors duration-300 group-hover:text-white">
          {brand}
        </span>
        <span
          aria-hidden
          className="absolute -bottom-1 start-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-400 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
        />
      </span>
    </a>
  );
}

/**
 * About page opening. The portrait (saeid-original-01) is a background layer, not a framed photo:
 * PHOTO → soft fade → dark charcoal → faint logo-silver on the right, with the story on top.
 */
export function AboutIntro() {
  const { t, dir } = useI18n();
  const a = t.about;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-ink pb-[var(--section-py)] lg:flex lg:min-h-[min(100svh,58rem)] lg:items-center lg:pt-[calc(var(--header-h)+1.5rem)]"
    >
      {/* Background tone the portrait dissolves into: near-black → charcoal → faint silver */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: [
            "linear-gradient(180deg, transparent 80%, #050505 100%)",
            "radial-gradient(45% 60% at 92% 45%, rgb(191 192 194 / 0.1), rgb(191 192 194 / 0.03) 55%, transparent 80%)",
            "linear-gradient(90deg, #050505 0%, #0b0d0e 40%, #111314 70%, color-mix(in srgb, #bfc0c2 8%, #111111) 100%)",
          ].join(", "),
        }}
      />

      {/* Portrait layer — in flow on mobile, full-height on the left from lg */}
      <motion.div
        className="about-portrait-mask relative -z-10 aspect-square w-full lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[min(60vw,60rem)]"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <Image
          src="/images/about-portrait.webp"
          alt={a.portraitAlt}
          fill
          preload
          quality={90}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[45%_20%] lg:object-[30%_22%]"
        />
        {/* warm spill echoing the rim light behind Saeid */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(30% 40% at 22% 62%, rgb(255 106 0 / 0.08), transparent 70%)" }}
        />
      </motion.div>

      <div className="relative mx-auto -mt-24 grid w-full max-w-[88rem] px-5 sm:-mt-32 sm:px-8 lg:mt-0 lg:grid-cols-12 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]" dir="ltr">
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-7" dir={dir}>
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span className="text-ember">{a.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 id="about-title" className="display mt-4 text-[clamp(2.75rem,8vw,5.25rem)] text-bone [font-family:var(--font-barlow),var(--font-display)] rtl:leading-[0.95]!" dir="ltr">
              <span className="block rtl:text-right">{COACH_NAME}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.16em] text-silver sm:text-xl">
              {a.subtitle}
            </p>
          </Reveal>

          {/* Human introduction → fitness experience, as one story */}
          <Reveal delay={0.18}>
            <blockquote className="relative mt-6 max-w-2xl border-s-2 border-ember ps-5 sm:ps-6">
              <p className="font-display text-[1.45rem] font-semibold uppercase leading-[1.15] text-bone sm:text-[1.7rem]">
                {a.quote[0]}
              </p>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-silver sm:text-lg">{a.quote[1]}</p>
            </blockquote>
            <p className="mt-5 flex items-center gap-3 font-display text-lg font-bold uppercase tracking-[0.16em] text-bone">
              <span aria-hidden className="size-2 rounded-full bg-ember" />
              {a.fitnessExperience}
            </p>
          </Reveal>

          {/* Credentials — text first, logos proportional and secondary */}
          <Reveal delay={0.24} className="mt-6 max-w-2xl">
            <h2 className="sr-only">{a.credentialsTitle}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {CREDENTIALS.map((c, i) => {
                const lines = a.credentials[c.key].lines;
                return (
                  <motion.li
                    key={c.key}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 * i }}
                    className="relative flex flex-col border border-bone/10 bg-carbon/70 p-4 backdrop-blur-[2px] sm:p-5"
                  >
                    <span aria-hidden className="absolute -top-px start-0 h-px w-12 bg-ember" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-sans text-[0.85rem] font-bold tracking-[0.08em] text-silver" dir="ltr">
                        {c.org}
                      </span>
                      {/*
                        Light plate keeps the exact supplied logo legible on black. Scaled by height only —
                        ratio preserved, never cropped or recoloured.
                      */}
                      <span className="inline-flex h-9 shrink-0 items-center rounded-[3px] bg-[#ededed] px-2.5">
                        <Image
                          src={c.logo.src}
                          alt={c.logo.alt}
                          width={c.logo.width}
                          height={c.logo.height}
                          unoptimized
                          className={`w-auto max-w-none object-contain ${c.key === "reps" ? "h-6" : "h-[18px]"}`}
                        />
                      </span>
                    </div>
                    <p className="mt-3 font-display text-[1.45rem] font-bold uppercase leading-[1.05] text-bone">
                      {lines[0]}
                    </p>
                    {lines[1] && <p className="mt-1 text-[0.98rem] leading-snug text-silver">{lines[1]}</p>}
                  </motion.li>
                );
              })}
            </ul>
          </Reveal>

          {/* Social / contact actions */}
          {/* One social/contact group, centred under the credentials (same width as the cards above) */}
          <Reveal delay={0.3} className="mt-7 flex max-w-2xl flex-col items-center gap-x-16 gap-y-4 sm:flex-row sm:justify-center">
            <SocialAction
              href={INSTAGRAM.url}
              ariaLabel={`${a.followAria} (${t.common.newTab})`}
              context={a.followOn}
              brand="Instagram"
              icon={<InstagramBrandIcon className="size-9" />}
            />
            <SocialAction
              href={whatsappLink(t.common.defaultWhatsAppMessage)}
              ariaLabel={`${a.contactAria} (${t.common.newTab})`}
              context={a.contactOn}
              brand="WhatsApp"
              icon={<WhatsAppGlyph className="size-9" />}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
