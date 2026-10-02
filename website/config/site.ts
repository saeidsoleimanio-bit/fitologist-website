/**
 * Central business configuration — the single source for every business value on the site
 * (FITOLOGIST_SPEC.md §1). Empty values mean "not provided": the related UI must not render.
 * Secrets (bot tokens, webhook URLs) are environment variables, never stored here.
 */

export type Testimonial = { name: string; text: string; goal: string; photo?: string };

export const site = {
  brand: "FITologist.me",
  coachName: "Saeid Soleimani",
  whatsappNumber: "971506461816", // wa.me format, no +
  whatsappDisplay: "+971 50 646 1816",
  instagramHandle: "fitologist.me",
  instagramUrl: "https://instagram.com/fitologist.me",
  contactEmail: "", // {{CONTACT_EMAIL}} — optional
  serviceArea: "Al Jaddaf & nearby",
  homeSessions: true,
  sessionLengthMin: 60,
  consultationMin: 30,
  progressCheckWeeks: 4,
  replyWithinHours: 24,
  languagesSpoken: ["English", "فارسی", "Türkçe", "Azərbaycanca"],

  credentials: {
    // {{ACTIVEIQ}} — set show: true once issued
    activeIq: { show: false, title: "Level 3 Diploma in Gym Instructing & Personal Training" },
    // {{REPS_NO}}
    reps: { show: false, category: "Category A Personal Trainer", number: "" },
  },

  stats: { yearsTraining: 5, yearsCorporate: 12 },

  testimonials: [] as Testimonial[], // {{TESTIMONIALS}}
  photos: {
    // {{REAL_PHOTOS}} — paths; empty = section hidden or fallback
    hero: "/images/hero-desktop.webp",
    about: "/images/about-portrait.webp",
    gallery: [] as string[], // real, non-composite photos only
    avatar: "", // crop of hero portrait — supplied later
  },
  homeEquipmentNote: "", // {{EQUIPMENT_NOTE}} e.g. "I bring the equipment we need."

  analytics: { ga4Id: "", metaPixelId: "" }, // {{GA4_ID}} {{PIXEL_ID}} — load scripts only if set
};

/** True when at least one credential is published (drives "Certified" wording). */
export const hasAnyCredential = site.credentials.activeIq.show || site.credentials.reps.show;
