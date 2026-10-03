"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/primitives";
import { stripLocale } from "@/lib/i18n/config";
import { startPathFor, whatsappLink } from "@/lib/site";

/** Standard left-aligned CTA block: title + Book a Free Consultation + WhatsApp Saeid (§5.5, §8.5). */
export function CtaBlock({ title, id = "cta-block" }: { title?: string; id?: string }) {
  const { t, href } = useI18n();
  const path = stripLocale(usePathname() ?? "/");
  return (
    <section aria-labelledby={id} className="section-y surface-deep relative overflow-hidden">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12 rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        <Reveal>
          <h2 id={id} className="display text-[clamp(2.4rem,8vw,4.5rem)] text-bone text-balance">
            {title ?? t.ctaBlock.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href(startPathFor(path))} className="w-full sm:w-auto" data-cta="cta_block">
            {t.nav.cta}
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(t.common.defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            data-wa="cta_block"
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
