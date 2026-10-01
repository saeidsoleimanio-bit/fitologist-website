# FITologist.me — Website (V1)

Single-page premium landing site for **FITologist.me — Personal Training by Saeid, Dubai**.
Specs live in the project root: `PROJECT-BRIEF.md`, `BRAND-GUIDELINES.md`, `ASSET-MANIFEST.md`, `WEBSITE-SPEC.md`.

## Stack
Next.js 16 (App Router, static) · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide React

## Commands
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm run start      # serve the production build
npm run lint
npm run typecheck
npm run images     # regenerate web images from ../assets/originals (read-only source)
```

## Structure
```
app/            layout (metadata, fonts, JSON-LD), page, icons, robots, sitemap
components/
  Header.tsx, Footer.tsx
  sections/     Hero, Positioning, About, Method, Goals, Coaching, BmiCalculator, Application, FinalCta
  ui/           Button, primitives (Reveal, AccentLine, ParallaxImage, LogoWatermark…), icons
  providers/    MotionProvider (reduced motion), ApplicationProvider (goal/coaching preselect)
lib/            site constants, BMI logic, application validation + submit boundary
scripts/        optimize-images.mjs
public/images/  generated web assets
```

## Application form
No backend in V1. `lib/application.ts#submitApplication` POSTs JSON to
`NEXT_PUBLIC_APPLICATION_ENDPOINT` when set (see `.env.example`); otherwise nothing is sent and the
success screen hands the pre-filled application to WhatsApp (+971 50 646 1816).

## Content rules
Never add invented certifications, testimonials, client numbers, years of experience, awards,
pricing or guaranteed results. Credentials are reserved: add real ones to `CREDENTIALS` in
`lib/site.ts` and they render in the About section automatically.
