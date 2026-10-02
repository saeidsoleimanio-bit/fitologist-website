"use client";

import { BadgeCheck, House, Languages, MapPin, type LucideIcon } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { site } from "@/config/site";

type Item = { key: string; icon: LucideIcon; label: React.ReactNode };

/**
 * Trust strip under the hero (§4.2): separate chips, horizontally scrollable on mobile.
 * Every item comes from `config/site.ts`; credentials render only when enabled there.
 */
export function TrustStrip() {
  const { t } = useI18n();
  const { reps, activeIq } = site.credentials;

  const items: Item[] = [
    ...(reps.show
      ? [
          {
            key: "reps",
            icon: BadgeCheck,
            label: (
              <>
                <span dir="ltr">{t.trust.reps}</span> {reps.category}
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
    {
      key: "languages",
      icon: Languages,
      label: (
        <span className="flex items-center gap-2.5">
          {site.languagesSpoken.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </span>
      ),
    },
  ];

  return (
    <section aria-label={t.trust.label} className="relative bg-ink">
      <ul className="mx-auto flex max-w-[88rem] snap-x gap-2.5 overflow-x-auto px-4 pb-6 pt-1 [scrollbar-width:none] sm:px-8 lg:flex-wrap lg:overflow-visible lg:px-12 lg:py-6 [&::-webkit-scrollbar]:hidden rtl:pr-6 rtl:sm:pr-10 rtl:lg:pr-[clamp(4.5rem,5.5vw,5.5rem)]">
        {items.map(({ key, icon: Icon, label }) => (
          <li
            key={key}
            className="flex min-h-11 shrink-0 snap-start items-center gap-2 border hairline bg-carbon px-3.5 text-[0.9rem] font-medium text-bone"
          >
            <Icon aria-hidden className="size-4 shrink-0 text-ember" strokeWidth={1.75} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
