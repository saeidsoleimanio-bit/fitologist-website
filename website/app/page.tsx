import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ApplicationProvider } from "@/components/providers/ApplicationProvider";
import { About } from "@/components/sections/About";
import { Application } from "@/components/sections/Application";
import { BmiCalculator } from "@/components/sections/BmiCalculator";
import { Coaching } from "@/components/sections/Coaching";
import { FinalCta } from "@/components/sections/FinalCta";
import { Goals } from "@/components/sections/Goals";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Positioning } from "@/components/sections/Positioning";

export default function Home() {
  return (
    <ApplicationProvider>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Positioning />
        <About />
        <Method />
        <Goals />
        <Coaching />
        <BmiCalculator />
        <Application />
        <FinalCta />
      </main>
      <Footer />
    </ApplicationProvider>
  );
}
