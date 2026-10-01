# Website Specification — V1

Single landing page. Anchor navigation (5 items): **HOME `#home` · ABOUT `#about` · COACHING `#coaching` · METHOD `#method` · START TRAINING `#start-training`**. Mobile: compact premium overlay menu.

## Section order
1. **Hero** `#home` — photo 05 (desktop) / 07 (mobile, own composition). H1 "TRAIN. TRANSFORM. TRANSCEND." Supporting: "Personal Training by Saeid — Dubai, UAE". CTAs: START YOUR TRANSFORMATION → `#start-training`, VIEW COACHING → `#coaching`. Motion: slight scale-in, sequential type reveal, expanding orange line, scroll parallax.
2. **Positioning** — "Training is not just about changing how you look. It is about building a stronger version of yourself — with structure, consistency and purpose." Photo 06.
3. **About** `#about` — "MEET SAEID", photo 03. Coach behind FITologist; structured training, accountability, individualised programming. CTA START TRAINING. Credentials slot reserved (renders nothing until data supplied).
4. **Method** `#method` — "THE FITologist METHOD": 01 ASSESS · 02 BUILD · 03 TRANSFORM · 04 TRANSCEND. Staggered numbered cards. Photo 04 (top crop).
5. **Training goals** — BUILD MUSCLE · LOSE FAT · GET STRONGER · GENERAL FITNESS. Hover/tap response; selecting a goal pre-fills the application.
6. **Coaching** `#coaching` — "CHOOSE YOUR COACHING": 1:1 Personal Training / Online Coaching / Hybrid Coaching. No prices. Each → APPLY NOW (pre-fills coaching type).
7. **BMI calculator** — "KNOW YOUR STARTING POINT". Height + weight (metric / imperial), client-side, validated ranges, BMI + standard adult category, disclaimer, then "BMI IS ONLY THE START." + START TRAINING.
8. **Application** `#start-training` — max 6 fields: Name, Age, WhatsApp, Goal, Coaching Type, optional Note. Button APPLY TO TRAIN. Success: "APPLICATION RECEIVED" + WhatsApp continuation (pre-filled message). No backend in V1: submission boundary in `lib/application.ts` posts to `NEXT_PUBLIC_APPLICATION_ENDPOINT` if configured; otherwise it is honest that the details are sent via WhatsApp.
9. **Final CTA** — photo 10. "READY TO START?" "TRAIN • TRANSFORM • TRANSCEND". START TRAINING + WHATSAPP SAEID.
10. **Footer** — FITologist.me, Dubai UAE, Instagram fitologist.me, WhatsApp +971 50 646 1816, tagline. No email.

## BMI rules
BMI = kg / m². Valid input: height 100–250 cm (3'3"–8'2"), weight 25–350 kg (55–770 lb).
Categories: < 18.5 Underweight · 18.5–24.9 Healthy weight · 25–29.9 Overweight · ≥ 30 Obesity.
Disclaimer: "BMI is a general screening measure and does not directly measure body composition."

## Form validation
Name 2–60 chars · Age 16–99 · WhatsApp 8–15 digits (optional +, spaces, dashes) · Goal & Coaching required · Note ≤ 500 chars. Errors announced via `aria-describedby`/`aria-invalid`, focus moves to first invalid field.

## SEO
Title "FITologist.me | Personal Training in Dubai". Natural meta description (Personal Training, Online Coaching, Hybrid Coaching, Saeid, Dubai). One H1, logical H2/H3. Open Graph + Twitter card, favicon from logo mark, JSON-LD (LocalBusiness/ExerciseCoach style, no invented data).

## Accessibility
Semantic landmarks, labelled fields, keyboard navigable menu (Escape closes, focus managed), visible focus rings, WCAG-contrast text, meaningful alt text, decorative images `alt=""`/`aria-hidden`, `prefers-reduced-motion` respected.

## Responsive targets
320 · 375 · 390 · 430 · 768 · 1024 · 1280 · 1440+. No horizontal scroll, ≥44px touch targets, mobile-specific compositions.

## Revision 2 (layout & polish)
- Hero (desktop): headline block left; photo shifted right and dissolving into black; CTAs stacked right beneath the wall sign. Mobile keeps its dedicated composition.
- Positioning: "TRAINING IS ABOUT BUILDING A STRONGER VERSION OF YOURSELF." / "With structure, consistency and purpose." Image = 10 (brand banner), frameless.
- Frameless, edge-blended photography (`.blend-edges` CSS mask + `BlendedImage`) in Positioning, About, Method (04 full-height) and Final CTA (07).
- Section rhythm via `.section-y` (`--section-py`: 3.75 / 4.5 / 5.5rem). `scroll-margin-top` offsets each section's own padding so nav targets sit ~20px under the fixed header.
- Method cards: fixed number row → all titles share one baseline. Premium SVG dumbbell rides the scroll rail with gentle parallax.
- Goal cards: content top-aligned; orange atmospheric wash rises to ~mid-card on hover / focus / tap / selected.
- Coaching: tighter spacing; identical APPLY NOW treatment on all cards (orange → white text + orange tint on card hover/focus).
- BMI: + Age (adults 18–100 only) and Sex (Male/Female, recorded only — formula unchanged). Four colour ranges: <18.5 yellow, 18.5–<25 green, 25–<30 orange, ≥30 red. Card uses the logo's silver shadow tones (#4e4e4d → #444443).
- Application: compact desktop grid (Name | Age | WhatsApp; goals in one row; coaching in one row; 2-line note).
- Footer: large slogan removed.

## Revision 3 (premium polish)
- Header: 68px mobile / 86px desktop glass bar (rgba(5,5,5,0.72), 14px blur, 8% white hairline). Complete official logo (mark + wordmark), 40/48px tall. Active nav = orange; hover = orange transition; outlined START TRAINING CTA.
- Hero: Saeid left (full strength), headline + Personal Training by Saeid / Dubai, UAE + CTAs (orange primary, text secondary) in one right-hand column. Wall logo removed via a masked, localized veil that never touches Saeid. Headline ~13% smaller. Mobile: 3:4 crop on Saeid below the header.
- Surfaces: L1 #050505 · L2 #0B0D0E (`.surface-deep`, fades in/out with ambient glow) · L3 #111416 (cards) · L4 #1A1D1F (hover). Charcoal `.image-halo` behind About / Method / Final CTA photos.
- BMI: silver-tinted L3 panel (#BFC0C2 as tint, border, highlight); BMI number + label in category colour.
- Form: Name | Age, WhatsApp full width; fits one desktop viewport.
- Typography: section H2s ~12% smaller; card titles reduced. Hover transitions 300–400ms.

## Final polish round
- Header: fully transparent at top of page; smooth transition to glass (rgba(5,5,5,0.72), 14px blur, 8% hairline) on scroll. Complete logo at 64px desktop / 44px mobile.
- Hero: photo layer shifted ~4% left and lowered (clamp 84–140px) so Saeid's hair clears the header; the band behind the header is a stretched, softened strip of the photo's own ceiling (no Saeid, no black bar). Heavy left overlay removed; only a right-side atmosphere behind the copy. Larger, bolder subtext.
- Positioning copy: "TRAINING IS ABOUT BUILDING A STRONGER YOU." / "With structure, consistency and purpose." Background: #050505 left → #0B0D0E → faint logo-silver atmosphere right (`.surface-silver-right`).
- Method: explicit grid (heading cols 1–6, photo cols 8–12 below the header, cards full-width row over the photo's faded legs). Cards: translucent gradient rgba(17,20,22,0.25) → rgba(5,5,5,0.82). Dumbbell removed from Method.
- Dumbbell: new `DumbbellDivider` transition between Method and Training Goals (restrained scroll parallax + slight tilt).
- BMI: obesity red #FF3B30.
- Application success: "Application received" / "Your information has been received." / "If you'd like to speak with Saeid directly, you can continue the conversation on WhatsApp." + WHATSAPP SAEID → (wa.me/971506461816, pre-filled).
- Final CTA: photo 07 on the left (natural left edge), dissolving rightwards into a logo-silver/charcoal wall-toned atmosphere, CTA content on the right.
- Footer: "Personal Training by Saeid" / "1:1 PT, Online and Hybrid Coaching". All slogan lines removed from the footer.

## Final visual refinement #2
- Method: `BlendedGallery` crossfade 04 → 01 → 02 (hold 4.5s, fade 1.1s, subtle 1.03→1 settle), orange progress lines, pauses on hover/focus/off-screen, no auto-rotate with reduced motion.
- About: `saeid-original-01.PNG` (edge-blended).
- Dumbbell removed. `ArmCurlDivider`: line-art torso + arm; only the forearm/dumbbell group rotates about the elbow, mapped to scroll (rest −6° → peak −145° → −20°). Reduced motion: static −45°.
- Final CTA: image nudged right; left wall extended from the photo's own edge columns; background tones sampled from the wall in 07 (#6b5b50 / #61534c, spot-lit edge #b48f70).
- Footer: compact (~282px desktop, ~416px mobile).
- WhatsApp message: "Hi Saeid, / I'd like to start training. / Name / Age / Goal / Coaching Type / [note] / Thank you." — URL-encoded via encodeURIComponent on wa.me/971506461816; opens only when the user taps.

## Final refinement #3
- Header: logo 92px (desktop) / 62px (mobile) at top, scales to 64/44px once scrolling (transform only). Desktop CTA = "BMI Calculator" → #bmi with a slow 3s border/glow pulse (off for reduced motion). Mobile menu includes BMI Calculator.
- Philosophy: only "STRONGER" in orange; supporting line all white; three boxes replaced by an editorial statement (Build with structure. / Stay consistent. / Train with purpose.).
- Coach: title "Saeid Soleimani"; grouped profile from `COACH` in lib/site.ts (facts as supplied); certificate placeholders driven by `CERTIFICATES` (add `image/width/height` to publish); "Follow on [Instagram]" + "Contact on [WhatsApp]" editorial actions.
- Method: cards removed → 2×2 editorial grid; `FragmentGallery` (natural aspect per slide, object-contain, 4×3 fragment dispersion ~1.45s, fragments only mounted during transitions, reduced motion = crossfade).
- Arm-curl divider removed. Desktop-only `ScrollDumbbell` progress indicator (right edge).
- Goals: numbers removed; large orange background icons on the right; wash rises to ~50%.
- Final CTA: image shifted right; photo extended on both sides with its own wall (CSS background sampling of edge columns) so ".me" stays clear; wall-toned gradient.
- Footer: single compact band (~153px desktop) incl. BMI Calculator; bold white contact details with orange icons.
- Section rhythm tokens: 3 / 3.5 / 4.25rem.

## Final refinement #4
- Removed the desktop scroll dumbbell entirely.
- Coach: "The coach" / SAEID SOLEIMANI; Professional credentials = ONE Active IQ credential (Level 3 Diploma — Gym Instructing & Personal Training) + REPs UAE (Category A Personal Trainer), each with its exact supplied logo on a small light plate (logos' dark artwork is otherwise invisible on black). Educational background: BA in English Literature · 5+ Years Teaching English as a Second Language · 12+ Years in Business Development · 2+ Years in Fitness · Multilingual.
- Coaching: numbers removed; large composed background visuals (person+dumbbell / monitor+phone / person⇄phone), hover wash + brighter/larger visual; APPLY NOW turns white.
- Header: compacts on scroll (86→72px desktop, 68→64px mobile); anchors offset by the compact height (`--header-compact`).
- Footer: ~91px desktop; contact left-aligned in a 2×2 grid, 16px semibold.
- BMI under-18 message: "This calculator uses adult BMI categories and is not intended for children or teens (under 18)."
- Application success: next step = contact Saeid on WhatsApp; message opens ready to send (user presses Send).

## Multilingual restructure (en / ar / ru)
- Routes: `/`, `/about`, `/method`, `/coaching` (English, unprefixed) + `/ar/...` (RTL) + `/ru/...`. `app/[lang]` root layout sets `<html lang dir>`; `proxy.ts` rewrites unprefixed paths to `/en`, 308-redirects `/en/...` to clean URLs. Unknown paths → localized 404.
- Translations: `website/lib/i18n/dictionaries/{en,ar,ru}.ts`. `en.ts` defines the `Dictionary` type; ar/ru must match it (missing key = build error). Client components read strings via `useI18n()`; data constants in `lib/site.ts` are language-neutral keys (goals, coaching types, credentials).
- Fonts: Inter + Barlow Condensed (en); Cairo for Arabic; Oswald for Russian headings (Inter covers Cyrillic body). Arabic: no letter-spacing, roomier display line-height; directional arrows mirror, brand icons and photographs do not.
- SEO: per-page/per-language title, description, canonical, hreflang (en/ar/ru/x-default), OG locale; sitemap lists all 12 URLs with alternates.
- Homepage: Hero → Philosophy + "What are you training for?" (6 selectable goals, "This is my goal →") → BMI → Who is this for? → short start/WhatsApp CTA.
- /about: Meet your coach, intro quote, credentials (Active IQ Level 3 Diploma; REPs UAE Category A) with logos secondary to text, "2+ years in fitness" with the fitness credentials; journey gallery + Educational & professional background lower.
- /method: banner2 (`brand-banner2.webp` from `10-fitologist-brand-banner2.PNG`) hero, four stages with the new copy, "Ready to start? / Take the assessment →".
- /coaching: "Choose how you train" (includes, no prices, pricing note) + "Ready to start?" (photo 07 treatment + application form, `#start-training`).
- Goal/coaching choices persist in sessionStorage across pages and languages and pre-fill the form; the WhatsApp message is written in the visitor's language.
- Floating "Chat on WhatsApp" button appears after the first screen (reading-end corner). Flag language selector in header, mobile header and footer; switching keeps the page and section hash.
- Homepage philosophy visual replaced: old #10 (`10-fitologist-brand-banner.png`) removed from the site; `brand-banner2.webp` (banner2, full 1672×941 frame, edge-blended) sits beside the philosophy copy. Philosophy + Goals tightened to one desktop viewport (section 804px at 1440×900, 748px at 1366×768; was 1052px).
- Homepage banner2 is now a full-bleed background layer on desktop (≥1024px): from the section top to the bottom of the goal cards, bleeding off the right edge (~1200px wide at 1440, left edge ≈ 233px), box ratio kept within ~3% of the image's 1672:941 (branding never cropped). Content sits above it; contrast comes from the image's own masked edges plus localized gradients (#050505 / #111111) under the goals and behind the goals intro — no full overlay. Goal cards are slightly translucent with a light blur. Mobile keeps the banner in flow, full frame.

## Final UI/UX refinement
- Home goals: disclaimer and helper line removed; no divider; heading closer to philosophy; cards slightly lower; large 52px line icons; "I'm not sure yet" = Signpost; "Select a goal to continue" / "This is my goal →" start-aligned under the cards.
- BMI: graphite/silver metallic card on a distinct graphite band; Height · Weight · Age · Gender in one row (2×2 on mobile); bold 0.9rem labels; boxed 56px controls; result area reserved from the start (no layout shift — verified 453px before/after at 1440).
- Home CTA copy: "Tell Saeid about your goals, it takes about a minute" / "Or simply say hello on WhatsApp." (exact; translated for ar/ru).
- About: saeid-original-01 (about-portrait.webp) is a background layer — photo → soft fade → charcoal → faint silver (`.about-portrait-mask`); 2+ years in fitness directly under the approach line, before credentials; "Know Saeid more"; larger Instagram/WhatsApp lockups; tighter gap before Ready to start.
- Coaching form: Name | Age | WhatsApp on one desktop row; graphite card with silver sheen; full form + Apply visible in one viewport at 1440×778 and 1366×768.
- Floating WhatsApp shows after ~35% of the first screen (soft fade-up). Header: Instagram icon beside the flags (BMI Calculator CTA kept).
- Section rhythm tokens: 2.75 / 3 / 3.5rem.

## Final visual refinement — round 2
- Goal cards: vector inside the card on a fine circular plate (turns orange on hover) → larger/bolder title → description → "Choose goal →" (Selected ✓).
- BMI: result absent until calculated, then revealed (height + fade); desktop card column reserves the revealed height (verified 0px shift for en/ar/ru at 1440 and 1366). Card max 36rem (576px); fields 48px; Height · Weight · Age row, then Gender + Calculate. "Your BMI" bold orange. Left copy wider (5 cols) and larger.
- Who is this for: low-opacity orange line vectors clipped per row — briefcase (professionals), footprints (beginners), barbell (experienced lifters).
- About: Instagram/WhatsApp lockups centred as one group under the credentials.
- Photo album = `PhotoLayerGallery` (replaces FragmentGallery): 04 → 01 → 02 → 12me; 3.4s per image, 1.15s turn (slight rotateY ±14°, drift, fade); each photo is a masked layer at its own ratio (`.photo-layer-mask`), edges dissolve — no frame. Reduced motion: crossfade. Used on About only.
- New asset: `journey-12me.webp` (encode of `12me.PNG`). `about-portrait.webp` regenerated from the current `saeid-original-01.PNG`.
- Method page reverted (by request) to its state before round 2: banner2 hero, four-stage editorial grid with logo watermark, Ready to start CTA — no photo album on Method.

## Arabic RTL refinement (rtl: variants only — English/Russian unaffected)
- Right inset for Arabic content containers: `rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]` (≈ +31px at 1440, +27px at 1366, +4px at 390) on BMI, Who is this for, Home CTA, Coaching, Start training, About intro, About background.
- Hero copy: `rtl:lg:right-[max(5rem,8vw)]` (+43px at 1440) and `rtl:pr-6 rtl:sm:pr-10` below lg.
- Philosophy (desktop): Arabic copy placed over the banner's dark left third (`rtl:lg:col-start-7 rtl:xl:col-start-8`) so it no longer sits on the banner logo; still RTL / right-aligned. Banner never mirrored.
- Goals heading only: `rtl:lg:pr-[clamp(1.5rem,2.2vw,2rem)]`; goal cards unchanged.
- About intro: grid pinned LTR with the text column `dir="rtl"`, so the Arabic copy sits right of the portrait instead of over it.
- Header (Arabic, desktop): `rtl:lg:px-[clamp(3.5rem,4.2vw,4.25rem)]`.
