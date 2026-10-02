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
