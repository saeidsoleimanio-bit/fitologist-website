import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { INSTAGRAM, SITE, WHATSAPP } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_AE",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Saeid, personal trainer, in a gym in front of the FITologist.me logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  image: `${SITE.url}/images/og.jpg`,
  telephone: WHATSAPP.e164,
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  areaServed: { "@type": "City", name: "Dubai" },
  sameAs: [INSTAGRAM.url],
  founder: { "@type": "Person", name: "Saeid", jobTitle: "Personal Trainer" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${barlow.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
