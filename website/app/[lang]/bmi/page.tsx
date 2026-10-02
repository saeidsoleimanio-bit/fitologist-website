import type { Metadata } from "next";
import { BodyCheck } from "@/components/sections/BodyCheck";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/bmi">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "bmi") : {};
}

/** Standalone Free Body Check (for the Instagram bio) — same component as the home page. */
export default function BmiPage() {
  return (
    <div className="pt-[var(--header-compact)] lg:pt-[var(--header-h)]">
      <BodyCheck headingLevel="h1" />
    </div>
  );
}
