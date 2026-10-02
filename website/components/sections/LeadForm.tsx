"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { readPrefill, readUtm, useApplication } from "@/components/providers/ApplicationProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import {
  COUNTRY_CODES,
  EMPTY_LEAD,
  FIELD_ORDER,
  FREQUENCIES,
  GOALS,
  LIMITS,
  SEXES,
  TIMES,
  TRAINING_TYPES,
  isInPerson,
  leadMessage,
  toggleGoal,
  validateLead,
  type Frequency,
  type LeadErrors,
  type LeadField,
  type LeadInput,
  type LeadLabels,
  type Time,
  type TrainingType,
} from "@/lib/lead";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "fallback";

const LABEL = "block font-display text-[0.85rem] font-bold uppercase tracking-[0.12em] text-bone/90";
const INPUT =
  "mt-1.5 block h-12 w-full border bg-[#0b0d0e]/80 px-3.5 text-base text-bone shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] placeholder:text-bone/45 transition-[border-color,box-shadow] duration-300 hover:border-silver/35 focus:border-ember focus:shadow-[0_0_0_3px_rgb(255_106_0/0.18)] focus:outline-none";

function ErrorText({ id, children }: { id: string; children?: string }) {
  return (
    <p id={id} aria-live="polite" className="min-h-0 pt-1.5 text-sm text-ember-soft empty:hidden">
      {children}
    </p>
  );
}

/** Pill chips (single or multiple choice) that wrap; state shown by fill and border. */
function Chips<T extends string>({
  id,
  legend,
  optional,
  options,
  selected,
  onToggle,
  multiple,
  error,
}: {
  id: string;
  legend: string;
  optional?: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onToggle: (v: T) => void;
  multiple: boolean;
  error?: string;
}) {
  const errId = `${id}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined} aria-invalid={error ? true : undefined}>
      <legend className={LABEL}>
        {legend} {optional && <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">{optional}</span>}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o, i) => {
          const on = selected.includes(o.value);
          return (
            <label
              key={o.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[0.92rem] font-medium leading-tight transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember ${
                on
                  ? "border-ember bg-ember/20 text-bone"
                  : error
                    ? "border-ember/50 bg-[#0b0d0e]/60 text-bone/85"
                    : "border-silver/25 bg-[#0b0d0e]/60 text-bone/85 hover:border-silver/45 hover:text-bone"
              }`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={id}
                id={i === 0 ? id : undefined}
                value={o.value}
                checked={on}
                onChange={() => onToggle(o.value)}
                className="sr-only"
              />
              {on && multiple && <Check aria-hidden className="-ms-1 me-1.5 size-4 text-ember" strokeWidth={2.75} />}
              {o.label}
            </label>
          );
        })}
      </div>
      <ErrorText id={errId}>{error}</ErrorText>
    </fieldset>
  );
}

const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches);

/**
 * Lead form (§6) — used on the home page, /plans and /start.
 * One tap, two deliveries: the lead is POSTed to /api/lead (keepalive, not awaited) and WhatsApp
 * opens with the message ready, all inside the same click handler (iOS blocks it after an await).
 */
export function LeadForm({ titleId }: { titleId: string }) {
  const { t, locale, href } = useI18n();
  const l = t.lead;
  const { prefill, version } = useApplication();
  const [data, setData] = useState<LeadInput>(EMPTY_LEAD);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState("");
  const statusRef = useRef<HTMLHeadingElement>(null);

  const labels: LeadLabels = {
    goals: t.goals,
    sexes: l.sexOptions,
    types: l.types,
    frequencies: l.frequencies,
    times: l.timesOptions,
    message: l.message,
  };
  const errorMessages = l.errors;

  // Prefill: Body Check (age, goals, bmi) and plan cards (?type=…&freq=…).
  useEffect(() => {
    const stored = readPrefill();
    const q = new URLSearchParams(window.location.search);
    const qType = q.get("type");
    const qFreq = q.get("freq");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- merge client-only prefill once
    setData((d) => ({
      ...d,
      age: stored.age ?? d.age,
      sex: stored.sex ?? d.sex,
      goals: stored.goals?.length ? stored.goals : d.goals,
      type: TRAINING_TYPES.includes(qType as TrainingType) ? (qType as TrainingType) : (stored.type ?? d.type),
      frequency: FREQUENCIES.includes(qFreq as Frequency) ? (qFreq as Frequency) : (stored.frequency ?? d.frequency),
    }));
  }, []);

  // A preset arriving while the form is already on screen (e.g. a plan card on the same page).
  useEffect(() => {
    if (version === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- merge preset from context
    setData((d) => ({
      ...d,
      age: prefill.age ?? d.age,
      sex: prefill.sex ?? d.sex,
      goals: prefill.goals?.length ? prefill.goals : d.goals,
      type: prefill.type ?? d.type,
      frequency: prefill.frequency ?? d.frequency,
    }));
  }, [version, prefill]);

  useEffect(() => {
    if (status === "success" || status === "fallback") statusRef.current?.focus();
  }, [status]);

  const errors: LeadErrors = submitted ? { ...fieldErrors } : {};

  const update = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    // Re-validate live once the visitor has tried to submit.
    if (submitted) setFieldErrors(validateLead(next, errorMessages));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateLead(data, errorMessages);
    setFieldErrors(errs);
    const firstInvalid = FIELD_ORDER.find((k) => errs[k]);
    if (firstInvalid) {
      document.getElementById(`lead-${firstInvalid}`)?.focus();
      return;
    }

    const url = whatsappLink(leadMessage(data, labels));
    setWaUrl(url);

    // 1. Fire the lead POST — not awaited before opening WhatsApp.
    const request = fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        language: locale,
        source: window.location.pathname,
        bmi: readPrefill().bmi ?? "",
        ...readUtm(),
      }),
    })
      .then(async (res) => res.ok && ((await res.json()) as { ok?: boolean }).ok === true)
      .catch(() => false);

    // 2. Sending state.
    setStatus("sending");

    // 3. Open WhatsApp in the same click handler.
    if (isMobileDevice()) window.location.href = url;
    else window.open(url, "_blank", "noopener");

    // 4. Success only if the API confirmed delivery; otherwise the fallback.
    void request.then((ok) => setStatus(ok ? "success" : "fallback"));
  };

  const describe = (key: LeadField) => (errors[key] ? `lead-${key}-error` : undefined);
  const border = (key: LeadField) => (errors[key] ? "border-ember/70" : "border-silver/20");
  const inPerson = isInPerson(data.type);

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
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-4"
          >
            {/* Name | WhatsApp, then Age + Sex */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-3">
              <div>
                <label htmlFor="lead-name" className={LABEL}>
                  {l.name}
                </label>
                <input
                  id="lead-name"
                  name="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describe("name")}
                  aria-required
                  maxLength={80}
                  className={`${INPUT} ${border("name")}`}
                />
                <ErrorText id="lead-name-error">{errors.name}</ErrorText>
              </div>
              <div>
                <label htmlFor="lead-phone" className={LABEL}>
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
                      id="lead-country"
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
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={describe("phone")}
                    aria-required
                    maxLength={20}
                    className={`${INPUT} min-w-0 flex-1 basis-0 ${border("phone")}`}
                  />
                </div>
                <ErrorText id="lead-phone-error">{errors.phone}</ErrorText>
              </div>
            </div>

            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 lg:max-w-md">
              <div>
                <label htmlFor="lead-age" className={LABEL}>
                  {l.age}
                </label>
                <input
                  id="lead-age"
                  name="age"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={data.age}
                  onChange={(e) => update("age", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                  aria-invalid={errors.age ? true : undefined}
                  aria-describedby={describe("age")}
                  aria-required
                  className={`${INPUT} ${border("age")}`}
                />
                <ErrorText id="lead-age-error">{errors.age}</ErrorText>
              </div>
              <fieldset className="min-w-0">
                <legend className={LABEL}>
                  {l.sex} <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">{l.optional}</span>
                </legend>
                {/* Segmented control; tapping the selected option clears it (optional field). */}
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
                          name="lead-sex"
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

            <Chips
              id="lead-goals"
              legend={l.goals}
              options={GOALS.map((g) => ({ value: g, label: t.goals[g] }))}
              selected={data.goals}
              onToggle={(g) => update("goals", toggleGoal(data.goals, g))}
              multiple
              error={errors.goals}
            />

            <Chips
              id="lead-type"
              legend={l.type}
              options={TRAINING_TYPES.map((v) => ({ value: v, label: l.types[v] }))}
              selected={data.type ? [data.type] : []}
              onToggle={(v) => update("type", v)}
              multiple={false}
              error={errors.type}
            />

            {inPerson && (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-3">
                <Chips
                  id="lead-frequency"
                  legend={l.frequency}
                  optional={l.optional}
                  options={FREQUENCIES.map((v) => ({ value: v, label: l.frequencies[v] }))}
                  selected={data.frequency ? [data.frequency] : []}
                  onToggle={(v) => update("frequency", v)}
                  multiple={false}
                />
                <div>
                  <label htmlFor="lead-area" className={LABEL}>
                    {l.area} <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">{l.optional}</span>
                  </label>
                  <input
                    id="lead-area"
                    name="area"
                    autoComplete="address-level2"
                    value={data.area}
                    onChange={(e) => update("area", e.target.value)}
                    maxLength={LIMITS.area}
                    placeholder={l.areaPlaceholder}
                    className={`${INPUT} border-silver/20`}
                  />
                </div>
              </div>
            )}

            <Chips
              id="lead-times"
              legend={l.times}
              optional={l.optional}
              options={TIMES.map((v) => ({ value: v, label: l.timesOptions[v] }))}
              selected={data.times}
              onToggle={(v: Time) => update("times", data.times.includes(v) ? data.times.filter((x) => x !== v) : [...data.times, v])}
              multiple
            />

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="lead-notes" className={LABEL}>
                  {l.notes} <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">{l.optional}</span>
                </label>
                <p id="lead-notes-count" className="text-xs text-silver" dir="ltr">
                  {data.notes.length}/{LIMITS.notes}
                </p>
              </div>
              <textarea
                id="lead-notes"
                name="notes"
                rows={2}
                value={data.notes}
                onChange={(e) => update("notes", e.target.value)}
                aria-invalid={errors.notes ? true : undefined}
                aria-describedby={`lead-notes-count${errors.notes ? " lead-notes-error" : ""}`}
                maxLength={LIMITS.notes + 20}
                placeholder={l.notesPlaceholder}
                className={`${INPUT} h-auto min-h-[3.5rem] resize-y py-2.5 ${border("notes")}`}
              />
              <ErrorText id="lead-notes-error">{errors.notes}</ErrorText>
            </div>

            {/* Honeypot — hidden from people and assistive tech; bots that fill it are dropped. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="lead-company">{l.honeypot}</label>
              <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" value={data.company} onChange={(e) => update("company", e.target.value)} />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-snug text-bone">
                <input
                  id="lead-consent"
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={errors.consent ? true : undefined}
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
              <ErrorText id="lead-consent-error">{errors.consent}</ErrorText>
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
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="py-2 sm:py-4"
            role="status"
          >
            <h3 ref={statusRef} tabIndex={-1} className="display text-[clamp(2rem,7vw,3rem)] text-bone outline-none">
              {status === "success" ? l.success.title : l.fallback.title}
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-bone/90">
              {status === "success" ? (
                <>
                  {l.success.bodyBefore} <strong>{l.success.send}</strong>.
                </>
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
