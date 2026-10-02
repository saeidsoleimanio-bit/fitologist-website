/**
 * Free Body Check — calculations (FITOLOGIST_SPEC.md §3.3).
 * Pure functions, metric internally; imperial input is converted before validation.
 */

export type UnitSystem = "metric" | "imperial";
export type Sex = "male" | "female";
export type Activity = "sitting" | "light" | "very";
export type BmiTone = "under" | "healthy" | "over" | "obese";

export const ACTIVITIES: readonly Activity[] = ["sitting", "light", "very"];

/** Mifflin-St Jeor activity factors. */
export const ACTIVITY_FACTOR: Record<Activity, number> = { sitting: 1.2, light: 1.375, very: 1.55 };

export const LIMITS = {
  heightCm: { min: 120, max: 230 },
  weightKg: { min: 35, max: 250 },
  age: { min: 18, max: 80 },
} as const;

export const BMI_TONE_COLOR: Record<BmiTone, string> = {
  under: "var(--color-bmi-under)",
  healthy: "var(--color-bmi-healthy)",
  over: "var(--color-bmi-over)",
  obese: "var(--color-bmi-obese)",
};

/** Visual scale used for the result bar. */
export const BMI_SCALE = { min: 15, max: 40 } as const;

export const BMI_BANDS = [
  { tone: "under", from: BMI_SCALE.min, to: 18.5 },
  { tone: "healthy", from: 18.5, to: 25 },
  { tone: "over", from: 25, to: 30 },
  { tone: "obese", from: 30, to: BMI_SCALE.max },
] as const;

/** Parses user input, accepting a comma as decimal separator. NaN when not a clean number. */
export function parseNumber(value: string): number {
  const normalised = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalised)) return Number.NaN;
  return Number(normalised);
}

export const inToCm = (inches: number) => inches * 2.54;
export const lbToKg = (lb: number) => lb * 0.45359237;
export const kgToLb = (kg: number) => kg / 0.45359237;

/** BMI = kg / m², one decimal. */
export function calculateBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

/** WHO adult categories (on the rounded value). */
export function bmiCategory(bmi: number): BmiTone {
  if (bmi < 18.5) return "under";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "over";
  return "obese";
}

/** Healthy weight range for a height: 18.5·m² – 24.9·m², whole kg (or lb). */
export function healthyRange(heightCm: number, units: UnitSystem): { min: number; max: number } {
  const m2 = (heightCm / 100) ** 2;
  const lo = 18.5 * m2;
  const hi = 24.9 * m2;
  return units === "metric"
    ? { min: Math.round(lo), max: Math.round(hi) }
    : { min: Math.round(kgToLb(lo)), max: Math.round(kgToLb(hi)) };
}

/** Maintenance calories: Mifflin-St Jeor BMR × activity factor, rounded to the nearest 50. */
export function maintenanceCalories(sex: Sex, weightKg: number, heightCm: number, age: number, activity: Activity): number {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  return Math.round((bmr * ACTIVITY_FACTOR[activity]) / 50) * 50;
}

/** Position (0–1) of a BMI value on the visual scale, clamped. */
export function bmiScalePosition(bmi: number): number {
  const p = (bmi - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min);
  return Math.min(1, Math.max(0, p));
}
