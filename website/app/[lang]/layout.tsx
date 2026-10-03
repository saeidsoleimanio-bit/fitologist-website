import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans_Arabic, Inter, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { ApplicationProvider } from "@/components/providers/ApplicationProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { getDictionary, isLocale, LOCALE_META, LOCALES, localizePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/i18n/metadata";
import { site } from "@/config/site";
import { COACH_NAME, CREDENTIALS, INSTAGRAM, SITE, WHATSAPP } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"], // 800: Home hero H1
  variable: "--font-barlow",
  display: "swap",
});

/*
 * Arabic-script faces (§10.1): IBM Plex Sans Arabic (AR), Vazirmatn (FA) for body and headings
 * (Barlow/Inter have no Arabic glyphs). Not preloaded: the [lang] layout is shared by every locale,
 * so preloading would make English pages download them too; `swap` keeps text visible meanwhile.
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  // Static font (one file per weight): 500 falls back to 400, saving a ~34 KB download.
  weight: ["400", "600", "700"],
  variable: "--font-locale-sans",
  display: "swap",
  preload: false,
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-locale-sans",
  display: "swap",
  preload: false,
});

const LOCALE_FONTS: Record<Locale, string> = {
  en: `${inter.variable} ${barlow.variable}`,
  fa: `${inter.variable} ${barlow.variable} ${vazirmatn.variable}`,
  ar: `${inter.variable} ${barlow.variable} ${plexArabic.variable}`,
};

/** True on Vercel preview deployments only (set by Vercel at build time). */
const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

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
    // Google Search Console ownership (property https://www.fitologist.me).
    verification: { google: "4XCoeuZeguG5YxARse-41aAT_-Geyv-3aoF59LKvB_Y" },
    // Vercel preview deployments (VERCEL_ENV=preview) are never indexed; production and local builds are.
    robots: IS_PREVIEW ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  // Lets the Home hero sit under the transparent header; safe-area insets are respected in CSS.
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const meta = LOCALE_META[lang];

  // §10.2: Person (Saeid) + ProfessionalService. Credentials only when enabled; no price fields.
  const personId = `${SITE.url}/#saeid`;
  const credentials = CREDENTIALS.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name:
      c.key === "aiq"
        ? site.credentials.activeIq.title
        : ["Registered Personal Trainer (Level 3", site.credentials.reps.category].filter(Boolean).join(", ") + ")",
    ...(c.key === "aiq" ? { credentialCategory: "UK-regulated qualification" } : { credentialCategory: "Registration" }),
    recognizedBy: { "@type": "Organization", name: c.org },
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: COACH_NAME,
        jobTitle: "Personal Trainer",
        url: `${SITE.url}${localizePath(lang, "/about")}`,
        image: `${SITE.url}${site.photos.about}`,
        knowsLanguage: ["en", "fa", "az"],
        sameAs: [INSTAGRAM.url],
        ...(credentials.length > 0 ? { hasCredential: credentials } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}/#business`,
        name: SITE.name,
        description: t.meta.siteDescription,
        url: `${SITE.url}${localizePath(lang, "/")}`,
        image: `${SITE.url}${ogImage(lang)}`,
        telephone: WHATSAPP.e164,
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
        areaServed: { "@type": "City", name: "Dubai" },
        availableLanguage: ["English", "Persian", "Azerbaijani"],
        sameAs: [INSTAGRAM.url],
        founder: { "@id": personId },
        employee: { "@id": personId },
        inLanguage: meta.htmlLang,
      },
    ],
  };

  return (
    <html lang={meta.htmlLang} dir={meta.dir} data-scroll-behavior="smooth" className={LOCALE_FONTS[lang]}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body className="min-h-dvh antialiased">
        <I18nProvider locale={lang} dictionary={t}>
          <MotionProvider>
            <ApplicationProvider>
              <Header />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
              <FloatingWhatsApp />
              <Analytics />
            </ApplicationProvider>
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
