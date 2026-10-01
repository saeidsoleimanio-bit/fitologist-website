import { MapPin } from "lucide-react";
import Image from "next/image";
import { InstagramGlyph, WhatsAppGlyph } from "@/components/ui/icons";
import {
  BMI_SECTION,
  CTA_SECTION,
  DEFAULT_WHATSAPP_MESSAGE,
  INSTAGRAM,
  NAV_ITEMS,
  SITE,
  WHATSAPP,
  whatsappLink,
} from "@/lib/site";

const FOOTER_NAV = [...NAV_ITEMS, BMI_SECTION, CTA_SECTION];

const contactCls =
  "inline-flex min-h-7 items-center gap-2.5 text-base font-semibold leading-none text-bone transition-colors duration-300 hover:text-ember-soft";

/** Compact closing band: brand · navigation · contact. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t hairline bg-ink py-5 lg:py-4">
      <div className="mx-auto grid max-w-[88rem] gap-x-8 gap-y-4 px-5 sm:px-8 md:grid-cols-12 md:items-center lg:px-12">
        {/* Brand */}
        <div className="flex items-center gap-4 md:[grid-column:1/5]">
          <a href="#home" className="shrink-0" aria-label={`${SITE.name} — back to top`}>
            <Image
              src="/images/logo-emblem.png"
              alt={SITE.name}
              width={640}
              height={367}
              sizes="110px"
              className="h-auto w-[78px] lg:w-[84px]"
            />
          </a>
          <div className="text-[0.8rem] leading-snug text-silver">
            <p>
              Personal Training by Saeid
              <br />
              1:1 PT, Online and Hybrid Coaching
            </p>
            <p className="mt-1.5 text-[0.7rem] text-steel">
              © {year} {SITE.name} · {SITE.location}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer" className="md:[grid-column:5/9]">
          <ul className="grid grid-cols-2 gap-x-6 min-[400px]:grid-cols-3">
            {FOOTER_NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="inline-flex min-h-7 items-center font-display text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-silver transition-colors duration-300 hover:text-ember-soft"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <ul className="grid grid-cols-1 justify-start gap-x-7 min-[400px]:grid-cols-[auto_auto] md:[grid-column:9/13]">
          <li>
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className={contactCls}
            >
              <WhatsAppGlyph className="size-[1.15rem]" color="#FF6A00" />
              <span>
                <span className="sr-only">WhatsApp: </span>
                {WHATSAPP.display}
              </span>
            </a>
          </li>
          <li>
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className={contactCls}>
              <InstagramGlyph className="size-[1.05rem] text-ember" />
              <span>
                <span className="sr-only">Instagram: </span>
                {INSTAGRAM.handle}
              </span>
            </a>
          </li>
          <li className="inline-flex min-h-7 items-center gap-2.5 text-base font-semibold leading-none text-bone">
            <MapPin className="size-[1.05rem] text-ember" aria-hidden />
            {SITE.location}
          </li>
        </ul>
      </div>
    </footer>
  );
}
