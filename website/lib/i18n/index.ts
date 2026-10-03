import ar from "./dictionaries/ar";
import en, { type Dictionary } from "./dictionaries/en";
import fa from "./dictionaries/fa";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, fa, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
