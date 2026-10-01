import ar from "./dictionaries/ar";
import en, { type Dictionary } from "./dictionaries/en";
import ru from "./dictionaries/ru";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar, ru };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
