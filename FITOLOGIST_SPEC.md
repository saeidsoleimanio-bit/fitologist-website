# FITologist.me — Website Revision Spec (v1)

Owner: Saeid Soleimani · Site: fitologist.me · Date: Oct 2026

This file is the single source of truth for the revision. Work through it **phase by phase** (Section 10). Do not start a phase until the owner confirms the previous one.

---

## 0. Ground rules for Claude Code

1. **Inspect first.** Before changing anything, read the codebase and report: framework, routing, styling approach, i18n setup, hosting/deploy target (Vercel / Netlify / static / other), and how the form currently works. If the host cannot run serverless functions, stop and say so before Phase 2.
2. **Never invent business facts.** Prices, certificate numbers, testimonials, photos, email, IDs are placeholders in `site.config` (Section 1). If a value is empty, the related UI must **not render** — no fake numbers, no "Lorem ipsum", no stock testimonials.
3. **Copy is final unless marked `{{…}}`.** Use the English copy in this file exactly. FA and AR are translated from it (Phase 4).
4. **Keep the existing visual identity** (black background, orange accent, condensed display face, existing logo). This is a refinement, not a redesign. Apply the restraint rules in Section 2.4.
5. **Mobile first.** Every change is checked at 375×667, 390×844 and 430×932 before desktop (1440).
6. **Do not delete content or pages that are not listed for removal.**

---

## 1. Central config (`site.config` — create it)

Create one typed config module (e.g. `src/config/site.ts`) and read every business value from it.

```ts
export const site = {
  brand: "FITologist.me",
  coachName: "Saeid Soleimani",
  whatsappNumber: "971506461816",          // wa.me format, no +
  whatsappDisplay: "+971 50 646 1816",
  instagramHandle: "fitologist.me",
  instagramUrl: "https://instagram.com/fitologist.me",
  contactEmail: "",                         // {{CONTACT_EMAIL}} — optional
  serviceArea: "Al Jaddaf & nearby",
  homeSessions: true,
  sessionLengthMin: 60,
  consultationMin: 30,
  progressCheckWeeks: 4,
  replyWithinHours: 24,
  languagesSpoken: ["English", "فارسی", "Türkçe", "Azərbaycanca"],

  credentials: {
    activeIq: { show: false, title: "Level 3 Diploma in Gym Instructing & Personal Training" }, // {{ACTIVEIQ}} set show:true once issued
    reps:     { show: false, category: "Category A Personal Trainer", number: "" },          // {{REPS_NO}}
  },

  stats: { yearsTraining: 5, yearsCorporate: 12 },

  testimonials: [],                         // {{TESTIMONIALS}} [{name, text, goal, photo?}]
  photos: {                                 // {{REAL_PHOTOS}} — paths; empty = section hidden or fallback
    hero: "<current hero portrait>",
    about: "<current about portrait>",
    gallery: [],                            // real, non-composite photos only
    avatar: "<crop of hero portrait>",
  },
  homeEquipmentNote: "",                    // {{EQUIPMENT_NOTE}} e.g. "I bring the equipment we need."

  analytics: { ga4Id: "", metaPixelId: "" },// {{GA4_ID}} {{PIXEL_ID}} — load scripts only if set
};
```

Conditional rendering rules:
- `credentials.*.show === false` → hide that credential everywhere (About cards, trust strip, schema). While **both** are false, the hero eyebrow reads `Personal Trainer · Dubai`; once either is true it reads `Certified Personal Trainer · Dubai`.
- `testimonials.length === 0` → testimonials section not rendered.
- `photos.gallery.length === 0` → About gallery not rendered.
- `homeEquipmentNote === ""` → omit that sentence from the FAQ answer.

Secrets (bot token etc.) are **env vars**, never in this config (Section 6.4).

---

## 2. Global changes

### 2.1 Pages, routes, navigation

| Route | Status | Notes |
|---|---|---|
| `/` | Rebuild | Section 4 |
| `/method` | Keep, expand | Section 5 |
| `/plans` | New (replaces `/coaching`) | Section 7. **301 `/coaching` → `/plans`** |
| `/about` | Rebuild | Section 8 |
| `/bmi` | New | Standalone Body Check (same component as Home) for Instagram bio |
| `/start` | New | Form only (same component) for Instagram bio |
| `/terms` | New | Section 9.2 |
| `/privacy` | New | Section 9.3 |
| `/ru/*` | Remove | **301 → `/`** |
| `/fa/*` | New | RTL, Phase 4 |
| `/ar/*` | Keep | Full RTL check, Phase 4 |

**Menu (in this order):**

| EN | FA | AR | Target |
|---|---|---|---|
| Home | خانه | الرئيسية | `/` |
| How It Works | روش کار | كيف نعمل | `/method` |
| Training Plans | پلن‌های تمرینی | خطط التدريب | `/plans` |
| About Saeid | درباره سعید | تعرّف على سعيد | `/about` |
| Free BMI Check | چکاپ رایگان BMI | فحص BMI مجاني | `/bmi` |
| **Button:** Book a Free Consultation | رزرو مشاوره رایگان | احجز استشارة مجانية | form (2.2) |

**Desktop header:** logo · menu · primary button · Instagram icon · text language switcher `EN | فا | ع` (no flags).

**Mobile header:** compact logo (fixed height ~40px, the same size at top and on scroll — no large variant, no tagline) · short primary button `Free Consultation` · hamburger. Instagram and the language switcher move into the drawer. Header background always solid (never transparent over photos). If the button does not fit at 360px width, hide it below 360px only.

Footer: keep current structure; update link labels to the menu above; add `Terms` and `Privacy`; replace flags with the text switcher.

### 2.2 One action, one name

- Primary CTA everywhere: **Book a Free Consultation**
- Secondary CTA: **WhatsApp Saeid**
- Form submit: **Send to Saeid via WhatsApp** (Section 6)
- Remove all of: Start your transformation, Start training, Take the assessment, Apply now, Apply to train, View coaching.
- Primary CTA target: on `/` and `/plans` scroll to `#start` (the form). On every other page link to `/#start`.
- No `→` / `↗` arrows appended to button text.

### 2.3 Floating WhatsApp button

- Keep, 56px, `aria-label="Chat with Saeid on WhatsApp"`.
- Opens `wa.me/{number}?text=` with: `Hi Saeid, I found you on fitologist.me and I'd like to know more.` (localized).
- **Hide it** (IntersectionObserver) whenever any of these is in view: an inline WhatsApp/primary CTA, the form, the Body Check result card, the footer.
- Respect `env(safe-area-inset-bottom)`.
- Add bottom padding (~88px) to the last element of each section on mobile so no content ever sits under it. Known collisions to verify fixed: BMI "Female" button, Method step 04 text, form rows, footer, "I'm not sure yet" card.

### 2.4 Visual restraint & typography

- **Remove the hero scroll fade/opacity animation** on headline and CTA (on mobile it makes the CTA look disabled). One page-load reveal on the hero is allowed; no fade-up on every section.
- Uppercase + wide tracking only for short labels (≤3 words). Reduce label letter-spacing to ~0.12em. Any sentence longer than 5 words is sentence case, normal tracking (e.g. "With structure, consistency and purpose", "Select a goal to continue", the old pricing note).
- Cut eyebrow labels to where they add information; not every section needs one.
- Body text min 16px on mobile; all inputs 16px (prevents iOS zoom).
- All grey-on-black text must meet WCAG AA 4.5:1.
- Trust/meta items render as separate items (chips or a row with spacing), not one string joined with middle dots.
- Mobile section vertical padding reduced ~40%. Remove the large empty gap under the Home hero.
- Logo appears only in header and footer. Remove every large logo inside content (Home philosophy image, Method hero image, form-side photo).

### 2.5 Images

Remove (composite / AI-looking):
- Bench + dumbbell + towel image with slogans (Home and Method).
- About gallery image with the FITologist sign on the MyPT gym wall (and the purple "Active" ghost).
- Photo in front of the lit logo wall next to the form.

Keep for now: hero portrait, About portrait. Replace later from `photos.*`.

Where an image is removed and nothing replaces it, use the plain dark background — do not add stock imagery.

All images: WebP/AVIF, responsive `srcset`, `loading="lazy"` below the fold, hero `fetchpriority="high"`, meaningful `alt`.

### 2.6 Decorative icons & false affordances

- Decorative line icons on cards: remove on mobile; on desktop move them so they never overlap text or links.
- Remove arrows that are not links (Method step arrows).

### 2.7 Accessibility baseline

`aria-label` on all icon-only buttons (hamburger, Instagram, WhatsApp, language), visible focus states, tap targets ≥44px, every input has a linked `<label>`, error messages announced (`aria-live`), `prefers-reduced-motion` respected.

---

## 3. Free Body Check (component used on `/` and `/bmi`)

Replaces the current BMI calculator. Purpose: give a useful result instantly, then turn it into a conversation.

### 3.1 Copy
- Title: **Free Body Check**
- Subtitle: *30 seconds. See your BMI, a healthy weight range for your height, and an estimate of your daily calories.*

### 3.2 Inputs
| Field | Details |
|---|---|
| Units | Toggle `cm / kg` ↔ `ft-in / lb` (convert internally to metric) |
| Height | required, 120–230 cm |
| Weight | required, 35–250 kg |
| Age | required, 18–80. Under 18 → inline message: *This check is for adults 18+.* |
| Sex | required, segmented Male / Female, clear selected state, no default |
| Activity | required, 3 options: Mostly sitting · Lightly active · Very active |
| Goals | optional, **multi-select chips**: Lose fat · Build muscle · Get stronger · Move better · Build confidence · Not sure yet. "Not sure yet" is exclusive (selecting it clears others; selecting another clears it). |

No numeric placeholders (remove 178 / 80 / 30). Show only the unit inside the field. `inputmode="decimal"`. Validation messages inline, plain: *Enter your height in cm (120–230).*

### 3.3 Calculations
- BMI = kg / m², 1 decimal.
- Categories (WHO): <18.5 Underweight · 18.5–24.9 Healthy · 25–29.9 Overweight · ≥30 Obesity. Show a simple coloured scale with a marker.
- Healthy weight range for height = 18.5·m² to 24.9·m², rounded to whole kg (or lb).
- Maintenance calories = Mifflin-St Jeor BMR × activity factor, rounded to nearest 50:
  - Male: 10·kg + 6.25·cm − 5·age + 5 · Female: 10·kg + 6.25·cm − 5·age − 161
  - Factors: Mostly sitting 1.2 · Lightly active 1.375 · Very active 1.55
- Show maintenance only. Do **not** show deficit/surplus numbers.

### 3.4 Result card
```
Your BMI: 26.4 — Overweight
Healthy range for your height: 59–79 kg
Estimated maintenance: ~2,450 kcal/day

BMI doesn't tell muscle from fat. In your free consultation, Saeid turns these
numbers into a plan for your goals: {goals joined with " & "}.
[ Send my result to Saeid ]   (primary, opens WhatsApp)
[ Book a Free Consultation ]  (secondary, goes to #start with prefill)

Estimates only, not medical advice. For adults 18+.
```
- If no goals selected, drop the ": {goals}" part.
- Remove the old line "Age and gender are recorded for your profile…".
- The short disclaimer sits **under** the result. Before calculating, show nothing but the form (no 6-line disclaimer above it).

### 3.5 Actions
- **Send my result to Saeid** → `wa.me` with (localized):
  ```
  Hi Saeid, I just did the Body Check on fitologist.me.
  BMI: 26.4 (Overweight) · Age: 34 · Goals: Lose fat, Build muscle
  I'd like to book a free consultation.
  ```
- **Book a Free Consultation** → save `{age, goals, bmi}` to `sessionStorage` key `fit_prefill`, scroll/navigate to `#start`; the form reads and pre-fills age and goals.
- No gating: the result is never hidden behind a phone number.

---

## 4. Home page (`/`) — section order and copy

Remove from Home: the "Philosophy" section, the six goal cards, the "Built for real life / Experienced lifters" block, the mid-page "Ready to start?" repeat.

### 4.1 Hero
**Mobile acceptance criterion:** at 390×844 the eyebrow, H1, subtitle and primary button are fully visible on first load without scrolling; at 375×667 at least H1 and the primary button. Use a shorter image (~50–55svh, `object-position: top`) with the text on a bottom gradient or directly below.

- Eyebrow: `Personal Trainer · Dubai` (or `Certified Personal Trainer · Dubai` per Section 1 rule)
- **H1: Personal Training in Dubai, Built Around Your Schedule**
- Subtitle: *1:1, partner, online and hybrid coaching for busy professionals, at your home or in Al Jaddaf & nearby.*
- Primary: **Book a Free Consultation** · Secondary text link: **Check your BMI in 30 seconds** (→ Body Check section)
- "Train. Transform. Transcend." may stay only as a small tagline, never as the H1.

### 4.2 Trust strip
Separate items (chips / icon + text), horizontally scrollable on mobile:
- REPs UAE `{category}` `No. {number}` *(only if reps.show)*
- Active IQ Level 3 *(only if activeIq.show)*
- Al Jaddaf & nearby
- Home sessions available
- English · فارسی · Türkçe · Azərbaycanca

### 4.3 Who I work with
- **H2: Built for Busy Professionals**
- Body: *You work long hours, travel, and still want to look and feel strong. I spent 12+ years in corporate business development, so I know what a demanding schedule does to your training. My job is to make every session count.*
- Three points:
  - 60-minute sessions at your home, your building's gym or nearby
  - Plans that adapt when you travel or get busy
  - Progress checked every 4 weeks, so you always see where you stand
- Small line: *New to the gym? You'll learn proper technique from day one.*

### 4.4 Free Body Check
Component from Section 3, anchor `#bmi`.

### 4.5 How it works (summary)
H2: **How It Works** · four compact rows (number inline with title on mobile; this section must be ~60% shorter than the current Method list):
1. **Free consultation:** 30 minutes, online or in person. Your goals, history and schedule.
2. **Your plan:** a program and nutrition targets built around you.
3. **Train & track:** sessions, support between them, progress checked every 4 weeks.
4. **Keep progressing:** you learn the why behind every exercise and build habits that last.

Link: **See the full method** → `/method`

### 4.6 Training plans (preview)
H2: **Training Plans** · four compact items:
- Foundation · 1× a week
- Momentum · 2× a week · *Recommended*
- Accelerate · 3× a week
- Elite · 4× a week

Line: *Every plan includes nutrition guidance and WhatsApp support. Partner, online and hybrid options available.*
Link: **Compare plans** → `/plans`

### 4.7 Meet Saeid (short)
Photo (`photos.about`) + text:
- **I train busy people the way I train myself: with structure, honesty and no wasted time.**
- *Five years of training, twelve years in corporate life, and coaching in four languages.*
- Link: **More about Saeid** → `/about`

### 4.8 Testimonials
Render only if `testimonials.length > 0`. Card: quote, first name, goal. Build the component now; it stays hidden.

### 4.9 FAQ
Accordion, content from Section 9.1.

### 4.10 Start (form)
Anchor `#start`. Above the form:
- **H2: Your First Step Is Free**
- *A 30-minute consultation, online or in person. No pressure, just a conversation.*
- Small avatar (`photos.avatar`) + *Saeid replies personally within 24 hours.*
- Form component (Section 6).

---

## 5. Method page (`/method`) — keep, expand

- **H1: The FITologist Method**
- Subtitle: *Four stages. One clear process, so you always know where you are and what comes next.*
- Remove the hero image with logo/dumbbells (plain dark background). Remove non-link arrows.
- Mobile: outlined numbers smaller and inline with the title.

### 5.1 The four stages
| # | Stage label | Title | Text |
|---|---|---|---|
| 01 | Assess | Free consultation | A 30-minute conversation, online or in person: your goals, training history, injuries, schedule and where you'd like to train. In your first session we add a movement check and baseline measurements. |
| 02 | Build | Your plan | Your program and nutrition targets, built around your goal, level, schedule and equipment, plus the plan that fits how often you can train. |
| 03 | Transform | Train & track | We train together, you get support between sessions, and every 4 weeks we review measurements, photos and strength, then adjust. |
| 04 | Transcend | Keep progressing | You learn the why behind every exercise and build habits that last, so progress continues beyond the program. |

### 5.2 Your first 30 days
- **Day 1:** free consultation, then your plan recommendation.
- **Week 1:** first session, movement check, baseline measurements and photos.
- **Weeks 1–2:** learning technique and setting your training rhythm.
- **Weeks 3–4:** progressive training and nutrition habits in place.
- **Day 30:** progress review and your next 4-week block.

### 5.3 How we track progress
Body measurements · progress photos · strength numbers · consistency. (Separate items.)

### 5.4 Nutrition, kept simple
*Every plan includes nutrition guidance: calorie and protein targets and practical eating habits that fit your life. No extreme diets. If you have a medical condition, I'll work alongside your doctor or dietitian.*

### 5.5 CTA block
**Your first step is free.** Primary: Book a Free Consultation · Secondary: WhatsApp Saeid.

---

## 6. Form & lead flow (component used on `/`, `/plans`, `/start`)

### 6.1 The problem being fixed
Today the success screen says "Application received / Your information has been received", but nothing is stored anywhere: if the visitor doesn't press Send in WhatsApp, the lead is lost and the message is untrue.

### 6.2 Fields
| Field | Type | Required |
|---|---|---|
| Name | text, `autocomplete="name"` | ✔ |
| WhatsApp number | `type="tel"`, `autocomplete="tel"`, country-code selector defaulting to +971, validated (7–15 digits) | ✔ |
| Age | number 18–80, no placeholder value | ✔ |
| Goals | **multi-select chips**, same list and "Not sure yet" rule as 3.2 | ✔ (≥1) |
| Training type | single-select chips: 1:1 · Partner · Online · Hybrid · Not sure yet | ✔ |
| How often | single-select chips: 1× a week · 2× a week · 3× a week · 4× a week · Not sure yet — **shown only** for 1:1, Partner, Hybrid | optional |
| Your area | text, placeholder *e.g. Al Jaddaf, Business Bay* — **shown only** for 1:1, Partner, Hybrid | optional |
| Preferred time | multi-select chips: Mornings · Evenings · Weekends | optional |
| Anything Saeid should know? | textarea, 500 chars, placeholder *Injuries, schedule, anything else* | optional |
| Consent | checkbox: *I agree to be contacted on WhatsApp about coaching.* + link Privacy Policy | ✔ |
| Honeypot | hidden field `company`; if filled, silently drop | — |

Chips: 2 columns on mobile, compact height (no full-width checkbox rows). Pre-fill age and goals from `sessionStorage.fit_prefill` (Section 3.5); pre-select training type if arriving from a plan card (`?type=hybrid` etc.).

Submit button: **Send to Saeid via WhatsApp** (WhatsApp icon) with helper text below: *Opens WhatsApp with your details ready. Just press Send.*

### 6.3 Submit behaviour — one tap, two deliveries
On a valid submit, **inside the same click handler (no `await` before navigation, or iOS will block it):**
1. Fire `fetch('/api/lead', { method:'POST', keepalive:true, body: JSON })` — do not await before step 3.
2. Switch the form to the **sending state** (6.5).
3. Open WhatsApp: mobile → `window.location.href = waUrl`; desktop → `window.open(waUrl, '_blank')`.
4. When the fetch resolves (also after the user returns from WhatsApp), switch to the **success** or **fallback** state.

WhatsApp message (localized to page language; omit empty lines):
```
Hi Saeid, I'd like to book a free consultation.
Name: {name}
Age: {age}
Goals: {goals}
Training type: {type}
How often: {frequency}
Area: {area}
Preferred time: {times}
Notes: {notes}
(Sent from fitologist.me)
```

### 6.4 `/api/lead` (serverless function)
- Validate server-side (same rules), length-limit every field, drop if honeypot filled, basic rate limit (e.g. 5 requests / 10 min per IP).
- **Deliver to two places:**
  1. **Telegram** (instant notification): `POST https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage` with `chat_id={TELEGRAM_CHAT_ID}`. Message = all fields + language + source page + BMI (if present) + UTM params + timestamp (Asia/Dubai). Include a tap-to-chat link `https://wa.me/{lead number}`.
  2. **Google Sheet** (lead log): `POST` JSON to `{SHEETS_WEBHOOK_URL}` (a Google Apps Script web app that appends a row). Columns: timestamp, name, whatsapp, age, goals, type, frequency, area, times, notes, language, source, bmi, utm_source, utm_campaign.
- Return `200 {ok:true}` if **at least one** delivery succeeded; otherwise `502`.
- Env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SHEETS_WEBHOOK_URL`. Never exposed to the client. Provide `.env.example`.
- Also provide the Apps Script code (`scripts/sheets-webhook.gs`) and a short `SETUP_LEADS.md` for the owner: create bot with @BotFather → get token; message the bot, get chat id; create Sheet → Extensions → Apps Script → paste → Deploy as web app (Anyone) → copy URL; add the three env vars to the host; redeploy; send a test lead.

### 6.5 States & copy
- **Sending:** *Opening WhatsApp…*
- **Success** (API ok):
  > **Request sent ✓**
  > Saeid has received your details and will reply within 24 hours. WhatsApp is open so you can chat with him directly. Just press **Send**.
  > [Open WhatsApp again] · Edit details
- **Fallback** (API failed or offline):
  > **Almost done**
  > Press **Send** in WhatsApp to reach Saeid.
  > [Open WhatsApp] · Edit details
- Never show "received/sent" wording unless the API returned ok.
- Remove the old "Application received" screen and the large photo below the form on mobile.

---

## 7. Training Plans page (`/plans`)

- Eyebrow: `Training Plans` · **H1: Training Plans**
- Intro: *Choose how often you train. Every plan is tailored to you. Saeid will recommend the right one and share pricing in your free consultation.*
- Primary: Book a Free Consultation
- **No prices anywhere on the site.**

### 7.1 Where we train
*At your home, your building's gym, or a gym in Al Jaddaf & nearby. Online coaching works anywhere.*

### 7.2 In-person plans (1:1 or Partner) — all sessions 60 minutes
Table on desktop, stacked cards on mobile:

| Plan | How often | Sessions / month | Best for |
|---|---|---|---|
| Foundation | 1× a week | 4 | Learning technique and building the habit |
| Momentum · *Recommended* | 2× a week | 8 | Busy professionals who want steady progress |
| Accelerate | 3× a week | 12 | Faster, visible body transformation |
| Elite | 4× a week | 16 | Maximum results and accountability |

Each plan's CTA → form with `?type=1to1&freq=…` pre-selected.

### 7.3 Every plan includes
- **Personalised program:** built around your goals, level and schedule.
- **Technique coaching:** coached rep by rep, safely progressed.
- **Nutrition guidance:** calorie and protein targets with practical eating habits.
- **Progress check every 4 weeks:** measurements, photos and strength.
- **WhatsApp support:** questions answered within 24 hours.

### 7.4 Partner Training
**Train together.** *Train with your partner, friend or colleague. Two people, same session, special partner rate. Available on all four plans, and best when you share a similar goal and schedule.* CTA → form `?type=partner`.

### 7.5 Online Coaching
*Train anywhere. Your program in a dedicated coaching app with exercise videos, weekly check-ins, video form reviews and nutrition guidance. A new training block every 4 weeks.* CTA → form `?type=online`.

### 7.6 Hybrid Coaching
*Foundation or Momentum sessions in person, plus an online program for the days you train alone and weekly check-ins. Built for busy professionals.* CTA → form `?type=hybrid`.

### 7.7 Your first step is free
- **30-minute consultation** — Free · Online or in person
- *We'll talk about where you are, where you want to go, and the right plan to get you there:*
  - Your goals and priorities
  - Your current fitness level, training history and any injuries
  - Your schedule and where you'd like to train
  - Your questions, answered
  - The plan we recommend, and its price
- **No pressure. Just a conversation.**
- Then: FAQ (9.1) and the form (`#start`).

Remove the old Coaching-page note "Pricing depends on the plan you choose — ask Saeid on WhatsApp for details."

---

## 8. About page (`/about`)

- Header solid; photo sits below it (icons must not overlap the face). Remove the vertical Train/Transform/Transcend stack on mobile.
- Eyebrow: `Meet your coach` · **H1: Saeid Soleimani** · Subtitle: `Personal Trainer · Dubai` (or `REPs UAE-Registered Personal Trainer · Dubai` when `reps.show`).
- Lead line (replaces "I don't believe in one-size-fits-all training"): **I train busy people the way I train myself: with structure, honesty and no wasted time.**
- Stats (separate items; replaces "2+ Years in Fitness"): **5 years** training · **12+ years** corporate · **4** languages.

### 8.1 My story
> I started training seriously five years ago, under the guidance of a coach, the same way I now work with my clients. Structure, proper technique and consistency changed how I look, how I feel, and how I handle a demanding career.
>
> For more than twelve years I've worked in business development across Iran and the GCC. Long days, travel and pressure: I know exactly what a busy schedule does to good intentions. That's why my coaching is built for real life, with efficient sessions, clear plans and progress you can actually measure.
>
> Before business, I spent five years teaching. It taught me to explain things simply and patiently, which is exactly what good technique coaching needs. For the past year I've been coaching clients one-to-one, and today I help busy professionals in Dubai build strength that lasts.

### 8.2 Why train with me (replaces "Know Saeid More" + Education/Professional/Multilingual list)
- **I've been where you are.** 12+ years in corporate business development, training around a demanding schedule.
- **I explain things clearly.** Five years of teaching (BA in English Literature) means step-by-step technique coaching you'll actually understand.
- **Coaching in your language.** English, Persian, Turkish and Azerbaijani.

### 8.3 Credentials
Keep the existing two cards, rendered only per `credentials.*.show`. REPs card shows `No. {number}` when set.

### 8.4 Gallery
Only from `photos.gallery`; hidden while empty. Swipeable on mobile.

### 8.5 CTA
Replace the centered "Follow on / Contact on" block with the standard left-aligned CTA block (Book a Free Consultation + WhatsApp Saeid). Instagram stays in header/footer.

---

## 9. FAQ, Terms, Privacy

### 9.1 FAQ (accordion — Home, Plans)
1. **Where do sessions take place?** At your home, your building's gym, or a gym in Al Jaddaf and nearby areas. Online coaching works anywhere.
2. **How much does it cost?** Every plan is tailored to you. In your free 30-minute consultation, Saeid recommends the right plan and shares its price.
3. **Do I need a gym membership?** Not necessarily. We can train at your home or in your building's gym. `{homeEquipmentNote}`
4. **How many sessions a week should I do?** Most busy professionals start with two a week (Momentum). You can choose one to four.
5. **Is nutrition included?** Yes. Every plan includes nutrition guidance: calorie and protein targets and practical eating habits.
6. **Can I train with a partner?** Yes. Partner Training is available on all four plans, with a special partner rate.
7. **I'm a complete beginner. Is that OK?** Absolutely. You'll learn proper technique from your first session.
8. **What languages do you coach in?** English, Persian, Turkish and Azerbaijani.
9. **What if I need to cancel?** Rescheduling is free with 24 hours' notice. See the full [cancellation policy](/terms).

### 9.2 `/terms` — Cancellation & Rescheduling
- **24-hour notice:** Reschedule or cancel at least 24 hours before your session at no cost.
- **Late cancellation or no-show:** Cancellations within 24 hours, or missed sessions, count as used.
- **Running late:** Sessions end at the scheduled time.
- **If Saeid cancels:** Your session is rescheduled at no cost.
- **Plan validity:** Sessions are valid for 30 days from your first session. Sessions cancelled with proper notice can be carried over once, up to 2 sessions.
- **Pause:** For travel or illness, your plan can be paused once per cycle for up to 14 days, with 48 hours' notice.
- **Partner training:** If one partner cancels late, the session goes ahead for the other at the partner rate.
- **Payment:** Plans are paid in advance, before the first session of each cycle.
- **Health:** Please tell Saeid about any injury or medical condition before training. Coaching is not a substitute for medical advice.

### 9.3 `/privacy` — Privacy Policy (plain-language draft)
- **Who we are:** FITologist.me, personal training by Saeid Soleimani, Dubai, UAE. Contact: WhatsApp `{whatsappDisplay}` `{contactEmail if set}`.
- **What we collect:** the details you enter in the form (name, WhatsApp number, age, goals, training preferences, area, notes), and Body Check inputs only if you choose to send them. Notes may include health information you choose to share, such as injuries.
- **Why:** to reply to you and arrange coaching. We don't sell your data or use it for anything else.
- **Where it's stored:** form submissions are sent to Saeid via a private Telegram notification and logged in a private Google Sheet.
- **Analytics:** we use Google Analytics and Meta Pixel to understand how the site is used *(render this bullet only if the IDs are set)*.
- **How long:** if you don't become a client, your details are deleted within 12 months.
- **Your rights:** message Saeid on WhatsApp to see, correct or delete your data.
- Last updated: {build date}.

---

## 10. Languages, SEO, tracking

### 10.1 Languages
- Supported: **EN** (default), **FA** (`/fa`, RTL), **AR** (`/ar`, RTL). **Remove RU** (301 to `/`).
- RTL: `dir="rtl"` + `lang`, fully mirrored layout (use logical CSS properties), icons that imply direction flipped, numbers and phone numbers kept LTR (`dir="ltr"` spans).
- Fonts: Vazirmatn (FA), IBM Plex Sans Arabic (AR), keep the current Latin faces. `font-display: swap`, preload the primary weight only.
- Translate all copy in this spec from EN. Write FA in a natural, conversational register (not formal/bureaucratic). Mark AR strings with a `// needs native review` comment in the dictionary.
- WhatsApp prefilled messages are localized to the page language.
- Switcher: text labels `EN | فا | ع`, keeps the current path, remembers the choice.
- `hreflang` alternates on every page.

### 10.2 SEO
- `/` title: **Personal Trainer in Dubai | Saeid Soleimani · FITologist.me**
- `/` description: *Personal trainer in Dubai for busy professionals. 1:1, partner, online and hybrid coaching at your home or in Al Jaddaf. Free 30-minute consultation.*
- Unique title, description and single H1 per page (`/plans`: Training Plans | …; `/method`: The FITologist Method | …; `/about`: About Saeid Soleimani | …; `/bmi`: Free BMI & Calorie Check | …).
- JSON-LD: `Person` (Saeid) + `ProfessionalService` (`areaServed`: Dubai; `availableLanguage`; `hasCredential` only for credentials with `show:true`). No price fields.
- OG/Twitter image 1200×630 (hero portrait + H1). `sitemap.xml`, `robots.txt`, canonical URLs, 301s from Section 2.1.

### 10.3 Tracking (load only if IDs are set)
GA4 + Meta Pixel. Events:
| Event | When | Params |
|---|---|---|
| `cta_click` | any primary CTA | `location` (hero, plans_card, footer…) |
| `bmi_calculated` | result shown | `category`, `goals` |
| `bmi_whatsapp_click` | "Send my result to Saeid" | `category` |
| `bmi_to_form` | "Book a Free Consultation" from result | — |
| `form_submit` | valid submit | `type`, `goals`, `api_ok` |
| `whatsapp_click` | floating / inline WhatsApp | `location` |
Meta Pixel: `Lead` on `form_submit`, `Contact` on WhatsApp clicks. Capture UTM params into the lead payload.

---

## 11. Phases (do one, report, wait for approval)

### Phase 1 — Foundations & mobile fixes
Sections 0 (inspection report), 1 (config), 2 (all of it), Home hero 4.1 + trust strip 4.2, removal of Philosophy/goal cards/composite images. Keep existing pages working.
**Done when:** hero criterion 4.1 passes on all three mobile sizes; no element is ever covered by the floating button; no scroll-fade on CTA; nav labels and CTA labels match 2.1/2.2 everywhere; RU removed with redirects; no horizontal scroll at 360px.

### Phase 2 — Lead flow & Body Check
Sections 3 and 6, `/bmi`, `/start`, `.env.example`, `scripts/sheets-webhook.gs`, `SETUP_LEADS.md`.
**Done when:** a test submit on iPhone Safari opens WhatsApp with the full message in one tap, a Telegram notification arrives, a row appears in the Sheet; with env vars removed the fallback state shows and WhatsApp still opens; multi-select goals work in both Body Check and form; prefill from Body Check works.

### Phase 3 — Pages & content
Sections 4.3–4.10, 5, 7, 8, 9 (FAQ, `/terms`, `/privacy`), 301 `/coaching` → `/plans`.
**Done when:** every page uses the copy in this file; no prices anywhere; credentials/testimonials/gallery hide correctly when config is empty and appear when filled.

### Phase 4 — Languages, SEO, tracking, QA
Section 10 + Section 12 checklist.

---

## 12. Final QA checklist
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95
- [ ] 360, 375, 390, 430 px and 1440 px: no overlap, no horizontal scroll
- [ ] Floating WhatsApp never covers content and hides near inline CTAs/form/footer
- [ ] All CTAs use the names in 2.2; no leftover old labels (search the codebase)
- [ ] FA and AR: mirrored layout, no broken alignment, phone numbers LTR
- [ ] Every input has a label, 16px font, correct `inputmode`/`autocomplete`
- [ ] Empty config values render nothing (credentials, testimonials, gallery, analytics, email)
- [ ] 301s: `/coaching` → `/plans`, `/ru/*` → `/`
- [ ] Lead test: Telegram ✓, Sheet ✓, WhatsApp opens ✓, success/fallback copy correct

## 13. Owner inputs still open (fill in `site.config` later)
`{{ACTIVEIQ}}` show flag · `{{REPS_NO}}` · `{{CONTACT_EMAIL}}` · `{{EQUIPMENT_NOTE}}` · `{{REAL_PHOTOS}}` · `{{TESTIMONIALS}}` · `{{GA4_ID}}` · `{{PIXEL_ID}}` · Telegram bot token & chat id · Sheets webhook URL
