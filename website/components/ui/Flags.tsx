/**
 * Small inline SVG flags (not emoji: Windows renders flag emoji as letters). Sized to the text
 * (height ≈ 0.8em). Flags are never mirrored in RTL; they simply sit at the start of the line.
 */
type FlagProps = { label: string; className?: string };

/** United Kingdom (Union Jack), 2:1. */
export function UKFlag({ label, className = "" }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" role="img" aria-label={label} className={`inline-block h-[0.8em] w-auto shrink-0 rounded-[1px] ${className}`}>
      <clipPath id="uk-flag-clip">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id="uk-flag-diag">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-flag-diag)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

/** United Arab Emirates, 2:1: red hoist band + green / white / black stripes. */
export function UAEFlag({ label, className = "" }: FlagProps) {
  return (
    <svg viewBox="0 0 12 6" role="img" aria-label={label} className={`inline-block h-[0.8em] w-auto shrink-0 rounded-[1px] ${className}`}>
      <path d="M0 0h12v2H0z" fill="#00732F" />
      <path d="M0 2h12v2H0z" fill="#fff" />
      <path d="M0 4h12v2H0z" fill="#000" />
      <path d="M0 0h3v6H0z" fill="#FF0000" />
      {/* hairline so the white stripe doesn't vanish on light backgrounds */}
      <rect x="0.05" y="0.05" width="11.9" height="5.9" fill="none" stroke="rgb(0 0 0 / 0.25)" strokeWidth="0.1" />
    </svg>
  );
}
