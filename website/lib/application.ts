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

export function validateApplication(data: ApplicationData): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const name = data.name.trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 60) errors.name = "Please keep your name under 60 characters.";

  const age = Number(data.age.trim());
  if (!data.age.trim()) errors.age = "Please enter your age.";
  else if (!Number.isInteger(age) || age < 16 || age > 99)
    errors.age = "Please enter an age between 16 and 99.";

  const phone = data.whatsapp.trim();
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.whatsapp = "Please enter your WhatsApp number.";
  else if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 8 || digits.length > 15)
    errors.whatsapp = "Please enter a valid number, including country code (e.g. +971 50 000 0000).";

  if (!GOALS.includes(data.goal as Goal)) errors.goal = "Please choose your main goal.";
  if (!COACHING_TYPES.includes(data.coaching as CoachingType))
    errors.coaching = "Please choose a coaching type.";

  if (data.note.length > NOTE_MAX) errors.note = `Please keep your note under ${NOTE_MAX} characters.`;

  return errors;
}

/**
 * Pre-filled WhatsApp message. Plain text only; the whole string is passed through
 * encodeURIComponent by whatsappLink(), so spaces, line breaks, "&", "#", "?", emoji
 * and other user input cannot break the URL.
 */
export function applicationMessage(data: ApplicationData): string {
  const clean = (v: string) => v.replace(/\s+/g, " ").trim();
  const lines = [
    "Hi Saeid,",
    "",
    "I'd like to start training.",
    "",
    `Name: ${clean(data.name)}`,
    `Age: ${clean(data.age)}`,
    `Goal: ${data.goal}`,
    `Coaching Type: ${data.coaching}`,
  ];
  const note = data.note.trim();
  if (note) lines.push("", note);
  lines.push("", "Thank you.");
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
