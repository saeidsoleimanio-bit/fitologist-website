"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useApplication } from "@/components/providers/ApplicationProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GymVectors } from "@/components/ui/GymVectors";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/primitives";
import {
  ACTIVITIES,
  BMI_BANDS,
  BMI_SCALE,
  BMI_TONE_COLOR,
  LIMITS,
  bmiCategory,
  bmiScalePosition,
  calculateBmi,
  healthyRange,
  inToCm,
  lbToKg,
  maintenanceCalories,
  parseNumber,
  type Activity,
  type BmiTone,
  type Sex,
  type UnitSystem,
} from "@/lib/bodycheck";
import { GOALS, toLatinDigits, toggleGoal, type Goal } from "@/lib/lead";
import { track } from "@/lib/analytics";
import { EASE } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";

type Fields = {
  cm: string;
  ft: string;
  inch: string;
  kg: string;
  lb: string;
  age: string;
};
type Errors = Partial<
  Record<"height" | "weight" | "age" | "sex" | "activity", string>
>;
type Result = {
  bmi: number;
  tone: BmiTone;
  range: { min: number; max: number };
  kcal: number;
  age: number;
  goals: Goal[];
  units: UnitSystem;
};

const EMPTY: Fields = { cm: "", ft: "", inch: "", kg: "", lb: "", age: "" };
const LABEL =
  "block font-display text-[0.88rem] font-bold uppercase tracking-[0.12em] text-bone";
const ERR = "text-[#ffb27a]";

/** Number formatting in the active locale with Western digits (decimal comma-safe). */
const fmt = (v: number, digits = 1) =>
  v.toLocaleString("en", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = fmt(value);
      return;
    }
    const controls = animate(Math.max(BMI_SCALE.min, value - 6), value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => (el.textContent = fmt(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);
  return <span ref={ref}>{fmt(value)}</span>;
}

/** Boxed numeric input; the unit is the only hint (no sample numbers). */
function Field({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  describedBy,
  inputMode = "decimal",
  hideLabel = false,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  describedBy?: string;
  inputMode?: "decimal" | "numeric";
  hideLabel?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className={hideLabel ? "sr-only" : LABEL}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center border bg-[#0b0d0e] px-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-[border-color,box-shadow] duration-300 focus-within:border-ember focus-within:shadow-[0_0_0_3px_rgb(255_106_0/0.18)] ${
          hideLabel ? "" : "mt-1"
        } ${error ? "border-ember/80" : "border-silver/20 hover:border-silver/40"}`}
      >
        <input
          id={id}
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(toLatinDigits(e.target.value))}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          dir="ltr"
          className="w-full min-w-0 bg-transparent font-display text-[1.5rem] font-bold leading-none text-bone outline-none rtl:text-right"
          style={{ outline: "none" }}
        />
        <span
          aria-hidden
          className="shrink-0 ps-1.5 font-display text-[0.85rem] font-bold uppercase tracking-[0.1em] text-silver"
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

/** Single-select radio group rendered as compact chips (units, sex, activity). */
function RadioChips<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  describedBy,
  firstId,
  columns,
  hideLegend = false,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: boolean;
  describedBy?: string;
  firstId?: string;
  columns: string;
  hideLegend?: boolean;
}) {
  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error || undefined}>
      <legend className={hideLegend ? "sr-only" : LABEL}>{legend}</legend>
      <div className={`grid gap-1.5 ${hideLegend ? "" : "mt-1"} ${columns}`}>
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex min-h-11 cursor-pointer items-center justify-center border px-2 text-center text-[0.9rem] font-semibold leading-tight transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
                checked
                  ? "border-transparent bg-linear-to-b from-[#e4e5e7] to-silver text-ink"
                  : error
                    ? "border-ember/70 bg-[#0b0d0e] text-bone/85"
                    : "border-silver/20 bg-[#0b0d0e] text-bone/85 hover:border-silver/45 hover:text-bone"
              }`}
            >
              <input
                type="radio"
                id={i === 0 ? firstId : undefined}
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Free Body Check (§3) — used on the home page (#bmi) and on /bmi. */
/** What the embedded Body Check reports to its host page (/floor-test). */
export type BodyCheckOutcome = {
  bmi: string;
  category: BmiTone;
  age: string;
  sex: Sex | "";
  goals: Goal[];
};

export function BodyCheck({
  headingLevel = "h2",
  embedded,
}: {
  headingLevel?: "h1" | "h2";
  /**
   * Inline use inside another page (/floor-test): the host supplies the heading; the card, units and
   * maths are identical; the result shows one "Continue" button instead of WhatsApp / Book.
   */
  embedded?: {
    heading: React.ReactNode;
    continueLabel: string;
    onResult: (r: BodyCheckOutcome) => void;
    onContinue: () => void;
  };
}) {
  const { t } = useI18n();
  const b = t.bodyCheck;
  const { startApplication } = useApplication();
  const uid = useId();
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [sex, setSex] = useState<Sex | "">("");
  const [activity, setActivity] = useState<Activity | "">("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<Result | null>(null);
  const reduce = useReducedMotion();
  const Heading = headingLevel;

  const set = (key: keyof Fields) => (v: string) =>
    setFields((f) => ({ ...f, [key]: v }));

  const validate = () => {
    const e: Errors = {};
    let heightCm: number | undefined;
    let weightKg: number | undefined;
    if (units === "metric") {
      const h = parseNumber(fields.cm);
      if (Number.isNaN(h) || h < LIMITS.heightCm.min || h > LIMITS.heightCm.max)
        e.height = b.errors.heightCm;
      else heightCm = h;
      const w = parseNumber(fields.kg);
      if (Number.isNaN(w) || w < LIMITS.weightKg.min || w > LIMITS.weightKg.max)
        e.weight = b.errors.weightKg;
      else weightKg = w;
    } else {
      const ft = parseNumber(fields.ft);
      const inch = fields.inch.trim() ? parseNumber(fields.inch) : 0;
      const cm = inToCm(ft * 12 + inch);
      if (
        Number.isNaN(ft) ||
        !Number.isInteger(ft) ||
        Number.isNaN(inch) ||
        inch >= 12 ||
        cm < LIMITS.heightCm.min ||
        cm > LIMITS.heightCm.max
      )
        e.height = b.errors.heightFt;
      else heightCm = cm;
      const kg = lbToKg(parseNumber(fields.lb));
      if (
        Number.isNaN(kg) ||
        kg < LIMITS.weightKg.min ||
        kg > LIMITS.weightKg.max
      )
        e.weight = b.errors.weightLb;
      else weightKg = kg;
    }
    const ageRaw = fields.age.trim();
    const age = Number(ageRaw);
    if (!/^\d+$/.test(ageRaw)) e.age = b.errors.age;
    else if (age < LIMITS.age.min) e.age = b.errors.minor;
    else if (age > LIMITS.age.max) e.age = b.errors.age;
    if (!sex) e.sex = b.errors.sex;
    if (!activity) e.activity = b.errors.activity;
    return { e, heightCm, weightKg, age };
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const { e, heightCm, weightKg, age } = validate();
    setErrors(e);
    if (heightCm && weightKg && sex && activity && !Object.keys(e).length) {
      const bmi = calculateBmi(weightKg, heightCm);
      track("bmi_calculated", {
        category: bmiCategory(bmi),
        goals: goals.join(","),
      });
      embedded?.onResult({
        bmi: fmt(bmi),
        category: bmiCategory(bmi),
        age: String(age),
        sex,
        goals,
      });
      setResult({
        bmi,
        tone: bmiCategory(bmi),
        range: healthyRange(heightCm, units),
        kcal: maintenanceCalories(sex, weightKg, heightCm, age, activity),
        age,
        goals,
        units,
      });
    } else {
      setResult(null);
      const order: [keyof Errors, string][] = [
        ["height", units === "metric" ? `${uid}-cm` : `${uid}-ft`],
        ["weight", units === "metric" ? `${uid}-kg` : `${uid}-lb`],
        ["age", `${uid}-age`],
        ["sex", `${uid}-sex`],
        ["activity", `${uid}-activity`],
      ];
      const first = order.find(([k]) => e[k]);
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
  const errorLine = (k: keyof Errors) => (
    <p
      id={errId(k)}
      className={`mt-0.5 min-h-[1rem] text-[0.8rem] font-medium leading-tight ${ERR}`}
      aria-live="polite"
    >
      {errors[k]}
    </p>
  );

  const goalLabels = (gs: Goal[]) => gs.map((g) => t.goals[g]);
  const toneColor = result ? BMI_TONE_COLOR[result.tone] : undefined;

  const waMessage = result
    ? [
        b.whatsapp.intro,
        [
          `${b.whatsapp.bmi}: ${fmt(result.bmi)} (${b.categories[result.tone]})`,
          `${b.whatsapp.age}: ${result.age}`,
          ...(result.goals.length
            ? [`${b.whatsapp.goals}: ${goalLabels(result.goals).join(", ")}`]
            : []),
        ].join(" · "),
        b.whatsapp.outro,
      ].join("\n")
    : "";

  const Outer = embedded ? "div" : "section";
  return (
    <Outer
      id={embedded ? undefined : "bmi"}
      aria-labelledby={embedded ? undefined : `${uid}-title`}
      className={embedded ? "relative" : "section-y relative overflow-hidden"}
      style={
        embedded
          ? undefined
          : {
              background: [
                "radial-gradient(50% 60% at 78% 40%, rgb(191 192 194 / 0.07), transparent 70%)",
                "linear-gradient(180deg, #050505 0%, #111315 16%, #141618 50%, #111315 84%, #050505 100%)",
              ].join(", "),
            }
      }
    >
      <div
        className={
          embedded
            ? "relative grid gap-4"
            : "relative mx-auto grid max-w-[88rem] gap-6 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]"
        }
      >
        <div className={embedded ? "min-w-0" : "min-w-0 lg:col-span-4 lg:pt-6"}>
          {embedded ? (
            embedded.heading
          ) : (
            <>
              <Reveal load={headingLevel === "h1"}>
                <Heading
                  id={`${uid}-title`}
                  className="display text-[clamp(2.25rem,7.4vw,4rem)] text-bone text-balance"
                >
                  {b.title}
                </Heading>
              </Reveal>
              <Reveal load={headingLevel === "h1"} delay={0.08}>
                <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-silver lg:text-[1.15rem]">
                  {b.subtitle}
                </p>
              </Reveal>
            </>
          )}
          {/* Units live outside the card to keep the card compact (§3, owner revision) */}
          <div className="mt-4 w-48">
            <RadioChips
              name={`${uid}-units`}
              legend={b.units}
              options={[
                { value: "metric", label: b.metric },
                { value: "imperial", label: b.imperial },
              ]}
              value={units}
              onChange={switchUnits}
              columns="grid-cols-2"
              hideLegend
            />
          </div>
        </div>

        <Reveal
          load={headingLevel === "h1"}
          delay={0.12}
          className={embedded ? "min-w-0" : "min-w-0 lg:col-span-8"}
        >
          <div
            className="relative mx-auto w-full max-w-[44rem] overflow-hidden border border-silver/30 p-4 sm:p-5 lg:p-6 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.95),inset_0_1px_0_rgb(255_255_255/0.14)] "
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
            <GymVectors />

            <form
              noValidate
              onSubmit={onSubmit}
              aria-label={b.formLabel}
              className="relative space-y-2 lg:space-y-3"
            >
              <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-3 [&>div]:min-w-0">
                <div className="col-span-2 sm:col-span-1">
                  {units === "metric" ? (
                    <Field
                      id={`${uid}-cm`}
                      label={b.height}
                      unit={b.unitCm}
                      value={fields.cm}
                      onChange={set("cm")}
                      error={!!errors.height}
                      describedBy={described("height")}
                    />
                  ) : (
                    <fieldset aria-describedby={described("height")}>
                      <legend className={LABEL}>{b.height}</legend>
                      <div className="mt-1 flex gap-1.5">
                        <Field
                          id={`${uid}-ft`}
                          label={`${b.height} (${b.unitFt})`}
                          unit={b.unitFt}
                          value={fields.ft}
                          onChange={set("ft")}
                          error={!!errors.height}
                          inputMode="numeric"
                          hideLabel
                        />
                        <Field
                          id={`${uid}-in`}
                          label={`${b.height} (${b.unitIn})`}
                          unit={b.unitIn}
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
                    unit={b.unitYrs}
                    inputMode="numeric"
                    value={fields.age}
                    onChange={(v) =>
                      set("age")(v.replace(/[^\d]/g, "").slice(0, 3))
                    }
                    error={!!errors.age}
                    describedBy={described("age")}
                  />
                  {errorLine("age")}
                </div>
              </div>

              <div className="grid gap-x-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div>
                  <RadioChips
                    name={`${uid}-sex`}
                    legend={b.sex}
                    options={[
                      { value: "male", label: b.male },
                      { value: "female", label: b.female },
                    ]}
                    value={sex}
                    onChange={(v) => {
                      setSex(v);
                      setErrors((e) => ({ ...e, sex: undefined }));
                    }}
                    error={!!errors.sex}
                    describedBy={described("sex")}
                    firstId={`${uid}-sex`}
                    columns="grid-cols-2"
                  />
                  {errorLine("sex")}
                </div>
                <div>
                  <RadioChips
                    name={`${uid}-activity`}
                    legend={b.activity}
                    options={ACTIVITIES.map((a) => ({
                      value: a,
                      label: b.activities[a],
                    }))}
                    value={activity}
                    onChange={(v) => {
                      setActivity(v);
                      setErrors((e) => ({ ...e, activity: undefined }));
                    }}
                    error={!!errors.activity}
                    describedBy={described("activity")}
                    firstId={`${uid}-activity`}
                    columns="grid-cols-3"
                  />
                  {errorLine("activity")}
                </div>
              </div>

              {/* Goals — optional multi-select; "Not sure yet" is exclusive */}
              <fieldset>
                <legend className={LABEL}>
                  {b.goals}{" "}
                  <span className="font-sans text-[0.8rem] font-medium normal-case tracking-normal text-silver">
                    {b.optional}
                  </span>
                </legend>
                <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {GOALS.map((g) => {
                    const on = goals.includes(g);
                    return (
                      <label
                        key={g}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 border px-3 text-[0.9rem] font-semibold leading-tight transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
                          on
                            ? "border-ember bg-[#2e1a0c] text-bone"
                            : "border-silver/20 bg-[#0b0d0e] text-bone/85 hover:border-silver/45 hover:text-bone"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setGoals((gs) => toggleGoal(gs, g))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={`flex size-4 shrink-0 items-center justify-center border ${on ? "border-ember bg-ember" : "border-bone/35"}`}
                        >
                          {on && (
                            <Check
                              className="size-3 text-ink"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                        {t.goals[g]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="pt-2.5">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  icon={false}
                  data-fab-avoid
                >
                  {b.calculate}
                </Button>
              </div>
            </form>

            {/* Result — revealed after a valid calculation; never gated (§3.5) */}
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence initial={false}>
                {result && (
                  <motion.div
                    key="result"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 border-t border-silver/15 pt-5">
                      <p className="font-display text-[1.05rem] font-bold uppercase tracking-[0.12em] text-ember">
                        {b.yourBmi}
                      </p>
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                        <span
                          className="display text-[3.5rem] leading-none sm:text-[4rem]"
                          style={{ color: toneColor }}
                        >
                          <CountUp
                            key={`${result.bmi}-${result.age}`}
                            value={result.bmi}
                          />
                        </span>
                        <span
                          className="font-display text-[1.6rem] font-bold uppercase tracking-[0.04em]"
                          style={{ color: toneColor }}
                        >
                          {b.categories[result.tone]}
                        </span>
                      </p>

                      {/* WHO scale: yellow <18.5 · green 18.5–<25 · orange 25–<30 · red 30+ */}
                      <div className="mt-3" aria-hidden dir="ltr">
                        <div className="relative flex h-1.5 gap-1">
                          {BMI_BANDS.map((band) => (
                            <span
                              key={band.tone}
                              className="h-full"
                              style={{
                                flex: band.to - band.from,
                                background: BMI_TONE_COLOR[band.tone],
                                opacity: band.tone === result.tone ? 1 : 0.3,
                              }}
                            />
                          ))}
                          <motion.span
                            className="absolute -top-1.5 h-[18px] w-1 -translate-x-1/2 bg-bone shadow-[0_0_0_2px_rgba(5,5,5,0.6)]"
                            initial={{
                              left: reduce
                                ? `${bmiScalePosition(result.bmi) * 100}%`
                                : "0%",
                            }}
                            animate={{
                              left: `${bmiScalePosition(result.bmi) * 100}%`,
                            }}
                            transition={{ duration: 1.1, ease: EASE }}
                          />
                        </div>
                        <div className="relative mt-1.5 h-4 text-[0.75rem] font-medium tabular-nums text-bone/70">
                          {BMI_BANDS.slice(1).map((band) => (
                            <span
                              key={band.tone}
                              className="absolute -translate-x-1/2"
                              style={{
                                left: `${bmiScalePosition(band.from) * 100}%`,
                              }}
                            >
                              {fmt(
                                band.from,
                                Number.isInteger(band.from) ? 0 : 1,
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="border border-silver/15 bg-ink/40 p-3">
                          <dt className="text-[0.85rem] text-silver">
                            {b.healthyRange}
                          </dt>
                          <dd
                            className="mt-0.5 font-display text-[1.6rem] font-bold text-bone"
                            dir="ltr"
                          >
                            {result.range.min}–{result.range.max}{" "}
                            {result.units === "metric" ? b.unitKg : b.unitLb}
                          </dd>
                        </div>
                        <div className="border border-silver/15 bg-ink/40 p-3">
                          <dt className="text-[0.85rem] text-silver">
                            {b.maintenance}
                          </dt>
                          <dd
                            className="mt-0.5 font-display text-[1.6rem] font-bold text-bone"
                            dir="ltr"
                          >
                            ~{result.kcal.toLocaleString("en")} {b.kcal}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-4 text-base leading-relaxed text-bone/90">
                        {b.explain}
                        {result.goals.length > 0
                          ? `: ${goalLabels(result.goals).join(" & ")}.`
                          : "."}
                      </p>

                      {embedded ? (
                        <div className="mt-4">
                          <Button
                            type="button"
                            className="w-full sm:w-auto"
                            data-fab-avoid
                            onClick={embedded.onContinue}
                          >
                            {embedded.continueLabel}
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <ButtonLink
                            href={whatsappLink(waMessage)}
                            data-track="bmi_whatsapp"
                            data-category={result.tone}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={
                              <WhatsAppGlyph
                                className="size-5"
                                color="#050505"
                                handset="#FF6A00"
                              />
                            }
                            className="w-full sm:w-auto"
                            data-fab-avoid
                          >
                            {b.sendResult}
                          </ButtonLink>
                          <Button
                            variant="ghost"
                            className="w-full bg-[#1b1d20]! backdrop-blur-none sm:w-auto"
                            data-fab-avoid

                            onClick={() => {
                              track("bmi_to_form");
                              startApplication({
                                age: String(result.age),
                                ...(sex ? { sex } : {}),
                                goals: result.goals,
                                bmi: fmt(result.bmi),
                              });
                            }}
                          >
                            {b.book}
                          </Button>
                        </div>
                      )}

                      <p className="mt-4 text-[0.85rem] text-silver">
                        {b.disclaimer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </Outer>
  );
}
