import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "outline";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 min-[360px]:gap-3 overflow-hidden px-5 py-3 font-display text-[0.9rem] min-[360px]:px-6 min-[360px]:text-[0.95rem] font-semibold uppercase tracking-[0.12em] min-[360px]:tracking-[0.18em] transition-[color,background-color,border-color,transform] duration-300 ease-[var(--ease-premium)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ember text-ink hover:text-ink",
  ghost: "border hairline bg-bone/[0.03] text-bone backdrop-blur-sm hover:border-bone/40",
  outline: "border border-ember/60 text-bone hover:border-ember",
};

/** Sweep layer that slides in on hover. */
function Sweep({ variant }: { variant: Variant }) {
  const tone = variant === "primary" ? "bg-bone" : "bg-ember/15";
  return (
    <span
      aria-hidden
      className={`absolute inset-0 origin-left scale-x-0 rtl:origin-right ${tone} transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100 group-focus-visible:scale-x-100`}
    />
  );
}

type CommonProps = {
  variant?: Variant;
  icon?: React.ReactNode | false;
  className?: string;
  children: React.ReactNode;
};

function Inner({ variant, icon, children }: Required<Pick<CommonProps, "variant">> & CommonProps) {
  return (
    <>
      <Sweep variant={variant} />
      <span className="relative">{children}</span>
      {icon !== false && (
        <span
          aria-hidden
          className="relative transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
        >
          {/* Directional icons mirror in RTL; brand icons passed in (e.g. WhatsApp) never do. */}
          {icon ?? <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={2} />}
        </span>
      )}
    </>
  );
}

/** Internal paths ("/…") use next/link for client-side navigation; anything else is a plain anchor. */
export function ButtonLink({
  variant = "primary",
  icon,
  className = "",
  children,
  href = "",
  ...props
}: CommonProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <Inner variant={variant} icon={icon}>
      {children}
    </Inner>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={cls} {...props}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls} {...props}>
      {inner}
    </a>
  );
}

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  type = "button",
  ...props
}: CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Inner variant={variant} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}
