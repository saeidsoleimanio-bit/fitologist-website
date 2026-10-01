"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
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
  type Gender,
  type UnitSystem,
} from "@/lib/bmi";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { EASE } from "@/lib/motion";
import { START_PATH } from "@/lib/site";

type Fields = { age: string; gender: Gender | ""; cm: string; ft: string; inch: string; kg: string; lb: string };
type Errors = { age?: string; gender?: string; height?: string; weight?: string };
type Result = { bmi: number; age: number; gender: Gender };

const EMPTY: Fields = { age: "", gender: "", cm: "", ft: "", inch: "", kg: "", lb: "" };

/** Error text tuned for contrast on the graphite card. */
const ERR = "text-[#ffb27a]";

/** Format a number in the active locale (decimal comma for Russian; Western digits everywhere). */
const fmt = (locale: string, v: number, digits = 1) =>
  v.toLocaleString(locale === "ar" ? "en" : locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });

function validate(
  units: UnitSystem,
  f: Fields,
  msg: Dictionary["bmi"]["errors"],
): { errors: Errors; heightCm?: number; weightKg?: number; age?: number } {
  const errors: Errors = {};
  let heightCm: number | undefined;
  let weightKg: number | undefined;
  let age: number | undefined;

  const a = Number(f.age.trim());
  if (!f.age.trim()) errors.age = msg.ageRequired;
  else if (!/^\d+$/.test(f.age.trim()) || a < AGE_LIMITS.min || a > AGE_LIMITS.max)
    errors.age = a > 0 && a < AGE_LIMITS.min ? msg.ageMinor : msg.ageRange;
  else age = a;

  if (f.gender !== "male" && f.gender !== "female") errors.gender = msg.genderRequired;

  if (units === "metric") {
    const h = parseNumber(f.cm);
    const { min, max } = BMI_LIMITS.heightCm;
    if (!f.cm.trim()) errors.height = msg.heightRequired;
    else if (Number.isNaN(h) || h < min || h > max) errors.height = msg.heightRangeCm;
    else heightCm = h;

    const w = parseNumber(f.kg);
    const wl = BMI_LIMITS.weightKg;
    if (!f.kg.trim()) errors.weight = msg.weightRequired;
    else if (Number.isNaN(w) || w < wl.min || w > wl.max) errors.weight = msg.weightRangeKg;
    else weightKg = w;
  } else {
    const ft = parseNumber(f.ft);
    const inch = f.inch.trim() ? parseNumber(f.inch) : 0;
    const total = ft * 12 + inch;
    const { min, max } = BMI_LIMITS.heightIn;
    if (!f.ft.trim()) errors.height = msg.heightRequired;
    else if (Number.isNaN(ft) || Number.isNaN(inch) || inch >= 12 || !Number.isInteger(ft))
      errors.height = msg.heightFtFormat;
    else if (total < min || total > max) errors.height = msg.heightRangeFt;
    else heightCm = inToCm(total);

    const lb = parseNumber(f.lb);
    const wl = BMI_LIMITS.weightLb;
    if (!f.lb.trim()) errors.weight = msg.weightRequired;
    else if (Number.isNaN(lb) || lb < wl.min || lb > wl.max) errors.weight = msg.weightRangeLb;
    else weightKg = lbToKg(lb);
  }
  return { errors, heightCm, weightKg, age };
}

function CountUp({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = fmt(locale, value);
      return;
    }
    const controls = animate(Math.max(BMI_SCALE.min, value - 6), value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => (el.textContent = fmt(locale, v)),
    });
    return () => controls.stop();
  }, [value, reduce, locale]);
  return <span ref={ref}>{fmt(locale, value)}</span>;
}


/** Boxed numeric input with unit — substantial but compact (h-14). */
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
  hideLabel = false,
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
  hideLabel?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className={hideLabel ? "sr-only" : LABEL}>
        {label}
      </label>
      <div
        className={`flex h-12 items-center border bg-[#0b0d0e]/75 px-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-[border-color,box-shadow] duration-300 focus-within:border-ember focus-within:shadow-[0_0_0_3px_rgb(255_106_0/0.18)] ${
          hideLabel ? "" : "mt-1.5"
        } ${error ? "border-ember/80" : "border-silver/20 hover:border-silver/40"}`}
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
          dir="ltr"
          className="w-full min-w-0 bg-transparent font-display text-[1.5rem] font-bold leading-none text-bone outline-none placeholder:text-bone/20 rtl:text-right"
          style={{ outline: "none" }}
        />
        {unit && (
          <span className="shrink-0 ps-1.5 font-display text-[0.85rem] font-bold uppercase tracking-[0.1em] text-silver">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/** Segmented radio control (units, gender). */
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
  compact = false,
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
  compact?: boolean;
}) {
  return (
    <fieldset className={className} aria-describedby={describedBy} aria-invalid={error || undefined}>
      <legend className={compact ? "sr-only" : LABEL}>{legend}</legend>
      <div
        className={`flex w-full border bg-[#0b0d0e]/75 p-1 ${compact ? "h-9" : "mt-1.5 h-12"} ${
          error ? "border-ember/80" : "border-silver/20"
        }`}
      >
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`relative flex flex-1 cursor-pointer items-center justify-center px-2 font-display font-bold uppercase transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
              compact ? "text-[0.72rem] tracking-[0.08em] sm:text-[0.8rem] sm:tracking-[0.12em]" : "text-[0.85rem] tracking-[0.06em] sm:text-[0.95rem] sm:tracking-[0.12em]"
            } ${value === o.value ? "text-ink" : "text-bone/70 hover:text-bone"}`}
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
                className="absolute inset-0 bg-linear-to-b from-[#e4e5e7] to-silver"
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

const LABEL = "block font-display text-[0.88rem] font-bold uppercase tracking-[0.14em] text-bone";

export function BmiCalculator() {
  const { t, href, locale } = useI18n();
  const b = t.bmi;
  const UNIT_OPTIONS = [
    { value: "metric", label: b.metric },
    { value: "imperial", label: b.imperial },
  ] as const;
  const GENDER_OPTIONS = [
    { value: "male", label: b.male },
    { value: "female", label: b.female },
  ] as const;
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
    const { errors: errs, heightCm, weightKg, age } = validate(units, fields, b.errors);
    setErrors(errs);
    if (heightCm && weightKg && age && (fields.gender === "male" || fields.gender === "female")) {
      // Adult BMI: weight / height² — the same formula regardless of age or gender.
      setResult({ bmi: Math.round(calculateBmi(weightKg, heightCm) * 10) / 10, age, gender: fields.gender });
    } else {
      setResult(null);
      const order: [keyof Errors, string][] = [
        ["height", units === "metric" ? `${uid}-cm` : `${uid}-ft`],
        ["weight", units === "metric" ? `${uid}-kg` : `${uid}-lb`],
        ["age", `${uid}-age`],
        ["gender", `${uid}-gender`],
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
  const tone = result ? bmiCategory(result.bmi) : null;
  const toneColor = tone ? BMI_TONE_COLOR[tone] : undefined;

  // Fixed-height error slot (two short lines) so messages never move the layout.
  const errorLine = (k: keyof Errors) => (
    <p id={errId(k)} className={`mt-1 min-h-[1.6rem] text-[0.75rem] font-medium leading-tight ${ERR}`} aria-live="polite">
      {errors[k]}
    </p>
  );

  return (
    <section
      id="bmi"
      aria-labelledby="bmi-title"
      className="section-y relative overflow-hidden"
      style={{
        // Distinct graphite tone between the black sections, with a faint silver sheen.
        background: [
          "radial-gradient(50% 60% at 78% 40%, rgb(191 192 194 / 0.07), transparent 70%)",
          "linear-gradient(180deg, #050505 0%, #111315 16%, #141618 50%, #111315 84%, #050505 100%)",
        ].join(", "),
      }}
    >
      <div className="relative mx-auto grid max-w-[88rem] gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div className="min-w-0 lg:col-span-5 lg:pe-4">
          <SectionHeading label={b.eyebrow} title={b.title} id="bmi-title" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-lg text-[1.15rem] leading-[1.65] text-silver lg:text-[1.2rem]">{b.intro}</p>
            <p className="mt-5 max-w-lg border-s border-ember/60 ps-4 text-[0.9rem] leading-[1.7] text-steel">
              {b.disclaimer}
            </p>
          </Reveal>
        </div>

        {/* Card column reserves the space of the revealed result, so calculating never moves the page */}
        <Reveal delay={0.15} className="min-w-0 lg:col-span-6 lg:col-start-7 lg:min-h-[var(--bmi-col-h)] lg:[--bmi-col-h:35rem]">
          {/*
            Metallic graphite card built from the logo silver (#BFC0C2): a brushed sheen from the top
            corner, a bright top edge and an inner hairline. Fixed structure — the result area is
            reserved from the start, so calculating never changes the card's height.
          */}
          <div
            className="relative mx-auto w-full max-w-[36rem] overflow-hidden border border-silver/30 p-5 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95),inset_0_1px_0_rgb(255_255_255/0.14)] sm:p-6"
            style={{
              backgroundImage: [
                "radial-gradient(90% 70% at 0% 0%, rgb(191 192 194 / 0.2) 0%, rgb(191 192 194 / 0.05) 50%, transparent 75%)",
                "repeating-linear-gradient(100deg, rgb(255 255 255 / 0.016) 0 1px, transparent 1px 4px)",
                "linear-gradient(150deg, #2a2d31 0%, #1e2124 45%, #17191b 100%)",
              ].join(", "),
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-logo-silver-hi to-transparent"
            />

            <form noValidate onSubmit={onSubmit} aria-label={b.formLabel} className="relative">
              {/* Card header: title + units */}
              <div className="flex items-center justify-between gap-4">
                <p className="flex min-w-0 items-center gap-3 font-display text-[0.8rem] font-bold uppercase tracking-[0.16em] text-bone sm:text-[0.9rem] sm:tracking-[0.2em]">
                  <span aria-hidden className="h-px w-6 bg-ember" />
                  {t.nav.bmi}
                </p>
                <Segmented
                  name={`${uid}-units`}
                  legend={b.units}
                  options={UNIT_OPTIONS}
                  value={units}
                  onChange={switchUnits}
                  pillId={`${uid}-unit-pill`}
                  className="w-36 shrink-0 sm:w-44"
                  compact
                />
              </div>

              {/* Height · Weight · Age, then Gender + Calculate */}
              <div className="mt-4 grid grid-cols-2 gap-x-3 sm:grid-cols-3 [&>div]:min-w-0">
                <div>
                  {units === "metric" ? (
                    <Field
                      id={`${uid}-cm`}
                      label={b.height}
                      unit={b.unitCm}
                      placeholder="178"
                      value={fields.cm}
                      onChange={set("cm")}
                      error={!!errors.height}
                      describedBy={described("height")}
                    />
                  ) : (
                    <fieldset aria-describedby={described("height")}>
                      <legend className={LABEL}>{b.height}</legend>
                      <div className="mt-1.5 flex gap-1.5">
                        <Field
                          id={`${uid}-ft`}
                          label={`${b.height} (${b.unitFt})`}
                          unit={b.unitFt}
                          placeholder="5"
                          value={fields.ft}
                          onChange={set("ft")}
                          error={!!errors.height}
                          hideLabel
                        />
                        <Field
                          id={`${uid}-in`}
                          label={`${b.inches} (${b.unitIn})`}
                          unit={b.unitIn}
                          placeholder="10"
                          value={fields.inch}
                          onChange={set("inch")}
                          error={!!errors.height}
                          hideLabel
                        />
                      </div>
                    </fieldset>
                  )}
                  {errorLine("height")}
                </div>
                <div>
                  {units === "metric" ? (
                    <Field
                      id={`${uid}-kg`}
                      label={b.weight}
                      unit={b.unitKg}
                      placeholder="80"
                      value={fields.kg}
                      onChange={set("kg")}
                      error={!!errors.weight}
                      describedBy={described("weight")}
                    />
                  ) : (
                    <Field
                      id={`${uid}-lb`}
                      label={b.weight}
                      unit={b.unitLb}
                      placeholder="176"
                      value={fields.lb}
                      onChange={set("lb")}
                      error={!!errors.weight}
                      describedBy={described("weight")}
                    />
                  )}
                  {errorLine("weight")}
                </div>
                <div>
                  <Field
                    id={`${uid}-age`}
                    label={b.age}
                    unit={b.yrs}
                    placeholder="30"
                    inputMode="numeric"
                    value={fields.age}
                    onChange={(v) => set("age")(v.replace(/[^\d]/g, "").slice(0, 3))}
                    error={!!errors.age}
                    describedBy={described("age")}
                  />
                  {errorLine("age")}
                </div>
                <div className="sm:col-span-2">
                  <Segmented
                    name={`${uid}-gender`}
                    legend={b.gender}
                    options={GENDER_OPTIONS}
                    value={fields.gender}
                    onChange={(v) => {
                      set("gender")(v);
                      setErrors((e) => ({ ...e, gender: undefined }));
                    }}
                    error={!!errors.gender}
                    describedBy={described("gender")}
                    firstId={`${uid}-gender`}
                    pillId={`${uid}-gender-pill`}
                  />
                  {errorLine("gender")}
                </div>
                <div className="col-span-2 sm:col-span-1 sm:pt-[1.85rem]">
                  <Button type="submit" className="h-12 min-h-12 w-full px-4! py-0" icon={false}>
                    {b.calculate}
                  </Button>
                </div>
              </div>
            </form>

            {/*
              Result — absent until the first calculation, then revealed smoothly. The card's column
              reserves room for it on desktop, so revealing it never moves the page.
            */}
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence initial={false}>
                {result && tone && (
                  <motion.div
                    key="result"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 border-t border-silver/15 pt-4">
                      <div className="min-w-[6rem]">
                        <p className="font-display text-[1.05rem] font-bold uppercase tracking-[0.14em] text-ember">
                          {b.yourBmi}
                        </p>
                        <p className="display mt-1 text-[3.5rem] leading-none sm:text-[4rem]" style={{ color: toneColor }}>
                          <span className="sr-only">{b.srYourBmi} </span>
                          <CountUp key={`${result.bmi}-${result.age}-${result.gender}`} value={result.bmi} locale={locale} />
                        </p>
                      </div>

                      <div className="min-w-0">
                        <motion.div
                          key={`${result.bmi}-${result.gender}-${result.age}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <p
                            className="font-display text-[1.5rem] font-bold uppercase leading-none tracking-[0.06em] sm:text-[1.7rem]"
                            style={{ color: toneColor }}
                          >
                            {b.categories[tone]}
                          </p>
                          <p className="mt-1.5 text-[0.85rem] font-medium text-bone/75">
                            {b.adultRange} <span dir="ltr">{b.ranges[tone]}</span> · {b.age} {result.age} ·{" "}
                            {result.gender === "male" ? b.male : b.female}
                          </p>
                        </motion.div>

                        {/* Four-range indicator: yellow <18.5 · green 18.5–<25 · orange 25–<30 · red 30+ */}
                        <div className="mt-3" aria-hidden dir="ltr">
                          <div className="relative flex h-1.5 gap-1">
                            {BMI_BANDS.map((band) => (
                              <span
                                key={band.tone}
                                className="h-full transition-opacity duration-500"
                                style={{
                                  flex: band.to - band.from,
                                  background: BMI_TONE_COLOR[band.tone],
                                  opacity: band.tone === tone ? 1 : 0.3,
                                }}
                              />
                            ))}
                            <motion.span
                              className="absolute -top-1.5 h-[18px] w-1 -translate-x-1/2 bg-bone shadow-[0_0_0_2px_rgba(5,5,5,0.6)]"
                              initial={{ left: reduce ? `${bmiScalePosition(result.bmi) * 100}%` : "0%" }}
                              animate={{ left: `${bmiScalePosition(result.bmi) * 100}%` }}
                              transition={{ duration: 1.1, ease: EASE }}
                            />
                          </div>
                          <div className="relative mt-1.5 h-4 text-[0.72rem] font-medium tabular-nums tracking-[0.08em] text-bone/55">
                            {BMI_BANDS.slice(1).map((band) => (
                              <span
                                key={band.tone}
                                className="absolute -translate-x-1/2"
                                style={{ left: `${bmiScalePosition(band.from) * 100}%` }}
                              >
                                {fmt(locale, band.from, Number.isInteger(band.from) ? 0 : 1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 flex flex-col gap-3 bg-ink/45 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-display text-[1.05rem] font-bold uppercase tracking-[0.1em] text-bone">{b.onlyStart}</p>
                        <ButtonLink href={href(START_PATH)} className="w-full sm:w-auto">
                          {b.startTraining}
                        </ButtonLink>
                      </div>
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
