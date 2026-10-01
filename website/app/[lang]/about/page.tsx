import type { Metadata } from "next";
import { AboutBackground } from "@/components/sections/AboutBackground";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { HomeCta } from "@/components/sections/HomeCta";
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
      <AboutBackground />
      <HomeCta className="[--section-pt:1rem] lg:[--section-pt:1.25rem]" />
    </>
  );
}
