import type { Metadata } from "next";
import { Coaching } from "@/components/sections/Coaching";
import { StartTraining } from "@/components/sections/StartTraining";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/coaching">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "coaching") : {};
}

export default function CoachingPage() {
  return (
    <>
      <Coaching />
      <StartTraining />
    </>
  );
}
