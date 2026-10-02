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
    muscle: { label: "Build Muscle", body: "Progressive, structured training to build lean muscle." },
    fat: { label: "Lose Fat", body: "Training and consistent habits that support sustainable fat loss." },
    strength: { label: "Get Stronger", body: "Own the key lifts and build strength with clear progression." },
    mobility: { label: "Move Better", body: "Improve mobility, posture and how you move day to day." },
    confidence: { label: "Build Confidence", body: "Learn proper technique and feel at home in the gym." },
    unsure: { label: "I'm Not Sure Yet", body: "We'll find the right starting point together." },
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

  bmi: {
    eyebrow: "Starting point",
    title: "Know your starting point",
    intro: "A quick reference before you begin. Enter your details to see your Body Mass Index.",
    disclaimer:
      "BMI is a general screening measure and does not directly measure body composition. This calculator uses the standard adult categories and is for adults aged 18+. Age and gender are recorded for your profile; they do not change the adult BMI formula.",
    age: "Age",
    yrs: "yrs",
    gender: "Gender",
    male: "Male",
    female: "Female",
    height: "Height",
    inches: "Inches",
    weight: "Weight",
    units: "Units",
    metric: "cm / kg",
    imperial: "ft / lb",
    unitCm: "cm",
    unitKg: "kg",
    unitFt: "ft",
    unitIn: "in",
    unitLb: "lb",
    calculate: "Calculate BMI",
    formLabel: "BMI calculator",
    yourBmi: "Your BMI",
    srYourBmi: "Your BMI is",
    adultRange: "Adult range",
    onlyStart: "BMI is only the start.",
    startTraining: "Book a Free Consultation",
    categories: {
      under: "Underweight",
      healthy: "Healthy weight",
      over: "Overweight",
      obese: "Obesity",
    },
    ranges: {
      under: "Below 18.5",
      healthy: "18.5 – 24.9",
      over: "25 – 29.9",
      obese: "30 and above",
    },
    errors: {
      ageRequired: "Enter your age.",
      ageMinor:
        "This calculator uses adult BMI categories and is not intended for children or teens (under 18).",
      ageRange: "Enter an age between 18 and 100.",
      genderRequired: "Select your gender.",
      heightRequired: "Enter your height.",
      heightRangeCm: "Enter a height between 100 and 250 cm.",
      heightFtFormat: "Enter feet as a whole number and inches from 0 to 11.",
      heightRangeFt: "Enter a height between 3 ft 3 in and 8 ft 2 in.",
      weightRequired: "Enter your weight.",
      weightRangeKg: "Enter a weight between 25 and 350 kg.",
      weightRangeLb: "Enter a weight between 55 and 770 lb.",
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

  form: {
    name: "Name",
    namePlaceholder: "Your name",
    age: "Age",
    whatsapp: "WhatsApp number",
    goal: "Main goal",
    coaching: "Coaching type",
    note: "Anything Saeid should know?",
    optional: "(optional)",
    notePlaceholder: "Training history, injuries, schedule…",
    submit: "Send to Saeid via WhatsApp",
    sending: "Sending…",
    privacy: "Your details are only used to contact you about coaching.",
    failure:
      "Something went wrong sending your application. Please try again, or message Saeid directly on",
    errors: {
      nameRequired: "Please enter your name.",
      nameLong: "Please keep your name under 60 characters.",
      ageRequired: "Please enter your age.",
      ageRange: "Please enter an age between 16 and 99.",
      phoneRequired: "Please enter your WhatsApp number.",
      phoneInvalid: "Please enter a valid number, including country code (e.g. +971 50 000 0000).",
      goalRequired: "Please choose your main goal.",
      coachingRequired: "Please choose a coaching type.",
      noteLong: "Please keep your note under 500 characters.",
    },
    success: {
      title: "Application received",
      received: "Your information has been received.",
      next: "Your details have been prepared as a WhatsApp message to Saeid. Open WhatsApp, review the message and press Send.",
      button: "WhatsApp Saeid",
      edit: "Edit details",
    },
    message: {
      greeting: "Hi Saeid,",
      intro: "I'd like to start training.",
      name: "Name",
      age: "Age",
      goal: "Goal",
      coaching: "Coaching Type",
      thanks: "Thank you.",
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
