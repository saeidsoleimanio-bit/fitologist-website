"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { InstagramGlyph, WhatsAppGlyph } from "@/components/ui/icons";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/config";
import { INSTAGRAM, NAV_ITEMS, SITE, WHATSAPP, startPathFor, whatsappLink } from "@/lib/site";

const contactCls =
  "inline-flex min-h-11 items-center gap-2.5 text-base font-semibold leading-none text-bone transition-colors duration-300 hover:text-ember-soft";

/** Compact closing band: brand · navigation + languages · contact. */
export function Footer() {
  const { t, href } = useI18n();
  const path = stripLocale(usePathname() ?? "/");
  const year = new Date().getFullYear();
  const items = [
    ...NAV_ITEMS.map((n) => ({ key: n.key as string, path: n.path as string, label: t.nav[n.key] })),
    { key: "start", path: startPathFor(path), label: t.nav.cta },
    { key: "terms", path: "/terms", label: t.footer.terms },
    { key: "privacy", path: "/privacy", label: t.footer.privacy },
  ];

  return (
    <footer className="relative border-t hairline bg-ink py-5 lg:py-4">
      <div className="mx-auto grid max-w-[88rem] gap-x-8 gap-y-4 px-5 sm:px-8 md:grid-cols-12 md:items-center lg:px-12">
        {/* Brand */}
        <div className="flex items-center gap-4 md:[grid-column:1/5]">
          <Link href={href("/")} className="shrink-0" aria-label={`${SITE.name} — ${t.nav.home}`}>
            <Image
              src="/images/logo-emblem.png"
              alt={SITE.name}
              width={640}
              height={367}
              sizes="110px"
              className="h-auto w-[78px] lg:w-[84px]"
            />
          </Link>
          <div className="text-[0.8rem] leading-snug text-silver">
            <p>
              {t.footer.line1}
              <br />
              {t.footer.line2}
            </p>
            <p className="mt-1.5 text-[0.7rem] text-steel">
              © {year} {SITE.name} · {t.common.location}
            </p>
          </div>
        </div>

        {/* Navigation + languages */}
        <div className="flex flex-col gap-1 md:[grid-column:5/9]">
          <nav aria-label={t.nav.footerLabel}>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {items.map((n) => (
                <li key={n.key}>
                  <Link
                    href={href(n.path)}
                    className={`inline-flex min-h-11 items-center font-display text-[0.85rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 hover:text-ember-soft ${
                      n.key === "start" ? "text-ember" : "text-silver"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher className="-ms-1.5" />
        </div>

        {/* Contact */}
        <ul className="grid grid-cols-1 justify-start gap-x-7 min-[400px]:grid-cols-[auto_auto] md:[grid-column:9/13]">
          <li>
            <a
              href={whatsappLink(t.common.defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={contactCls}
            >
              <WhatsAppGlyph className="size-[1.15rem]" color="#FF6A00" />
              <span dir="ltr">
                <span className="sr-only">WhatsApp: </span>
                {WHATSAPP.display}
              </span>
            </a>
          </li>
          <li>
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className={contactCls}>
              <InstagramGlyph className="size-[1.05rem] text-ember" />
              <span dir="ltr">
                <span className="sr-only">Instagram: </span>
                {INSTAGRAM.handle}
              </span>
            </a>
          </li>
          <li className="inline-flex min-h-11 items-center gap-2.5 text-base font-semibold leading-none text-bone">
            <MapPin className="size-[1.05rem] text-ember" aria-hidden />
            {t.common.location}
          </li>
        </ul>
      </div>
    </footer>
  );
}
