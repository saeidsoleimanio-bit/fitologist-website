"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";
import { site } from "@/config/site";

/** Compact "Meet Saeid" on Home (§4.7): small avatar beside the lead line, one sentence, link. The large portrait lives on /about. */
export function MeetSaeid() {
  const { t, href } = useI18n();
  const m = t.meet;
  return (
    <section aria-labelledby="meet-title" className="section-y relative bg-ink lg:pb-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:max-w-5xl rtl:pr-6 rtl:sm:pr-10">
        <Reveal>
          <p className="eyebrow text-ember">{m.eyebrow}</p>
          <div className="mt-3 flex items-center gap-5 lg:gap-9">
            {site.photos.meetCutout && (
              <div className="relative size-[5.5rem] shrink-0 lg:size-36">
                {/* Irregular orange glow: three offset blurred shapes, slow calm pulse. The photo stays still. */}
                <div aria-hidden className="glow-beat pointer-events-none absolute -inset-6 lg:-inset-10">
                  <span className="absolute left-[2%] top-[22%] h-[58%] w-[64%] rotate-[-18deg] rounded-[58%_42%_55%_45%/48%_60%_40%_52%] bg-ember/45 blur-[18px]" />
                  <span className="absolute right-[0%] top-[4%] h-[46%] w-[52%] rotate-[24deg] rounded-[45%_55%_40%_60%/55%_45%_60%_40%] bg-[#ff8a2a]/40 blur-[14px]" />
                  <span className="absolute bottom-[4%] left-[30%] h-[36%] w-[60%] rotate-[8deg] rounded-[60%_40%_50%_50%/50%_55%_45%_50%] bg-ember/30 blur-[20px]" />
                </div>
                <Image
                  src={site.photos.meetCutout}
                  alt={m.photoAlt}
                  width={176}
                  height={176}
                  sizes="(min-width: 1024px) 144px, 88px"
                  className="relative size-full object-contain [mask-image:linear-gradient(to_bottom,#000_60%,transparent_98%),linear-gradient(to_right,transparent_0%,#000_16%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
                />
              </div>
            )}
            <h2 id="meet-title" className="font-display text-[clamp(1.45rem,5vw,2.2rem)] font-semibold leading-[1.12] text-bone lg:text-[2.6rem]">
              {m.lead}
            </h2>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-silver lg:mt-6 lg:text-xl">{m.body}</p>
          <Link
            href={href("/about")}
            className="mt-2 inline-flex min-h-11 items-center font-semibold text-ember-soft underline decoration-ember/40 underline-offset-[6px] transition-colors hover:text-bone"
          >
            {m.link}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
