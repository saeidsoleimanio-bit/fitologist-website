import type { Metadata } from "next";
import { PlansPage } from "@/components/sections/PlansPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/plans">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "plans") : {};
}

export default function Plans() {
  return <PlansPage />;
}
