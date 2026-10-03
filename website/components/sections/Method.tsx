"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, BrandWord, Reveal } from "@/components/ui/primitives";
import { CalendarCheck, Camera, Dumbbell, Ruler } from "lucide-react";
import { FoodPyramid, DrumstickAndOats } from "@/components/ui/GymVectors";
import { caveat } from "@/lib/handwriting";
import { CtaBlock } from "./CtaBlock";
import { PhotoHero, type Veil } from "./PhotoHero";

/*
 * Photo 10 (10-fitologist-brand-banner2.PNG → brand-banner2.webp) as the intro image (owner revision).
 * Its baked-in logo, tagline and slogans are covered by localized veils in photo coordinates.
 */
const BANNER_VEILS: Veil[] = [
  { x: 73.5, y: 20, rx: 20, ry: 18 }, // "F" barbell icon
  { x: 71.5, y: 39.5, rx: 29, ry: 11.5 }, // "FITologist.me" + "TRAIN • TRANSFORM • TRANSCEND"
  { x: 64.5, y: 81.5, rx: 9, ry: 8 }, // "CONSISTENCY ALWAYS WINS" (towel)
  { x: 92.5, y: 70, rx: 6.5, ry: 11 }, // "BETTER STRONGER YOU" (dumbbell)
];

/** Icons in the order of `method.track`: Body Measurements · Consistency · Progress Photos · Strength Numbers. */
const TRACK_ICONS = [Ruler, CalendarCheck, Camera, Dumbbell];

function MethodHero() {
  const { t } = useI18n();
  const m = t.method;
  return (
    <PhotoHero
      id="method-title"
      src="/images/brand-banner2.webp"
      alt={m.heroAlt}
      ratio={1672 / 941}
      focus={{ mobile: "38%", desktop: "50%" }}
      side="left"
      veils={BANNER_VEILS}
    >
      <Reveal load className="eyebrow flex items-center gap-4">
        <AccentLine className="w-10" />
        <span className="text-ember">{m.eyebrow}</span>
      </Reveal>
      <Reveal load delay={0.08}>
        <h1 id="method-title" className="display mt-4 text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.92] text-bone">
          {m.titleBefore} <BrandWord />
          {m.titleAfter && <> {m.titleAfter}</>}
        </h1>
      </Reveal>
      <Reveal load delay={0.16}>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-silver">{m.intro}</p>
      </Reveal>
    </PhotoHero>
  );
}

/** The four stages (§5.1) — stage label, title and text; on mobile the outlined number is smaller and inline. */
function MethodStages() {
  const { t } = useI18n();
  return (
    <section aria-label={t.method.eyebrow} className="section-y relative overflow-hidden bg-ink">
      {/* Right under the intro on first load: CSS entrance (staggered) so it never waits for JS (LCP). */}
      <ol
        className="relative mx-auto grid max-w-[88rem] gap-x-10 gap-y-8 px-4 sm:grid-cols-2 sm:px-8 lg:px-12 xl:grid-cols-4 xl:gap-x-8 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]"
      >
        {t.method.stages.map((s, i) => (
          <li
            key={s.title}
            style={{ "--load-y": "24px", "--load-delay": `${0.2 + i * 0.12}s` } as React.CSSProperties}
            className="load-fade-up group relative border-t border-bone/10 pt-5"
          >
            <span aria-hidden className="absolute -top-px start-0 block h-px w-16 bg-ember" />
            <div className="flex items-baseline gap-3 sm:block">
              <span
                aria-hidden
                className="font-display text-[2.4rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_106_0/0.75)] sm:block sm:text-[clamp(3.5rem,7vw,5rem)]"
              >
                0{i + 1}
              </span>
              <div className="sm:mt-3">
                <p className="eyebrow text-[0.75rem] text-ember">{s.label}</p>
                <h2 className="display mt-1 text-[clamp(1.8rem,4.4vw,2.4rem)] font-semibold text-bone">
                  <span className="sr-only">0{i + 1}. </span>
                  {s.title}
                </h2>
              </div>
            </div>
            <p className="mt-3 text-base leading-relaxed text-silver">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Your first 30 days (§5.2), progress tracking (§5.3) and nutrition (§5.4). */
function MethodDetails() {
  const { t } = useI18n();
  const m = t.method;
  return (
    <section aria-labelledby="first30-title" className="section-y surface-deep relative overflow-hidden">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div>
          <h2 id="first30-title" className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">
            {m.first30Title}
          </h2>
          <ol className="mt-5 border-s border-ember/40">
            {m.first30.map((d) => (
              <li key={d.when} className="relative ps-5 pb-5 last:pb-0">
                <span aria-hidden className="absolute -start-[5px] top-2 size-2.5 rounded-full bg-ember" />
                <p className="text-base leading-relaxed text-silver">
                  <strong className="font-semibold text-bone">{d.when}:</strong> {d.what}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-10">
          <div>
            <h2 className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">{m.trackTitle}</h2>
            {/* 2×2 equal boxes, centred labels with a small orange line icon (owner revision) */}
            <ul className="mt-5 grid grid-cols-2 gap-2.5">
              {m.track.map((x, i) => {
                const Icon = TRACK_ICONS[i] ?? Ruler;
                return (
                  <li key={x} className="flex flex-col items-center justify-center gap-2 border hairline bg-carbon px-3 py-4 text-center text-base font-medium leading-snug text-bone">
                    <Icon aria-hidden className="size-6 text-ember" strokeWidth={1.5} />
                    {x}
                  </li>
                );
              })}
            </ul>
          </div>
          {/*
            Room below the paragraph for the faint food art. The art's base reaches into the section's
            bottom padding (gap to the next section ≈ 56–64px on mobile); the pyramid tip sits behind the
            last line; drumstick + oats bowl on the start side, below the text.
          */}
          <div className="relative isolate pb-[6.125rem] sm:pb-[7.125rem] lg:pb-[5.75rem]">
            <FoodPyramid fontClass={caveat.className} />
            <DrumstickAndOats fontClass={caveat.className} />
            <h2 className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">{m.nutritionTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-silver lg:text-lg">{m.nutrition}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodPage() {
  return (
    <>
      <MethodHero />
      <MethodStages />
      <MethodDetails />
      <CtaBlock />
    </>
  );
}
