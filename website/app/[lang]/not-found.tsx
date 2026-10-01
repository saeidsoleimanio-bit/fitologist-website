"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function NotFound() {
  const { t, href } = useI18n();
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-5 pt-[var(--header-h)] text-center">
      <title>{t.meta.notFound}</title>
      <p className="eyebrow text-ember">404</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,9vw,5rem)] text-bone">{t.notFound.title}</h1>
      <p className="mt-4 text-silver">{t.notFound.body}</p>
      <Link
        href={href("/")}
        className="mt-8 inline-flex min-h-12 items-center bg-ember px-6 font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink"
      >
        {t.notFound.home}
      </Link>
    </section>
  );
}
