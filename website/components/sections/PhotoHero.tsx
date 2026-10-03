"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n/I18nProvider";

export type Veil = { x: number; y: number; rx: number; ry: number };

/**
 * Page intro over a landscape photo (/method, /plans). Mobile: photo block (behind the transparent
 * header) with the copy directly below it, overlapping its bottom fade — like Home. Desktop:
 * full-bleed photo with the copy over its dark side.
 *
 * The inner box is always exactly the photo's rendered area (cover, computed with container units),
 * so localized veils over baked-in logos/slogans (photo coordinates, %) stay on them at every width.
 * `focus` = which horizontal point of the photo is centred (mobile / desktop). `belowHeader` starts
 * the photo under the header band, so the logo, language button and menu never sit over a face.
 * `side` is physical (the photo is never mirrored), so the copy stays on the dark side in every language.
 */
export function PhotoHero({
  id,
  src,
  alt,
  ratio,
  focus,
  side,
  belowHeader = false,
  veils = [],
  children,
}: {
  id: string;
  src: string;
  alt: string;
  ratio: number;
  focus: { mobile: string; desktop: string };
  side: "left" | "right";
  belowHeader?: boolean;
  veils?: Veil[];
  children: React.ReactNode;
}) {
  const { dir } = useI18n();
  const shade =
    side === "left"
      ? "linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 32%, rgba(5,5,5,0.25) 52%, transparent 64%)"
      : "linear-gradient(to left, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.7) 30%, rgba(5,5,5,0.2) 50%, transparent 60%)";
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-ink lg:flex lg:min-h-[min(82svh,46rem)] lg:items-center">
      <div
        className={`relative w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto ${
          belowHeader
            ? "mt-[calc(var(--header-compact)+env(safe-area-inset-top))] h-[min(44svh,24rem)] lg:top-[var(--header-h)] lg:mt-0"
            : "h-[calc(min(44svh,24rem)+var(--header-compact)+env(safe-area-inset-top))]"
        }`}
      >
        <div className="absolute inset-0 [container-type:size]">
          <div
            className="load-fade-in absolute left-1/2 top-1/2 [--hero-x:var(--hero-x-m)] lg:[--hero-x:var(--hero-x-d)]"
            style={
              {
                "--hero-x-m": focus.mobile,
                "--hero-x-d": focus.desktop,
                width: `max(100cqw, 100cqh * ${ratio})`,
                aspectRatio: String(ratio),
                transform: "translate(calc(var(--hero-x) * -1), -50%)",
              } as React.CSSProperties
            }
          >
            <Image src={src} alt={alt} fill preload quality={85} sizes="(min-width: 1024px) 100vw, 200vw" className="object-cover" />
            {/* Localized darken + blur over baked-in logos/slogans (photo coordinates) */}
            {veils.map((v, i) => {
              const shape = `radial-gradient(ellipse ${v.rx}% ${v.ry}% at ${v.x}% ${v.y}%, #000 78%, transparent 100%)`;
              return (
                <div key={i} aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 backdrop-blur-[12px]" style={{ maskImage: shape, WebkitMaskImage: shape }} />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse ${v.rx}% ${v.ry}% at ${v.x}% ${v.y}%, rgb(14 14 15 / 0.97) 0%, rgb(14 14 15 / 0.95) 72%, rgb(14 14 15 / 0.7) 86%, transparent 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Legibility: soft top fade (header / band edge), bottom fade into the page, dark reading side on desktop */}
        <div aria-hidden className={`absolute inset-x-0 top-0 bg-linear-to-b to-transparent ${belowHeader ? "h-12 from-ink" : "h-28 from-ink/60"}`} />
        <div aria-hidden className="absolute inset-x-0 -bottom-px h-[42%] bg-linear-to-t from-ink via-ink/70 to-transparent lg:h-[30%]" />
        <div aria-hidden className="absolute inset-0 hidden lg:block" style={{ background: shade }} />
      </div>

      <div
        className={`relative z-10 mx-auto -mt-20 w-full max-w-[88rem] px-4 pb-6 sm:px-8 lg:mt-0 lg:flex lg:px-12 lg:pb-0 lg:pt-[var(--header-h)] rtl:pr-6 rtl:sm:pr-10 ${
          side === "right" ? "lg:justify-end" : "lg:justify-start"
        }`}
        dir="ltr"
      >
        {/* Copy keeps the page direction; only its physical column is fixed */}
        <div className="max-w-xl lg:w-[min(36rem,42%)]" dir={dir}>
          {children}
        </div>
      </div>
    </section>
  );
}
