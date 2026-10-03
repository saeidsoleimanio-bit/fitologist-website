import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FloorTest } from "@/components/sections/FloorTest";
import { site } from "@/config/site";
import { getDictionary, isLocale } from "@/lib/i18n";
import { FLOOR_TEST_LOCALES } from "@/lib/site";

/** Re-checked hourly, so the offer switches off on its own after `offerValidUntil` (no redeploy). */
export const revalidate = 3600;

const isFloorTestLocale = (lang: string): lang is (typeof FLOOR_TEST_LOCALES)[number] =>
  (FLOOR_TEST_LOCALES as readonly string[]).includes(lang);

/** Offer is active until the end of `offerValidUntil` in Dubai time (UTC+4). */
function offerActive(now = Date.now()) {
  const endOfDay = new Date(`${site.floorTest.offerValidUntil}T00:00:00+04:00`).getTime() + 24 * 60 * 60 * 1000;
  return now < endOfDay;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/floor-test">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !isFloorTestLocale(lang)) return {};
  const t = getDictionary(lang).floorTest;
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    // For card holders only: never indexed, not in the sitemap.
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

/** Printed "floor test" card landing page (§ Floor Test landing page). EN + FA only (Arabic hidden). */
export default async function FloorTestPage({ params }: PageProps<"/[lang]/floor-test">) {
  const { lang } = await params;
  if (!isLocale(lang) || !isFloorTestLocale(lang)) notFound();
  const t = getDictionary(lang).floorTest;
  const validLabel = new Intl.DateTimeFormat(lang === "fa" ? "fa-IR-u-ca-gregory" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(new Date(`${site.floorTest.offerValidUntil}T12:00:00+04:00`));
  return <FloorTest offerActive={offerActive()} offerLabel={lang === "en" ? site.floorTest.offer : t.offer} validLabel={validLabel} />;
}
