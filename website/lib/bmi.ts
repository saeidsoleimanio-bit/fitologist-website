export type UnitSystem = "metric" | "imperial";

export type Sex = "male" | "female";

export type BmiTone = "under" | "healthy" | "over" | "obese";

export type BmiCategory = {
  label: "Underweight" | "Healthy weight" | "Overweight" | "Obesity";
  range: string;
  tone: BmiTone;
};

/** CSS colour per category (tokens defined in globals.css). */
export const BMI_TONE_COLOR: Record<BmiTone, string> = {
  under: "var(--color-bmi-under)",
  healthy: "var(--color-bmi-healthy)",
  over: "var(--color-bmi-over)",
  obese: "var(--color-bmi-obese)",
};

/**
 * Standard adult categories only apply from 18. Children/teens need age- and
 * sex-specific percentiles, so the calculator is restricted to adults.
 * Sex is recorded as part of the starting profile; it does not change adult BMI.
 */
export const AGE_LIMITS = { min: 18, max: 100 } as const;

export const BMI_LIMITS = {
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 25, max: 350 },
  heightIn: { min: 39, max: 98 }, // 3'3" – 8'2"
  weightLb: { min: 55, max: 770 },
} as const;

/** Visual scale used for the result bar. */
export const BMI_SCALE = { min: 15, max: 40 } as const;

export const BMI_BANDS = [
  { label: "Underweight", tone: "under", from: BMI_SCALE.min, to: 18.5 },
  { label: "Healthy weight", tone: "healthy", from: 18.5, to: 25 },
  { label: "Overweight", tone: "over", from: 25, to: 30 },
  { label: "Obesity", tone: "obese", from: 30, to: BMI_SCALE.max },
] as const;

/** Parses user input, accepting a comma as decimal separator. Returns NaN when not a clean number. */
export function parseNumber(value: string): number {
  const normalised = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalised)) return Number.NaN;
  return Number(normalised);
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/** BMI = kg / m². Identical for men and women. */
export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return { label: "Underweight", range: "Below 18.5", tone: "under" };
  if (bmi < 25) return { label: "Healthy weight", range: "18.5 – 24.9", tone: "healthy" };
  if (bmi < 30) return { label: "Overweight", range: "25 – 29.9", tone: "over" };
  return { label: "Obesity", range: "30 and above", tone: "obese" };
}

/** Position (0–1) of a BMI value on the visual scale, clamped. */
export function bmiScalePosition(bmi: number): number {
  const p = (bmi - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min);
  return Math.min(1, Math.max(0, p));
}

export const inToCm = (inches: number) => inches * 2.54;
export const lbToKg = (lb: number) => lb * 0.45359237;
