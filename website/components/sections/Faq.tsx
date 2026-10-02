"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reveal } from "@/components/ui/primitives";
import { site } from "@/config/site";

/** FAQ accordion (§9.1) — native <details>/<summary>: keyboard and screen-reader friendly. */
export function Faq() {
  const { t, href } = useI18n();
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y relative bg-ink">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 rtl:pr-6 rtl:sm:pr-10">
        <Reveal>
          <h2 id="faq-title" className="display text-[clamp(2.25rem,7vw,3.75rem)] text-bone">
            {t.faq.title}
          </h2>
        </Reveal>
        <div className="mt-6 border-t hairline">
          {t.faq.items.map((item, i) => (
            <details key={item.q} className="group border-b hairline">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-start text-[1.05rem] font-semibold text-bone transition-colors duration-300 hover:text-ember-soft [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="size-5 shrink-0 text-ember transition-transform duration-300 group-open:rotate-45" strokeWidth={1.75} />
              </summary>
              <p className="pb-5 pe-8 text-base leading-relaxed text-silver">
                {item.a}
                {i === 2 && site.homeEquipmentNote ? ` ${site.homeEquipmentNote}` : null}
                {"link" in item && item.link ? (
                  <>
                    {" "}
                    <Link href={href("/terms")} className="text-ember-soft underline underline-offset-4">
                      {item.link}
                    </Link>
                    .
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
