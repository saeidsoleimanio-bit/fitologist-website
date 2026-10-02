"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import { FragmentLayerGallery, type LayerSlide } from "@/components/ui/FragmentLayerGallery";
import { SectionHeading } from "@/components/ui/primitives";
import { site } from "@/config/site";
import { EASE, VIEWPORT } from "@/lib/motion";

const row = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={row} className="grid gap-2 border-t hairline py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <h3 className="eyebrow pt-0.5 text-[0.72rem] text-ember">{label}</h3>
      <div>{children}</div>
    </motion.div>
  );
}

/** About page, lower: the journey gallery beside the educational & professional background. */
export function AboutBackground() {
  const { t, dir } = useI18n();
  const a = t.about;
  // Portrait-format placeholder dimensions; real photo sizes are set when the gallery is filled (Phase 3).
  const gallery: LayerSlide[] = site.photos.gallery.map((src) => ({ src, alt: a.journeyLabel, width: 941, height: 1672 }));

  return (
    <section
      aria-labelledby="background-title"
      className="section-y surface-deep relative isolate overflow-hidden [--glow-x:75%] [--glow-y:40%] [--section-pb:2rem] lg:flex lg:items-center lg:[--section-pb:2.25rem]"
    >
      {/* Gallery renders only from config/site.ts → photos.gallery (real, non-composite photos). */}
      {gallery.length > 0 && (
        <>
      {/*
        Journey photographs as a large background layer: full section height on the left from lg
        (bleeding to the viewport edge), in flow on mobile. No frame, card or halo.
      */}
      <div className="relative -z-10 mx-auto h-[min(128vw,38rem)] w-full max-w-md lg:absolute lg:-inset-y-[9%] lg:left-0 lg:mx-0 lg:h-auto lg:w-[min(56vw,54rem)] lg:max-w-none">
        <FragmentLayerGallery
          slides={gallery}
          label={a.journeyLabel}
          dotsLabel={(i, n) => `${a.journeyShow} ${i} / ${n}`}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-full w-full"
          dotsClassName="bottom-0 lg:bottom-[10%]"
        />
      </div>
        </>
      )}

      {/* Layout pinned LTR so the text sits beside the photo layer in every language */}
      <div className="relative mx-auto grid w-full max-w-[88rem] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]" dir="ltr">
        <div className={gallery.length > 0 ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-9"} dir={dir}>
          <SectionHeading label={a.backgroundEyebrow} title={a.backgroundTitle} id="background-title" />

          <motion.div
            className="mt-8"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
          >
            <Group label={a.education.label}>
              <ul className="space-y-1.5">
                {a.education.items.map((item) => (
                  <li key={item} className="text-[1.05rem] text-bone">
                    {item}
                  </li>
                ))}
              </ul>
            </Group>
            <Group label={a.professional.label}>
              <ul className="space-y-1.5">
                {a.professional.items.map((item) => (
                  <li key={item} className="text-[1.05rem] text-bone">
                    {item}
                  </li>
                ))}
              </ul>
            </Group>
            <Group label={a.multilingualLabel}>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[1.05rem] text-bone">
                {a.languages.map((l, i) => (
                  <span key={l} className="inline-flex items-center gap-3">
                    {l}
                    {i < a.languages.length - 1 && <span aria-hidden className="size-1 rounded-full bg-ember" />}
                  </span>
                ))}
              </p>
            </Group>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
