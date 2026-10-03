"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { readUtm } from "@/components/providers/ApplicationProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { track } from "@/lib/analytics";
import {
  CARD_SOURCE,
  COUNTRY_CODES,
  EMPTY_LEAD,
  SEXES,
  toLatinDigits,
  validateLead,
  type LeadErrors,
  type LeadField,
  type LeadInput,
} from "@/lib/lead";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";
import { BodyCheck, type BodyCheckOutcome } from "./BodyCheck";
import { ErrorText, INPUT, LABEL, isMobileDevice } from "./LeadForm";

type Answer = "a" | "b" | "c" | "d";
type Status = "idle" | "sending" | "success" | "fallback";

const SECTION_SCROLL = "scroll-mt-[calc(var(--header-compact)+1rem)]";

function scrollToEl(el: HTMLElement | null) {
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/**
 * Landing page for the printed "floor test" card (/c → /floor-test). Step 1: how did it go (result
 * shows on tap) · Step 2: optional Body Check (inline, same card and maths) · Step 3: short form to
 * send the results to Saeid and claim the card offer — same one-tap lead flow (/api/lead + WhatsApp).
 */
export function FloorTest({ offerActive, offerLabel, validLabel }: { offerActive: boolean; offerLabel: string; validLabel: string }) {
  const { t } = useI18n();
  const f = t.floorTest;
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [bmi, setBmi] = useState<BodyCheckOutcome | null>(null);
  const [step3, setStep3] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLElement>(null);
  const option = answer ? f.options.find((o) => o.key === answer) : undefined;

  const choose = (a: Answer) => {
    const first = answer === null;
    setAnswer(a);
    track("floor_test_answered", { answer: a });
    // Bring the result into view on the first answer (it appears right under the options).
    if (first) window.setTimeout(() => scrollToEl(resultRef.current), 60);
  };

  const goToStep3 = () => {
    setStep3(true);
    window.setTimeout(() => scrollToEl(step3Ref.current), 60);
  };

  return (
    <>
      {/* Step 1 — how did it go? (first screen) */}
      <section aria-labelledby="ft-title" className="relative bg-ink px-4 pb-8 pt-[calc(var(--header-compact)+1.25rem)] sm:px-8 lg:pb-12 lg:pt-[calc(var(--header-h)+2rem)] rtl:pr-6 rtl:sm:pr-10">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-ember">{f.eyebrow}</p>
          <h1 id="ft-title" className="display mt-2 text-[clamp(2.4rem,10vw,3.75rem)] leading-[0.95] text-bone">
            {f.title}
          </h1>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-silver">{f.intro}</p>

          <fieldset className="mt-5">
            <legend className="sr-only">{f.optionsLabel}</legend>
            <div className="grid gap-2.5">
              {f.options.map((o) => {
                const on = answer === o.key;
                return (
                  <label
                    key={o.key}
                    data-fab-avoid
                    className={`flex min-h-[3.75rem] cursor-pointer items-center gap-3 border px-4 py-3 text-[1.05rem] font-semibold leading-snug transition-[border-color,background-color] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember ${
                      on ? "border-ember bg-ember/[0.14] text-bone" : "border-bone/15 bg-carbon text-bone/90 hover:border-silver/45"
                    }`}
                  >
                    <input type="radio" name="floor-test" value={o.key} checked={on} onChange={() => choose(o.key as Answer)} className="sr-only" />
                    <span
                      aria-hidden
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-ember bg-ember" : "border-bone/35"}`}
                    >
                      {on && <Check className="size-4 text-ink" strokeWidth={3} />}
                    </span>
                    {o.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Result — shown as soon as an option is tapped (no submit) */}
          <div ref={resultRef} aria-live="polite" className={SECTION_SCROLL}>
            {option && (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative mt-5 border border-ember/60 bg-[linear-gradient(160deg,#1f2225_0%,#141618_100%)] p-5"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ember" />
                <p className="font-display text-[1.75rem] font-bold leading-tight text-ember-soft">{option.band}</p>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-bone">{option.body}</p>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-silver">{f.note}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Step 2 — optional Body Check */}
      {answer && (
        <section aria-labelledby="ft-bmi-title" className="section-y relative bg-ink px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10">
          <div className="mx-auto max-w-2xl">
            <BodyCheck
              embedded={{
                heading: (
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                    <h2 id="ft-bmi-title" className="display text-[clamp(1.9rem,7vw,2.75rem)] leading-[1.02] text-bone">
                      {f.bmiTitle}
                    </h2>
                    {!step3 && (
                      <button
                        type="button"
                        onClick={() => {
                          track("floor_test_bmi_skipped");
                          goToStep3();
                        }}
                        className="min-h-11 font-semibold text-ember-soft underline decoration-ember/40 underline-offset-4 hover:text-bone"
                      >
                        {f.skip}
                      </button>
                    )}
                  </div>
                ),
                continueLabel: f.continue,
                onResult: (r) => {
                  setBmi(r);
                  track("floor_test_bmi_done", { category: r.category });
                  setStep3(true);
                },
                onContinue: goToStep3,
              }}
            />
          </div>
        </section>
      )}

      {/* Step 3 — send the results and claim the offer */}
      {answer && step3 && option && (
        <section ref={step3Ref} aria-labelledby="ft-claim-title" className={`section-y relative bg-ink px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10 ${SECTION_SCROLL}`}>
          <div className="mx-auto max-w-2xl">
            {offerActive && <p className="inline-block bg-ember px-2.5 py-1 text-[0.85rem] font-bold text-ink">{offerLabel}</p>}
            <h2 id="ft-claim-title" className={`display text-[clamp(1.9rem,7vw,2.75rem)] leading-[1.02] text-bone ${offerActive ? "mt-3" : ""}`}>
              {offerActive ? f.claimTitle : f.consultTitle}
            </h2>
            {offerActive && <p className="mt-2 text-[0.9rem] text-silver">{f.validity.replace("{date}", validLabel)}</p>}
            <div className="mt-5">
              <FloorTestForm answer={answer} band={option.band} bmi={bmi} offerActive={offerActive} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** Short card form: Name · WhatsApp · Age + Sex · consent → one tap: /api/lead + WhatsApp. */
function FloorTestForm({ answer, band, bmi, offerActive }: { answer: Answer; band: string; bmi: BodyCheckOutcome | null; offerActive: boolean }) {
  const { t, locale, href } = useI18n();
  const l = t.lead;
  const f = t.floorTest;
  const [data, setData] = useState<LeadInput>(EMPTY_LEAD);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState("");
  const statusRef = useRef<HTMLHeadingElement>(null);

  // Prefill age + sex from the Body Check (only fields the visitor hasn't typed yet).
  useEffect(() => {
    if (!bmi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- merge Body Check values once they arrive
    setData((d) => ({ ...d, age: d.age || bmi.age, sex: d.sex || bmi.sex }));
  }, [bmi]);

  useEffect(() => {
    if (status === "success" || status === "fallback") statusRef.current?.focus();
  }, [status]);

  const validate = (d: LeadInput) => {
    const e = validateLead(d, l.errors, { requireGoalsAndType: false });
    return e;
  };
  const update = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (submitted) setErrors(validate(next));
  };
  const err = submitted ? errors : {};
  const describe = (k: LeadField) => (err[k] ? `ft-${k}-error` : undefined);
  const border = (k: LeadField) => (err[k] ? "border-ember/70" : "border-silver/20");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const lead: LeadInput = { ...data, goals: bmi?.goals ?? [] };
    const errs = validate(lead);
    setErrors(errs);
    const order: LeadField[] = ["name", "phone", "age", "consent"];
    const first = order.find((k) => errs[k]);
    if (first) {
      document.getElementById(`ft-${first}`)?.focus();
      return;
    }

    const bmiLine = bmi ? f.whatsapp.bmi.replace("{bmi}", bmi.bmi).replace("{category}", t.bodyCheck.categories[bmi.category]) : "";
    const message = [f.whatsapp.intro, f.whatsapp.result.replace("{band}", band), bmiLine, offerActive ? f.whatsapp.offer : f.whatsapp.consult]
      .filter(Boolean)
      .join(" ");
    const url = whatsappLink(message);
    setWaUrl(url);

    // 1. Lead POST (keepalive, not awaited) — same pipeline as the main form.
    const request = fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        language: locale,
        source: CARD_SOURCE,
        floorTest: answer,
        bmi: bmi?.bmi ?? "",
        bmiCategory: bmi?.category ?? "",
        ...readUtm(),
      }),
    })
      .then(async (res) => res.ok && ((await res.json()) as { ok?: boolean }).ok === true)
      .catch(() => false);

    // Tracked before WhatsApp opens (on phones the page can be replaced).
    track("form_submit", { source: CARD_SOURCE, floor_test: answer, bmi_done: Boolean(bmi) });
    setStatus("sending");

    // 2. WhatsApp in the same click handler (iOS blocks it after an await).
    if (isMobileDevice()) window.location.href = url;
    else window.open(url, "_blank", "noopener");

    void request.then((ok) => {
      track("lead_delivery", { api_ok: ok });
      setStatus(ok ? "success" : "fallback");
    });
  };

  const optional = <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">{l.optional}</span>;

  return (
    <div
      className="relative border border-silver/25 p-4 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95),inset_0_1px_0_rgb(255_255_255/0.1)] sm:p-6"
      style={{
        backgroundImage: [
          "radial-gradient(80% 60% at 100% 0%, rgb(191 192 194 / 0.12) 0%, transparent 70%)",
          "repeating-linear-gradient(100deg, rgb(255 255 255 / 0.014) 0 1px, transparent 1px 4px)",
          "linear-gradient(160deg, #1f2225 0%, #17191b 55%, #121415 100%)",
        ].join(", "),
      }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ember/70" />
      <AnimatePresence mode="wait" initial={false}>
        {status === "idle" || status === "sending" ? (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="ft-claim-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="ft-name" className={LABEL}>
                {l.name}
              </label>
              <input
                id="ft-name"
                name="name"
                autoComplete="name"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={err.name ? true : undefined}
                aria-describedby={describe("name")}
                aria-required
                maxLength={80}
                className={`${INPUT} ${border("name")}`}
              />
              <ErrorText id="ft-name-error">{err.name}</ErrorText>
            </div>

            <div>
              <label htmlFor="ft-phone" className={LABEL}>
                {l.phone}
              </label>
              <div className="flex min-w-0 gap-1.5" dir="ltr">
                {/* Closed: dial code only. Open: the native list with country names. */}
                <div
                  className={`relative mt-1.5 flex h-12 w-[6.5rem] shrink-0 items-center justify-between gap-1 border bg-[#0b0d0e]/80 px-3 text-base text-bone transition-[border-color,box-shadow] duration-300 hover:border-silver/35 focus-within:border-ember focus-within:shadow-[0_0_0_3px_rgb(255_106_0/0.18)] ${border("phone")}`}
                >
                  <span aria-hidden className="tabular-nums">
                    +{data.countryCode}
                  </span>
                  <ChevronDown aria-hidden className="size-4 shrink-0 text-silver" />
                  <select
                    id="ft-country"
                    name="countryCode"
                    aria-label={l.countryCode}
                    value={data.countryCode}
                    onChange={(e) => update("countryCode", e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label} (+{c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  id="ft-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={data.phone}
                  onChange={(e) => update("phone", toLatinDigits(e.target.value))}
                  aria-invalid={err.phone ? true : undefined}
                  aria-describedby={describe("phone")}
                  aria-required
                  maxLength={20}
                  className={`${INPUT} min-w-0 flex-1 basis-0 ${border("phone")}`}
                />
              </div>
              <ErrorText id="ft-phone-error">{err.phone}</ErrorText>
            </div>

            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
              <div>
                <label htmlFor="ft-age" className={LABEL}>
                  {l.age}
                </label>
                <input
                  id="ft-age"
                  name="age"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={data.age}
                  onChange={(e) => update("age", toLatinDigits(e.target.value).replace(/[^\d]/g, "").slice(0, 2))}
                  aria-invalid={err.age ? true : undefined}
                  aria-describedby={describe("age")}
                  aria-required
                  className={`${INPUT} ${border("age")}`}
                />
                <ErrorText id="ft-age-error">{err.age}</ErrorText>
              </div>
              <fieldset className="min-w-0">
                <legend className={LABEL}>
                  {l.sex} {optional}
                </legend>
                <div className="mt-1.5 grid h-12 grid-cols-2 border border-silver/20 bg-[#0b0d0e]/80 p-1">
                  {SEXES.map((v) => {
                    const on = data.sex === v;
                    return (
                      <label
                        key={v}
                        className={`flex cursor-pointer items-center justify-center text-[0.92rem] font-semibold transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
                          on ? "bg-ember text-ink" : "text-bone/80 hover:text-bone"
                        }`}
                      >
                        <input
                          type="radio"
                          name="ft-sex"
                          value={v}
                          checked={on}
                          onChange={() => update("sex", v)}
                          onClick={() => on && update("sex", "")}
                          className="sr-only"
                        />
                        {l.sexOptions[v]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-snug text-bone">
                <input
                  id="ft-consent"
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={err.consent ? true : undefined}
                  aria-describedby={describe("consent")}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#ff6a00]"
                />
                <span>
                  {l.consentBefore}{" "}
                  <Link href={href("/privacy")} className="text-ember-soft underline underline-offset-4">
                    {l.privacy}
                  </Link>
                </span>
              </label>
              <ErrorText id="ft-consent-error">{err.consent}</ErrorText>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                data-fab-avoid
                disabled={status === "sending"}
                icon={status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <WhatsAppGlyph className="size-5" color="#050505" handset="#FF6A00" />}
              >
                {status === "sending" ? l.sending : l.submit}
              </Button>
              <p className="mt-2 text-sm text-silver">{l.helper}</p>
            </div>
          </motion.form>
        ) : (
          <motion.div key={status} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="py-2 sm:py-4" role="status">
            <h3 ref={statusRef} tabIndex={-1} className="display text-[clamp(2rem,7vw,3rem)] text-bone outline-none">
              {status === "success" ? l.success.title : l.fallback.title}
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-bone/90">
              {status === "success" ? (
                offerActive ? f.success.offer : f.success.consult
              ) : (
                <>
                  {l.fallback.bodyBefore} <strong>{l.success.send}</strong> {l.fallback.bodyAfter}
                </>
              )}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={<WhatsAppGlyph className="size-5" color="#050505" handset="#FF6A00" />}
                className="w-full sm:w-auto"
              >
                {status === "success" ? l.success.again : l.fallback.open}
              </ButtonLink>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="min-h-11 text-[0.95rem] font-semibold text-silver underline decoration-bone/30 underline-offset-4 transition-colors duration-300 hover:text-ember-soft"
              >
                {status === "success" ? l.success.edit : l.fallback.edit}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
