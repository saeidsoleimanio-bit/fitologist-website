import { site } from "@/config/site";

export const SITE = {
  name: site.brand,
  url: "https://fitologist.me",
  location: "Dubai, UAE",
  tagline: ["Train", "Transform", "Transcend"] as const,
};

export const WHATSAPP = {
  display: site.whatsappDisplay,
  e164: `+${site.whatsappNumber}`,
  number: site.whatsappNumber,
};

export const INSTAGRAM = {
  handle: site.instagramHandle,
  url: site.instagramUrl,
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Site navigation, in the spec's order (§2.1). Labels come from the dictionary (`nav.<key>`).
 * Interim target until the new page exists: Training Plans → /coaching (becomes /plans in Phase 3).
 */
export const NAV_ITEMS = [
  { key: "home", path: "/" },
  { key: "method", path: "/method" },
  { key: "plans", path: "/coaching" },
  { key: "about", path: "/about" },
  { key: "bmi", path: "/bmi" },
] as const;

export const BMI_PATH = "/#bmi";
/** Primary CTA target — the form (#start). Interim: the form lives on /coaching until Phase 3. */
export const START_ID = "start";
export const START_PATH = `/coaching#${START_ID}`;

/** Coaching keys — labels live in the dictionary (`coaching.options.<key>`). */
export const COACHING_TYPES = ["personal", "online", "hybrid"] as const;
export type CoachingType = (typeof COACHING_TYPES)[number];

/**
 * Coach credentials — exact supplied logo files, never resized out of ratio.
 * One integrated Active IQ qualification (the Level 3 Diploma covers gym instructing) + REPs UAE.
 * Descriptive lines are translated in the dictionary (`about.credentials.<key>`).
 * Rendered only when enabled in `config/site.ts` (`credentials.*.show`).
 */
const ALL_CREDENTIALS = [
  {
    key: "aiq",
    org: "Active IQ",
    logo: { src: "/images/credentials/aiqLogo.png", width: 786, height: 180, alt: "Active IQ" },
    show: site.credentials.activeIq.show,
  },
  {
    key: "reps",
    org: "REPs UAE",
    logo: { src: "/images/credentials/REPs-logo.webp", width: 261, height: 141, alt: "REPs UAE" },
    show: site.credentials.reps.show,
  },
] as const;

export const CREDENTIALS = ALL_CREDENTIALS.filter((c) => c.show);

export const COACH_NAME = site.coachName;
