export type UnitSystem = "metric" | "imperial";

export type Gender = "male" | "female";

export type BmiTone = "under" | "healthy" | "over" | "obese";


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
 * Gender is recorded as part of the starting profile; it does not change adult BMI.
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
  { tone: "under", from: BMI_SCALE.min, to: 18.5 },
  { tone: "healthy", from: 18.5, to: 25 },
  { tone: "over", from: 25, to: 30 },
  { tone: "obese", from: 30, to: BMI_SCALE.max },
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

/** Adult category for a (rounded) BMI. BMI = kg / m², identical for men and women. Labels/ranges are translated. */
export function bmiCategory(bmi: number): BmiTone {
  if (bmi < 18.5) return "under";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "over";
  return "obese";
}

/** Position (0–1) of a BMI value on the visual scale, clamped. */
export function bmiScalePosition(bmi: number): number {
  const p = (bmi - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min);
  return Math.min(1, Math.max(0, p));
}

export const inToCm = (inches: number) => inches * 2.54;
export const lbToKg = (lb: number) => lb * 0.45359237;
