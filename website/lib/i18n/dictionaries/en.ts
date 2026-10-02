/**
 * English dictionary — the source of truth for the dictionary shape.
 * `ar.ts` and `ru.ts` must satisfy `Dictionary`, so a missing key fails the build.
 * Brand names (FITologist, Saeid Soleimani, Active IQ, REPs UAE) are never translated.
 */
const en = {
  meta: {
    siteTitle: "FITologist.me | Personal Training in Dubai",
    siteDescription:
      "Personal training in Dubai with Saeid Soleimani. 1:1 personal training, online and hybrid coaching — structured programs, accountability and coaching built around you.",
    about: {
      title: "Meet Your Coach — Saeid Soleimani | FITologist.me",
      description:
        "Meet Saeid Soleimani, a personal trainer in Dubai coaching busy professionals 1:1, online and hybrid.",
    },
    method: {
      title: "The FITologist Method | FITologist.me",
      description:
        "Assess, Build, Transform, Transcend — the FITologist signature coaching method by Saeid Soleimani in Dubai.",
    },
    coaching: {
      title: "Coaching — 1:1, Online & Hybrid | FITologist.me",
      description:
        "Choose how you train with Saeid: 1:1 personal training in Dubai, online coaching or hybrid coaching. Apply in a minute.",
    },
    bmi: {
      title: "Free BMI & Calorie Check | FITologist.me",
      description:
        "A free 30-second body check: your BMI, a healthy weight range for your height and your estimated daily calories.",
    },
    start: {
      title: "Book a Free Consultation | FITologist.me",
      description:
        "Book a free 30-minute consultation with Saeid Soleimani, personal trainer in Dubai. Online or in person.",
    },
    notFound: "Page not found | FITologist.me",
  },

  nav: {
    home: "Home",
    method: "How It Works",
    plans: "Training Plans",
    about: "About Saeid",
    bmi: "Free BMI Check",
    cta: "Book a Free Consultation",
    ctaShort: "Free Consultation",
    primaryLabel: "Primary",
    mobileLabel: "Mobile",
    footerLabel: "Footer",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    skip: "Skip to content",
    backToTop: "back to top",
    language: "Language",
    instagram: "FITologist on Instagram",
  },

  common: {
    location: "Dubai, UAE",
    tagline: ["Train", "Transform", "Transcend"],
    whatsappSaeid: "WhatsApp Saeid",
    chatOnWhatsApp: "Chat with Saeid on WhatsApp",
    newTab: "opens in a new tab",
    defaultWhatsAppMessage: "Hi Saeid, I found you on fitologist.me and I'd like to know more.",
  },

  hero: {
    eyebrow: "Personal Trainer · Dubai",
    eyebrowCertified: "Certified Personal Trainer · Dubai",
    title: "Personal Training in Dubai, Built Around Your Schedule",
    sub: "1:1, partner, online and hybrid coaching for busy professionals, at your home or in Al Jaddaf & nearby.",
    primary: "Book a Free Consultation",
    secondary: "Check your BMI in 30 seconds",
    alt: "Saeid, personal trainer, smiling with arms crossed in a Dubai gym",
  },

  trust: {
    label: "At a glance",
    reps: "REPs UAE",
    repsNo: "No.",
    activeIq: "Active IQ Level 3",
    area: "Al Jaddaf & nearby",
    homeSessions: "Home sessions available",
  },


  goals: {
    fat: "Lose fat",
    muscle: "Build muscle",
    strength: "Get stronger",
    mobility: "Move better",
    confidence: "Build confidence",
    unsure: "Not sure yet",
  },

  who: {
    eyebrow: "Who is this for?",
    title: "Built for real life.",
    intro: "For people who want serious results without making fitness their entire life.",
    profiles: [
      { title: "Busy Professionals", body: "Train effectively around a demanding schedule." },
      { title: "Beginners", body: "Learn proper technique and build confidence from day one." },
      { title: "Experienced Lifters", body: "Break plateaus with structured progression." },
    ],
  },

  homeCta: {
    eyebrow: "Start",
    title: "Ready to start?",
    body: ["Tell Saeid about your goals, it takes about a minute", "Or simply say hello on WhatsApp."],
    primary: "Book a Free Consultation",
  },

  bodyCheck: {
    title: "Free Body Check",
    subtitle: "30 seconds. See your BMI, a healthy weight range for your height, and an estimate of your daily calories.",
    formLabel: "Free Body Check",
    units: "Units",
    metric: "cm / kg",
    imperial: "ft-in / lb",
    height: "Height",
    weight: "Weight",
    age: "Age",
    sex: "Sex",
    male: "Male",
    female: "Female",
    activity: "Activity",
    activities: { sitting: "Mostly sitting", light: "Lightly active", very: "Very active" },
    goals: "Goals",
    optional: "(optional)",
    unitCm: "cm",
    unitKg: "kg",
    unitFt: "ft",
    unitIn: "in",
    unitLb: "lb",
    unitYrs: "yrs",
    calculate: "Check my numbers",
    yourBmi: "Your BMI",
    healthyRange: "Healthy range for your height",
    maintenance: "Estimated maintenance",
    kcal: "kcal/day",
    categories: { under: "Underweight", healthy: "Healthy", over: "Overweight", obese: "Obesity" },
    explain: "BMI doesn't tell muscle from fat. In your free consultation, Saeid turns these numbers into a plan for your goals",
    sendResult: "Send my result to Saeid",
    book: "Book a Free Consultation",
    disclaimer: "Estimates only, not medical advice. For adults 18+.",
    whatsapp: {
      intro: "Hi Saeid, I just did the Body Check on fitologist.me.",
      bmi: "BMI",
      age: "Age",
      goals: "Goals",
      outro: "I'd like to book a free consultation.",
    },
    errors: {
      heightCm: "Enter your height in cm (120–230).",
      heightFt: "Enter your height in ft and in (3 ft 11 in – 7 ft 6 in).",
      weightKg: "Enter your weight in kg (35–250).",
      weightLb: "Enter your weight in lb (77–551).",
      age: "Enter your age (18–80).",
      minor: "This check is for adults 18+.",
      sex: "Select your sex.",
      activity: "Select your activity level.",
    },
  },

  about: {
    eyebrow: "Meet your coach",
    subtitle: "Personal Trainer · Dubai",
    subtitleCertified: "REPs UAE-Registered Personal Trainer · Dubai",
    quote: [
      "I don’t believe in one-size-fits-all training.",
      "My approach combines structure, technique and consistency to build results that last beyond the gym.",
    ],
    credentialsTitle: "Fitness credentials",
    credentials: {
      aiq: { lines: ["Level 3 Diploma", "Gym Instructing & Personal Training"] },
      reps: { lines: ["Category A Personal Trainer"] },
    },
    fitnessExperience: "2+ years in fitness",
    journeyLabel: "Saeid's professional journey",
    journeyShow: "Show image",
    journeyAlts: [
      "Saeid from behind, arms raised, facing the illuminated FITologist.me sign in a gym",
      "Saeid and another trainer flexing in front of an Active IQ sign in a gym",
      "Saeid standing with another trainer beneath the MyPT Academy sign",
      "Saeid standing beneath a wall sign reading “Every success story started with a DREAM”",
    ],
    backgroundEyebrow: "Background",
    backgroundTitle: "Know Saeid more",
    education: {
      label: "Education",
      items: ["BA in English Literature", "5+ Years Teaching English as a Second Language"],
    },
    professional: {
      label: "Professional",
      items: ["12+ Years in Business Development"],
    },
    multilingualLabel: "Multilingual",
    languages: ["English", "Persian", "Azerbaijani", "Turkish"],
    portraitAlt:
      "Portrait of Saeid Soleimani, the coach behind FITologist, in a FITologist t-shirt with arms crossed",
    caption: "Coach, FITologist",
    followOn: "Follow on",
    contactOn: "Contact on",
    followAria: "Follow FITologist on Instagram",
    contactAria: "Contact Saeid on WhatsApp",
  },

  method: {
    eyebrow: "Signature method",
    titleBefore: "The",
    titleAfter: "Method",
    intro: "Four stages. One clear process — so you always know where you are and what comes next.",
    stages: [
      { title: "Assess", body: "We understand your goals, movement, experience and lifestyle." },
      { title: "Build", body: "Your training plan is built specifically around you." },
      { title: "Transform", body: "Train consistently, track progress and adjust as you improve." },
      {
        title: "Transcend",
        body: "Build the strength, habits and confidence to keep progressing beyond the program.",
      },
    ],
    ctaTitle: "Ready to start?",
    ctaButton: "Book a Free Consultation",
    imageAlt: "FITologist.me brand visual: the logo above a dumbbell and towel on a dark gym floor",
  },

  coaching: {
    eyebrow: "Coaching",
    title: "Choose how you train",
    includesLabel: "What's included",
    apply: "Book a Free Consultation",
    applyAria: "Book a Free Consultation:",
    options: {
      personal: {
        title: "1:1 Personal Training",
        tagline: "Individual coaching and programming.",
        includes: ["In-person sessions with Saeid in Dubai", "Technique coached rep by rep", "A program built around you"],
      },
      online: {
        title: "Online Coaching",
        tagline: "Structured training wherever you are.",
        includes: ["Your individual training plan", "Regular check-ins and adjustments", "Train on your own schedule"],
      },
      hybrid: {
        title: "Hybrid Coaching",
        tagline: "In-person sessions + ongoing online support.",
        includes: ["In-person sessions in Dubai", "Online programming between sessions", "Ongoing accountability"],
      },
    },
    pricing: "Pricing depends on the plan you choose — ask Saeid on WhatsApp for details.",
    unsure: "Not sure which option fits? Choose the closest one — you can discuss it with Saeid before you start.",
  },

  start: {
    eyebrow: "Apply",
    title: "Ready to start?",
    body: "Tell Saeid a little about you and what you want to achieve. It takes about a minute.",
    imageAlt: "Saeid, full length, arms crossed, standing in front of a textured wall with the FITologist.me sign",
  },

  lead: {
    name: "Name",
    phone: "WhatsApp number",
    countryCode: "Country code",
    age: "Age",
    goals: "Goals",
    type: "Training type",
    frequency: "How often",
    area: "Your area",
    areaPlaceholder: "e.g. Al Jaddaf, Business Bay",
    times: "Preferred time",
    notes: "Anything Saeid should know?",
    notesPlaceholder: "Injuries, schedule, anything else",
    optional: "(optional)",
    consentBefore: "I agree to be contacted on WhatsApp about coaching.",
    privacy: "Privacy Policy",
    submit: "Send to Saeid via WhatsApp",
    helper: "Opens WhatsApp with your details ready. Just press Send.",
    honeypot: "Company",
    types: { "1to1": "1:1", partner: "Partner", online: "Online", hybrid: "Hybrid", unsure: "Not sure yet" },
    frequencies: { "1": "1× a week", "2": "2× a week", "3": "3× a week", "4": "4× a week", unsure: "Not sure yet" },
    timesOptions: { mornings: "Mornings", evenings: "Evenings", weekends: "Weekends" },
    errors: {
      name: "Enter your name (2–60 characters).",
      phone: "Enter a valid WhatsApp number (7–15 digits).",
      age: "Enter your age (18–80).",
      goals: "Choose at least one goal.",
      type: "Choose a training type.",
      notes: "Keep this under 500 characters.",
      consent: "Please agree to be contacted on WhatsApp.",
    },
    sending: "Opening WhatsApp…",
    success: {
      title: "Request sent ✓",
      bodyBefore: "Saeid has received your details and will reply within 24 hours. WhatsApp is open so you can chat with him directly. Just press",
      send: "Send",
      again: "Open WhatsApp again",
      edit: "Edit details",
    },
    fallback: {
      title: "Almost done",
      bodyBefore: "Press",
      bodyAfter: "in WhatsApp to reach Saeid.",
      open: "Open WhatsApp",
      edit: "Edit details",
    },
    message: {
      intro: "Hi Saeid, I'd like to book a free consultation.",
      name: "Name",
      age: "Age",
      goals: "Goals",
      type: "Training type",
      frequency: "How often",
      area: "Area",
      times: "Preferred time",
      notes: "Notes",
      footer: "(Sent from fitologist.me)",
    },
  },

  footer: {
    line1: "Personal Training by Saeid",
    line2: "1:1 PT, Online and Hybrid Coaching",
  },

  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist.",
    home: "Back to home",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;

export default en as Dictionary;
