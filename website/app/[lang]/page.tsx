import type { Metadata } from "next";
import { BmiCalculator } from "@/components/sections/BmiCalculator";
import { Hero } from "@/components/sections/Hero";
import { HomeCta } from "@/components/sections/HomeCta";
import { PhilosophyGoals } from "@/components/sections/PhilosophyGoals";
import { WhoIsThisFor } from "@/components/sections/WhoIsThisFor";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "home") : {};
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhilosophyGoals />
      <BmiCalculator />
      <WhoIsThisFor />
      <HomeCta />
    </>
  );
}
