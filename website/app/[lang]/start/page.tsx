import type { Metadata } from "next";
import { StartTraining } from "@/components/sections/StartTraining";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/start">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "start") : {};
}

/** Form only (for the Instagram bio) — same component as the coaching page. */
export default function StartPage() {
  return <StartTraining headingLevel="h1" standalone />;
}
