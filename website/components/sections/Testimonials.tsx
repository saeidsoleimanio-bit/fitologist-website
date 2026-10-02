"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n/I18nProvider";
import { site } from "@/config/site";

/** Testimonials (§4.8) — rendered only when `config/site.ts` has entries. Never invented. */
export function Testimonials() {
  const { t } = useI18n();
  if (site.testimonials.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section-y relative bg-ink">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-8 lg:px-12">
        <h2 id="testimonials-title" className="display text-[clamp(2.25rem,7vw,3.75rem)] text-bone">
          {t.testimonials.title}
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {site.testimonials.map((q) => (
            <li key={q.name + q.text.slice(0, 20)} className="border hairline bg-carbon p-5">
              <blockquote className="text-base leading-relaxed text-bone">“{q.text}”</blockquote>
              <div className="mt-4 flex items-center gap-3">
                {q.photo && <Image src={q.photo} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />}
                <p className="text-sm">
                  <span className="font-semibold text-bone">{q.name}</span>
                  <span className="text-silver"> · {q.goal}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
