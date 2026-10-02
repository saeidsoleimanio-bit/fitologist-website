import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/sections/LegalPage";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "terms") : {};
}

/** Cancellation & Rescheduling (§9.2). */
export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang).terms;
  return (
    <LegalPage title={t.title}>
      <ul className="border-t hairline">
        {t.items.map((it) => (
          <li key={it.title} className="border-b hairline py-4 text-base leading-relaxed text-silver">
            <strong className="font-semibold text-bone">{it.title}:</strong> {it.body}
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
