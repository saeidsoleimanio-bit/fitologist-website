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

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Saeid, I found FITologist.me and I'd like to start training.";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "coaching", label: "Coaching" },
  { id: "method", label: "Method" },
] as const;

export const CTA_SECTION = { id: "start-training", label: "Start Training" } as const;
export const BMI_SECTION = { id: "bmi", label: "BMI Calculator" } as const;

export const GOALS = ["Build Muscle", "Lose Fat", "Get Stronger", "General Fitness"] as const;
export type Goal = (typeof GOALS)[number];

export const COACHING_TYPES = [
  "1:1 Personal Training",
  "Online Coaching",
  "Hybrid Coaching",
] as const;
export type CoachingType = (typeof COACHING_TYPES)[number];

/** Coach profile — supplied by Saeid. Facts unchanged; grouped for display. */
export const COACH = {
  name: "Saeid Soleimani",
  /**
   * One integrated Active IQ qualification (the Level 3 Diploma covers gym instructing),
   * plus REPs UAE registration. Logos are the exact supplied files, never resized out of ratio.
   */
  credentials: [
    {
      org: "Active IQ",
      label: "ACTIVE IQ",
      logo: { src: "/images/credentials/aiqLogo.png", width: 786, height: 180, alt: "Active IQ logo" },
      lines: ["Level 3 Diploma", "Gym Instructing & Personal Training"],
      fullTitle: "Active IQ Level 3 Diploma in Gym Instructing and Personal Training",
    },
    {
      org: "REPs UAE",
      label: "REPs UAE",
      logo: { src: "/images/credentials/REPs-logo.webp", width: 261, height: 141, alt: "REPs UAE logo" },
      lines: ["Category A Personal Trainer"],
      fullTitle: "REPs UAE — Category A Personal Trainer",
    },
  ],
  education: [
    "BA in English Literature",
    "5+ Years Teaching English as a Second Language",
    "12+ Years in Business Development",
    "2+ Years in Fitness",
  ],
  languages: ["English", "Persian", "Azerbaijani", "Turkish"],
} as const;
