import type { Metadata } from "next";
import { BmiCalculator } from "@/components/sections/BmiCalculator";
import { Hero } from "@/components/sections/Hero";
import { HomeCta } from "@/components/sections/HomeCta";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhoIsThisFor } from "@/components/sections/WhoIsThisFor";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "home") : {};
}

/** Phase 1: hero + trust strip; Philosophy and goal cards removed. Remaining sections are rebuilt in Phase 3. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BmiCalculator />
      <WhoIsThisFor />
      <HomeCta />
    </>
  );
}
