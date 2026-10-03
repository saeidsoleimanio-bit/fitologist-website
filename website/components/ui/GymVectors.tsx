import { BicepsFlexed, Dumbbell, Timer } from "lucide-react";

type SvgProps = { className?: string; style?: React.CSSProperties };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Protein shaker: cap with spout, tapered bottle, mixing-line marks. */
function Shaker({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...stroke}>
      <path d="M10.5 2h3v2h-3z" />
      <path d="M7.5 4h9v3h-9z" />
      <path d="M8 7l1 14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-14" />
      <path d="M8.7 12h6.6M9 16h2" />
    </svg>
  );
}

/** Protein tub: lid, round container, label band and a scoop mark. */
function ProteinTub({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...stroke}>
      <path d="M4.5 5.5h15v3h-15z" />
      <path d="M5.5 8.5v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-11" />
      <path d="M5.5 12.5h13M5.5 17h13" />
      <path d="M10 14.8h4" />
    </svg>
  );
}

/** Person in a back squat with a loaded barbell across the shoulders. */
function SquatBarbell({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} {...stroke}>
      <path d="M2.5 7.5h19" />
      <path d="M3.5 5.5v4M5 5v5M19 5v5M20.5 5.5v4" />
      <circle cx="12" cy="4.2" r="1.6" />
      <path d="M9 7.5l2 2M15 7.5l-2 2" />
      <path d="M12 7.5l-1 6" />
      <path d="M11 13.5l4.5 1.5-.5 6" />
      <path d="M11 13.5l-4 2 .5 5.5" />
    </svg>
  );
}

/**
 * Faint orange gym line-art scattered behind the Body Check card content (owner revision).
 * Decorative only: aria-hidden, no pointer events, ~10% opacity, irregular sizes and rotations.
 * Inputs and buttons above it have solid backgrounds, so nothing shows through them.
 */
export function GymVectors() {
  // Mobile positions sit in the measured gaps between control rows (identical at 375–430px):
  // 0–42 top · 86–129 weight/age · 173–224 sex · 268–311 activity · 355–407 goals (px from card top).
  // Only small edges tuck behind fields. From sm up, the original scattered positions apply.
  const items: { Icon: React.ComponentType<SvgProps>; cls: string; rot: number }[] = [
    { Icon: Shaker, cls: "-top-1 right-[6%] size-14 sm:top-[3%] sm:right-[5%] sm:size-16", rot: 12 },
    { Icon: Timer, cls: "left-[30%] top-[90px] size-9 sm:top-auto sm:bottom-[16%] sm:left-[48%] sm:size-11", rot: -22 },
    { Icon: Dumbbell, cls: "right-[8%] top-[88px] size-10 sm:right-auto sm:left-[36%] sm:top-[14%] sm:size-12", rot: 28 },
    { Icon: SquatBarbell, cls: "right-[12%] top-[158px] size-20 sm:top-auto sm:bottom-[3%] sm:right-[20%] sm:size-24", rot: 4 },
    { Icon: ProteinTub, cls: "left-[42%] top-[258px] size-16 sm:left-[2%] sm:top-[42%] sm:size-20", rot: -9 },
    { Icon: BicepsFlexed, cls: "right-[3%] top-[345px] size-[4.5rem] sm:right-[2%] sm:top-[36%] sm:size-24", rot: -16 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-ember opacity-[0.1]">
      {items.map(({ Icon, cls, rot }, i) => (
        <Icon key={i} className={`absolute ${cls}`} style={{ transform: `rotate(${rot}deg)` }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Food pyramid */

/** Deterministic wobble so the "hand-drawn" lines are identical on server and client. */
function wobblyLine(x1: number, y1: number, x2: number, y2: number, seed: number, amp = 1.3) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * 2;
  const steps = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 14));
  const nx = -(y2 - y1) / Math.hypot(x2 - x1, y2 - y1);
  const ny = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1);
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const o = i === 0 || i === steps ? rand() * amp * 0.4 : rand() * amp;
    return [x1 + (x2 - x1) * t + nx * o, y1 + (y2 - y1) * t + ny * o].map((v) => Math.round(v * 10) / 10);
  });
  return "M" + pts.map((p) => p.join(" ")).join(" L");
}

// Pyramid geometry (viewBox 200×172): apex (100,6), base y=164, tiers at y = 124 / 84 / 44.
const APEX = { x: 100, y: 6 };
const BASE_Y = 164;
const HALF_BASE = 94;
const halfAt = (y: number) => ((y - APEX.y) / (BASE_Y - APEX.y)) * HALF_BASE;
const TIERS = [124, 84, 44];
const PYRAMID_LINES = [
  wobblyLine(APEX.x - HALF_BASE, BASE_Y, APEX.x + HALF_BASE, BASE_Y, 3),
  wobblyLine(APEX.x - HALF_BASE, BASE_Y, APEX.x, APEX.y, 7),
  wobblyLine(APEX.x + HALF_BASE, BASE_Y, APEX.x, APEX.y, 11),
  ...TIERS.map((y, i) => wobblyLine(APEX.x - halfAt(y) + 1, y, APEX.x + halfAt(y) - 1, y, 17 + i * 5, 1)),
];
// A second, lighter pass slightly offset: the sketchy "drawn twice" look.
const PYRAMID_SKETCH = [
  wobblyLine(APEX.x - HALF_BASE + 3, BASE_Y + 1.5, APEX.x + HALF_BASE - 2, BASE_Y - 1, 41, 1.6),
  wobblyLine(APEX.x - HALF_BASE + 2, BASE_Y - 1, APEX.x + 1.5, APEX.y + 3, 43, 1.6),
  wobblyLine(APEX.x + HALF_BASE - 1, BASE_Y + 1, APEX.x - 1, APEX.y + 2, 47, 1.6),
];
/** Bottom → top, labels stay English on every language version (like the dictionary card). */
const PYRAMID_LABELS = [
  { text: "Carbohydrates", y: 150, size: 17 },
  { text: "Protein", y: 110, size: 17 },
  { text: "Healthy Fats", y: 70, size: 14 },
  { text: "Treats", y: 33, size: 10.5 },
];

/**
 * Hand-drawn food pyramid behind "Nutrition, kept simple" on /method (owner revision; replaces the
 * plate/avocado vectors). Faint orange sketchy lines, handwriting labels a little stronger, rotated
 * ~6°. Sits at the end side of the block (right in LTR, left in RTL), base near the section's bottom
 * edge, tip behind the last line of the paragraph. Decorative: aria-hidden, no pointer events.
 */
export function FoodPyramid({ fontClass, column = false, boost = 1 }: { fontClass: string; column?: boolean; boost?: number }) {
  // `column`: desktop placement in the empty left column of the section (owner revision); the inline
  // placement (below the paragraph) is the mobile/tablet one and hides from lg up.
  const o = (v: number) => Math.min(1, v * boost);
  return (
    <div
      aria-hidden
      className={
        column
          ? "pointer-events-none absolute bottom-0 end-[6%] w-64 text-ember"
          : "pointer-events-none absolute -bottom-3.5 end-1 w-[min(46vw,11rem)] text-ember sm:end-2 sm:w-52 lg:-bottom-9 lg:hidden"
      }
      style={{ transform: "rotate(6deg)" }}
    >
      <svg viewBox="0 0 200 172" className={`h-auto w-full overflow-visible ${fontClass}`} lang="en">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" opacity={o(0.22)}>
          {PYRAMID_LINES.map((d, i) => (
            <path key={i} d={d} strokeWidth={1.6} />
          ))}
        </g>
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity={o(0.11)}>
          {PYRAMID_SKETCH.map((d, i) => (
            <path key={i} d={d} strokeWidth={1.1} />
          ))}
        </g>
        <g fill="currentColor" opacity={o(0.35)} textAnchor="middle">
          {PYRAMID_LABELS.map((l) => (
            <text key={l.text} x={APEX.x} y={l.y} fontSize={l.size}>
              {l.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------- More sketchy nutrition art (/method) */

/** Closed hand-drawn outline: samples a parametric shape and adds a deterministic wobble. */
function wobblyClosed(at: (t: number) => [number, number], seed: number, steps = 28, amp = 1.1) {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * 2;
  const pts = Array.from({ length: steps }, (_, i) => {
    const [x, y] = at(i / steps);
    return [Math.round((x + rand() * amp) * 10) / 10, Math.round((y + rand() * amp) * 10) / 10];
  });
  return "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
}

const SKETCH = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Chicken drumstick (viewBox 120×84): meaty teardrop tapering into the bone, two-knob bone end.
const drumstick = (scale: number, dx = 0, dy = 0) => (t: number): [number, number] => {
  const a = t * Math.PI * 2;
  // Teardrop pointing right: full height on the left, narrowing to the bone on the right.
  return [44 + dx + Math.cos(a) * 36 * scale, 42 + dy + Math.sin(a) * 27 * scale * (0.58 - 0.42 * Math.cos(a))];
};
const DRUM_OUTLINE = wobblyClosed(drumstick(1), 5);
const DRUM_SKETCH = wobblyClosed(drumstick(0.97, 1.2, 0.8), 9, 24, 1.6);
const DRUM_DETAIL = [
  wobblyLine(76, 38.5, 99, 35.5, 13, 0.6), // bone shaft, top edge
  wobblyLine(76, 45.5, 99, 47.5, 19, 0.6), // bone shaft, bottom edge
  "M30 30 C 36 26, 44 27, 50 31", // skin texture strokes
  "M24 46 C 30 50, 40 52, 48 49",
];
const DRUM_KNOBS = [
  [104, 33.5, 5.2],
  [104.5, 49, 5.4],
] as const;

// Bowl (viewBox 120×96): rim, rounded body, foot, oat flakes on top; "Oats" handwritten on the front.
const BOWL_RIM = wobblyClosed((t) => {
  const a = t * Math.PI * 2;
  return [60 + Math.cos(a) * 50, 36 + Math.sin(a) * 9];
}, 29, 30, 0.9);
const BOWL_BODY = `${wobblyLine(10, 37, 10.5, 40, 31, 0.5)} C 14 70, 38 84, 60 84 C 82 84, 106 70, 110 40`;
const BOWL_FOOT = wobblyLine(44, 86, 76, 86, 37, 0.8);
const OAT_FLAKES = [
  [42, 30, 6, 2.6, -20],
  [58, 28, 6.5, 2.8, 15],
  [74, 31, 5.5, 2.4, -8],
  [50, 34, 5, 2.2, 30],
  [67, 35, 5.5, 2.3, -35],
] as const;

/**
 * Two more hand-drawn background pieces for "Nutrition, kept simple" (owner revision): a chicken drumstick and an
 * "Oats" bowl, same faint sketchy orange as the food pyramid, casually rotated (not aligned with each
 * other or the pyramid). They sit on the start side below the paragraph (left in LTR, right in RTL),
 * clear of the text and the pyramid. Decorative: aria-hidden, no pointer events.
 */
export function DrumstickAndOats({ fontClass, column = false, boost = 1 }: { fontClass: string; column?: boolean; boost?: number }) {
  const o = (v: number) => Math.min(1, v * boost);
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${column ? "" : "lg:hidden"}`}>
      <svg
        viewBox="0 0 120 84"
        className={
          column
            ? "absolute bottom-[52%] start-[3%] h-auto w-32 overflow-visible text-ember"
            : "absolute bottom-5 start-0 h-auto w-[min(19vw,4.75rem)] overflow-visible text-ember rtl:w-[min(16vw,4.25rem)] sm:bottom-6 sm:w-24 rtl:sm:w-24 lg:bottom-0"
        }
        style={{ transform: "rotate(-11deg)" }}
      >
        <g {...SKETCH} opacity={o(0.22)} strokeWidth={2}>
          <path d={DRUM_OUTLINE} />
          {DRUM_DETAIL.map((d, i) => (
            <path key={i} d={d} strokeWidth={i < 2 ? 2 : 1.4} />
          ))}
          {DRUM_KNOBS.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <path d={DRUM_SKETCH} {...SKETCH} opacity={o(0.11)} strokeWidth={1.3} />
      </svg>
      <svg
        viewBox="0 0 120 96"
        className={`${
          column
            ? "absolute bottom-[6%] start-[24%] h-auto w-32 overflow-visible text-ember"
            : "absolute -bottom-3 start-[25%] h-auto w-[min(17vw,4.5rem)] rtl:start-[23%] rtl:w-[min(15vw,4rem)] rtl:sm:w-24 overflow-visible text-ember sm:start-[26%] sm:w-24 lg:-bottom-8"
        } ${fontClass}`}
        style={{ transform: "rotate(7deg)" }}
        lang="en"
      >
        <g {...SKETCH} opacity={o(0.22)} strokeWidth={2}>
          <path d={BOWL_RIM} />
          <path d={BOWL_BODY} />
          <path d={BOWL_FOOT} />
          {OAT_FLAKES.map(([x, y, rx, ry, rot], i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${rot} ${x} ${y})`} strokeWidth={1.4} />
          ))}
        </g>
        <text x={60} y={68} textAnchor="middle" fontSize={22} fill="currentColor" opacity={o(0.35)}>
          Oats
        </text>
      </svg>
    </div>
  );
}
