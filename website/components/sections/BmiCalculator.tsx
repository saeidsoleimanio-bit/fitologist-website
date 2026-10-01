"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import {
  AGE_LIMITS,
  BMI_BANDS,
  BMI_LIMITS,
  BMI_SCALE,
  BMI_TONE_COLOR,
  bmiCategory,
  bmiScalePosition,
  calculateBmi,
  inToCm,
  lbToKg,
  parseNumber,
  type Sex,
  type UnitSystem,
} from "@/lib/bmi";
import { EASE } from "@/lib/motion";

type Fields = { age: string; sex: Sex | ""; cm: string; ft: string; inch: string; kg: string; lb: string };
type Errors = { age?: string; sex?: string; height?: string; weight?: string };
type Result = { bmi: number; age: number; sex: Sex };

const EMPTY: Fields = { age: "", sex: "", cm: "", ft: "", inch: "", kg: "", lb: "" };

/** Error text tuned for contrast on the silver card. */
const ERR = "text-[#ffc59a]";

function validate(
  units: UnitSystem,
  f: Fields,
): { errors: Errors; heightCm?: number; weightKg?: number; age?: number } {
  const errors: Errors = {};
  let heightCm: number | undefined;
  let weightKg: number | undefined;
  let age: number | undefined;

  const a = Number(f.age.trim());
  if (!f.age.trim()) errors.age = "Enter your age.";
  else if (!/^\d+$/.test(f.age.trim()) || a < AGE_LIMITS.min || a > AGE_LIMITS.max)
    errors.age =
      a > 0 && a < AGE_LIMITS.min
        ? "This calculator uses adult BMI categories and is not intended for children or teens (under 18)."
        : `Enter an age between ${AGE_LIMITS.min} and ${AGE_LIMITS.max}.`;
  else age = a;

  if (f.sex !== "male" && f.sex !== "female") errors.sex = "Select your sex.";

  if (units === "metric") {
    const h = parseNumber(f.cm);
    const { min, max } = BMI_LIMITS.heightCm;
    if (!f.cm.trim()) errors.height = "Enter your height.";
    else if (Number.isNaN(h) || h < min || h > max) errors.height = `Enter a height between ${min} and ${max} cm.`;
    else heightCm = h;

    const w = parseNumber(f.kg);
    const wl = BMI_LIMITS.weightKg;
    if (!f.kg.trim()) errors.weight = "Enter your weight.";
    else if (Number.isNaN(w) || w < wl.min || w > wl.max) errors.weight = `Enter a weight between ${wl.min} and ${wl.max} kg.`;
    else weightKg = w;
  } else {
    const ft = parseNumber(f.ft);
    const inch = f.inch.trim() ? parseNumber(f.inch) : 0;
    const total = ft * 12 + inch;
    const { min, max } = BMI_LIMITS.heightIn;
    if (!f.ft.trim()) errors.height = "Enter your height.";
    else if (Number.isNaN(ft) || Number.isNaN(inch) || inch >= 12 || !Number.isInteger(ft))
      errors.height = "Enter feet as a whole number and inches from 0 to 11.";
    else if (total < min || total > max) errors.height = "Enter a height between 3 ft 3 in and 8 ft 2 in.";
    else heightCm = inToCm(total);

    const lb = parseNumber(f.lb);
    const wl = BMI_LIMITS.weightLb;
    if (!f.lb.trim()) errors.weight = "Enter your weight.";
    else if (Number.isNaN(lb) || lb < wl.min || lb > wl.max) errors.weight = `Enter a weight between ${wl.min} and ${wl.max} lb.`;
    else weightKg = lbToKg(lb);
  }
  return { errors, heightCm, weightKg, age };
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = value.toFixed(1);
      return;
    }
    const controls = animate(Math.max(BMI_SCALE.min, value - 6), value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => (el.textContent = v.toFixed(1)),
    });
    return () => controls.stop();
  }, [value, reduce]);
  return <span ref={ref}>{value.toFixed(1)}</span>;
}

function Field({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  describedBy,
  placeholder,
  inputMode = "decimal",
}: {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  describedBy?: string;
  placeholder: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="eyebrow text-[0.7rem] text-bone/80">
        {label}
      </label>
      <div
        className={`mt-1 flex items-baseline border-b transition-[border-color,box-shadow] duration-300 focus-within:border-ember focus-within:shadow-[0_1px_0_0_var(--color-ember)] ${
          error ? "border-ember" : "border-bone/30"
        }`}
      >
        <input
          id={id}
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          className="w-full min-w-0 bg-transparent py-2 font-display text-3xl font-semibold text-bone outline-none placeholder:text-bone/30 sm:text-4xl"
          style={{ outline: "none" }}
        />
        {unit && (
          <span className="shrink-0 pl-2 font-display text-base font-semibold uppercase tracking-[0.16em] text-bone/60">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/** Segmented radio control (units, sex). */
function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  describedBy,
  firstId,
  pillId,
  className = "",
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: boolean;
  describedBy?: string;
  firstId?: string;
  pillId: string;
  className?: string;
}) {
  return (
    <fieldset className={className} aria-describedby={describedBy} aria-invalid={error || undefined}>
      <legend className="eyebrow text-[0.7rem] text-bone/80">{legend}</legend>
      <div
        className={`mt-2 inline-flex w-full border bg-ink/30 p-1 ${error ? "border-ember" : "border-bone/25"}`}
      >
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center px-3 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
              value === o.value ? "text-ink" : "text-bone/75 hover:text-bone"
            }`}
          >
            <input
              type="radio"
              id={i === 0 ? firstId : undefined}
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {value === o.value && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 bg-bone"
                transition={{ duration: 0.4, ease: EASE }}
              />
            )}
            <span className="relative">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const UNIT_OPTIONS = [
  { value: "metric", label: "cm / kg" },
  { value: "imperial", label: "ft / lb" },
] as const;

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export function BmiCalculator() {
  const uid = useId();
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<Result | null>(null);
  const reduce = useReducedMotion();

  const set = (key: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [key]: v }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors: errs, heightCm, weightKg, age } = validate(units, fields);
    setErrors(errs);
    if (heightCm && weightKg && age && (fields.sex === "male" || fields.sex === "female")) {
      // Adult BMI: weight / height² — the same formula for every sex.
      setResult({ bmi: Math.round(calculateBmi(weightKg, heightCm) * 10) / 10, age, sex: fields.sex });
    } else {
      setResult(null);
      const order: [keyof Errors, string][] = [
        ["age", `${uid}-age`],
        ["sex", `${uid}-sex`],
        ["height", units === "metric" ? `${uid}-cm` : `${uid}-ft`],
        ["weight", units === "metric" ? `${uid}-kg` : `${uid}-lb`],
      ];
      const first = order.find(([k]) => errs[k]);
      if (first) document.getElementById(first[1])?.focus();
    }
  };

  const switchUnits = (u: UnitSystem) => {
    setUnits(u);
    setErrors((e) => ({ ...e, height: undefined, weight: undefined }));
    setResult(null);
  };

  const errId = (k: keyof Errors) => `${uid}-${k}-err`;
  const described = (k: keyof Errors) => (errors[k] ? errId(k) : undefined);
  const category = result ? bmiCategory(result.bmi) : null;
  const toneColor = category ? BMI_TONE_COLOR[category.tone] : undefined;

  const errorLine = (k: keyof Errors) => (
    <p id={errId(k)} className={`mt-1.5 min-h-5 text-sm ${ERR}`} aria-live="polite">
      {errors[k]}
    </p>
  );

  return (
    <section id="bmi" aria-labelledby="bmi-title" className="section-y relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 50% at 80% 30%, rgba(255,106,0,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-12">
        <div className="lg:col-span-5">
          <SectionHeading index="06" label="Starting point" title="Know your starting point" id="bmi-title" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">
              A quick reference before you begin. Enter your details to see your Body Mass Index.
            </p>
            <p className="mt-6 max-w-md border-l border-ember/60 pl-4 text-sm leading-relaxed text-steel">
              BMI is a general screening measure and does not directly measure body composition.
              This calculator uses the standard adult categories and is for adults aged 18+. Sex is
              recorded for your profile; it does not change the adult BMI formula.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          {/* Silver-tinted panel: logo silver (#BFC0C2) used as tint, border and highlight over L3 */}
          <div
            className="relative border border-silver/25 bg-carbon p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-6"
            style={{
              backgroundImage:
                "linear-gradient(155deg, rgb(191 192 194 / 0.15) 0%, rgb(191 192 194 / 0.06) 45%, rgb(191 192 194 / 0.02) 100%)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-logo-silver-hi/60 to-transparent"
            />

            <form noValidate onSubmit={onSubmit} aria-label="BMI calculator">
              <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                <div>
                  <Field
                    id={`${uid}-age`}
                    label="Age"
                    unit="yrs"
                    placeholder="30"
                    inputMode="numeric"
                    value={fields.age}
                    onChange={(v) => set("age")(v.replace(/[^\d]/g, "").slice(0, 3))}
                    error={!!errors.age}
                    describedBy={described("age")}
                  />
                  {errorLine("age")}
                </div>
                <div>
                  <Segmented
                    name={`${uid}-sex`}
                    legend="Sex"
                    options={SEX_OPTIONS}
                    value={fields.sex}
                    onChange={(v) => {
                      set("sex")(v);
                      setErrors((e) => ({ ...e, sex: undefined }));
                    }}
                    error={!!errors.sex}
                    describedBy={described("sex")}
                    firstId={`${uid}-sex`}
                    pillId={`${uid}-sex-pill`}
                  />
                  {errorLine("sex")}
                </div>

                <div>
                  {units === "metric" ? (
                    <Field
                      id={`${uid}-cm`}
                      label="Height"
                      unit="cm"
                      placeholder="178"
                      value={fields.cm}
                      onChange={set("cm")}
                      error={!!errors.height}
                      describedBy={described("height")}
                    />
                  ) : (
                    <div className="flex gap-4">
                      <Field
                        id={`${uid}-ft`}
                        label="Height"
                        unit="ft"
                        placeholder="5"
                        value={fields.ft}
                        onChange={set("ft")}
                        error={!!errors.height}
                        describedBy={described("height")}
                      />
                      <Field
                        id={`${uid}-in`}
                        label="Inches"
                        unit="in"
                        placeholder="10"
                        value={fields.inch}
                        onChange={set("inch")}
                        error={!!errors.height}
                        describedBy={described("height")}
                      />
                    </div>
                  )}
                  {errorLine("height")}
                </div>
                <div>
                  {units === "metric" ? (
                    <Field
                      id={`${uid}-kg`}
                      label="Weight"
                      unit="kg"
                      placeholder="80"
                      value={fields.kg}
                      onChange={set("kg")}
                      error={!!errors.weight}
                      describedBy={described("weight")}
                    />
                  ) : (
                    <Field
                      id={`${uid}-lb`}
                      label="Weight"
                      unit="lb"
                      placeholder="176"
                      value={fields.lb}
                      onChange={set("lb")}
                      error={!!errors.weight}
                      describedBy={described("weight")}
                    />
                  )}
                  {errorLine("weight")}
                </div>
              </div>

              <div className="mt-3 flex flex-col-reverse gap-4 sm:flex-row sm:items-end sm:justify-between">
                <Button type="submit" className="w-full sm:w-auto" icon={false}>
                  Calculate BMI
                </Button>
                <Segmented
                  name={`${uid}-units`}
                  legend="Units"
                  options={UNIT_OPTIONS}
                  value={units}
                  onChange={switchUnits}
                  pillId={`${uid}-unit-pill`}
                  className="sm:w-60"
                />
              </div>
            </form>

            {/* Result */}
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                {result && category && (
                  <motion.div
                    key={`${result.bmi}-${result.age}-${result.sex}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mt-6 border-t border-bone/15 pt-5"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                      <div>
                        <p className="eyebrow text-[0.7rem] text-bone/80">Your BMI</p>
                        <p
                          className="display mt-1 text-[4rem] leading-none sm:text-[4.5rem]"
                          style={{ color: toneColor }}
                        >
                          <span className="sr-only">Your BMI is </span>
                          <CountUp value={result.bmi} />
                        </p>
                      </div>
                      <div className="pb-1 text-left sm:text-right">
                        <p
                          className="font-display text-2xl font-bold uppercase tracking-[0.1em] sm:text-3xl"
                          style={{ color: toneColor }}
                        >
                          {category.label}
                        </p>
                        <p className="mt-0.5 text-sm text-bone/70">
                          Adult range {category.range} · Age {result.age} ·{" "}
                          {result.sex === "male" ? "Male" : "Female"}
                        </p>
                      </div>
                    </div>

                    {/* Four-range indicator: yellow <18.5 · green 18.5–<25 · orange 25–<30 · red 30+ */}
                    <div className="mt-5" aria-hidden>
                      <div className="relative flex h-2 gap-1">
                        {BMI_BANDS.map((b) => {
                          const active = b.tone === category.tone;
                          return (
                            <span
                              key={b.label}
                              className="h-full transition-opacity duration-300"
                              style={{
                                flex: b.to - b.from,
                                background: BMI_TONE_COLOR[b.tone],
                                opacity: active ? 1 : 0.3,
                              }}
                            />
                          );
                        })}
                        <motion.span
                          className="absolute -top-1.5 h-5 w-1 -translate-x-1/2 bg-bone shadow-[0_0_0_2px_rgba(5,5,5,0.6)]"
                          initial={{ left: reduce ? `${bmiScalePosition(result.bmi) * 100}%` : "0%" }}
                          animate={{ left: `${bmiScalePosition(result.bmi) * 100}%` }}
                          transition={{ duration: 1.1, ease: EASE }}
                        />
                      </div>
                      <div className="relative mt-2 h-4 text-[0.7rem] tabular-nums tracking-[0.1em] text-bone/60">
                        {BMI_BANDS.slice(1).map((b) => (
                          <span
                            key={b.label}
                            className="absolute -translate-x-1/2"
                            style={{ left: `${bmiScalePosition(b.from) * 100}%` }}
                          >
                            {b.from}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 bg-ink/55 p-4 min-[360px]:p-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="display text-[1.8rem] text-bone sm:text-[2.1rem]">BMI is only the start.</p>
                      <ButtonLink href="#start-training" className="w-full shrink-0 sm:w-auto">
                        Start training
                      </ButtonLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
