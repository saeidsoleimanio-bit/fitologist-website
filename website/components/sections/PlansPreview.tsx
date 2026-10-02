"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";

/** Home preview of the plans (§4.6) — names and frequency only, no prices. */
export function PlansPreview() {
  const { t, href } = useI18n();
  const p = t.plansPreview;
  return (
    <section aria-labelledby="plans-preview-title" className="section-y surface-deep relative">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <Reveal>
          <h2 id="plans-preview-title" className="display text-[clamp(2.25rem,7vw,3.75rem)] text-bone">
            {p.title}
          </h2>
        </Reveal>
        <ul className="mt-6 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
          {p.items.map((it) => (
            <li
              key={it.name}
              className={`relative flex flex-col justify-center border p-4 ${it.recommended ? "border-ember bg-ember/[0.08]" : "hairline bg-carbon"}`}
            >
              {it.recommended && (
                <span className="mb-1.5 self-start bg-ember px-2 py-0.5 text-[0.75rem] font-bold text-ink">{p.recommended}</span>
              )}
              <span className="display text-[1.6rem] text-bone" dir="ltr">
                {it.name}
              </span>
              <span className="mt-0.5 text-base text-silver">{it.freq}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-silver">{p.line}</p>
        <Link
          href={href("/plans")}
          className="mt-3 inline-flex min-h-11 items-center font-semibold text-ember-soft underline decoration-ember/40 underline-offset-[6px] transition-colors hover:text-bone"
        >
          {p.link}
        </Link>
        <p className="mt-2 text-base leading-relaxed text-silver">
          {p.faqLine}{" "}
          <Link href={href("/plans#faq")} className="font-semibold text-ember-soft underline decoration-ember/40 underline-offset-4 transition-colors hover:text-bone">
            {p.faqLink}
          </Link>
        </p>
      </div>
    </section>
  );
}
