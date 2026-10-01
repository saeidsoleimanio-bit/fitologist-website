"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { AccentLine } from "@/components/ui/primitives";
import {
  EMPTY_APPLICATION,
  FIELD_ORDER,
  NOTE_MAX,
  applicationMessage,
  submitApplication,
  validateApplication,
  type ApplicationData,
  type ApplicationErrors,
} from "@/lib/application";
import { EASE } from "@/lib/motion";
import { COACHING_TYPES, GOALS, WHATSAPP, whatsappLink } from "@/lib/site";

const inputBase =
  "mt-1.5 block w-full border bg-[#0b0d0e]/80 px-3.5 text-base text-bone shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] placeholder:text-bone/25 transition-[border-color,box-shadow] duration-300 hover:border-silver/35 focus:border-ember focus:shadow-[0_0_0_3px_rgb(255_106_0/0.18)] focus:outline-none focus-visible:outline-none";

/** Strong, readable field labels. */
const LABEL = "block font-display text-[0.82rem] font-bold uppercase tracking-[0.16em] text-bone/90";

function ErrorText({ id, children }: { id: string; children?: string }) {
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-2 text-sm text-ember-soft"
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns,
}: {
  name: keyof ApplicationData;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
  columns: string;
}) {
  const errId = `app-${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined} aria-invalid={error ? true : undefined}>
      <legend className={LABEL}>{legend}</legend>
      <div className={`mt-1.5 grid gap-2 ${columns}`}>
        {options.map((opt, i) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`group relative flex min-h-11 lg:min-h-10 cursor-pointer items-center gap-2.5 border bg-[#0b0d0e]/60 px-3 py-1.5 text-[0.92rem] font-medium leading-tight transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember ${
                checked
                  ? "border-ember bg-ember/10 text-bone"
                  : error
                    ? "border-ember/40 text-silver hover:border-bone/30"
                    : "border-bone/15 text-silver hover:border-bone/30 hover:text-bone"
              }`}
            >
              <input
                type="radio"
                id={i === 0 ? `app-${name}` : undefined}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`flex size-4 shrink-0 items-center justify-center border transition-colors ${
                  checked ? "border-ember bg-ember" : "border-bone/30"
                }`}
              >
                {checked && <Check className="size-3 text-ink" strokeWidth={3} />}
              </span>
              {opt.label}
            </label>
          );
        })}
      </div>
      <ErrorText id={errId}>{error}</ErrorText>
    </fieldset>
  );
}

/** Application card (form → success) — graphite with a brushed silver sheen, compact enough for one desktop screen. Goal / coaching come from shared context, so earlier choices are pre-selected. */
export function ApplicationForm({ titleId }: { titleId: string }) {
  const { t } = useI18n();
  const f = t.form;
  const { goal, coaching, setGoal, setCoaching } = useApplication();
  const [data, setData] = useState<ApplicationData>(EMPTY_APPLICATION);
  const [fieldErrors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Goal / coaching live in shared context so cards elsewhere can pre-select them.
  const form: ApplicationData = { ...data, goal, coaching };
  // A selection made anywhere (including the cards) resolves its error.
  const errors: ApplicationErrors = {
    ...fieldErrors,
    goal: goal ? undefined : fieldErrors.goal,
    coaching: coaching ? undefined : fieldErrors.coaching,
  };

  useEffect(() => {
    if (status === "done") successRef.current?.focus();
  }, [status]);


  const update = <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    // Re-validate the field live once the user has tried to submit.
    if (submitted) {
      const next = validateApplication({ ...form, [key]: value }, f.errors);
      setErrors((e) => ({ ...e, [key]: next[key] }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateApplication(form, f.errors);
    setErrors(errs);
    const firstInvalid = FIELD_ORDER.find((k) => errs[k]);
    if (firstInvalid) {
      document.getElementById(`app-${firstInvalid}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      await submitApplication(form);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const describe = (key: keyof ApplicationData) =>
    errors[key] ? `app-${key}-error` : undefined;
  const border = (key: keyof ApplicationData) => (errors[key] ? "border-ember/70" : "border-silver/20");

  const waHref = whatsappLink(applicationMessage(form, t));
  const goalOptions = GOALS.map((g) => ({ value: g, label: t.goals[g].label }));
  const coachingOptions = COACHING_TYPES.map((c) => ({ value: c, label: t.coaching.options[c].title }));

  return (
          <div
            className="relative border border-silver/25 p-5 lg:px-6 lg:py-5 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95),inset_0_1px_0_rgb(255_255_255/0.1)] sm:p-6"
            style={{
              backgroundImage: [
                "radial-gradient(80% 60% at 100% 0%, rgb(191 192 194 / 0.12) 0%, transparent 70%)",
                "repeating-linear-gradient(100deg, rgb(255 255 255 / 0.014) 0 1px, transparent 1px 4px)",
                "linear-gradient(160deg, #1f2225 0%, #17191b 55%, #121415 100%)",
              ].join(", "),
            }}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 block">
              <AccentLine />
            </span>

            <AnimatePresence mode="wait" initial={false}>
              {status !== "done" ? (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  aria-labelledby={titleId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="space-y-4 lg:space-y-3.5"
                >
                  {/* Name | Age | WhatsApp — one row on desktop */}
                  <div className="grid gap-4 sm:grid-cols-[1fr_6rem] lg:grid-cols-[minmax(0,1.15fr)_5.5rem_minmax(0,1.25fr)] lg:gap-3">
                    <div>
                      <label htmlFor="app-name" className={LABEL}>
                        {f.name}
                      </label>
                      <input
                        id="app-name"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={describe("name")}
                        aria-required
                        maxLength={80}
                        placeholder={f.namePlaceholder}
                        className={`${inputBase} h-12 ${border("name")}`}
                      />
                      <ErrorText id="app-name-error">{errors.name}</ErrorText>
                    </div>
                    <div>
                      <label htmlFor="app-age" className={LABEL}>
                        {f.age}
                      </label>
                      <input
                        id="app-age"
                        name="age"
                        inputMode="numeric"
                        autoComplete="off"
                        value={form.age}
                        onChange={(e) => update("age", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                        aria-invalid={errors.age ? true : undefined}
                        aria-describedby={describe("age")}
                        aria-required
                        placeholder="30"
                        className={`${inputBase} h-12 ${border("age")}`}
                      />
                      <ErrorText id="app-age-error">{errors.age}</ErrorText>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label htmlFor="app-whatsapp" className={LABEL}>
                        {f.whatsapp}
                      </label>
                      <input
                        id="app-whatsapp"
                        name="whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        aria-invalid={errors.whatsapp ? true : undefined}
                        aria-describedby={describe("whatsapp")}
                        aria-required
                        maxLength={24}
                        placeholder="+971 50 000 0000"
                        dir="ltr"
                        className={`${inputBase} h-12 ${border("whatsapp")}`}
                      />
                      <ErrorText id="app-whatsapp-error">{errors.whatsapp}</ErrorText>
                    </div>
                  </div>


                  <ChoiceGroup
                    name="goal"
                    legend={f.goal}
                    options={goalOptions}
                    value={form.goal}
                    onChange={setGoal}
                    error={errors.goal}
                    columns="grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3"
                  />

                  <ChoiceGroup
                    name="coaching"
                    legend={f.coaching}
                    options={coachingOptions}
                    value={form.coaching}
                    onChange={setCoaching}
                    error={errors.coaching}
                    columns="grid-cols-1 sm:grid-cols-3"
                  />

                  <div>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="app-note" className={LABEL}>
                        {f.note} <span className="normal-case tracking-normal text-steel">{f.optional}</span>
                      </label>
                      <p id="app-note-count" className="text-xs text-steel" dir="ltr">
                        {form.note.length}/{NOTE_MAX}
                      </p>
                    </div>
                    <textarea
                      id="app-note"
                      name="note"
                      rows={2}
                      value={form.note}
                      onChange={(e) => update("note", e.target.value)}
                      aria-invalid={errors.note ? true : undefined}
                      aria-describedby={`app-note-count${errors.note ? " app-note-error" : ""}`}
                      maxLength={NOTE_MAX + 50}
                      placeholder={f.notePlaceholder}
                      className={`${inputBase} ${border("note")} h-auto min-h-[3.5rem] resize-y py-2.5`}
                    />
                    <ErrorText id="app-note-error">{errors.note}</ErrorText>
                  </div>

                  {status === "error" && (
                    <p role="alert" className="border border-ember/50 bg-ember/10 p-4 text-sm text-bone">
                      {f.failure}{" "}
                      <a className="underline underline-offset-4" href={waHref} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                      .
                    </p>
                  )}

                  <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={status === "submitting"}
                      icon={status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : undefined}
                    >
                      {status === "submitting" ? f.sending : f.submit}
                    </Button>
                    <p className="text-xs leading-relaxed text-steel sm:max-w-[14rem] sm:text-end">
                      {f.privacy}
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="py-4 sm:py-8"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                    className="flex size-14 items-center justify-center border border-ember text-ember"
                    aria-hidden
                  >
                    <Check className="size-6" strokeWidth={2} />
                  </motion.span>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="display mt-8 text-[clamp(2.75rem,10vw,4.5rem)] text-bone outline-none"
                  >
                    {f.success.title}
                  </h3>
                  <motion.span
                    aria-hidden
                    className="mt-5 block h-px w-24 origin-left bg-ember rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                  />
                  {/*
                    Client-side confirmation. Nothing is claimed about remote storage; the WhatsApp
                    link carries the application (pre-filled) so it reaches Saeid either way.
                  */}
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-bone">
                    {f.success.received}
                  </p>
                  <p className="mt-3 max-w-lg leading-relaxed text-silver">{f.success.next}</p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <ButtonLink
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2} />}
                      className="w-full sm:w-auto"
                    >
                      <span className="inline-flex items-center gap-3">
                        <WhatsAppGlyph className="size-5" color="#050505" handset="#FF6A00" />
                        {f.success.button}
                      </span>
                    </ButtonLink>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="min-h-11 font-display text-sm font-semibold uppercase tracking-[0.18em] text-silver underline decoration-bone/25 underline-offset-4 transition-colors duration-300 hover:text-ember-soft"
                    >
                      {f.success.edit}
                    </button>
                  </div>
                  <p className="mt-6 text-sm text-steel">
                    WhatsApp: <span dir="ltr">{WHATSAPP.display}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
  );
}
