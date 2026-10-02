/**
 * Lead form model — shared by the browser form and the /api/lead serverless function
 * (FITOLOGIST_SPEC.md §6). Pure TypeScript: no browser or Node APIs.
 */

/** Goal chips, in spec order (§3.2 / §6.2). "unsure" is exclusive. */
export const GOALS = ["fat", "muscle", "strength", "mobility", "confidence", "unsure"] as const;
export type Goal = (typeof GOALS)[number];

export const TRAINING_TYPES = ["1to1", "partner", "online", "hybrid", "unsure"] as const;
export type TrainingType = (typeof TRAINING_TYPES)[number];

export const FREQUENCIES = ["1", "2", "3", "4", "unsure"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

/** Optional "Sex" on the form (prefilled from the Body Check). */
export const SEXES = ["male", "female"] as const;
export type Sex = (typeof SEXES)[number];

export const TIMES = ["mornings", "evenings", "weekends"] as const;
export type Time = (typeof TIMES)[number];

/** "How often" and "Your area" only apply to in-person formats. */
export const IN_PERSON_TYPES: readonly TrainingType[] = ["1to1", "partner", "hybrid"];

/** Country codes for the WhatsApp number (default +971). */
export const COUNTRY_CODES = [
  { code: "971", label: "UAE" },
  { code: "966", label: "KSA" },
  { code: "974", label: "Qatar" },
  { code: "973", label: "Bahrain" },
  { code: "968", label: "Oman" },
  { code: "965", label: "Kuwait" },
  { code: "98", label: "Iran" },
  { code: "90", label: "Türkiye" },
  { code: "994", label: "Azerbaijan" },
  { code: "44", label: "UK" },
  { code: "1", label: "US / Canada" },
  { code: "91", label: "India" },
  { code: "92", label: "Pakistan" },
  { code: "20", label: "Egypt" },
  { code: "49", label: "Germany" },
  { code: "33", label: "France" },
  { code: "7", label: "Russia / Kazakhstan" },
] as const;

export const LIMITS = {
  name: { min: 2, max: 60 },
  age: { min: 18, max: 80 },
  phoneDigits: { min: 7, max: 15 },
  area: 80,
  notes: 500,
} as const;

export type LeadInput = {
  name: string;
  countryCode: string;
  phone: string;
  age: string;
  sex: Sex | "";
  goals: Goal[];
  type: TrainingType | "";
  frequency: Frequency | "";
  area: string;
  times: Time[];
  notes: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  company: string;
};

export const EMPTY_LEAD: LeadInput = {
  name: "",
  countryCode: "971",
  phone: "",
  age: "",
  sex: "",
  goals: [],
  type: "",
  frequency: "",
  area: "",
  times: [],
  notes: "",
  consent: false,
  company: "",
};

export type LeadField = "name" | "phone" | "age" | "goals" | "type" | "notes" | "consent";
export type LeadErrors = Partial<Record<LeadField, string>>;
export type LeadErrorMessages = Record<
  "name" | "phone" | "age" | "goals" | "type" | "notes" | "consent",
  string
>;

/** Field order used to focus the first invalid field. */
export const FIELD_ORDER: LeadField[] = ["name", "phone", "age", "goals", "type", "notes", "consent"];

export const isInPerson = (type: string) => (IN_PERSON_TYPES as readonly string[]).includes(type);

/** Full international number, digits only (country code + local number, leading 0 dropped). */
export function fullNumber(countryCode: string, phone: string): string {
  const local = phone.replace(/\D/g, "").replace(/^0+/, "");
  return `${countryCode.replace(/\D/g, "")}${local}`;
}

/** Applies the "Not sure yet" exclusivity rule when a goal chip is toggled. */
export function toggleGoal(goals: Goal[], goal: Goal): Goal[] {
  if (goals.includes(goal)) return goals.filter((g) => g !== goal);
  if (goal === "unsure") return ["unsure"];
  return [...goals.filter((g) => g !== "unsure"), goal];
}

/** Same rules in the browser and on the server. Messages are passed in (localized). */
export function validateLead(d: LeadInput, msg: LeadErrorMessages): LeadErrors {
  const e: LeadErrors = {};
  const name = d.name.trim();
  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) e.name = msg.name;

  const digits = fullNumber(d.countryCode, d.phone);
  const localDigits = d.phone.replace(/\D/g, "").replace(/^0+/, "");
  if (
    !/^[\d\s()+-]*$/.test(d.phone) ||
    localDigits.length < 6 ||
    digits.length < LIMITS.phoneDigits.min ||
    digits.length > LIMITS.phoneDigits.max ||
    !COUNTRY_CODES.some((c) => c.code === d.countryCode)
  )
    e.phone = msg.phone;

  const age = Number(d.age.trim());
  if (!/^\d+$/.test(d.age.trim()) || age < LIMITS.age.min || age > LIMITS.age.max) e.age = msg.age;

  if (d.goals.length === 0 || d.goals.some((g) => !GOALS.includes(g))) e.goals = msg.goals;
  if (!TRAINING_TYPES.includes(d.type as TrainingType)) e.type = msg.type;
  if (d.notes.length > LIMITS.notes) e.notes = msg.notes;
  if (!d.consent) e.consent = msg.consent;
  return e;
}

/** Normalises and length-limits untrusted input (used by the API before validation). */
export function sanitizeLead(raw: unknown): LeadInput {
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const list = <T extends string>(v: unknown, allowed: readonly T[]) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is T => (allowed as readonly string[]).includes(x as string)))] : [];
  const one = <T extends string>(v: unknown, allowed: readonly T[]): T | "" =>
    typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : "";
  return {
    name: str(r.name, 80),
    countryCode: str(r.countryCode, 4),
    phone: str(r.phone, 24),
    age: str(r.age, 3),
    sex: one(r.sex, SEXES),
    goals: list(r.goals, GOALS),
    type: one(r.type, TRAINING_TYPES),
    frequency: one(r.frequency, FREQUENCIES),
    area: str(r.area, LIMITS.area),
    times: list(r.times, TIMES),
    notes: str(r.notes, LIMITS.notes + 20),
    consent: r.consent === true,
    company: str(r.company, 100),
  };
}

/** Labels needed to write messages in the visitor's language. */
export type LeadLabels = {
  goals: Record<Goal, string>;
  sexes: Record<Sex, string>;
  types: Record<TrainingType, string>;
  frequencies: Record<Frequency, string>;
  times: Record<Time, string>;
  message: {
    intro: string;
    name: string;
    age: string;
    sex: string;
    goals: string;
    type: string;
    frequency: string;
    area: string;
    times: string;
    notes: string;
    footer: string;
  };
};

/** WhatsApp message for the form (§6.3). Empty lines are omitted. */
export function leadMessage(d: LeadInput, l: LeadLabels): string {
  const clean = (v: string) => v.replace(/\s+/g, " ").trim();
  const m = l.message;
  const inPerson = isInPerson(d.type);
  const lines: (string | false)[] = [
    m.intro,
    `${m.name}: ${clean(d.name)}`,
    `${m.age}: ${clean(d.age)}`,
    d.sex !== "" && `${m.sex}: ${l.sexes[d.sex]}`,
    d.goals.length > 0 && `${m.goals}: ${d.goals.map((g) => l.goals[g]).join(", ")}`,
    d.type !== "" && `${m.type}: ${l.types[d.type]}`,
    inPerson && d.frequency !== "" && `${m.frequency}: ${l.frequencies[d.frequency]}`,
    inPerson && clean(d.area) !== "" && `${m.area}: ${clean(d.area)}`,
    d.times.length > 0 && `${m.times}: ${d.times.map((t) => l.times[t]).join(", ")}`,
    d.notes.trim() !== "" && `${m.notes}: ${d.notes.trim()}`,
    m.footer,
  ];
  return lines.filter((x): x is string => typeof x === "string").join("\n");
}

/** Context sent with the lead (never typed by the visitor). */
export type LeadMeta = {
  language: string;
  source: string;
  bmi: string;
  utm_source: string;
  utm_campaign: string;
};
