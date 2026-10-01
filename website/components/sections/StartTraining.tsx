"use client";

import { motion } from "framer-motion";
import Image, { getImageProps } from "next/image";
import { useI18n } from "@/components/i18n/I18nProvider";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { EASE, VIEWPORT } from "@/lib/motion";
import { ApplicationForm } from "./Application";

/** Optimised (640w) URL of photo 07, shared by both wall-extension strips. */
const WALL_SRC = getImageProps({ src: "/images/hero-mobile.webp", alt: "", width: 640, height: 1045, quality: 75 }).props.src;

/**
 * Coaching page, section 2 — "Ready to start?": photo 07 with its wall-extension treatment
 * (SAEID → WALL / GREY ATMOSPHERE) beside the application form. Anchor: #start-training.
 * The photo composition is physical (left) in every language — it is a photograph, not text.
 */
export function StartTraining() {
  const { t, dir } = useI18n();
  const titleId = "apply-title";

  return (
    <section
      id="start-training"
      aria-labelledby={titleId}
      className="grain section-y relative isolate overflow-hidden bg-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // Tones sampled from the wall in 07 (#6b5b50 lit, #61534c lower) and mixed toward charcoal,
          // so the photograph reads as continuing into the page.
          background: [
            "linear-gradient(180deg, #050505 0%, transparent 13%, transparent 87%, #050505 100%)",
            "radial-gradient(38% 60% at 36% 50%, rgb(107 91 80 / 0.34), rgb(97 83 76 / 0.13) 55%, transparent 85%)",
            // warm spill matching the spot-lit left edge of the photo (#b48f70 / #877366)
            "radial-gradient(14% 42% at 8% 42%, rgb(180 143 112 / 0.16), rgb(135 115 102 / 0.06) 55%, transparent 85%)",
            "radial-gradient(40% 50% at 82% 60%, rgb(255 106 0 / 0.04), transparent 70%)",
            "linear-gradient(90deg, #050505 0%, color-mix(in srgb, #61534c 22%, #0b0d0e) 10%, color-mix(in srgb, #61534c 36%, #0b0d0e) 28%, color-mix(in srgb, #6b5b50 30%, #0b0d0e) 44%, color-mix(in srgb, #6b5b50 16%, #0b0d0e) 60%, color-mix(in srgb, #bfc0c2 6%, #0b0d0e) 76%, color-mix(in srgb, #bfc0c2 3%, #0b0d0e) 88%, #050505 100%)",
          ].join(", "),
        }}
      />

      <div className="mx-auto grid max-w-[88rem] items-start gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]" dir="ltr">
        {/* Photo: after the form on mobile, sticky on the left from lg */}
        <Reveal
          delay={0.1}
          className="order-2 mx-auto w-full max-w-sm lg:sticky lg:top-[calc(var(--header-compact)+1rem)] lg:order-none lg:col-span-5 lg:max-w-none"
        >
          {/*
            Box = left wall extension (11.5%) + photo (70.8%) + right wall extension (17.7%).
            Extensions stretch the photo's own outermost 2% columns (pure wall), mirrored so they
            join seamlessly. Fades happen over wall only: Saeid and the "FITologist.me" sign stay
            untouched. Right side: IMAGE → WALL TONE → charcoal → dark.
          */}
          <div
            className="blend-edges relative aspect-[1329/1537] w-full max-w-[34rem] lg:max-w-[min(100%,calc(86vh*0.8647))] lg:mx-auto"
            style={{ "--fade-l": "14%", "--fade-r": "19%", "--fade-t": "9%", "--fade-b": "14%" } as React.CSSProperties}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.03 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              {/*
                Wall extensions sit UNDER the photo and overlap it slightly. Each is a small div whose
                CSS background samples only the photo's outermost 2% of columns (background-size
                5000% → 2% of the image spans the strip), mirrored for a seamless join. No large
                transformed layers, so painting stays cheap.
              */}
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-[14%] -scale-x-100 blur-[1.5px]"
                style={{ backgroundImage: `url("${WALL_SRC}")`, backgroundSize: "5000% 100%", backgroundPosition: "0% 50%" }}
              />
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 w-[20.2%] -scale-x-100 blur-[1.5px]"
                style={{ backgroundImage: `url("${WALL_SRC}")`, backgroundSize: "5000% 100%", backgroundPosition: "100% 50%" }}
              />
              {/* …and the photo's outer edges feather into them, so there is no join line. */}
              <div className="absolute inset-y-0 left-[11.5%] w-[70.8%] [mask-image:linear-gradient(to_right,transparent_0,#000_3.5%,#000_96.5%,transparent_100%)]">
                <Image
                  src="/images/hero-mobile.webp"
                  alt={t.start.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 70vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-none lg:col-span-7" dir={dir}>
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span className="text-ember">{t.start.eyebrow}</span>
          </Reveal>
          {/* Observe the (unclipped) heading; the line starts hidden inside an overflow-hidden mask. */}
          <motion.h2
            id={titleId}
            className="display mt-4 text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.88] text-bone lg:mt-3 lg:text-[clamp(3rem,4.4vw,4.25rem)]"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block"
                variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}
              >
                {t.start.title}
              </motion.span>
            </span>
          </motion.h2>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-silver lg:mt-3 lg:max-w-none lg:text-base">{t.start.body}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-7 lg:mt-5">
            <ApplicationForm titleId={titleId} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
