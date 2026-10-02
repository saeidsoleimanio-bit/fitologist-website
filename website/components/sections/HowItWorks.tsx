"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";

/** Home summary of the method (§4.5): four compact rows, number inline with the title. */
export function HowItWorks() {
  const { t, href } = useI18n();
  const h = t.howItWorks;
  return (
    <section aria-labelledby="how-title" className="section-y relative bg-ink">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <Reveal>
          <h2 id="how-title" className="display text-[clamp(2.25rem,7vw,3.75rem)] text-bone">
            {h.title}
          </h2>
        </Reveal>
        <ol className="mt-6 grid gap-x-10 border-t hairline sm:grid-cols-2">
          {h.steps.map((s, i) => (
            <li key={s.title} className="flex gap-3 border-b hairline py-4 text-base leading-relaxed text-silver">
              <span className="pt-0.5 font-display text-sm font-semibold tracking-[0.12em] text-ember">0{i + 1}</span>
              <p>
                <strong className="font-semibold text-bone">{s.title}:</strong> {s.body}
              </p>
            </li>
          ))}
        </ol>
        <Link
          href={href("/method")}
          className="mt-5 inline-flex min-h-11 items-center font-semibold text-ember-soft underline decoration-ember/40 underline-offset-[6px] transition-colors hover:text-bone"
        >
          {h.link}
        </Link>
      </div>
    </section>
  );
}
