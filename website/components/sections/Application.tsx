"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { AccentLine, LogoWatermark, Reveal, SectionHeading } from "@/components/ui/primitives";
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

const STEPS = [
  { title: "Apply", body: "Six quick questions." },
  { title: "Connect", body: "Continue the conversation with Saeid on WhatsApp." },
  { title: "Assess", body: "Start with your goals, history and schedule." },
];

const inputBase =
  "mt-1.5 block w-full border bg-ink/60 px-4 py-3 text-base text-bone placeholder:text-bone/30 transition-colors duration-300 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember focus-visible:outline-none";

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
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
  columns: string;
}) {
  const errId = `app-${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined} aria-invalid={error ? true : undefined}>
      <legend className="eyebrow text-[0.72rem]">{legend}</legend>
      <div className={`mt-1.5 grid gap-2 ${columns}`}>
        {options.map((opt, i) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={`group relative flex min-h-11 cursor-pointer items-center gap-2.5 border px-3.5 py-2 text-[0.95rem] leading-tight lg:text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember ${
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
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
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
              {opt}
            </label>
          );
        })}
      </div>
      <ErrorText id={errId}>{error}</ErrorText>
    </fieldset>
  );
}

export function Application() {
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
      const next = validateApplication({ ...form, [key]: value });
      setErrors((e) => ({ ...e, [key]: next[key] }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateApplication(form);
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
  const border = (key: keyof ApplicationData) => (errors[key] ? "border-ember/70" : "border-bone/15");

  const waHref = whatsappLink(applicationMessage(form));

  return (
    <section
      id="start-training"
      aria-labelledby="apply-title"
      className="section-y surface-deep relative overflow-hidden [--glow-x:85%] [--glow-y:60%]"
    >
      <LogoWatermark className="-left-[30%] bottom-[5%] w-[110vw] lg:-left-[6%] lg:w-[48vw]" opacity={0.03} />

      <div className="relative mx-auto grid max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12">
        <div className="lg:col-span-5">
          <div>
            <SectionHeading index="07" label="Apply" title="Start training" id="apply-title" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">
                Tell Saeid a little about you and what you want to achieve. It takes about a
                minute.
              </p>
            </Reveal>

            <motion.ol
              className="mt-8 max-w-md space-y-0 border-t hairline"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
            >
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.title}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                  className="flex gap-5 border-b hairline py-4"
                >
                  <span className="font-display text-sm font-semibold tracking-[0.2em] text-ember">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-bone">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-sm text-silver">{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative border hairline bg-carbon p-5 sm:p-7 lg:p-8">
            <span aria-hidden className="absolute inset-x-0 top-0 block">
              <AccentLine />
            </span>

            <AnimatePresence mode="wait" initial={false}>
              {status !== "done" ? (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  aria-labelledby="apply-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
                    <div>
                      <label htmlFor="app-name" className="eyebrow text-[0.72rem]">
                        Name
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
                        placeholder="Your name"
                        className={`${inputBase} ${border("name")}`}
                      />
                      <ErrorText id="app-name-error">{errors.name}</ErrorText>
                    </div>
                    <div>
                      <label htmlFor="app-age" className="eyebrow text-[0.72rem]">
                        Age
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
                        className={`${inputBase} ${border("age")}`}
                      />
                      <ErrorText id="app-age-error">{errors.age}</ErrorText>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="app-whatsapp" className="eyebrow text-[0.72rem]">
                        WhatsApp number
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
                        className={`${inputBase} ${border("whatsapp")}`}
                      />
                      <ErrorText id="app-whatsapp-error">{errors.whatsapp}</ErrorText>
                    </div>
                  </div>


                  <ChoiceGroup
                    name="goal"
                    legend="Main goal"
                    options={GOALS}
                    value={form.goal}
                    onChange={setGoal}
                    error={errors.goal}
                    columns="grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4"
                  />

                  <ChoiceGroup
                    name="coaching"
                    legend="Coaching type"
                    options={COACHING_TYPES}
                    value={form.coaching}
                    onChange={setCoaching}
                    error={errors.coaching}
                    columns="grid-cols-1 sm:grid-cols-3"
                  />

                  <div>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="app-note" className="eyebrow text-[0.72rem]">
                        Anything Saeid should know? <span className="normal-case tracking-normal text-steel">(optional)</span>
                      </label>
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
                      placeholder="Training history, injuries, schedule…"
                      className={`${inputBase} ${border("note")} resize-y`}
                    />
                    <div className="flex justify-between">
                      <ErrorText id="app-note-error">{errors.note}</ErrorText>
                      <p id="app-note-count" className="ml-auto pt-2 text-xs text-steel">
                        {form.note.length}/{NOTE_MAX}
                      </p>
                    </div>
                  </div>

                  {status === "error" && (
                    <p role="alert" className="border border-ember/50 bg-ember/10 p-4 text-sm text-bone">
                      Something went wrong sending your application. Please try again, or message
                      Saeid directly on{" "}
                      <a className="underline underline-offset-4" href={waHref} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                      .
                    </p>
                  )}

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={status === "submitting"}
                      icon={status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : undefined}
                    >
                      {status === "submitting" ? "Sending…" : "Apply to train"}
                    </Button>
                    <p className="text-xs leading-relaxed text-steel sm:max-w-[14rem] sm:text-right">
                      Your details are only used to contact you about coaching.
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
                    Application received
                  </h3>
                  <motion.span
                    aria-hidden
                    className="mt-5 block h-px w-24 origin-left bg-ember"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                  />
                  {/*
                    Client-side confirmation. Nothing is claimed about remote storage; the WhatsApp
                    link carries the application (pre-filled) so it reaches Saeid either way.
                  */}
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-bone">
                    Your information has been received.
                  </p>
                  <p className="mt-3 max-w-lg leading-relaxed text-silver">
                    Next step: contact Saeid on WhatsApp. Your details open as a ready-to-send
                    message — just review it and press Send.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <ButtonLink
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ArrowRight className="size-4" strokeWidth={2} />}
                      className="w-full sm:w-auto"
                    >
                      <span className="inline-flex items-center gap-3">
                        <WhatsAppIcon className="size-5" />
                        WhatsApp Saeid
                      </span>
                    </ButtonLink>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="min-h-11 font-display text-sm font-semibold uppercase tracking-[0.18em] text-silver underline decoration-bone/25 underline-offset-4 transition-colors duration-300 hover:text-ember-soft"
                    >
                      Edit details
                    </button>
                  </div>
                  <p className="mt-6 text-sm text-steel">WhatsApp: {WHATSAPP.display}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
