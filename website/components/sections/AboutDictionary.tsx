"use client";

import { motion } from "framer-motion";
import { Aref_Ruqaa, Source_Serif_4 } from "next/font/google";
import { useI18n } from "@/components/i18n/I18nProvider";
import { caveat } from "@/lib/handwriting";

/*
 * Fonts used only by this card (About page, below the first screen): not preloaded, `swap`.
 * Source Serif 4 is variable (one file per style); latin-ext carries the IPA pronunciation glyphs.
 * The handwritten note: Caveat (Latin) or Aref Ruqaa (Arabic script) — one weight each.
 */
const serif = Source_Serif_4({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], display: "swap", preload: false });
const ruqaa = Aref_Ruqaa({ subsets: ["arabic"], weight: "400", display: "swap", preload: false });

/** Deterministic torn edge: x in %, depth in px (no randomness → identical on server and client). */
function tornEdge(seed: number, steps: number, depth: number) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * 100;
    const d = (rand() * 0.75 + (i % 2) * 0.25) * depth;
    return [x, Math.round(d * 10) / 10] as const;
  });
}
const TOP = tornEdge(7, 46, 9);
const BOTTOM = tornEdge(23, 52, 12);
const CLIP = `polygon(${[
  ...TOP.map(([x, d]) => `${x}% ${d}px`),
  ...[...BOTTOM].reverse().map(([x, d]) => `${x}% calc(100% - ${d}px)`),
].join(", ")})`;

/** Faint paper grain (SVG turbulence) + warm edge tone; pure CSS, no image file. */
const PAPER = [
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgb(176 150 104 / 0.18) 100%)",
  "linear-gradient(180deg, #f5f0e4 0%, #efe8d8 100%)",
].join(", ");

const INK = "text-[#2a2826]";

function Pron({ children }: { children: string }) {
  return <span className="font-light text-[#5d5a55]"> {children} </span>;
}
function Pos({ children }: { children: string }) {
  return <i className="text-[#3c3936]">{children}</i>;
}

/**
 * "Dictionary page" card (§8.1, owner revision): a torn printed page, built in HTML/CSS so the text
 * stays sharp, selectable and readable by screen readers. Entries stay English on every language
 * version (the wordplay only works in English); the handwritten note and a one-line translation
 * (FA/AR only) are localized. Only motion: the highlighter draws in once (Framer; reduced-motion safe).
 */
export function AboutDictionary() {
  const { t, dir } = useI18n();
  const d = t.about.dictionary;
  const rtl = dir === "rtl";

  return (
    <div className="mt-9 lg:mt-10">
      {/* Rotation + shadow live on the wrapper so the shadow follows the torn (clipped) shape */}
      <figure
        aria-label={d.label}
        className="mx-auto w-[92%] max-w-[560px] -rotate-[1.5deg] [filter:drop-shadow(0_14px_22px_rgb(0_0_0/0.45))_drop-shadow(0_2px_3px_rgb(0_0_0/0.35))]"
      >
        <div
          lang="en"
          dir="ltr"
          className={`${serif.className} ${INK} relative px-5 pb-9 pt-7 text-left text-[0.97rem] leading-[1.5] sm:px-8 sm:pb-11 sm:pt-9 sm:text-[1.06rem]`}
          style={{ clipPath: CLIP, backgroundImage: PAPER }}
        >
          {/* Book title at the very top of the page (generic — no publisher name or logo) */}
          <div aria-hidden className="mb-3 text-center">
            <p className="text-[0.92em] font-bold uppercase tracking-[0.18em]">The Dictionary of Fitness</p>
            <p className="mt-0.5 text-[0.78em] italic text-[#5d5a55]">Unabridged · Second Edition</p>
          </div>
          {/* Running head: guide words · big letter · page number (decorative) */}
          <div aria-hidden className="flex items-end justify-between border-b border-[#2a2826]/45 pb-1.5">
            <span className="text-[0.86em] font-semibold tracking-[0.02em]">fist — fitting</span>
            <span className="flex items-baseline gap-3">
              <span className="text-[1.9em] font-bold leading-none">F</span>
              <span className="text-[0.86em] tabular-nums">214</span>
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            <p>
              <b className="font-bold">fit</b>
              <Pron>/fɪt/</Pron>
              <Pos>adj.</Pos> In good physical shape; strong, healthy and ready for whatever the day throws at you.
            </p>
            <p>
              <b className="font-bold">fitness</b>
              <Pron>/ˈfɪt.nəs/</Pron>
              <Pos>n.</Pos> The state of being fit. Built on consistency, not perfection.
            </p>

            <p className="relative">
              {/* Margin note in blue ballpoint, floated into the right margin of this entry */}
              <span
                aria-hidden
                dir="ltr"
                className="float-right -mr-2 ml-2 mt-1 flex rotate-[-7deg] items-center gap-1 whitespace-nowrap text-[#2747a6] sm:-mr-4"
              >
                <span className={`${caveat.className} text-[1.45em] leading-none`}>←</span>
                <span
                  dir={rtl ? "rtl" : "ltr"}
                  className={`${rtl ? ruqaa.className : caveat.className} text-[1.35em] leading-none ${rtl ? "text-[1.25em]" : ""}`}
                >
                  {d.note}
                </span>
              </span>
              <b className="relative isolate inline-block font-bold">
                {/* Brand-orange highlighter stroke, slightly uneven; draws in left → right once */}
                <motion.span
                  aria-hidden
                  className="absolute -inset-x-1.5 -bottom-0.5 top-[0.2em] -z-10 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.9 }}
                  transition={{ duration: 0.8, ease: [0.45, 0, 0.25, 1], delay: 0.15 }}
                >
                  <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="size-full -rotate-[0.8deg]">
                    <path
                      d="M1.5 5.2 C 18 3.1, 37 4.6, 55 3.4 S 86 2.6, 98.6 4.1 L 99.2 9 L 98.1 15.6 C 80 17.4, 61 15.9, 43 17.2 S 12 16.4, 0.8 17.8 L 1.4 11.5 Z"
                      fill="#ff6a00"
                      fillOpacity="0.55"
                    />
                  </svg>
                </motion.span>
                FIT·ol·o·gist
              </b>
              <Pron>/fɪˈtɒl.ə.dʒɪst/</Pron>
              <Pos>n.</Pos> A coach who studies what gets people fit, and makes it work for your life.{" "}
              <span className="whitespace-nowrap">
                <span aria-hidden>▸</span> <i>see also:</i> Saeid (Dubai).
              </span>
            </p>

            {/* Last entry runs into the torn edge and fades out */}
            <p className="[mask-image:linear-gradient(to_bottom,#000_35%,transparent_105%)]">
              <b className="font-bold">fitting</b>
              <Pron>/ˈfɪt.ɪŋ/</Pron>
              <Pos>adj.</Pos> Right for the situation, like a plan built around your…
            </p>
          </div>
        </div>
      </figure>

      {d.translation && (
        <p className="mx-auto mt-5 w-[92%] max-w-[560px] text-[0.95rem] leading-relaxed text-silver">
          <bdi dir="ltr" className="font-semibold text-bone">
            {d.translation.split(" ")[0]}
          </bdi>{" "}
          {d.translation.slice(d.translation.indexOf(" ") + 1)}
        </p>
      )}
    </div>
  );
}
