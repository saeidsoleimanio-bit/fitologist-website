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
  /** Promise shown next to the lead form and in the success message (owner revision). */
  replyPromise: "within a few hours",
  /** Client support response time (Plans → "WhatsApp support") — unchanged. */
  supportReplyHours: 24,
  languagesSpoken: ["English", "فارسی", "Azərbaycanca"],

  credentials: {
    // {{ACTIVEIQ}} — set show: true once issued
    activeIq: { show: true, title: "Level 3 Diploma in Gym Instructing & Personal Training" },
    // {{REPS_NO}}
    reps: { show: true, category: "", number: "" }, // category optional (e.g. a REPs category) — shown in the card subline when set
  },

  stats: { yearsTraining: 5, yearsCorporate: 12 },

  testimonials: [] as Testimonial[], // {{TESTIMONIALS}}
  photos: {
    // {{REAL_PHOTOS}} — paths; empty = section hidden or fallback
    hero: "/images/hero-desktop.webp",
    about: "/images/about-portrait.webp",
    gallery: [] as string[], // real, non-composite photos only
    avatar: "/images/avatar.webp", // face crop of the hero portrait (scripts/optimize-images.mjs) — currently unused
    /** Home "Meet Saeid": head-and-shoulders cut-out of photo 05 on a transparent background (rembg). */
    meetCutout: "/images/meet-saeid-cutout.webp",
  },
  homeEquipmentNote: "", // {{EQUIPMENT_NOTE}} e.g. "I bring the equipment we need."

  analytics: { ga4Id: "", metaPixelId: "" }, // {{GA4_ID}} {{PIXEL_ID}} — load scripts only if set
};

/** "Certified" wording (Home H1/title, About subtitle) comes only from the Active IQ certificate — never from REPs, which is a registration. */
export const isCertified = site.credentials.activeIq.show;
