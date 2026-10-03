"use client";

import { BadgeCheck, House, Languages, MapPin, type LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { site } from "@/config/site";

type Item = { key: string; icon: LucideIcon; label: React.ReactNode };

/**
 * Trust strip under the hero (§4.2): three centered lines (area · home & gym sessions · languages).
 * Every item comes from `config/site.ts`; credentials render only when enabled there.
 */
export function TrustStrip() {
  const { t, locale } = useI18n();
  const { reps, activeIq } = site.credentials;

  const items: Item[] = [
    ...(reps.show
      ? [
          {
            key: "reps",
            icon: BadgeCheck,
            label: (
              <>
                {t.trust.repsRegistered}
                {reps.number && (
                  <>
                    {" "}
                    {t.trust.repsNo} <span dir="ltr">{reps.number}</span>
                  </>
                )}
              </>
            ),
          },
        ]
      : []),
    ...(activeIq.show ? [{ key: "aiq", icon: BadgeCheck, label: t.trust.activeIq }] : []),
    { key: "area", icon: MapPin, label: t.trust.area },
    ...(site.homeSessions ? [{ key: "home", icon: House, label: t.trust.homeSessions }] : []),
  ];

  const separator = locale === "en" ? ", " : "، ";

  return (
    <section aria-label={t.trust.label} className="relative bg-ink px-4 pb-8 pt-2 max-sm:pe-[4.75rem] sm:px-8 lg:py-8">
      {/* Phones: the lines are centred in the width left of the floating WhatsApp button (right of it on
          RTL pages), so no line ever runs under the button at any mobile width. */}
      {/* Three centered lines, icon at the start of each (credentials, when enabled, use the same style) */}
      <ul className="flex flex-col items-center gap-2.5">
        {items.map(({ key, icon: Icon, label }) => (
          <li key={key} className="flex min-h-7 items-center gap-2 whitespace-nowrap text-center text-[clamp(14px,4.2vw,16px)] font-medium text-bone">
            <Icon aria-hidden className="size-[1.1rem] shrink-0 text-ember" strokeWidth={1.75} />
            <span>{label}</span>
          </li>
        ))}
        {/* Languages: one line, never wrapped; each name isolated so mixed scripts keep comma order */}
        <li className="flex min-h-7 max-w-full items-center gap-2 whitespace-nowrap text-[clamp(14px,4.2vw,16px)] font-medium text-bone">
          <Languages aria-hidden className="size-[1.1rem] shrink-0 text-ember" strokeWidth={1.75} />
          <span className="sr-only">{t.trust.languages}: </span>
          <span>
            {site.languagesSpoken.map((l, i) => (
              <Fragment key={l}>
                {i > 0 && separator}
                {/* Extended-Latin names (Azərbaycanca: "ə") use the system font, so one letter doesn't
                    pull Inter's 84 KB latin-ext file onto every page (Lighthouse §12). */}
                <bdi className={/[\u0100-\u02ff]/.test(l) ? "font-[system-ui,sans-serif]" : undefined}>{l}</bdi>
              </Fragment>
            ))}
          </span>
        </li>
      </ul>
    </section>
  );
}
