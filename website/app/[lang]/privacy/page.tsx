import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/config/site";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "privacy") : {};
}

/** Build date (static page): "Last updated". */
const BUILD_DATE = new Date();

/** Privacy Policy (§9.3) — the analytics bullet renders only if GA4 / Meta Pixel IDs are set. */
export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const p = getDictionary(lang).privacy;
  const hasAnalytics = Boolean(site.analytics.ga4Id || site.analytics.metaPixelId);
  const updated = new Intl.DateTimeFormat(lang === "ar" ? "ar-u-nu-latn" : "en-GB", { dateStyle: "long" }).format(BUILD_DATE);

  const items: { title: string; body: React.ReactNode }[] = [
    {
      title: p.who.title,
      body: (
        <>
          {p.who.body} <span dir="ltr">{site.whatsappDisplay}</span>
          {site.contactEmail && (
            <>
              {" · "}
              <a href={`mailto:${site.contactEmail}`} className="text-ember-soft underline underline-offset-4" dir="ltr">
                {site.contactEmail}
              </a>
            </>
          )}
          .
        </>
      ),
    },
    { title: p.collect.title, body: p.collect.body },
    { title: p.why.title, body: p.why.body },
    { title: p.stored.title, body: p.stored.body },
    ...(hasAnalytics ? [{ title: p.analytics.title, body: p.analytics.body }] : []),
    { title: p.howLong.title, body: p.howLong.body },
    { title: p.rights.title, body: p.rights.body },
  ];

  return (
    <LegalPage title={p.title}>
      <ul className="border-t hairline">
        {items.map((it) => (
          <li key={it.title} className="border-b hairline py-4 text-base leading-relaxed text-silver">
            <strong className="font-semibold text-bone">{it.title}:</strong> {it.body}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-silver">
        {p.updated}: {updated}
      </p>
    </LegalPage>
  );
}
