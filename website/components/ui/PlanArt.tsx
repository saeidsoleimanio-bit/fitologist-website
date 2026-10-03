/**
 * Line-art for the /plans Step 1 cards (owner revision 2: objects only — no human figures): same
 * neon-orange line style with a soft glow
 * as the "Who I work with" icons, drawn larger as part of each card's background (bottom, end side,
 * partly cropped by the card edge). Decorative only: aria-hidden, no pointer events.
 */
type ArtProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** 1:1 — a clipboard with a checklist (a plan written for you) and a stopwatch beside it. */
function ClipboardStopwatch({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...stroke}>
      <defs>
        <mask id="plan-stopwatch-cutout">
          <rect width="64" height="64" fill="#fff" />
          <circle cx="47" cy="43" r="12.5" fill="#000" />
        </mask>
      </defs>
      {/* clipboard + clip (its edge stops behind the stopwatch) */}
      <g mask="url(#plan-stopwatch-cutout)">
        <rect x="7" y="11" width="30" height="44" rx="3" />
        <rect x="15" y="7" width="14" height="7" rx="2" />
        {/* checklist: three ticked rows */}
        <path d="M12 23.5l2 2 3.5-4M21 23.5h11" />
        <path d="M12 32.5l2 2 3.5-4M21 32.5h11" />
        <path d="M12 41.5l2 2 3.5-4M21 41.5h8" />
      </g>
      {/* stopwatch */}
      <circle cx="47" cy="43" r="10" />
      <path d="M45 30.5h4M47 30.5v2.5M54.5 34.5l2-2" />
      <path d="M47 43v-6M47 43l4 2.5" />
    </svg>
  );
}

/** Partner — two protein shakers clinking together ("cheers"), with motion lines at the contact. */
function ShakersCheers({ className }: ArtProps) {
  const shaker = (
    <>
      <path d="M-5 -20h10v4H-5z" />
      <path d="M-7 -16h14v4H-7z" />
      <path d="M-6.5 -12l1.5 22a1.6 1.6 0 0 0 1.6 1.5h6.8A1.6 1.6 0 0 0 5 10l1.5-22" />
      <path d="M-5.5 -3h11" />
    </>
  );
  return (
    <svg viewBox="0 0 64 64" className={className} {...stroke}>
      <g transform="translate(20 38) rotate(16) scale(1.25)">{shaker}</g>
      <g transform="translate(44 38) rotate(-16) scale(1.25)">{shaker}</g>
      {/* motion lines where the caps meet */}
      <path d="M32 7.5v-5M26 9.5l-2.5-4M38 9.5l2.5-4" />
    </svg>
  );
}

/** Online — a smartphone playing a workout video, with a small checkmark. */
function PhonePlay({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...stroke}>
      <defs>
        <mask id="plan-check-cutout">
          <rect width="64" height="64" fill="#fff" />
          <circle cx="47" cy="49" r="9.5" fill="#000" />
        </mask>
      </defs>
      {/* phone (its edge stops behind the checkmark badge) */}
      <g mask="url(#plan-check-cutout)">
        <rect x="16" y="5" width="28" height="54" rx="5" />
        <path d="M27 9.5h6" />
        <rect x="20" y="14" width="20" height="34" rx="1.5" />
      </g>
      {/* play button */}
      <circle cx="30" cy="31" r="7" />
      <path d="M28 27.5v7l6-3.5z" />
      {/* checkmark badge */}
      <circle cx="47" cy="49" r="7" />
      <path d="M43.8 49.2l2.2 2.2 4.2-4.6" />
    </svg>
  );
}

/** Hybrid — a dumbbell resting in front of a smartphone (the phone's lines stop behind the dumbbell). */
function DumbbellOverPhone({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...stroke}>
      <defs>
        <mask id="hybrid-dumbbell-cutout">
          <rect width="64" height="64" fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth={4}>
            <rect x="6" y="38" width="8" height="18" rx="2" />
            <rect x="14" y="41" width="5" height="12" rx="1.5" />
            <path d="M19 47h18" />
            <rect x="37" y="41" width="5" height="12" rx="1.5" />
            <rect x="42" y="38" width="8" height="18" rx="2" />
          </g>
        </mask>
      </defs>
      {/* phone behind */}
      <g mask="url(#hybrid-dumbbell-cutout)">
        <rect x="24" y="5" width="28" height="48" rx="4.5" />
        <path d="M34.5 9h7" />
        <path d="M29 18h18M29 24h13M29 30h18" />
      </g>
      {/* dumbbell in front */}
      <rect x="6" y="38" width="8" height="18" rx="2" />
      <rect x="14" y="41" width="5" height="12" rx="1.5" />
      <path d="M19 47h18" />
      <rect x="37" y="41" width="5" height="12" rx="1.5" />
      <rect x="42" y="38" width="8" height="18" rx="2" />
    </svg>
  );
}

const ART = { "1to1": ClipboardStopwatch, partner: ShakersCheers, online: PhonePlay, hybrid: DumbbellOverPhone } as const;

export function PlanTypeArt({ type, selected }: { type: keyof typeof ART; selected: boolean }) {
  const Art = ART[type];
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -bottom-4 -end-4 z-0 size-28 text-[#ff7a1a] transition-opacity duration-500 [filter:drop-shadow(0_0_5px_rgb(255_106_0/0.6))_drop-shadow(0_0_14px_rgb(255_106_0/0.3))] sm:size-32 ${
        selected ? "opacity-[0.36]" : "opacity-[0.2]"
      }`}
    >
      <Art className="size-full" />
    </span>
  );
}
