/**
 * English dictionary — the source of truth for the dictionary shape.
 * `ar.ts` and `ru.ts` must satisfy `Dictionary`, so a missing key fails the build.
 * Brand names (FITologist, Saeid Soleimani, Active IQ, REPs UAE) are never translated.
 */
const en = {
  meta: {
    siteTitle: "Personal Trainer in Dubai | Saeid Soleimani · FITologist.me",
    siteDescription:
      "Personal trainer in Dubai for busy professionals. 1:1, partner, online and hybrid coaching at your home or in Al Jaddaf. Free 30-minute consultation.",
    about: {
      title: "About Saeid Soleimani | FITologist.me",
      description:
        "Meet Saeid Soleimani, a personal trainer in Dubai coaching busy professionals 1:1, online and hybrid, in three languages.",
    },
    method: {
      title: "The FITologist Method | FITologist.me",
      description:
        "Assess, Build, Transform, Transcend: the four-stage FITologist method, your first 30 days, progress tracking and nutrition.",
    },
    plans: {
      title: "Training Plans | FITologist.me",
      description:
        "Foundation, Momentum, Accelerate and Elite: 60-minute personal training plans in Dubai, plus partner, online and hybrid coaching.",
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
    terms: {
      title: "Cancellation & Rescheduling | FITologist.me",
      description: "Cancellation, rescheduling, plan validity and payment terms for personal training with Saeid Soleimani.",
    },
    privacy: {
      title: "Privacy Policy | FITologist.me",
      description: "How FITologist.me handles the details you share: what we collect, why, where it is stored and your rights.",
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
    changeLanguage: "Change language",
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
    sub: "1:1, Partner (Couples & Friends), Online and Hybrid Coaching for busy professionals, at your home or in Al Jaddaf & nearby.",
    primary: "Book a Free Consultation",
    secondary: "Check your BMI in 30 seconds",
    alt: "Saeid, personal trainer, smiling with arms crossed in a Dubai gym",
  },

  trust: {
    label: "At a glance",
    languages: "Languages spoken",
    reps: "REPs UAE",
    repsNo: "No.",
    activeIq: "Active IQ Level 3",
    area: "Dubai, Al Jaddaf & Nearby",
    homeSessions: "Home & Gym Sessions Available",
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
    eyebrow: "Who I work with",
    title: "Built for Real Life",
    intro: "For people who want serious results without making fitness their entire life.",
    profiles: [
      {
        title: "Busy Professionals",
        body: "Train around a demanding schedule: 60-minute sessions at your home, your building's gym or nearby.",
      },
      { title: "Beginners", body: "Learn proper technique and build confidence from day one." },
      {
        title: "Already Training",
        body: "Training without a clear plan? Get structured programming and steady progression.",
      },
    ],
  },

  howItWorks: {
    title: "How It Works",
    steps: [
      { title: "Free consultation", body: "30 minutes, online or in person. Your goals, history and schedule." },
      { title: "Your plan", body: "a program and nutrition targets built around you." },
      { title: "Train & track", body: "sessions, support between them, progress checked every 4 weeks." },
      { title: "Keep progressing", body: "you learn the why behind every exercise and build habits that last." },
    ],
    link: "See the full method",
  },

  plansPreview: {
    title: "Training Plans",
    items: [
      { name: "Foundation", freq: "1× a week", recommended: false },
      { name: "Momentum", freq: "2× a week", recommended: true },
      { name: "Accelerate", freq: "3× a week", recommended: false },
      { name: "Elite", freq: "4× a week", recommended: false },
    ],
    recommended: "Recommended",
    line: "Every plan includes nutrition guidance and WhatsApp support. Partner, online and hybrid options available.",
    faqLine: "Questions about location, pricing or cancellation?",
    faqLink: "Read the FAQ",
    link: "Compare plans",
  },

  meet: {
    eyebrow: "Meet Saeid",
    lead: "I train busy people the way I train myself: with structure, honesty and no wasted time.",
    body: "Five years of training, twelve years in corporate life, and coaching in three languages.",
    link: "More about Saeid",
    photoAlt: "Portrait of Saeid Soleimani, personal trainer in Dubai",
  },

  testimonials: {
    title: "What Clients Say",
  },

  faq: {
    title: "Questions",
    items: [
      {
        q: "Where do sessions take place?",
        a: "At your home, your building's gym, or a gym in Al Jaddaf and nearby areas. Online coaching works anywhere.",
      },
      {
        q: "How much does it cost?",
        a: "Every plan is tailored to you. In your free 30-minute consultation, Saeid recommends the right plan and shares its price.",
      },
      {
        q: "Do I need a gym membership?",
        a: "Not necessarily. We can train at your home or in your building's gym.",
      },
      {
        q: "How many sessions a week should I do?",
        a: "Most busy professionals start with two a week (Momentum). You can choose one to four.",
      },
      {
        q: "Is nutrition included?",
        a: "Yes. Every plan includes nutrition guidance: calorie and protein targets and practical eating habits.",
      },
      {
        q: "Can I train with a partner?",
        a: "Yes. Partner Training is available on all four plans, with a special partner rate.",
      },
      {
        q: "I'm a complete beginner. Is that OK?",
        a: "Absolutely. You'll learn proper technique from your first session.",
      },
      { q: "What languages do you coach in?", a: "English, Persian and Azerbaijani." },
      {
        q: "What if I need to cancel?",
        a: "Rescheduling is free with 24 hours' notice. See the full",
        link: "cancellation policy",
      },
    ],
  },

  ctaBlock: {
    title: "Your first step is free.",
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
    lead: "I train busy people the way I train myself: with structure, honesty and no wasted time.",
    stats: [
      { value: "5 years", label: "training" },
      { value: "12+ years", label: "corporate" },
      { value: "3", label: "languages" },
    ],
    storyTitle: "My story",
    story: [
      "I started training seriously five years ago, under the guidance of a coach, the same way I now work with my clients. Structure, proper technique and consistency changed how I look, how I feel, and how I handle a demanding career.",
      "For more than twelve years I've worked in business development across Iran and the GCC. Long days, travel and pressure: I know exactly what a busy schedule does to good intentions. That's why my coaching is built for real life, with efficient sessions, clear plans and progress you can actually measure.",
      "Before business, I spent five years teaching. It taught me to explain things simply and patiently, which is exactly what good technique coaching needs. For the past year I've been coaching clients one-to-one, and today I help busy professionals in Dubai build strength that lasts.",
    ],
    whyTitle: "Why train with me",
    why: [
      { title: "I've been where you are.", body: "12+ years in corporate business development, training around a demanding schedule." },
      {
        title: "I explain things clearly.",
        body: "Five years of teaching (BA in English Literature) means step-by-step technique coaching you'll actually understand.",
      },
      { title: "Coaching in your language.", body: "English, Persian and Azerbaijani." },
    ],
    credentialsTitle: "Fitness credentials",
    credentials: {
      aiq: { lines: ["Level 3 Diploma", "Gym Instructing & Personal Training"] },
      reps: { lines: ["Category A Personal Trainer"] },
    },
    repsNo: "No.",
    galleryLabel: "Photos of Saeid",
    portraitAlt:
      "Portrait of Saeid Soleimani, the coach behind FITologist, in a FITologist t-shirt with arms crossed",
  },

  method: {
    eyebrow: "How it works",
    titleBefore: "The",
    titleAfter: "Method",
    intro: "Four stages. One clear process, so you always know where you are and what comes next.",
    stages: [
      {
        label: "Assess",
        title: "Free consultation",
        body: "A 30-minute conversation, online or in person: your goals, training history, injuries, schedule and where you'd like to train. In your first session we add a movement check and baseline measurements.",
      },
      {
        label: "Build",
        title: "Your plan",
        body: "Your program and nutrition targets, built around your goal, level, schedule and equipment, plus the plan that fits how often you can train.",
      },
      {
        label: "Transform",
        title: "Train & track",
        body: "We train together, you get support between sessions, and every 4 weeks we review measurements, photos and strength, then adjust.",
      },
      {
        label: "Transcend",
        title: "Keep progressing",
        body: "You learn the why behind every exercise and build habits that last, so progress continues beyond the program.",
      },
    ],
    first30Title: "Your first 30 days",
    first30: [
      { when: "Day 1", what: "free consultation, then your plan recommendation." },
      { when: "Week 1", what: "first session, movement check, baseline measurements and photos." },
      { when: "Weeks 1–2", what: "learning technique and setting your training rhythm." },
      { when: "Weeks 3–4", what: "progressive training and nutrition habits in place." },
      { when: "Day 30", what: "progress review and your next 4-week block." },
    ],
    trackTitle: "How we track progress",
    track: ["Body measurements", "Progress photos", "Strength numbers", "Consistency"],
    nutritionTitle: "Nutrition, kept simple",
    nutrition:
      "Every plan includes nutrition guidance: calorie and protein targets and practical eating habits that fit your life. No extreme diets. If you have a medical condition, I'll work alongside your doctor or dietitian.",
  },

  plans: {
    eyebrow: "Training Plans",
    title: "Training Plans",
    intro: "Choose how often you train. Every plan is tailored to you. Saeid will recommend the right one and share pricing in your free consultation.",
    whereTitle: "Where we train",
    where: "At your home, your building's gym, or a gym in Al Jaddaf & nearby. Online coaching works anywhere.",
    inPersonTitle: "In-person plans (1:1 or Partner)",
    inPersonNote: "All sessions 60 minutes.",
    columns: { plan: "Plan", freq: "How often", sessions: "Sessions / month", bestFor: "Best for" },
    recommended: "Recommended",
    perMonth: "sessions / month",
    items: [
      { key: "1", name: "Foundation", freq: "1× a week", sessions: "4", bestFor: "Learning technique and building the habit" },
      { key: "2", name: "Momentum", freq: "2× a week", sessions: "8", bestFor: "Busy professionals who want steady progress" },
      { key: "3", name: "Accelerate", freq: "3× a week", sessions: "12", bestFor: "Faster, visible body transformation" },
      { key: "4", name: "Elite", freq: "4× a week", sessions: "16", bestFor: "Maximum results and accountability" },
    ],
    includesTitle: "Every plan includes",
    includes: [
      { title: "Personalised program", body: "built around your goals, level and schedule." },
      { title: "Technique coaching", body: "coached rep by rep, safely progressed." },
      { title: "Nutrition guidance", body: "calorie and protein targets with practical eating habits." },
      { title: "Progress check every 4 weeks", body: "measurements, photos and strength." },
      { title: "WhatsApp support", body: "questions answered within 24 hours." },
    ],
    partner: {
      title: "Partner Training",
      lead: "Train together.",
      body: "Train with your partner, friend or colleague. Two people, same session, special partner rate. Available on all four plans, and best when you share a similar goal and schedule.",
    },
    online: {
      title: "Online Coaching",
      body: "Train anywhere. Your program in a dedicated coaching app with exercise videos, weekly check-ins, video form reviews and nutrition guidance. A new training block every 4 weeks.",
    },
    hybrid: {
      title: "Hybrid Coaching",
      body: "Foundation or Momentum sessions in person, plus an online program for the days you train alone and weekly check-ins. Built for busy professionals.",
    },
    firstStep: {
      title: "Your first step is free",
      consultation: "30-minute consultation",
      free: "Free",
      mode: "Online or in person",
      intro: "We'll talk about where you are, where you want to go, and the right plan to get you there:",
      points: [
        "Your goals and priorities",
        "Your current fitness level, training history and any injuries",
        "Your schedule and where you'd like to train",
        "Your questions, answered",
        "The plan we recommend, and its price",
      ],
      outro: "No pressure. Just a conversation.",
    },
  },

  start: {
    title: "Your First Step Is Free",
    body: "A 30-minute consultation, online or in person. No pressure, just a conversation.",
    reply: "Saeid replies personally within a few hours.",
  },

  lead: {
    name: "Name",
    phone: "WhatsApp number",
    countryCode: "Country code",
    age: "Age",
    sex: "Sex",
    sexOptions: { male: "Male", female: "Female" },
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
      bodyBefore: "Saeid has received your details and will reply within a few hours. WhatsApp is open so you can chat with him directly. Just press",
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
      sex: "Sex",
      goals: "Goals",
      type: "Training type",
      frequency: "How often",
      area: "Area",
      times: "Preferred time",
      notes: "Notes",
      footer: "(Sent from fitologist.me)",
    },
  },

  terms: {
    title: "Cancellation & Rescheduling",
    items: [
      { title: "24-hour notice", body: "Reschedule or cancel at least 24 hours before your session at no cost." },
      { title: "Late cancellation or no-show", body: "Cancellations within 24 hours, or missed sessions, count as used." },
      { title: "Running late", body: "Sessions end at the scheduled time." },
      { title: "If Saeid cancels", body: "Your session is rescheduled at no cost." },
      {
        title: "Plan validity",
        body: "Sessions are valid for 30 days from your first session. Sessions cancelled with proper notice can be carried over once, up to 2 sessions.",
      },
      { title: "Pause", body: "For travel or illness, your plan can be paused once per cycle for up to 14 days, with 48 hours' notice." },
      { title: "Partner training", body: "If one partner cancels late, the session goes ahead for the other at the partner rate." },
      { title: "Payment", body: "Plans are paid in advance, before the first session of each cycle." },
      {
        title: "Health",
        body: "Please tell Saeid about any injury or medical condition before training. Coaching is not a substitute for medical advice.",
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    who: { title: "Who we are", body: "FITologist.me, personal training by Saeid Soleimani, Dubai, UAE. Contact: WhatsApp" },
    collect: {
      title: "What we collect",
      body: "the details you enter in the form (name, WhatsApp number, age, goals, training preferences, area, notes), and Body Check inputs only if you choose to send them. Notes may include health information you choose to share, such as injuries.",
    },
    why: { title: "Why", body: "to reply to you and arrange coaching. We don't sell your data or use it for anything else." },
    stored: {
      title: "Where it's stored",
      body: "form submissions are sent to Saeid via a private Telegram notification and logged in a private Google Sheet.",
    },
    analytics: { title: "Analytics", body: "we use Google Analytics and Meta Pixel to understand how the site is used." },
    howLong: { title: "How long", body: "if you don't become a client, your details are deleted within 12 months." },
    rights: { title: "Your rights", body: "message Saeid on WhatsApp to see, correct or delete your data." },
    updated: "Last updated",
  },

  footer: {
    terms: "Terms",
    privacy: "Privacy",
    line1: "Personal Training by Saeid",
    line2: "1:1, Partner, Online and Hybrid Coaching",
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
