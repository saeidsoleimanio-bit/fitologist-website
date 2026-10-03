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
  replyPromise: "within a few hours",   // lead form + success message (owner revision)
  supportReplyHours: 24,               // Plans → "WhatsApp support" only
  languagesSpoken: ["English", "فارسی", "Azərbaycanca"],   // Turkish removed (owner revision)

  credentials: {
    activeIq: { show: false, title: "Level 3 Diploma in Gym Instructing & Personal Training" }, // {{ACTIVEIQ}} set show:true once issued
    reps:     { show: false, category: "", number: "" },  // {{REPS_NO}} · category optional (shown in the card subline when set)
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
- `credentials.*.show === false` → hide that credential everywhere (About cards, trust strip, schema).
- **"Certified" wording (owner revision):** comes **only** from the Active IQ certificate (`activeIq.show`, exported as `isCertified`) — Home H1/title "Your Certified Personal Trainer in Dubai", About subtitle "Certified Personal Trainer · Dubai" (only when REPs is off). **REPs UAE is a registration: never call it "Certified" or "Qualified" anywhere** (copy, translations, JSON-LD); it is "Registered" ("REPs UAE-Registered Personal Trainer", "Registered Personal Trainer").
- `testimonials.length === 0` → testimonials section not rendered.
- `photos.gallery.length === 0` → About gallery not rendered.
- `homeEquipmentNote === ""` → omit that sentence from the FAQ answer.

Secrets (bot token etc.) are **env vars**, never in this config (Section 6.4).

---

## 1a. Desktop layout (owner revision, Oct 2026) — `lg` (≥1024px) only

Phones and tablets are unchanged by everything in this section (verified: 32 full-page screenshots at 375/390px EN/FA pixel-identical before/after, except the Persian Home H1).
- **Spacing:** desktop section padding 2.75rem (≈88px between sections; 72–96px rule); no large empty areas.
- **Home hero:** CTA, "Check your BMI in 30 seconds" (white, 1.1rem, orange underline) and the "Train · Transform · Transcend" tagline (light grey, larger) sit on a soft dark radial backdrop so they read on any part of the photo.
- **Trust strip:** one row on desktop with a thin orange rule above and below (full content width), no boxes, icons kept, larger text; one line from 1280px (fluid gap 20→48px), may wrap into two balanced lines between 1024 and 1279px.
- **Meet Saeid:** wider (max 64rem), larger photo (144px, same glow), larger lead (2.6rem) and text; smaller gap to the next section.
- **"Your First Step Is Free" (Home):** two top-aligned columns — left: H2, the three steps, "Want the details first?" links; right: the form.
- **/method:** the stage row moves up so the outlined numbers overlap the bottom of the hero photo (the hero's bottom fade keeps text readable); the food pyramid, drumstick and Oats bowl move to the empty left column (below "Your first 30 days"), ~35% stronger, with no text over them; "Nutrition, kept simple" (heading + paragraph) sits in the right column on the same row as the art group, vertically centred with it (owner revision 2); smaller gap above "Your first step is free".
- **/plans:** hero photo pinned to the top of its area so Saeid's whole head is visible, and (owner revision 2) a taller hero (min(100svh, 58rem)) with a short bottom fade, so the clipboard in his hands — including the logo on its back — is visible and "Step 1" starts lower (copy stays on the dark side); "Your first step is free" (left) and the FAQ (right) side by side, top-aligned; the form at the bottom spans the full content width with fields in rows (Name | WhatsApp | Age + Sex; Goals | Training type; Preferred time | "Anything Saeid should know?" top-aligned; consent + submit + helper below) — driven by container queries (form ≥56rem wide), so narrower forms (Home column, phones) keep their layout. **/start** (desktop) uses the same full-width form.
- **Header "Book a Free Consultation" (desktop, xl+, owner revision):** shown on every page, except — Home while at the very top (the hero shows the same CTA; fades in after scrolling), /start (the page is the form), and any page while the lead form (`#start`) is in the viewport (shows again when it leaves). Same 240ms fade as mobile; when hidden it is removed from the tab order and the accessibility tree (visibility hidden).

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

**Mobile header:** compact logo (~40px when scrolled, no tagline) · short primary button `Free Consultation` · hamburger. Instagram and the text language switcher move into the drawer. If the button does not fit at 360px width, hide it below 360px only.
- **Mobile language button (owner revision, mobile review):** left of the hamburger, a compact button showing the current code (`EN` / `ع`; `فا` added with Phase 4) that opens a small dropdown of languages (full names). Visible in both header states (transparent and solid), 44px tap target, `aria-label="Change language"` (localized). Closes on outside tap / Escape. Must fit at 360px with the logo, `Free Consultation` and the hamburger (verified: it fits); if a future change breaks that, hide the `Free Consultation` button below 375px — never the language button. No language popup on page load. Respect the top safe area (`viewport-fit=cover` + `env(safe-area-inset-top)`).
- **All pages (owner revision, Oct 2026 — supersedes "Home only" and the Phase 3 rule):** below xl, at the top of every page (scrollY < ~20px) the header is **transparent** with a subtle top gradient (black ~60% → transparent); the logo is larger (~64–72px, via transform/scale — no layout shift); the header `Free Consultation` button is hidden. After scrolling (or with the menu open): solid black, fixed, logo ~40px, button fades in. Transition ~200–250ms. Desktop (xl+) keeps its transparent-at-top bar with the button always visible. The §4.1 hero criterion must still pass.
- On pages with a hero photo, the logo, language button and hamburger must never sit over Saeid's face: photos are positioned like the Home hero (`/plans` starts its photo below the header band; `/about` places the portrait below the header on mobile).

**Footer (owner revision, compact):** ~⅓ of a phone screen (≈250px at 390×844, was 487px). Logo + tagline (*Personal Training by Saeid* / *1:1, Partner, Online and Hybrid Coaching*; Arabic *تدريب فردي، وثنائي، وأونلاين، وهجين*) on one compact row; nav links (menu items + `Terms` + `Privacy`) as small inline wrapping text, max 2 rows, reduced letter-spacing; WhatsApp number and Instagram on one row with icons; small copyright. **No** "Book a Free Consultation" link, **no** language switcher (both are in the header) and no separate "Dubai, UAE" line.

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
- **Owner revision (Oct 2026):** fixed bottom corner and **visible at all times** while scrolling, on all pages (mobile and desktop). No hiding near inline CTAs, the footer or other controls. Only two exceptions: (a) hidden while any text input / textarea is focused (keyboard open); (b) hidden only when it would sit directly over the form's submit button, the Body Check "Check my numbers" button, or the Body Check result buttons (`data-fab-avoid`).
- Respect `env(safe-area-inset-bottom)`.
- **Mobile spacing (owner revision, mobile review — supersedes the earlier ~88px rule):** sections no longer carry the 88px bottom padding. Only the last section of each page keeps extra bottom space (~88px) above the footer, so nothing rests under the button.
- **Section rhythm (mobile):** ~56–64px from the end of one section's content to the next section's first element (`--section-py` = 1.875rem on mobile/tablet). Spacing inside sections unchanged.

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

- Decorative line icons on cards: remove on mobile; on desktop move them so they never overlap text or links. **Exception (owner revision):** the "Who I work with" rows (§4.3) show their neon line-art icons on mobile too, in their own column so they never overlap titles or text.
- Remove arrows that are not links (Method step arrows).

### 2.7 Accessibility baseline

`aria-label` on all icon-only buttons (hamburger, Instagram, WhatsApp, language), visible focus states, tap targets ≥44px, every input has a linked `<label>`, error messages announced (`aria-live`), `prefers-reduced-motion` respected.

---

## 3. Free Body Check (component used on `/` and `/bmi`)

Replaces the current BMI calculator. Purpose: give a useful result instantly, then turn it into a conversation.

### 3.1 Copy
- Title: **Free Body Check**
- Subtitle: *30 seconds. See your BMI, a healthy weight range for your height, and an estimate of your daily calories.*

**Background art (owner revision):** 5–7 faint orange line-art vectors (protein shaker, protein tub, flexed arm, barbell squat, dumbbell, stopwatch) scattered irregularly behind the card content at ~10% opacity, varied sizes and rotations; `aria-hidden`, no pointer events. **Placement (mobile):** each vector sits mostly (≈70–80%+) in the empty space of the card (gaps between label rows and field groups, side margins, space above the button); only small edges may tuck behind fields, never mostly hidden behind an input, chip or button. Verify at 375, 390 and 430px. Inputs, chips and buttons have fully opaque backgrounds so the art never shows inside them; text contrast unaffected.

**Card size (owner revision):** keep the card compact. Tight vertical spacing between fields, labels and rows (about 10–15% shorter than the first build). The units toggle sits under the subtitle, outside the card. Inputs stay ≥44px tall and 16px.

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

**Final Home order (owner revision, Oct 2026 — supersedes the mobile-review order):** Hero · Trust strip · Who I work with · Free Body Check · Meet Saeid (compact) · Testimonials (hidden while empty) · What happens next · Form (`#start`) · Footer. No FAQ, no How it works and no Training plans preview on Home (the full versions live on `/method` and `/plans`).

### 4.1 Hero
**Mobile acceptance criterion:** at 390×844 the eyebrow, H1, subtitle and primary button are fully visible on first load without scrolling; at 375×667 at least H1 and the primary button. Use a shorter image (~50–55svh, `object-position: top`) with the text on a bottom gradient or directly below.

**Copy (owner revision, Oct 2026 — supersedes the earlier eyebrow/H1/subtitle):**
- Eyebrow: `Hi, I'm Saeid` (no certified variant)
- **H1 on two controlled lines (owner revision 4), larger and extra-bold (800):** credentials off **Your Personal Trainer** / **in Dubai**; Active IQ on (§1) **Your Certified** / **Personal Trainer in Dubai**. Each line is its own block, so the break never moves; font-size = content width ÷ the widest line's measured width × 0.97 (`H1_RATIO` in `Hero.tsx`, per language and variant — re-measure if the copy changes), so each line stays on one line at 360/375/390/430px (EN ≈ 34–48px). Desktop: same two-line structure, sized to the copy column (max 72px). The eyebrow stays clearly smaller.
- Subtitle in **two lines** (owner revision 2): line 1 (brighter, semibold) *Training built around your busy schedule:* · line 2 *1:1 & Partner Training (Couples & Friends), Online and Hybrid Coaching.* (owner revision 3: location removed — the trust strip right below covers it)
- FA: eyebrow «سلام، سعید هستم» · H1 «مربی شخصی شما» / «در دبی» (certified, owner revision: «مربی شخصی شما در دبی» / «با مدرک معتبر», same sizing rule, desktop and mobile; FA page title with Active IQ on: «مربی شخصی شما در دبی، با مدرک معتبر | …») · subtitle line 1 «تمرینی هماهنگ با برنامه‌ی شلوغ شما:» · line 2 «تمرین یک‌به‌یک و دونفره (زوج‌ها و دوستان)، تمرین آنلاین و ترکیبی.»
- AR (needs native review): eyebrow «مرحباً، أنا سعيد» · H1 «مدربك الشخصي» / «في دبي» (certified: «مدربك الشخصي» / «المعتمد في دبي») · subtitle line 1 «تدريب مصمَّم حول جدولك المزدحم:» · line 2 «تدريب فردي 1:1 وثنائي (للأزواج والأصدقاء)، وتدريب أونلاين وهجين.»
- **Typography (owner revision 2):** eyebrow in sentence case, normal letter-spacing, orange, display font, 24px at 360–390 → ~26px at 430 (28px desktop), always clearly smaller than the H1. **H1 on mobile (< 640px) is always one line** and as large as fits: `font-size = (content width) ÷ (H1 width at 1px) × 0.97`, the ratio measured per language and title variant (`H1_RATIO` in `Hero.tsx` — re-measure if the H1 copy changes). Result: EN ~29px at 360 → ~36px at 430; FA/AR slightly larger. Tablet/desktop H1 sizes unchanged.
- Primary: **Book a Free Consultation** · Secondary text link: **Check your BMI in 30 seconds** (→ Body Check section)
- "Train. Transform. Transcend." may stay only as a small tagline, never as the H1.
- **Mobile photo (owner revision):** photo shifted down ~7% (offset, not scaled) with a soft top fade, so there is clear room between Saeid's head and the top of the screen/header. The half-visible wall sign ("FIT… / TRAIN • TR…") at the right edge is removed with a localized overlay only on that area (dark wall tone + soft blur, feathered edges, positioned in photo coordinates so it tracks the sign at every phone size), never touching Saeid — as clean as the desktop treatment. Check at 375×667, 390×844, 430×932.

### 4.2 Trust strip
**Owner revision (supersedes the list below):** no boxes, no borders, no horizontal scroll. Exactly three centered lines, icon at the start of each:
- **Credential lines (owner revision):** REPs → **REPs UAE Registered** (FA «ثبت‌شده در REPs UAE», AR «مسجّل لدى REPs UAE»; + `No. {number}` when set), matching **Active IQ Level 3**. All trust lines are one line (fluid 14–16px) and, on phones, centred in the width beside the floating WhatsApp button (end padding 76px; mirrored on RTL), so no line ever runs under the button at any mobile width.
- [pin] **Dubai, Al Jaddaf & Nearby**
- [home] **Home & Gym Sessions Available**
- [languages] **English, فارسی, Azərbaycanca** (Turkish removed site-wide — owner revision): one line, never wrapped (font shrinks slightly at narrow widths, minimum 14px); each language wrapped in `<bdi>` so commas keep their order; Arabic page uses the Arabic comma.
Credentials (when enabled) appear above these in the same style. Original items for reference:
- REPs UAE `{category}` `No. {number}` *(only if reps.show)*
- Active IQ Level 3 *(only if activeIq.show)*
- Al Jaddaf & nearby
- Home sessions available
- English · فارسی · Azərbaycanca

### 4.3 Who I work with (owner revision — replaces the earlier 4.3)
Keep the three-row editorial structure (no cards).
- Eyebrow: `Who I work with`
- **H2: Built for Real Life**
- Sub: *For people who want serious results without making fitness their entire life.*
- Rows:
  - **01 Busy Professionals** — Train around a demanding schedule, with sessions that fit your week. (owner revision: location removed)
  - **02 Beginners** — Learn proper technique and build confidence from day one.
  - **03 Already Training** — Training without a clear plan? Get structured programming and steady progression.
- One orange line-art vector per row, on the right side: 01 briefcase, 02 footsteps, 03 dumbbell. Bright neon orange with a soft glow, clearly visible, **shown on mobile too** (exception to §2.6), never overlapping titles; body text must meet WCAG AA.
- Arabic copy translated to match (`// needs native review`).

### 4.4 Free Body Check
Component from Section 3, anchor `#bmi`.

### 4.5 How it works (summary) — **removed from Home** (owner revision)
The full version stays on `/method`; Home links to it from 4.10.

### 4.6 Training plans (preview) — **removed from Home** (owner revision)
The four cards, the line and the FAQ link are gone; Home links to `/plans` and `/plans#faq` from 4.10.

### 4.7 Meet Saeid (short)
**Compact (owner revision):** photo on the left (mirrored on Arabic), lead line on the right, then the one-sentence summary and the link. The large portrait stays on `/about` only.
- **Photo (owner revision 2):** no circular frame or border; ~88px (≈35% larger than the old 64px avatar). Head-and-shoulders cut-out of photo 05 on a transparent background (`photos.meetCutout` = `/images/meet-saeid-cutout.webp`, made with rembg isnet + alpha matting; hair edges checked at 2×; original untouched). Bottom/left edges of the shirt fade out with a CSS mask.
- **Glow:** irregular orange glow behind the photo (three offset, blurred, uneven shapes; medium strength), pulsing slowly like a calm heartbeat (~3.8s cycle, slight opacity + scale). The photo itself never moves. No animation under `prefers-reduced-motion`.
- **I train busy people the way I train myself: with structure, honesty and no wasted time.**
- *Five years of training, twelve years in corporate life, and coaching in three languages.*
- Link: **More about Saeid** → `/about`

### 4.8 Testimonials
Render only if `testimonials.length > 0`. Card: quote, first name, goal. Build the component now; it stays hidden. Sits directly before the form.

### 4.9 FAQ
**Removed from Home (owner revision).** The FAQ lives on `/plans` (`id="faq"`); Home links to it from 4.10.

### 4.10 What happens next + Start (form)
Anchor `#start`. On **Home** (owner revision, Oct 2026), directly above the form, a "What happens next" block replaces the old intro sentence and standalone reply line:
- **H2: Your First Step Is Free**
- Three compact numbered steps (number inline with the text; FA uses Persian digits):
  1. *Send your details. It takes about a minute.*
  2. *Saeid replies personally within a few hours.* — keeps the small orange clock icon, the soft orange glow and the slow shimmer every ~5s (no motion under `prefers-reduced-motion`).
  3. *Free 30-minute consultation, online or in person. No pressure, just a conversation.*
- *Want the details first?* on its own line; on the next line, together: **How it works** (`/method`) · **Training plans** (`/plans`) · **FAQ** (`/plans#faq`).
- FA/AR: same structure, natural translations (AR marked for native review).

On `/plans` and `/start` the form keeps its earlier intro: H2, *A 30-minute consultation, online or in person. No pressure, just a conversation.* and the one-line reply promise with icon, glow and shimmer (no avatar; font 14.4px at 360 → 16px, never below 14px).
- Form component (Section 6).

---

## 5. Method page (`/method`) — keep, expand

- **H1: The FITologist Method**
- Subtitle: *Four stages. One clear process, so you always know where you are and what comes next.*
- **Hero image (owner revision, supersedes "plain dark background"):** `assets/originals/10-fitologist-brand-banner2.PNG` → `/images/brand-banner2.webp`, with its baked-in logo, tagline and slogans covered by localized darken + blur veils (photo coordinates). Mobile: photo with the copy directly below; desktop: copy over the photo's dark left side (same side in every language). Remove non-link arrows.
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
**2×2 grid of equal-width boxes** (owner revision), text centred, each word capitalised, small orange line icon above each label: row 1 **Body Measurements** | **Consistency** · row 2 **Progress Photos** | **Strength Numbers**. FA/AR same order.

### 5.4 Nutrition, kept simple
*Every plan includes nutrition guidance: calorie and protein targets and practical eating habits that fit your life. No extreme diets. If you have a medical condition, I'll work alongside your doctor or dietitian.*
Decoration (owner revision 2 — replaces the plate/avocado vectors): **one hand-drawn food pyramid** in the background, 4 horizontal tiers in a sketchy, slightly uneven line style (deterministic wobble + a lighter second pass), faint orange like the other background vectors, rotated ~6°. Handwriting labels (Caveat — the same face as the dictionary card's "that's me!" note), bottom → top: **Carbohydrates** (widest) · **Protein** · **Healthy Fats** · **Treats** (smallest); labels a little more visible than the lines (owner revision: raised ~35% to ≈35% vs 22% opacity, sketch pass 11%) but clearly background; silver paragraph text over the art stays ≥6:1. Placement: end side of the block (right in LTR, **left on RTL pages**), base just above the section's bottom edge, tip reaching up behind the last line of the paragraph, never overlapping the heading; ~180px wide at 360px, no horizontal scroll. Labels stay English on every language version. `aria-hidden`, `pointer-events: none`; text contrast stays WCAG AA.
- **Chicken drumstick + oats bowl (owner revision 4 — the drumstick replaces the earlier steak):** two more hand-drawn pieces in the same sketchy faint orange, on the **start** side below the paragraph (left in LTR; mirrored to the right on RTL pages, where the pyramid is on the left): a chicken drumstick (simple meaty outline tapering into the bone, two-knob bone end visible, a couple of skin strokes; same position, size range and ~−11° rotation the steak had) and a bowl with oat flakes and **"Oats"** handwritten on it in the pyramid's handwriting font (rotated ~7°). Casually placed, not aligned with each other or the pyramid; they never overlap the paragraph, the heading or the pyramid (slightly smaller on RTL pages, where the start padding is wider). `aria-hidden`, `pointer-events: none`.
- **Spacing:** the art's base reaches into the section's bottom padding (fully visible, not cropped), so the gap from the bottom of the art to the next section ("Your first step is free.") is ~58–60px on mobile (56–64px rule).

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

**Mobile layout (owner revision, mobile review):**
- **WhatsApp number:** country select and number on one row. The select is narrow (~104px) and shows only the dial code (`+971`) when closed; the open list shows country names. Nothing overflows the card (number input `min-w-0 flex-1`).
- **Age + Sex on one row:** Age ~40%, **Sex** ~60% as a Male / Female segmented control — optional, prefilled from the Body Check (`fit_prefill.sex`); tapping the selected option clears it. Sex is included in the WhatsApp message, the Telegram message and the Sheet (`sex` column, appended last).
- **Goals, Training type, How often, Preferred time:** pill chips that wrap (flex-wrap, ~44px tall, rounded), state shown by fill and border (no separate box indicator). Multi-select / single-select behaviour unchanged.

Pre-fill age, sex and goals from `sessionStorage.fit_prefill` (Section 3.5); pre-select training type if arriving from a plan card (`?type=hybrid` etc.).

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
  2. **Google Sheet** (lead log): `POST` JSON to `{SHEETS_WEBHOOK_URL}` (a Google Apps Script web app that appends a row). Columns: timestamp, name, whatsapp, age, goals, type, frequency, area, times, notes, language, source, bmi, utm_source, utm_campaign, sex (added last so existing rows keep their columns; the script writes any missing header cells).
- Return `200 {ok:true}` if **at least one** delivery succeeded; otherwise `502`.
- Env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SHEETS_WEBHOOK_URL`. Never exposed to the client. Provide `.env.example`.
- Also provide the Apps Script code (`scripts/sheets-webhook.gs`) and a short `SETUP_LEADS.md` for the owner: create bot with @BotFather → get token; message the bot, get chat id; create Sheet → Extensions → Apps Script → paste → Deploy as web app (Anyone) → copy URL; add the three env vars to the host; redeploy; send a test lead.

### 6.5 States & copy
- **Sending:** *Opening WhatsApp…*
- **Success** (API ok):
  > **Request sent ✓**
  > Saeid has received your details and will reply within a few hours. WhatsApp is open so you can chat with him directly. Just press **Send**.
  > [Open WhatsApp again] · Edit details
- **Fallback** (API failed or offline):
  > **Almost done**
  > Press **Send** in WhatsApp to reach Saeid.
  > [Open WhatsApp] · Edit details
- Never show "received/sent" wording unless the API returned ok.
- Remove the old "Application received" screen and the large photo below the form on mobile.

---

## 7. Training Plans page (`/plans`) — owner restructure (Oct 2026)

**Principle:** the page follows the order a client decides in — how to train, then how often — with **one CTA** plus the form. Type and frequency are two separate choices. **No prices anywhere on the site.** The only buttons are the summary CTA (7.4), the header button and the floating WhatsApp button; no CTA in the intro, on plan cards or on Partner/Online/Hybrid.

Order: Intro → Step 1 → Step 2 → Summary + CTA → Every plan includes → Your first step is free → FAQ (`#faq`) → Form (`#start`). Section spacing follows the 56–64px mobile rule.

### 7.1 Intro (hero)
- **Background photo (owner revision 2):** `assets/originals/training-plan.PNG` → `/images/training-plan.webp` (Saeid writing a plan on a FITologist clipboard; dark gym wall on the right). Desktop: eyebrow, H1 and intro over the **right**, dark side of the photo (same side in every language). Mobile (360–430px): the dark wall is too narrow to carry readable text, so — per the owner's fallback — the copy sits **directly below the photo**, overlapping its bottom fade like Home; the photo starts below the header band, so the logo, language button and hamburger never sit over Saeid's face.
- Header: the all-pages transparent-at-top behaviour (§2.1).
- Eyebrow: `Training Plans` · **H1: Build Your Plan** · Text: *Choose how you train and how often. Saeid will confirm the right plan and share pricing in your free consultation.* · No button.

### 7.2 Step 1 — "How do you want to train?"
Four selectable cards (radio group: tap/keyboard to select; selected = orange border + soft orange fill + check). Stacked on mobile, 2×2 on tablet, 4 across on wide desktop. No buttons.
- **Card layout (owner revision):** no small top icon. The **title** sits on the top row, aligned with the radio circle, ~24% larger than before (1.8rem); long titles (e.g. "Partner Training (Couples & Friends)") wrap to two lines but never run under the circle. Then the one line and the "Best for" line. Cards are shorter than before (5–36px at 360–430px).
- **Background line-art (owner revision):** one larger neon-orange line drawing per card with a soft glow (same style as the "Who I work with" icons), bottom-right and partly cropped by the card edge (**bottom-left on RTL pages**). **Objects only — no human figures or silhouettes** (owner revision 2): 1:1 — a clipboard with a ticked checklist and a stopwatch beside it (a plan written for you, a coach keeping time) · Partner — two protein shakers clinking in a "cheers", with small motion lines at the point of contact · Online — a smartphone with a play button on the screen (workout video) and a small checkmark badge · Hybrid — a dumbbell resting in front of a smartphone, overlapping it. Where objects overlap, the back object's lines stop behind the front one (SVG masks), so no lines cross. ~20% opacity normally, brighter (~36%) when the card is selected; on the selected card the body text switches to bone so text over the art keeps WCAG AA (≥4.5:1, measured ~5.9:1; unselected silver text ~6.5:1). Never overlaps the title or radio circle (checked at 360/375/390/430 in EN/FA/AR). `aria-hidden`, `pointer-events: none`.
- **1:1 Personal Training** — Private sessions with Saeid. At your home, your building's gym, or a gym in Al Jaddaf & nearby. *Best for:* hands-on coaching and beginners.
- **Partner Training (Couples & Friends)** — Two people, same session, special partner rate. Same locations as 1:1. *Best for:* training together and staying motivated.
- **Online Coaching** — Your program in a coaching app, weekly check-ins and video form reviews. Works anywhere. *Best for:* training on your own with expert guidance.
- **Hybrid Coaching** — In-person sessions plus an online program for the days you train alone. *Best for:* busy professionals who want both.
(The separate "Where we train" section is removed; locations live in the 1:1 card.)

### 7.3 Step 2 — "How often?"
Line above: *All sessions 60 minutes.* The four plans as selectable compact cards (2×2 on mobile, 4 across on desktop), each with its one-line "best for":

| Plan | How often | Sessions / month | Best for |
|---|---|---|---|
| Foundation | 1× a week | 4 | Learning technique and building the habit |
| Momentum · *Recommended* | 2× a week | 8 | Busy professionals who want steady progress |
| Accelerate | 3× a week | 12 | Faster, visible body transformation |
| Elite | 4× a week | 16 | Maximum results and accountability |

- **Online selected:** Step 2's cards are hidden; instead: *Online coaching is monthly: weekly check-ins and a new training block every 4 weeks.*
- **Hybrid selected:** only Foundation and Momentum are selectable; Accelerate and Elite are disabled, with the note *Hybrid combines up to 2 sessions a week with online training.* (A 3×/4× choice is cleared when switching to Hybrid.)
- **Nothing selected in Step 1:** Step 2 is visible and selectable.

### 7.4 Summary + the only CTA
- Live line: *Your plan: {type} · {plan} ({frequency})* (partial choices show what is chosen; Online shows *Online Coaching · monthly*). Nothing selected: *Not sure yet? That's what the consultation is for.*
- Button **Book a Free Consultation** → scrolls to `#start` and prefills Training type and How often in the form. Tracks `plan_selected { type, plan }`.
- `?type=` and `?freq=` URL params are still supported: they preselect these cards and the form (invalid combinations such as Hybrid + 3×/4× or Online + a frequency are ignored by the cards).

### 7.5 Every plan includes
- **Personalised program:** built around your goals, level and schedule.
- **Technique coaching:** coached rep by rep, safely progressed.
- **Nutrition guidance:** calorie and protein targets with practical eating habits.
- **Progress check every 4 weeks:** measurements, photos and strength.
- **WhatsApp support:** questions answered within 24 hours.
(No button.)

### 7.6 Your first step is free
- **30-minute consultation** — Free · Online or in person
- *We'll talk about where you are, where you want to go, and the right plan to get you there:*
  - Your goals and priorities
  - Your current fitness level, training history and any injuries
  - Your schedule and where you'd like to train
  - Your questions, answered
  - The plan we recommend, and its price
- **No pressure. Just a conversation.** (No button — the FAQ and the form follow.)

### 7.7 FAQ and form
FAQ (9.1, `id="faq"`), then the form (`#start`), as before.

Persian and Arabic: same structure with natural translations (Arabic marked for native review); plan names stay in Latin script.

Remove the old Coaching-page note "Pricing depends on the plan you choose — ask Saeid on WhatsApp for details."

---

## 8. About page (`/about`)

- Header: transparent at the top like every page (§2.1); on mobile the portrait sits below the header band so icons never overlap the face. Remove the vertical Train/Transform/Transcend stack on mobile.
  - **Status (owner decision):** the "Train / Transform / Transcend" text baked into the About portrait (x 8–25%, y 21–34% of the image) is **kept intentionally** — no crop, veil or overlay on that photo.
- **Order (owner revision):** hero (photo, eyebrow, name, subtitle, languages line, lead line) → credentials **or** stats row → My Story → dictionary card → gallery (hidden while empty) → CTA block. The "Why train with me" section is removed (its content is now in the story and the languages line).
- Eyebrow: `Meet your coach` · **H1: Saeid Soleimani** · Subtitle: `Personal Trainer · Dubai` while credentials are off; **`REPs UAE-Registered Personal Trainer`** (no "· Dubai", owner revision) when `reps.show` — always one line at 360/375/390/430px (letter-spacing 0.08em instead of 0.12em below 640px; FA «مربی شخصی ثبت‌شده در REPs UAE», AR «مدرب شخصي مسجّل لدى REPs UAE»); `Certified Personal Trainer · Dubai` when only `activeIq.show` (§1: certified wording comes from Active IQ only; Home H1/title switch to "Your Certified Personal Trainer in Dubai" when `activeIq.show`).
- Languages line under the subtitle: *Coaching in English, فارسی and Azərbaycanca.* (names from `languagesSpoken`; FA «مربیگری به English، فارسی و Azərbaycanca.», AR «أدرّب باللغات: English، فارسی وAzərbaycanca.»).
- Lead line (replaces "I don't believe in one-size-fits-all training"): **I train busy people the way I train myself: with structure, honesty and no wasted time.**
- **Credentials or stats (owner revision):** when `credentials.activeIq.show` / `credentials.reps.show` are true, the credential cards (8.3) render in this place. While both are off, the stats show as **one compact row** (not boxes): **5 years** training · **12+ years** corporate · **3** languages (font scales so it stays one row at 360–430px).

### 8.1 My story (owner revision — exactly two paragraphs)
> Five years ago I started training seriously, with a coach, a structure and a plan, the same way I now work with my clients. It changed more than my body: it changed how I feel, how I focus and how I handle a demanding career. Along the way, training became more than a habit. I studied it properly and {ACTIVEIQ_SENTENCE}
>
> For more than twelve years I've worked in business development across Iran and the GCC, and before that I spent five years teaching. I know what long days, travel and pressure do to good intentions, and I know how to explain things simply. That's what I bring to every client: efficient sessions, a clear plan and progress you can measure, built around the life you actually have.

{ACTIVEIQ_SENTENCE}: `activeIq.show === false` → *I'm completing the Level 3 Diploma in Gym Instructing & Personal Training with Active IQ, a UK-regulated qualification.* · `true` → *earned the Level 3 Diploma in Gym Instructing & Personal Training from Active IQ, a UK-regulated qualification.* (owner revision: "UK-regulated", not "UK-accredited") FA/AR: natural translations of both versions (dictionary `about.story`, `about.aiqPending`, `about.aiqEarned`; AR marked for review).

### 8.1a Dictionary page card (owner revision, after "My story")
Directly after the "My story" paragraphs: a torn fragment of a printed dictionary page, **built in HTML/CSS** (no image) so the text stays sharp, selectable, translatable and readable by screen readers (`components/sections/AboutDictionary.tsx`).
- **Look:** warm off-white paper with a CSS grain (SVG turbulence) and warm edge tone, dark grey ink, irregular torn top and bottom edges (deterministic `clip-path` polygon), soft drop shadow, rotated −1.5°. Width 92% on mobile, max 560px; no horizontal scroll at 360px.
- **Book title (owner revision):** at the very top of the paper, above the guide words, in the same serif: **THE DICTIONARY OF FITNESS** with a small italic line *Unabridged · Second Edition*. No Webster / Merriam-Webster name or logo.
- **Running head:** guide words "fist — fitting" (left), large "F" and page "214" (right), thin rule under it — decorative (`aria-hidden`).
- **Type:** Source Serif 4 (variable; latin + latin-ext for the IPA glyphs): headword bold, pronunciation light grey, part of speech italic.
- **Entries (exact text and order, English on every language version):**
  1. **fit** /fɪt/ *adj.* In good physical shape; strong, healthy and ready for whatever the day throws at you.
  2. **fitness** /ˈfɪt.nəs/ *n.* The state of being fit. Built on consistency, not perfection.
  3. **FIT·ol·o·gist** /fɪˈtɒl.ə.dʒɪst/ *n.* A coach who studies what gets people fit, and makes it work for your life. ▸ *see also:* Saeid (Dubai).
  4. **fitting** /ˈfɪt.ɪŋ/ *adj.* Right for the situation, like a plan built around your… (runs into the torn bottom edge, fading out)
- **Highlighter:** brand-orange, slightly uneven hand-drawn marker stroke behind "FIT·ol·o·gist"; draws in left → right (~0.8s) once when the card scrolls into view. No other motion. Under `prefers-reduced-motion` it is simply shown.
- **Margin note:** blue ballpoint handwriting in the right margin of the FITologist entry, slightly rotated: EN "← that's me!" (Caveat 500); FA «این منم!», AR «هذا أنا!» (Aref Ruqaa). The card itself is English/LTR, so the arrow always sits at the note's left and points left, at the headword.
- **FA/AR only:** one small line under the card translating the FITologist definition (dictionary key `about.dictionary.translation`; empty in English = hidden).
- **Performance:** card fonts are scoped to this component, not preloaded, `display: swap`; one weight per handwriting face. /about stays ≥ 90 on Lighthouse mobile (measured 97 EN/FA/AR).

### 8.2 Why train with me — **removed** (owner revision)
Its content now lives in My Story and the languages line.

### 8.3 Credentials
Two cards with logos (as in the original design), rendered only per `credentials.*.show`, in the place of the stats row (8, top):
- **Active IQ** card — title **LEVEL 3 DIPLOMA** · line 2 *Gym Instructing & Personal Training* · line 3 on its own line, smaller and slightly muted, no parentheses: **[UK flag]** *UK-regulated qualification*.
- **REPs UAE** card — label **REPs UAE** · title **REGISTERED PERSONAL TRAINER** · subline (one line) **[UAE flag]** *UAE · Level 3* (with `credentials.reps.category` set: *UAE · Level 3 · {category}*) · `No. {number}` below when `credentials.reps.number` is set. No "Category A".
- **Flags (owner revision):** small inline SVG icons (never emoji — Windows shows flag emoji as letters), ~0.8em tall, at the start of the line (right side on RTL pages; the flags themselves are never mirrored), `role="img"` with an accessible name (EN "United Kingdom" / "United Arab Emirates"; FA/AR localized).
- **Logos (owner revision):** both logo boxes share the same height, 46px (~28% larger than before); widths follow each logo's proportions (Active IQ wordmark 22px tall, REPs mark 38px tall so its small "The Register of Exercise Professionals" text is larger). Logos stay secondary to the card titles. Label and logo share one row (checked at 360–430px in EN/FA/AR, no wrapping); if space ever runs out, the logo box wraps above the label instead of pushing the label onto two lines.
- Trust strip (REPs on): **REPs UAE · Registered Personal Trainer** (+ `No. {number}`). JSON-LD `hasCredential`: Active IQ "Level 3 Diploma in Gym Instructing & Personal Training" (`credentialCategory`: UK-regulated qualification); REPs "Registered Personal Trainer (Level 3[, category])" (`credentialCategory`: Registration).
- FA/AR: natural translations (FA «مربی شخصی ثبت‌شده» · «سطح ۳ · ثبت متخصصان تمرین امارات (REPs UAE)» · «مدرکی رسمی و تحت نظارت در بریتانیا»; AR marked for review).
Both switches stay **off** until the certificates are issued. To turn them on, in `website/config/site.ts`: `credentials.activeIq.show: true`; `credentials.reps.show: true`, `credentials.reps.number: "<number>"` and optionally `credentials.reps.category: "<category>"`.

### 8.4 Gallery
Only from `photos.gallery`; hidden while empty. Swipeable on mobile.

### 8.5 CTA
Replace the centered "Follow on / Contact on" block with the standard left-aligned CTA block (Book a Free Consultation + WhatsApp Saeid). Instagram stays in header/footer.

---

## 9. FAQ, Terms, Privacy

### 9.1 FAQ (accordion — Plans only, `id="faq"`)
1. **Where do sessions take place?** At your home, your building's gym, or a gym in Al Jaddaf and nearby areas. Online coaching works anywhere.
2. **How much does it cost?** Every plan is tailored to you. In your free 30-minute consultation, Saeid recommends the right plan and shares its price.
3. **Do I need a gym membership?** Not necessarily. We can train at your home or in your building's gym. `{homeEquipmentNote}`
4. **How many sessions a week should I do?** Most busy professionals start with two a week (Momentum). You can choose one to four.
5. **Is nutrition included?** Yes. Every plan includes nutrition guidance: calorie and protein targets and practical eating habits.
6. **Can I train with a partner?** Yes. Partner Training is available on all four plans, with a special partner rate.
7. **I'm a complete beginner. Is that OK?** Absolutely. You'll learn proper technique from your first session.
8. **What languages do you coach in?** English, Persian and Azerbaijani.
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
  - **As built (Phase 4):** FA/AR faces are not preloaded at all: the `[lang]` layout is shared by every locale, so a preload would make English pages download them too; `swap` keeps text visible. IBM Plex Sans Arabic ships 400/600/700 (500 falls back to 400). Latin brand/plan names and numbers on FA/AR pages (`dir="ltr"` display text) keep Barlow Condensed. Extended-Latin language names (Azərbaycanca) render in the system font so one letter doesn't download Inter's latin-ext file.
  - Numeric inputs accept Persian (۰–۹) and Arabic-Indic (٠–٩) digits and convert them to Latin. FA copy uses Persian digits; the Privacy "Last updated" date uses the Persian (Solar Hijri) calendar on `/fa`.
- Translate all copy in this spec from EN. Write FA in a natural, conversational register (not formal/bureaucratic). Mark AR strings with a `// needs native review` comment in the dictionary.
- WhatsApp prefilled messages are localized to the page language.
- Switcher: text labels `EN | فا | ع`, keeps the current path, remembers the choice (cookie `fit_lang`, 1 year; an unprefixed URL then 307-redirects to the chosen `/fa` or `/ar` page; choosing EN clears it back to English). Search engines carry no cookie, so they always get the requested URL.
- `hreflang` alternates on every page.

### 10.2 SEO
- `/` title (owner revision, matches the H1): **Your Personal Trainer in Dubai | Saeid Soleimani · FITologist.me** — with a credential enabled: **Your Certified Personal Trainer in Dubai | …**
- `/` description: *Hi, I'm Saeid, your personal trainer in Dubai. Training built around your busy schedule: 1:1, partner, online and hybrid coaching at your home or in Al Jaddaf. Free 30-minute consultation.* (FA/AR equivalents in the dictionaries)
- Unique title, description and single H1 per page (`/plans`: Training Plans | …; `/method`: The FITologist Method | …; `/about`: About Saeid Soleimani | …; `/bmi`: Free BMI & Calorie Check | …).
- JSON-LD: `Person` (Saeid) + `ProfessionalService` (`areaServed`: Dubai; `availableLanguage`: English, Persian, Azerbaijani; `hasCredential` only for credentials with `show:true`). No price fields.
- OG/Twitter image 1200×630 (hero portrait + H1) — one per language: `/images/og-en.jpg`, `og-fa.jpg`, `og-ar.jpg` (rendered from `hero-desktop.webp` + the localized eyebrow/H1; Saeid unaltered). Re-rendered for the new hero copy ("Hi, I'm Saeid" / "Your Personal Trainer in Dubai"); they use the non-certified H1 — re-render when a credential is enabled. `sitemap.xml`, `robots.txt`, canonical URLs, 301s from Section 2.1.

### 10.3 Tracking (load only if IDs are set)
GA4 + Meta Pixel. Events:
| Event | When | Params |
|---|---|---|
| `cta_click` | any primary CTA | `location` (hero, plans_summary, footer…) |
| `plan_selected` | Plans summary CTA (§7.4) | `type`, `plan` |
| `bmi_calculated` | result shown | `category`, `goals` |
| `bmi_whatsapp_click` | "Send my result to Saeid" | `category` |
| `bmi_to_form` | "Book a Free Consultation" from result | — |
| `form_submit` | valid submit (fired before WhatsApp opens, so it isn't lost when the phone switches to WhatsApp) | `type`, `goals` |
| `lead_delivery` | API answered (only if the page is still open) | `api_ok` |
| `whatsapp_click` | floating / inline WhatsApp | `location` |
Meta Pixel: `Lead` on `form_submit`, `Contact` on WhatsApp clicks. Capture UTM params into the lead payload.
**As built:** `components/Analytics.tsx` renders nothing (no scripts, no listeners) while `analytics.ga4Id` / `analytics.metaPixelId` are empty. Clicks are tracked by delegation: `data-cta="hero|header|menu|footer|cta_block|plans_summary"` and WhatsApp links (`data-wa="floating|menu|footer|cta_block"`, else the containing section id). `lib/analytics.ts` → `track()`.

---

## 11. Phases (do one, report, wait for approval)

### Phase 1 — Foundations & mobile fixes
Sections 0 (inspection report), 1 (config), 2 (all of it), Home hero 4.1 + trust strip 4.2, removal of Philosophy/goal cards/composite images. Keep existing pages working.
**Done when:** hero criterion 4.1 passes on all three mobile sizes; the floating button stays visible except while typing or over the form submit / "Check my numbers" / Body Check result buttons (§2.3 owner revision); no scroll-fade on CTA; nav labels and CTA labels match 2.1/2.2 everywhere; RU removed with redirects; no horizontal scroll at 360px.

### Phase 2 — Lead flow & Body Check
Sections 3 and 6, `/bmi`, `/start`, `.env.example`, `scripts/sheets-webhook.gs`, `SETUP_LEADS.md`.
**Done when:** a test submit on iPhone Safari opens WhatsApp with the full message in one tap, a Telegram notification arrives, a row appears in the Sheet; with env vars removed the fallback state shows and WhatsApp still opens; multi-select goals work in both Body Check and form; prefill from Body Check works.

### Phase 3 — Pages & content
Sections 4.3–4.10, 5, 7, 8, 9 (FAQ, `/terms`, `/privacy`), 301 `/coaching` → `/plans`.
**Done when:** every page uses the copy in this file; no prices anywhere; credentials/testimonials/gallery hide correctly when config is empty and appear when filled.

### Phase 4 — Languages, SEO, tracking, QA
Section 10 + Section 12 checklist.
**Performance rule (Phase 4):** content on the first screen of any page (hero copy and image, page intros, Method stages, About portrait) must not wait for JavaScript to become visible — its entrance animation is CSS (`.load-fade-up`, `.load-fade-out`, `.load-settle`, `Reveal load`), not Framer `initial` opacity 0. Framer reveals are for content below the first screen only.

---

## 12. Final QA checklist
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95
- [ ] 360, 375, 390, 430 px and 1440 px: no overlap, no horizontal scroll
- [ ] Floating WhatsApp always visible; hidden only while typing or over the form submit / "Check my numbers" / Body Check result buttons
- [ ] All CTAs use the names in 2.2; no leftover old labels (search the codebase)
- [ ] FA and AR: mirrored layout, no broken alignment, phone numbers LTR
- [ ] Every input has a label, 16px font, correct `inputmode`/`autocomplete`
- [ ] Empty config values render nothing (credentials, testimonials, gallery, analytics, email)
- [ ] 301s: `/coaching` → `/plans`, `/ru/*` → `/`
- [ ] Lead test: Telegram ✓, Sheet ✓, WhatsApp opens ✓, success/fallback copy correct

## 13. Owner inputs still open (fill in `site.config` later)
`{{ACTIVEIQ}}` show flag · `{{REPS_NO}}` · `{{CONTACT_EMAIL}}` · `{{EQUIPMENT_NOTE}}` · `{{REAL_PHOTOS}}` · `{{TESTIMONIALS}}` · `{{GA4_ID}}` · `{{PIXEL_ID}}` · Telegram bot token & chat id · Sheets webhook URL
