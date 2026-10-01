import type { Dictionary } from "./i18n/dictionaries/en";
import { COACHING_TYPES, GOALS, type CoachingType, type Goal } from "./site";

export type ApplicationData = {
  name: string;
  age: string;
  whatsapp: string;
  goal: Goal | "";
  coaching: CoachingType | "";
  note: string;
};

export type ApplicationErrors = Partial<Record<keyof ApplicationData, string>>;

export const NOTE_MAX = 500;

export const EMPTY_APPLICATION: ApplicationData = {
  name: "",
  age: "",
  whatsapp: "",
  goal: "",
  coaching: "",
  note: "",
};

/** Field order used to focus the first invalid field. */
export const FIELD_ORDER: (keyof ApplicationData)[] = [
  "name",
  "age",
  "whatsapp",
  "goal",
  "coaching",
  "note",
];

export function validateApplication(
  data: ApplicationData,
  msg: Dictionary["form"]["errors"],
): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const name = data.name.trim();
  if (name.length < 2) errors.name = msg.nameRequired;
  else if (name.length > 60) errors.name = msg.nameLong;

  const age = Number(data.age.trim());
  if (!data.age.trim()) errors.age = msg.ageRequired;
  else if (!Number.isInteger(age) || age < 16 || age > 99) errors.age = msg.ageRange;

  const phone = data.whatsapp.trim();
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.whatsapp = msg.phoneRequired;
  else if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 8 || digits.length > 15)
    errors.whatsapp = msg.phoneInvalid;

  if (!GOALS.includes(data.goal as Goal)) errors.goal = msg.goalRequired;
  if (!COACHING_TYPES.includes(data.coaching as CoachingType)) errors.coaching = msg.coachingRequired;

  if (data.note.length > NOTE_MAX) errors.note = msg.noteLong;

  return errors;
}

/**
 * Pre-filled WhatsApp message, written in the visitor's language. Plain text only; the whole
 * string is passed through encodeURIComponent by whatsappLink(), so spaces, line breaks, "&",
 * "#", "?", emoji and other user input cannot break the URL.
 */
export function applicationMessage(data: ApplicationData, t: Dictionary): string {
  const m = t.form.message;
  const clean = (v: string) => v.replace(/\s+/g, " ").trim();
  const goal = data.goal ? t.goals[data.goal].label : "";
  const coaching = data.coaching ? t.coaching.options[data.coaching].title : "";
  const lines = [
    m.greeting,
    "",
    m.intro,
    "",
    `${m.name}: ${clean(data.name)}`,
    `${m.age}: ${clean(data.age)}`,
    `${m.goal}: ${goal}`,
    `${m.coaching}: ${coaching}`,
  ];
  const note = data.note.trim();
  if (note) lines.push("", note);
  lines.push("", m.thanks);
  return lines.join("\n");
}

export type SubmitResult = {
  /** true only when an endpoint is configured and accepted the application. */
  delivered: boolean;
};

/**
 * Form submission boundary.
 *
 * V1 has no backend. If NEXT_PUBLIC_APPLICATION_ENDPOINT is configured, the
 * application is POSTed there as JSON. Otherwise nothing is sent anywhere and
 * the UI asks the applicant to continue on WhatsApp — we never claim remote
 * storage that did not happen.
 */
export async function submitApplication(data: ApplicationData): Promise<SubmitResult> {
  const endpoint = process.env.NEXT_PUBLIC_APPLICATION_ENDPOINT;
  if (!endpoint) return { delivered: false };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...data, source: "fitologist.me", submittedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Application endpoint responded ${res.status}`);
  return { delivered: true };
}
