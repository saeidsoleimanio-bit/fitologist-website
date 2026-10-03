"use client";

import Image from "next/image";
import { Fragment } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { UAEFlag, UKFlag } from "@/components/ui/Flags";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { isCertified, site } from "@/config/site";
import { COACH_NAME, CREDENTIALS } from "@/lib/site";

/**
 * About page opening (§8). The portrait (saeid-original-01) is a background layer on desktop
 * (photo → soft fade → charcoal → faint silver). On mobile the header is solid and the photo sits
 * below it (never behind the header icons). Lead line, stats as separate items, credentials only
 * when enabled in config.
 */
export function AboutIntro() {
  const { t, dir, locale } = useI18n();
  const a = t.about;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-ink pb-[var(--section-py)] pt-[var(--header-compact)] lg:flex lg:min-h-[min(100svh,58rem)] lg:items-center lg:pt-[calc(var(--header-h)+1.5rem)]"
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

      {/* Portrait — in flow below the header on mobile, full-height on the left from lg */}
      <div
        className="load-fade-in about-portrait-mask relative -z-10 aspect-square w-full lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[min(60vw,60rem)]"
      >
        <Image
          src={site.photos.about}
          alt={a.portraitAlt}
          fill
          preload
          quality={90}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[45%_20%] lg:object-[30%_22%]"
        />
      </div>

      <div className="relative mx-auto -mt-20 grid w-full max-w-[88rem] px-4 sm:-mt-32 sm:px-8 lg:mt-0 lg:grid-cols-12 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]" dir="ltr">
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-7" dir={dir}>
          <Reveal load className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span className="text-ember">{a.eyebrow}</span>
          </Reveal>
          <Reveal load delay={0.06}>
            <h1
              id="about-title"
              className="display mt-4 text-[clamp(2.75rem,8vw,5.25rem)] text-bone [font-family:var(--font-barlow),var(--font-display)] rtl:leading-[0.95]!"
              dir="ltr"
            >
              <span className="block rtl:text-right">{COACH_NAME}</span>
            </h1>
          </Reveal>
          <Reveal load delay={0.12}>
            {/* REPs subtitle stays on one line on phones: slightly tighter letter-spacing below sm */}
            <p
              className={`mt-3 font-display text-lg font-semibold uppercase tracking-[0.12em] text-silver sm:text-xl ${
                site.credentials.reps.show ? "whitespace-nowrap max-sm:tracking-[0.08em]" : ""
              }`}
            >
              {site.credentials.reps.show ? a.subtitleRegistered : isCertified ? a.subtitleCertified : a.subtitle}
            </p>
            {/* Languages line (owner revision) — names in their own script, isolated so commas keep their order */}
            <p className="mt-2 text-base text-silver">
              {a.languagesLine.before}{" "}
              {site.languagesSpoken.map((l, i, all) => (
                <Fragment key={l}>
                  {i > 0 && (i === all.length - 1 ? ` ${a.languagesLine.and}${locale === "ar" ? "" : " "}` : locale === "en" ? ", " : "، ")}
                  <bdi className={`text-bone ${/[\u0100-\u02ff]/.test(l) ? "font-[system-ui,sans-serif]" : ""}`}>{l}</bdi>
                </Fragment>
              ))}
              {/* RLM keeps the full stop at the sentence end on RTL pages */}
              {locale === "en" ? "." : "\u200F."}
            </p>
          </Reveal>
          <Reveal load delay={0.18}>
            <p className="mt-6 max-w-2xl border-s-2 border-ember ps-5 font-display text-[1.55rem] font-semibold leading-[1.15] text-bone sm:text-[1.8rem]">
              {a.lead}
            </p>
          </Reveal>

          {/*
            Credentials (cards with logos) render only when enabled in config/site.ts, in place of the
            stats; while both switches are off, the stats show as one compact row instead.
          */}
          {CREDENTIALS.length === 0 && (
            <Reveal load delay={0.24} className="mt-6">
              <p className="flex items-baseline gap-x-2 whitespace-nowrap text-[length:min(1rem,calc((100vw-2.5rem)/25))] text-silver sm:text-base">
                {a.stats.map((st, i) => (
                  <Fragment key={st.label}>
                    {i > 0 && (
                      <span aria-hidden className="text-ember">
                        ·
                      </span>
                    )}
                    <span>
                      <strong className="font-semibold text-bone">{st.value}</strong> {st.label}
                    </span>
                  </Fragment>
                ))}
              </p>
            </Reveal>
          )}

          {/* Credentials render only when enabled in config/site.ts */}
          {CREDENTIALS.length > 0 && (
            <Reveal load delay={0.24} className="mt-7 max-w-2xl">
              <h2 className="eyebrow text-ember">{a.credentialsTitle}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {CREDENTIALS.map((c) => {
                  const aiq = a.credentials.aiq;
                  const reps = a.credentials.reps;
                  return (
                    <li key={c.key} className="relative flex flex-col border border-bone/10 bg-carbon/70 p-4 sm:p-5">
                      <span aria-hidden className="absolute -top-px start-0 h-px w-12 bg-ember" />
                      {/* Label + logo on one row; if space runs out, the logo box wraps above the label */}
                      <div className="flex flex-wrap-reverse items-center justify-between gap-x-3 gap-y-2">
                        <span className="font-sans text-[0.85rem] font-bold tracking-[0.08em] text-silver" dir="ltr">
                          {c.org}
                        </span>
                        {/* Both logo boxes share one height (46px, ~28% larger); each logo keeps its proportions */}
                        <span className="inline-flex h-[2.875rem] shrink-0 items-center rounded-[3px] bg-[#ededed] px-3">
                          <Image
                            src={c.logo.src}
                            alt={c.logo.alt}
                            width={c.logo.width}
                            height={c.logo.height}
                            unoptimized
                            className={`w-auto max-w-none object-contain ${c.key === "reps" ? "h-[38px]" : "h-[22px]"}`}
                          />
                        </span>
                      </div>
                      <p className="mt-3 font-display text-[1.45rem] font-bold uppercase leading-[1.05] text-bone">
                        {c.key === "aiq" ? aiq.title : reps.title}
                      </p>
                      {c.key === "aiq" ? (
                        <>
                          <p className="mt-1 text-base leading-snug text-silver">{aiq.line}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-[0.85rem] leading-snug text-silver/75">
                            <UKFlag label={a.flags.uk} />
                            {aiq.note}
                          </p>
                        </>
                      ) : (
                        /* "[UAE flag] UAE · Level 3" (+ " · {category}" when set in config) */
                        <p className="mt-1 flex items-center gap-1.5 text-[0.95rem] leading-snug text-silver">
                          <UAEFlag label={a.flags.uae} />
                          {[reps.country, reps.level, site.credentials.reps.category].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {c.key === "reps" && site.credentials.reps.number && (
                        <p className="mt-1 text-sm text-silver">
                          {a.repsNo} <span dir="ltr">{site.credentials.reps.number}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
