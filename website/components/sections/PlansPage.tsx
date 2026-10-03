"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { Button } from "@/components/ui/Button";
import { PlanTypeArt } from "@/components/ui/PlanArt";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";
import type { Frequency, TrainingType } from "@/lib/lead";
import { Faq } from "./Faq";
import { PhotoHero } from "./PhotoHero";
import { StartTraining } from "./StartTraining";

const INSET = "rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]";

/** The four ways to train on this page (the form's "Not sure yet" is not a card). */
type PlanType = Exclude<TrainingType, "unsure">;
type PlanFreq = Exclude<Frequency, "unsure">;
const PLAN_TYPES: readonly PlanType[] = ["1to1", "partner", "online", "hybrid"];
const PLAN_FREQS: readonly PlanFreq[] = ["1", "2", "3", "4"];
/** Hybrid combines up to 2 in-person sessions a week with online training. */
const HYBRID_FREQS: readonly PlanFreq[] = ["1", "2"];

function PlansHero() {
  const { t } = useI18n();
  const p = t.plans;
  return (
    <PhotoHero
      id="plans-title"
      src="/images/training-plan.webp"
      alt={p.heroAlt}
      ratio={1672 / 941}
      // Mobile: Saeid centred under the header band (copy below the photo — the dark wall is too
      // narrow to carry it at 360–430px). Desktop: whole frame, copy over the dark wall on the right.
      focus={{ mobile: "40%", desktop: "50%" }}
      side="right"
      belowHeader
      alignTopDesktop
      tallDesktop
    >
      <Reveal load className="eyebrow flex items-center gap-4">
        <AccentLine className="w-10" />
        <span className="text-ember">{p.eyebrow}</span>
      </Reveal>
      <Reveal load delay={0.06}>
        <h1 id="plans-title" className="display mt-3 text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.92] text-bone">
          {p.title}
        </h1>
      </Reveal>
      <Reveal load delay={0.12}>
        <p className="mt-4 text-lg leading-relaxed text-silver">{p.intro}</p>
      </Reveal>
    </PhotoHero>
  );
}

/** Step heading: small "Step n" label + title. */
function StepHeading({ id, step, title }: { id: string; step: string; title: string }) {
  return (
    <div>
      <p className="eyebrow text-ember">{step}</p>
      <h2 id={id} className="display mt-2 text-[clamp(2rem,6.5vw,3.25rem)] text-bone">
        {title}
      </h2>
    </div>
  );
}

/** Selected state shared by both steps: orange border + soft orange fill. */
const cardState = (on: boolean, disabled = false) =>
  disabled
    ? "cursor-not-allowed border-bone/10 bg-carbon/40 opacity-45"
    : on
      ? "cursor-pointer border-ember bg-ember/[0.12] shadow-[0_0_0_1px_rgb(255_106_0/0.55)]"
      : "cursor-pointer border-bone/15 bg-carbon hover:border-silver/45";

const FOCUS = "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember";

/**
 * Training Plans (§7, owner restructure): the order a client decides in — how to train, how often —
 * then a live summary with the page's only CTA (prefills the form below), what every plan includes,
 * the free consultation, FAQ and the form.
 */
export function PlansPage() {
  const { t } = useI18n();
  const p = t.plans;
  const { startApplication } = useApplication();
  const [type, setType] = useState<PlanType | "">("");
  const [freq, setFreq] = useState<PlanFreq | "">("");

  // Deep links: /plans?type=…&freq=… preselect the cards (the form reads the same params).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const qt = q.get("type") as PlanType;
    const qf = q.get("freq") as PlanFreq;
    const typeOk = PLAN_TYPES.includes(qt);
    const freqOk = PLAN_FREQS.includes(qf) && qt !== "online" && !(qt === "hybrid" && !HYBRID_FREQS.includes(qf));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL params, read once
    if (typeOk) setType(qt);
    if (freqOk) setFreq(qf);
  }, []);

  const chooseType = (v: PlanType) => {
    setType(v);
    if (v === "online") setFreq("");
    if (v === "hybrid" && freq && !HYBRID_FREQS.includes(freq)) setFreq("");
  };

  const typeName = type ? (p.types.find((x) => x.key === type)?.name ?? "") : "";
  const plan = freq ? p.items.find((x) => x.key === freq) : undefined;
  const summary =
    type === "online"
      ? `${typeName} · ${p.monthly}`
      : [typeName, plan ? `${plan.name} (${plan.freq})` : ""].filter(Boolean).join(" · ");

  const book = () => {
    track("plan_selected", { type: type || "none", plan: plan?.name ?? (type === "online" ? "monthly" : "none") });
    startApplication({ ...(type ? { type } : {}), ...(freq ? { frequency: freq } : {}) });
  };

  return (
    <>
      <PlansHero />

      {/* Step 1 — how to train */}
      <section aria-labelledby="step-type-title" className="section-y relative bg-ink">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <StepHeading id="step-type-title" step={p.step1} title={p.typeTitle} />
          <fieldset className="mt-6">
            <legend className="sr-only">{p.typeTitle}</legend>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {p.types.map((c) => {
                const key = c.key as PlanType;
                const on = type === key;
                return (
                  <label
                    key={key}
                    className={`relative isolate flex flex-col overflow-hidden border p-4 transition-[border-color,background-color,box-shadow] duration-300 sm:p-5 ${FOCUS} ${cardState(on)}`}
                  >
                    <input type="radio" name="plan-type" value={key} checked={on} onChange={() => chooseType(key)} className="sr-only" />
                    {/* Background line-art (bottom, end side, cropped by the card edge) */}
                    <PlanTypeArt type={key} selected={on} />
                    {/* Title on the top row with the radio circle; long titles wrap but never run under it */}
                    <span className="relative z-10 flex items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 font-display text-[1.8rem] font-bold leading-[1.08] text-bone">{c.name}</span>
                      <span
                        aria-hidden
                        className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-ember bg-ember" : "border-bone/30"}`}
                      >
                        {on && <Check className="size-4 text-ink" strokeWidth={3} />}
                      </span>
                    </span>
                    {/* Selected: brighter art, so the body text switches to bone to keep WCAG AA over it */}
                    <span className={`relative z-10 mt-2 text-base leading-relaxed transition-colors duration-300 ${on ? "text-bone" : "text-silver"}`}>{c.line}</span>
                    <span className="relative z-10 mt-2 text-[0.95rem] leading-snug text-bone">
                      <span className="font-semibold text-ember-soft">{p.bestForLabel}</span> {c.bestFor}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Step 2 — how often (hidden for Online; Hybrid limits it to 1–2× a week) + summary & CTA */}
      <section aria-labelledby="step-freq-title" className="section-y surface-deep relative">
        <div className={`mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <StepHeading id="step-freq-title" step={p.step2} title={p.freqTitle} />
          {type === "online" ? (
            <p role="status" className="mt-5 max-w-2xl border-s-2 border-ember ps-4 text-lg leading-relaxed text-bone">
              {p.onlineNote}
            </p>
          ) : (
            <fieldset className="mt-4">
              <legend className="text-base text-silver">{p.freqNote}</legend>
              <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
                {p.items.map((it) => {
                  const key = it.key as PlanFreq;
                  const disabled = type === "hybrid" && !HYBRID_FREQS.includes(key);
                  const on = freq === key;
                  return (
                    <label
                      key={key}
                      className={`relative flex flex-col border p-3.5 transition-[border-color,background-color,box-shadow,opacity] duration-300 sm:p-4 ${FOCUS} ${cardState(on, disabled)}`}
                    >
                      <input type="radio" name="plan-freq" value={key} checked={on} disabled={disabled} onChange={() => setFreq(key)} className="sr-only" />
                      {key === "2" && <span className="mb-1.5 self-start bg-ember px-2 py-0.5 text-[0.72rem] font-bold text-ink">{p.recommended}</span>}
                      <span className="display text-[1.55rem] leading-none text-bone" dir="ltr">
                        {it.name}
                      </span>
                      <span className="mt-1.5 text-[0.95rem] font-semibold text-bone">{it.freq}</span>
                      <span className="text-[0.88rem] text-silver">
                        {it.sessions} {p.perMonth}
                      </span>
                      <span className="mt-1.5 text-[0.88rem] leading-snug text-silver">{it.bestFor}</span>
                    </label>
                  );
                })}
              </div>
              {type === "hybrid" && (
                <p role="status" className="mt-3 text-[0.95rem] text-silver">
                  {p.hybridNote}
                </p>
              )}
            </fieldset>
          )}

          {/* Summary + the only CTA on this page */}
          <div className="mt-8 border-t hairline pt-6">
            <p aria-live="polite" className="text-lg leading-snug">
              {summary ? (
                <>
                  <span className="text-silver">{p.summaryLabel}</span> <strong className="font-semibold text-bone">{summary}</strong>
                </>
              ) : (
                <span className="text-bone">{p.summaryNone}</span>
              )}
            </p>
            <Button type="button" onClick={book} data-cta="plans_summary" className="mt-4 w-full sm:w-auto">
              {t.nav.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Every plan includes */}
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

      {/*
        Desktop: "Your first step is free" (left) and the FAQ (right) side by side, top-aligned, on one
        background. Below lg the wrapper is `display: contents`, so both stay separate sections as before.
      */}
      <div className="contents lg:mx-auto lg:grid lg:max-w-[88rem] lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-12 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
      {/* Your first step is free — no button: the form follows */}
      <section aria-labelledby="firststep-title" className="section-y surface-deep relative lg:[background:none]">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:mx-0 lg:px-0 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-0">
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

      <Faq inColumn />
      </div>
      <StartTraining wide />
    </>
  );
}
