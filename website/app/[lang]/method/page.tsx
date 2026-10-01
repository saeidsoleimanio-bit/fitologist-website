import type { Metadata } from "next";
import { MethodPage } from "@/components/sections/Method";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/method">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "method") : {};
}

export default function Method() {
  return <MethodPage />;
}
