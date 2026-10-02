"use client";

import { Clock } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";
import { START_ID } from "@/lib/site";
import { LeadForm } from "./LeadForm";

/**
 * The form section (§4.10) — anchor #start. Used on Home, /plans and /start (h1 there).
 * "Your First Step Is Free" + intro + avatar with the reply promise, then the lead form.
 */
export function StartTraining({ headingLevel = "h2", standalone = false }: { headingLevel?: "h1" | "h2"; standalone?: boolean }) {
  const { t } = useI18n();
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
        <Reveal>
          <Heading id={titleId} className="display text-[clamp(2.4rem,8vw,4rem)] leading-[0.95] text-bone text-balance">
            {s.title}
          </Heading>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-3 text-lg leading-relaxed text-silver">{s.body}</p>
          {/* Always one line: the size scales with the viewport (14.4px at 360 → 16px from 400px; never below 14px). */}
          <p className="mt-4 flex items-center gap-2 whitespace-nowrap text-[clamp(0.875rem,4vw,1rem)] font-medium">
            <Clock aria-hidden className="size-[1.15em] shrink-0 text-ember" strokeWidth={2.25} />
            <span className="reply-shimmer">{s.reply}</span>
          </p>
        </Reveal>
        <div className="mt-6">
          <LeadForm titleId={titleId} />
        </div>
      </div>
    </section>
  );
}
