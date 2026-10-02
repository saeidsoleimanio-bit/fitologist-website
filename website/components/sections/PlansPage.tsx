"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication, type Prefill } from "@/components/providers/ApplicationProvider";
import { ButtonLink } from "@/components/ui/Button";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import type { Frequency, TrainingType } from "@/lib/lead";
import { PLANS_START_PATH } from "@/lib/site";
import { Faq } from "./Faq";
import { StartTraining } from "./StartTraining";

const INSET = "rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]";

/**
 * A plan CTA: a real link to /plans?type=…&freq=…#start (works from anywhere, and the form reads the
 * query), and on this page it pre-selects the form in place and scrolls to it.
 */
function PlanCta({ type, freq, label, className = "" }: { type: TrainingType; freq?: Frequency; label: string; className?: string }) {
  const { href } = useI18n();
  const { startApplication } = useApplication();
  const query = `?type=${type}${freq ? `&freq=${freq}` : ""}`;
  const preset: Prefill = { type, ...(freq ? { frequency: freq } : {}) };
  return (
    <Link
      href={href(`/plans${query}#start`)}
      onClick={(e) => {
        e.preventDefault();
        startApplication(preset);
      }}
      aria-label={label}
      className={`inline-flex min-h-11 items-center justify-center border border-ember/70 px-4 text-[0.95rem] font-semibold text-ember transition-colors duration-300 hover:bg-ember hover:text-ink ${className}`}
    >
      {label}
    </Link>
  );
}

export function PlansPage() {
  const { t, href } = useI18n();
  const p = t.plans;
  const cta = t.nav.cta;

  return (
    <>
      {/* Intro — no photo, solid header */}
      <section aria-labelledby="plans-title" className="relative bg-ink pb-4 pt-[calc(var(--header-compact)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span className="text-ember">{p.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 id="plans-title" className="display mt-4 text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.92] text-bone">
              {p.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver">{p.intro}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-6">
            <ButtonLink href={href(PLANS_START_PATH)} className="w-full sm:w-auto">
              {cta}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 7.1 Where we train */}
      <section aria-labelledby="where-title" className="relative bg-ink py-8">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <h2 id="where-title" className="font-display text-[1.6rem] font-bold uppercase tracking-[0.04em] text-bone">
            {p.whereTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-silver">{p.where}</p>
        </div>
      </section>

      {/* 7.2 In-person plans: table on desktop, stacked cards on mobile */}
      <section aria-labelledby="inperson-title" className="section-y surface-deep relative">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <h2 id="inperson-title" className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">
            {p.inPersonTitle}
          </h2>
          <p className="mt-2 text-base text-silver">{p.inPersonNote}</p>

          <table className="mt-6 hidden w-full border-collapse text-start lg:table">
            <thead>
              <tr className="border-b hairline text-start">
                {[p.columns.plan, p.columns.freq, p.columns.sessions, p.columns.bestFor, ""].map((c, i) => (
                  <th key={i} scope="col" className="py-3 pe-4 text-start font-display text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-silver">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.items.map((it) => {
                const rec = it.key === "2";
                return (
                  <tr key={it.key} className={`border-b hairline ${rec ? "bg-ember/[0.07]" : ""}`}>
                    <th scope="row" className="py-4 pe-4 text-start">
                      <span className="display text-[1.6rem] text-bone" dir="ltr">
                        {it.name}
                      </span>
                      {rec && <span className="ms-3 bg-ember px-2 py-0.5 align-middle text-[0.75rem] font-bold text-ink">{p.recommended}</span>}
                    </th>
                    <td className="py-4 pe-4 text-base text-bone">{it.freq}</td>
                    <td className="py-4 pe-4 text-base text-bone">{it.sessions}</td>
                    <td className="py-4 pe-4 text-base text-silver">{it.bestFor}</td>
                    <td className="py-4 text-end">
                      <PlanCta type="1to1" freq={it.key as Frequency} label={cta} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:hidden">
            {p.items.map((it) => {
              const rec = it.key === "2";
              return (
                <li key={it.key} className={`flex flex-col border p-4 ${rec ? "border-ember bg-ember/[0.07]" : "hairline bg-carbon"}`}>
                  {rec && <span className="mb-2 self-start bg-ember px-2 py-0.5 text-[0.75rem] font-bold text-ink">{p.recommended}</span>}
                  <span className="display text-[1.8rem] text-bone" dir="ltr">
                    {it.name}
                  </span>
                  <p className="mt-1 text-base text-bone">
                    {it.freq} · {it.sessions} {p.perMonth}
                  </p>
                  <p className="mt-1 text-base text-silver">{it.bestFor}</p>
                  <PlanCta type="1to1" freq={it.key as Frequency} label={cta} className="mt-4 w-full" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 7.3 Every plan includes */}
      <section aria-labelledby="includes-title" className="section-y relative bg-ink">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <h2 id="includes-title" className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">
            {p.includesTitle}
          </h2>
          <ul className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {p.includes.map((x) => (
              <li key={x.title} className="flex gap-3 text-base leading-relaxed text-silver">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-ember" strokeWidth={2.25} />
                <p>
                  <strong className="font-semibold text-bone">{x.title}:</strong> {x.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7.4–7.6 Partner, Online, Hybrid */}
      <section aria-label={`${p.partner.title}, ${p.online.title}, ${p.hybrid.title}`} className="section-y surface-deep relative">
        <ul className={`mx-auto grid max-w-[88rem] gap-3 px-4 sm:px-8 lg:grid-cols-3 lg:gap-5 lg:px-12 ${INSET}`}>
          {[
            { key: "partner" as const, title: p.partner.title, lead: p.partner.lead, body: p.partner.body },
            { key: "online" as const, title: p.online.title, lead: "", body: p.online.body },
            { key: "hybrid" as const, title: p.hybrid.title, lead: "", body: p.hybrid.body },
          ].map((o) => (
            <li key={o.key} className="flex flex-col border hairline bg-carbon p-5">
              <h2 className="display text-[1.9rem] text-bone">{o.title}</h2>
              {o.lead && <p className="mt-2 font-semibold text-bone">{o.lead}</p>}
              <p className="mt-2 text-base leading-relaxed text-silver">{o.body}</p>
              <div className="mt-auto pt-5">
                <PlanCta type={o.key} label={cta} className="w-full" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 7.7 Your first step is free */}
      <section aria-labelledby="firststep-title" className="section-y relative bg-ink">
        <div className={`mx-auto max-w-3xl px-4 sm:px-8 ${INSET}`}>
          <h2 id="firststep-title" className="display text-[clamp(2rem,6vw,3.25rem)] text-bone">
            {p.firstStep.title}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
            <strong className="font-semibold text-bone">{p.firstStep.consultation}</strong>
            <span className="bg-ember px-2 py-0.5 text-[0.85rem] font-bold text-ink">{p.firstStep.free}</span>
            <span className="text-silver">{p.firstStep.mode}</span>
          </p>
          <p className="mt-4 text-base leading-relaxed text-silver">{p.firstStep.intro}</p>
          <ul className="mt-3 space-y-2">
            {p.firstStep.points.map((x) => (
              <li key={x} className="flex gap-3 text-base text-bone">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-ember" />
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-5 font-semibold text-bone">{p.firstStep.outro}</p>
        </div>
      </section>

      <Faq />
      <StartTraining />
    </>
  );
}
