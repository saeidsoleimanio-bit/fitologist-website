"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";
import { START_ID } from "@/lib/site";
import { LeadForm } from "./LeadForm";

/**
 * The form section (§4.10) — anchor #start. Used on Home, /plans and /start (h1 there).
 * "Your First Step Is Free" + intro + avatar with the reply promise, then the lead form.
 */
export function StartTraining({
  headingLevel = "h2",
  standalone = false,
  nextSteps = false,
}: {
  headingLevel?: "h1" | "h2";
  standalone?: boolean;
  /** Home: "What happens next" (3 numbered steps + detail links) instead of the intro sentence. */
  nextSteps?: boolean;
}) {
  const { t, href, locale } = useI18n();
  const s = t.start;
  const titleId = "start-title";
  const Heading = headingLevel;

  return (
    <section
      id={START_ID}
      aria-labelledby={titleId}
      className={`section-y relative isolate overflow-hidden bg-ink ${standalone ? "pt-[calc(var(--header-compact)+1.5rem)] lg:pt-[calc(var(--header-h)+2rem)]" : ""}`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10">
        <Reveal load={standalone}>
          <Heading
            id={titleId}
            className="display text-[clamp(2.4rem,8vw,4rem)] leading-[0.95] text-bone text-balance"
          >
            {s.title}
          </Heading>
        </Reveal>
        {nextSteps ? (
          <Reveal delay={0.08}>
            <ol className="mt-5 space-y-3">
              {[s.next.send, s.reply, s.next.consultation].map((text, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-[1.05rem] leading-snug"
                >
                  <span
                    aria-hidden
                    className="w-5 shrink-0 font-display text-[1.35rem] font-bold leading-none text-ember"
                  >
                    {(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en")}
                  </span>
                  {i === 1 ? (
                    /* Reply promise keeps its orange icon, glow and shimmer */
                    <span className="font-medium">
                      <Clock
                        aria-hidden
                        className="me-1.5 inline size-[1.1em] -translate-y-[0.1em] text-ember"
                        strokeWidth={2.25}
                      />
                      <span className="reply-shimmer">{text}</span>
                    </span>
                  ) : (
                    <span className="text-bone">{text}</span>
                  )}
                </li>
              ))}
            </ol>
            {/* Question on its own line; the three links together on the next line (owner revision) */}
            <p className="mt-5 text-base leading-relaxed text-silver">{s.next.details}</p>
            <p className="mt-1 whitespace-nowrap text-base leading-relaxed">
              {(
                [
                  ["/method", s.next.links.method],
                  ["/plans", s.next.links.plans],
                  ["/plans#faq", s.next.links.faq],
                ] as const
              ).map(([path, label], i) => (
                <span key={path}>
                  {i > 0 && (
                    <span aria-hidden className="text-bone/40">
                      {" "}
                      ·{" "}
                    </span>
                  )}
                  <Link
                    href={href(path)}
                    className="-my-2.5 inline-block py-2.5 font-semibold text-ember-soft underline decoration-ember/40 underline-offset-4 hover:text-bone"
                  >
                    {label}
                  </Link>
                </span>
              ))}
            </p>
          </Reveal>
        ) : (
          <Reveal load={standalone} delay={0.08}>
            <p className="mt-3 text-lg leading-relaxed text-silver">{s.body}</p>
            {/* Always one line: the size scales with the viewport (14.4px at 360 → 16px from 400px; never below 14px). */}
            <p className="mt-4 flex items-center gap-2 whitespace-nowrap text-[clamp(0.875rem,4vw,1rem)] font-medium">
              <Clock
                aria-hidden
                className="size-[1.15em] shrink-0 text-ember"
                strokeWidth={2.25}
              />
              <span className="reply-shimmer">{s.reply}</span>
            </p>
          </Reveal>
        )}
        <div className="mt-6">
          <LeadForm titleId={titleId} />
        </div>
      </div>
    </section>
  );
}
