"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";
import { site } from "@/config/site";
import { AboutDictionary } from "./AboutDictionary";

const INSET = "rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]";

/** About (§8.1, §8.1a, §8.4): my story, the dictionary card and the gallery (only when photos exist). */
export function AboutStory() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <>
      <section aria-labelledby="story-title" className="section-y surface-deep relative">
        <div className={`mx-auto max-w-3xl px-4 sm:px-8 lg:px-12 ${INSET}`}>
          <Reveal>
            <h2 id="story-title" className="display text-[clamp(2.25rem,7vw,3.75rem)] text-bone">
              {a.storyTitle}
            </h2>
          </Reveal>
          {/* Two paragraphs (owner revision); P1 ends with the Active IQ sentence for the current config state */}
          <div className="mt-5 space-y-4">
            {[`${a.story[0]} ${site.credentials.activeIq.show ? a.aiqEarned : a.aiqPending}`, a.story[1]].map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-[1.05rem] leading-relaxed text-silver lg:text-lg">{para}</p>
              </Reveal>
            ))}
          </div>
          {/* Dictionary-page card, directly after "My story" (owner revision) */}
          <AboutDictionary />
        </div>
      </section>

      {/* Gallery — real, non-composite photos only; hidden while photos.gallery is empty. Swipeable. */}
      {site.photos.gallery.length > 0 && (
        <section aria-label={a.galleryLabel} className="relative bg-ink py-8">
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
            {site.photos.gallery.map((src) => (
              <li key={src} className="relative aspect-[3/4] w-[72vw] max-w-sm shrink-0 snap-start overflow-hidden sm:w-[40vw]">
                <Image src={src} alt={a.galleryLabel} fill sizes="(min-width: 640px) 40vw, 72vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
