import type { Metadata } from "next";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutStory } from "@/components/sections/AboutStory";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "about") : {};
}

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutStory />
      <CtaBlock />
    </>
  );
}
