import type { Metadata } from "next";
import { BodyCheck } from "@/components/sections/BodyCheck";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { MeetSaeid } from "@/components/sections/MeetSaeid";
import { PlansPreview } from "@/components/sections/PlansPreview";
import { StartTraining } from "@/components/sections/StartTraining";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhoIsThisFor } from "@/components/sections/WhoIsThisFor";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "home") : {};
}

/** Home (§4): hero · trust · who · body check · how it works · plans (+ FAQ link) · meet Saeid · testimonials · form. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhoIsThisFor />
      <BodyCheck />
      <HowItWorks />
      <PlansPreview />
      <MeetSaeid />
      <Testimonials />
      <StartTraining />
    </>
  );
}
