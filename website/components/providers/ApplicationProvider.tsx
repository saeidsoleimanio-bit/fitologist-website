"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { FREQUENCIES, GOALS, TRAINING_TYPES, type Frequency, type Goal, type TrainingType } from "@/lib/lead";
import { START_ID, START_PATH } from "@/lib/site";

/** Values carried into the form (§3.5, §6.2). Stored in sessionStorage under `fit_prefill`. */
export type Prefill = {
  age?: string;
  goals?: Goal[];
  bmi?: string;
  type?: TrainingType;
  frequency?: Frequency;
};

type Ctx = {
  prefill: Prefill;
  /** Increments whenever a new preset arrives, so a mounted form can merge it. */
  version: number;
  /** Saves a preset and brings the form (#start) into view, navigating to it if needed. */
  startApplication: (preset?: Prefill) => void;
};

const ApplicationContext = createContext<Ctx | null>(null);
const PREFILL_KEY = "fit_prefill";
const UTM_KEY = "fit_utm";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(history.state, "", `#${id}`);
  return true;
}

function sanitize(v: Partial<Prefill> | null | undefined): Prefill {
  if (!v) return {};
  const out: Prefill = {};
  if (typeof v.age === "string" && /^\d{1,3}$/.test(v.age)) out.age = v.age;
  if (Array.isArray(v.goals)) out.goals = v.goals.filter((g): g is Goal => GOALS.includes(g as Goal));
  if (typeof v.bmi === "string" && /^\d{1,2}(\.\d)?$/.test(v.bmi)) out.bmi = v.bmi;
  if (TRAINING_TYPES.includes(v.type as TrainingType)) out.type = v.type;
  if (FREQUENCIES.includes(v.frequency as Frequency)) out.frequency = v.frequency;
  return out;
}

export function readPrefill(): Prefill {
  try {
    return sanitize(JSON.parse(sessionStorage.getItem(PREFILL_KEY) ?? "null"));
  } catch {
    return {};
  }
}

/** First-touch UTM parameters (§6.4), captured once per session. */
export function readUtm(): { utm_source: string; utm_campaign: string } {
  try {
    const v = JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "null") as Record<string, string> | null;
    return { utm_source: v?.utm_source ?? "", utm_campaign: v?.utm_campaign ?? "" };
  } catch {
    return { utm_source: "", utm_campaign: "" };
  }
}

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { href } = useI18n();
  const [prefill, setPrefill] = useState<Prefill>({});
  const [version, setVersion] = useState(0);

  // Restore prefill and capture UTM parameters after mount (sessionStorage is client-only).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setPrefill(readPrefill());
    try {
      const q = new URLSearchParams(window.location.search);
      const source = q.get("utm_source");
      const campaign = q.get("utm_campaign");
      if ((source || campaign) && !sessionStorage.getItem(UTM_KEY)) {
        sessionStorage.setItem(
          UTM_KEY,
          JSON.stringify({ utm_source: (source ?? "").slice(0, 100), utm_campaign: (campaign ?? "").slice(0, 100) }),
        );
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const startApplication = useCallback(
    (preset?: Prefill) => {
      if (preset) {
        const next = { ...readPrefill(), ...sanitize(preset) };
        try {
          sessionStorage.setItem(PREFILL_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable — the in-memory prefill still works on this page */
        }
        setPrefill(next);
        setVersion((v) => v + 1);
      }
      if (!scrollToSection(START_ID)) router.push(href(START_PATH));
    },
    [router, href],
  );

  const value = useMemo(() => ({ prefill, version, startApplication }), [prefill, version, startApplication]);
  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplication must be used inside <ApplicationProvider>");
  return ctx;
}
