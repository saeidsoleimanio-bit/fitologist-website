"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { AccentLine, Reveal } from "@/components/ui/primitives";
import { START_PATH, whatsappLink } from "@/lib/site";

/** Short closing call to action on the homepage: start the application, or say hello on WhatsApp. */
export function HomeCta({ className = "" }: { className?: string }) {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="home-cta-title" className={`grain section-y relative isolate overflow-hidden bg-ink ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 70% at 20% 50%, rgb(255 106 0 / 0.07), transparent 70%)" }}
      />
      <div className="relative mx-auto flex max-w-[88rem] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <div className="max-w-2xl">
          <Reveal className="eyebrow flex items-center gap-4">
            <AccentLine className="w-10" />
            <span>{t.homeCta.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="home-cta-title" className="display mt-5 text-[clamp(2.75rem,9vw,5.5rem)] text-bone">
              {t.homeCta.title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-[1.2rem] font-medium leading-snug text-bone sm:text-[1.3rem]">
              {t.homeCta.body[0]}
            </p>
            <p className="mt-1.5 text-base text-silver">{t.homeCta.body[1]}</p>
          </Reveal>
        </div>
        <Reveal delay={0.24} className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <ButtonLink href={href(START_PATH)} className="w-full sm:w-auto">
            {t.homeCta.primary}
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(t.common.defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            icon={<WhatsAppGlyph className="size-5" />}
            className="w-full sm:w-auto"
          >
            {t.common.whatsappSaeid}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
