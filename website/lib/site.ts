export const SITE = {
  name: "FITologist.me",
  url: "https://fitologist.me",
  title: "FITologist.me | Personal Training in Dubai",
  description:
    "Personal training in Dubai with Saeid. 1:1 personal training, online coaching and hybrid coaching — structured programs, accountability and coaching built around you.",
  location: "Dubai, UAE",
  tagline: ["Train", "Transform", "Transcend"] as const,
};

export const WHATSAPP = {
  display: "+971 50 646 1816",
  e164: "+971506461816",
  number: "971506461816",
};

export const INSTAGRAM = {
  handle: "fitologist.me",
  url: "https://instagram.com/fitologist.me",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Site navigation. Labels come from the dictionary (`nav.<key>`); paths are locale-independent. */
export const NAV_ITEMS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "method", path: "/method" },
  { key: "coaching", path: "/coaching" },
] as const;

export const BMI_PATH = "/#bmi";
export const START_PATH = "/coaching#start-training";

/** Goal keys — labels live in the dictionary (`goals.<key>`). */
export const GOALS = ["muscle", "fat", "strength", "mobility", "confidence", "unsure"] as const;
export type Goal = (typeof GOALS)[number];

/** Coaching keys — labels live in the dictionary (`coaching.options.<key>`). */
export const COACHING_TYPES = ["personal", "online", "hybrid"] as const;
export type CoachingType = (typeof COACHING_TYPES)[number];

/**
 * Coach credentials — exact supplied logo files, never resized out of ratio.
 * One integrated Active IQ qualification (the Level 3 Diploma covers gym instructing) + REPs UAE.
 * Descriptive lines are translated in the dictionary (`about.credentials.<key>`).
 */
export const CREDENTIALS = [
  {
    key: "aiq",
    org: "Active IQ",
    logo: { src: "/images/credentials/aiqLogo.png", width: 786, height: 180, alt: "Active IQ" },
  },
  {
    key: "reps",
    org: "REPs UAE",
    logo: { src: "/images/credentials/REPs-logo.webp", width: 261, height: 141, alt: "REPs UAE" },
  },
] as const;

export const COACH_NAME = "Saeid Soleimani";
