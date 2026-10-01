"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

export type LayerSlide = { src: string; alt: string; width: number; height: number };

const COLS = 4;
const ROWS = 3;
/** Whole transition (ms). Fragments animate within this window. */
const TRANSITION_MS = 1450;
/** Max fragment displacement (px) at the outer edge of the grid. */
const SPREAD = { x: 24, y: 18 };

type Cell = { c: number; r: number; dx: number; dy: number; dist: number };

const CELLS: Cell[] = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const nx = (c - (COLS - 1) / 2) / ((COLS - 1) / 2); // -1 … 1
  const ny = (r - (ROWS - 1) / 2) / ((ROWS - 1) / 2);
  return { c, r, dx: nx * SPREAD.x, dy: ny * SPREAD.y, dist: Math.hypot(nx, ny) / Math.SQRT2 };
});

/**
 * 12 absolutely positioned tiles sharing one background image (sprite technique).
 * Only mounted while a transition runs — the resting state is a single <Image>.
 */
function Fragments({ url, mode }: { url: string; mode: "out" | "in" }) {
  const out = mode === "out";
  const span = (TRANSITION_MS / 1000) * 0.7;
  return (
    <>
      {CELLS.map((cell) => {
        const scattered = { x: cell.dx, y: cell.dy, opacity: 0, scale: 0.985 };
        const settled = { x: 0, y: 0, opacity: 1, scale: 1 };
        return (
          <motion.div
            key={`${cell.c}-${cell.r}`}
            aria-hidden
            className="absolute will-change-transform"
            style={{
              left: `${(cell.c * 100) / COLS}%`,
              top: `${(cell.r * 100) / ROWS}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              backgroundImage: `url("${url}")`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(cell.c / (COLS - 1)) * 100}% ${(cell.r / (ROWS - 1)) * 100}%`,
            }}
            initial={out ? settled : scattered}
            animate={out ? scattered : settled}
            transition={{
              duration: span,
              ease: EASE,
              // out: edges leave first; in: centre assembles first
              delay: (out ? 1 - cell.dist : cell.dist) * ((TRANSITION_MS / 1000) * 0.3),
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Photographs as large layers embedded in the page background — no frame, card, border or halo.
 * - The dominant photo is a masked layer at its own ratio (never cropped or distorted); its edges
 *   dissolve into the dark page (`.photo-layer-mask`).
 * - A faint, offset "echo" of the next photo sits deeper behind it, so the photos overlap in depth.
 * - Transition: the current photo disintegrates into fragments that drift outward while the next
 *   one assembles in its place (~1.45s; holds ~5s). Fragments exist only during the transition.
 * - Pauses on hover/focus or off-screen. Reduced motion: plain crossfade, no autoplay.
 */
export function FragmentLayerGallery({
  slides,
  label,
  sizes,
  className = "",
  interval = 5000,
  dotsLabel = (i: number, n: number) => `${i} / ${n}`,
  dotsClassName = "bottom-0",
}: {
  slides: LayerSlide[];
  label: string;
  sizes: string;
  className?: string;
  interval?: number;
  dotsLabel?: (i: number, n: number) => string;
  /** Position of the slide indicator (e.g. raised when the layer bleeds past its section). */
  dotsClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.25 });
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  // One optimised URL per slide for the fragment sprites (also warmed up front).
  const spriteUrls = useMemo(
    () =>
      slides.map(
        (s) => getImageProps({ src: s.src, alt: "", width: 828, height: Math.round((828 * s.height) / s.width), quality: 75 }).props.src,
      ),
    [slides],
  );
  useEffect(() => {
    spriteUrls.forEach((u) => {
      const img = new window.Image();
      img.src = u;
    });
  }, [spriteUrls]);

  const goTo = useCallback(
    (next: number) => {
      if (next === index) return;
      setPrev(index);
      setIndex(next);
    },
    [index],
  );

  // End of transition → drop the fragments, back to a single image.
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), TRANSITION_MS + 150);
    return () => window.clearTimeout(t);
  }, [prev]);

  // Autoplay
  useEffect(() => {
    if (reduce || paused || !inView || prev !== null || slides.length < 2) return;
    const t = window.setTimeout(() => goTo((index + 1) % slides.length), interval);
    return () => window.clearTimeout(t);
  }, [reduce, paused, inView, prev, index, slides.length, interval, goTo]);

  const transitioning = prev !== null;
  const echo = slides[(index + 1) % slides.length];

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="gallery"
      aria-label={label}
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Deeper layer: a faint echo of the next photograph, offset and smaller, overlapping behind */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-start">
        <AnimatePresence initial={false}>
          <motion.div
            key={echo.src}
            className="photo-layer-mask absolute left-[-6%] top-[2%] h-[74%] blur-[1.5px]"
            style={{ aspectRatio: `${echo.width} / ${echo.height}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <Image src={echo.src} alt="" fill sizes="30vw" quality={60} className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dominant layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        {slides.map((s, i) => {
          const isCurrent = i === index;
          const isPrev = i === prev;
          const visible = isCurrent || isPrev;
          return (
            // Layer takes the photo's own ratio (never cropped); its edges dissolve via the mask.
            <motion.div
              key={s.src}
              aria-hidden={!isCurrent}
              className="photo-layer-mask absolute h-full max-w-full"
              style={{ aspectRatio: `${s.width} / ${s.height}` }}
              initial={false}
              animate={{ opacity: reduce ? (isCurrent ? 1 : 0) : visible ? 1 : 0 }}
              transition={{ duration: reduce ? 1 : 0.01 }}
            >
              <Image
                src={s.src}
                alt={isCurrent ? s.alt : ""}
                fill
                sizes={sizes}
                quality={85}
                className={`object-cover ${transitioning && !reduce ? "opacity-0" : ""}`}
              />
              {transitioning && !reduce && isPrev && <Fragments url={spriteUrls[i]} mode="out" />}
              {transitioning && !reduce && isCurrent && <Fragments url={spriteUrls[i]} mode="in" />}
            </motion.div>
          );
        })}
      </div>

      {/* Slide indicator — fine lines, bottom centre */}
      <div className={`absolute inset-x-0 z-10 flex justify-center gap-2 ${dotsClassName}`} dir="ltr">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={dotsLabel(i + 1, slides.length)}
            aria-current={i === index ? "true" : undefined}
            className="group flex h-8 items-center px-1"
          >
            <span
              className={`block h-px transition-[width,background-color] duration-400 ease-[var(--ease-premium)] ${
                i === index ? "w-10 bg-ember" : "w-5 bg-silver/40 group-hover:bg-silver/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
