import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Cairo, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { ApplicationProvider } from "@/components/providers/ApplicationProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { getDictionary, isLocale, LOCALE_META, LOCALES, type Locale } from "@/lib/i18n";
import { INSTAGRAM, SITE, WHATSAPP } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

/* Arabic: Cairo for body and headings (Barlow/Inter have no Arabic glyphs). */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-locale-sans",
  display: "swap",
  preload: false,
});

const LOCALE_FONTS: Record<Locale, string> = {
  en: `${inter.variable} ${barlow.variable}`,
  ar: `${inter.variable} ${barlow.variable} ${cairo.variable}`,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: t.meta.siteTitle,
    description: t.meta.siteDescription,
    applicationName: SITE.name,
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const meta = LOCALE_META[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: t.meta.siteDescription,
    url: SITE.url,
    image: `${SITE.url}/images/og.jpg`,
    telephone: WHATSAPP.e164,
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
    areaServed: { "@type": "City", name: "Dubai" },
    sameAs: [INSTAGRAM.url],
    founder: { "@type": "Person", name: "Saeid Soleimani", jobTitle: "Personal Trainer" },
    inLanguage: meta.htmlLang,
  };

  return (
    <html lang={meta.htmlLang} dir={meta.dir} data-scroll-behavior="smooth" className={LOCALE_FONTS[lang]}>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <I18nProvider locale={lang} dictionary={t}>
          <MotionProvider>
            <ApplicationProvider>
              <Header />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
              <FloatingWhatsApp />
            </ApplicationProvider>
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
