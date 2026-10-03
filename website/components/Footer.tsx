"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { stripLocale } from "@/lib/i18n/config";
import { InstagramGlyph, WhatsAppGlyph } from "@/components/ui/icons";
import { INSTAGRAM, NAV_ITEMS, SITE, WHATSAPP, whatsappLink } from "@/lib/site";

const contactCls =
  "inline-flex min-h-10 items-center gap-2 text-[0.92rem] font-semibold leading-none text-bone transition-colors duration-300 hover:text-ember-soft";

/**
 * Compact footer (owner revision, ~⅓ of a phone screen): logo + tagline on one row · small inline
 * nav (incl. Terms and Privacy) · WhatsApp and Instagram on one row · copyright. The primary CTA and
 * the language switcher live in the header only.
 */
export function Footer() {
  const { t, href } = useI18n();
  const year = new Date().getFullYear();
  // Floor-test landing page (printed card): minimal footer — Privacy and Terms only.
  const minimal = stripLocale(usePathname() ?? "/") === "/floor-test";
  const items = [
    ...(minimal ? [] : NAV_ITEMS.map((n) => ({ key: n.key as string, path: n.path as string, label: t.nav[n.key] }))),
    { key: "terms", path: "/terms", label: t.footer.terms },
    { key: "privacy", path: "/privacy", label: t.footer.privacy },
  ];

  return (
    <footer className="relative border-t hairline bg-ink pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 lg:py-6">
      <div className="mx-auto grid max-w-[88rem] gap-y-4 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:px-12">
        {/* Brand: logo + tagline on one compact row */}
        <div className="flex items-center gap-3.5 lg:col-span-4">
          <Link href={href("/")} className="shrink-0" aria-label={`${SITE.name} — ${t.nav.home}`}>
            <Image src="/images/logo-emblem.png" alt={SITE.name} width={640} height={367} sizes="80px" className="h-auto w-[64px] lg:w-[78px]" />
          </Link>
          <p className="text-[0.8rem] leading-snug text-silver">
            {t.footer.line1}
            <br />
            {t.footer.line2}
          </p>
        </div>

        {/* Navigation: small inline wrapping text */}
        <nav aria-label={t.nav.footerLabel} className="lg:col-span-5">
          <ul className="flex flex-wrap gap-x-4 gap-y-0.5">
            {items.map((n) => (
              <li key={n.key}>
                <Link
                  href={href(n.path)}
                  className="inline-flex min-h-8 items-center font-display text-[0.8rem] font-semibold uppercase tracking-[0.04em] text-silver transition-colors duration-300 hover:text-ember-soft"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact: WhatsApp + Instagram on one row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 lg:col-span-3 lg:justify-end">
          <a href={whatsappLink(t.common.defaultWhatsAppMessage)} data-wa="footer" target="_blank" rel="noopener noreferrer" className={contactCls}>
            <WhatsAppGlyph className="size-[1.05rem]" color="#FF6A00" />
            <span dir="ltr">
              <span className="sr-only">WhatsApp: </span>
              {WHATSAPP.display}
            </span>
          </a>
          <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className={contactCls}>
            <InstagramGlyph className="size-[1rem] text-ember" />
            <span dir="ltr">
              <span className="sr-only">Instagram: </span>
              {INSTAGRAM.handle}
            </span>
          </a>
        </div>

        <p className="text-[0.7rem] text-steel lg:col-span-12">
          <bdi dir="ltr">
            © {year} {SITE.name}
          </bdi>
        </p>
      </div>
    </footer>
  );
}
