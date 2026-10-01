"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { COACHING_TYPES, GOALS, START_PATH, type CoachingType, type Goal } from "@/lib/site";

type Selection = { goal: Goal | ""; coaching: CoachingType | "" };

type ApplicationContextValue = Selection & {
  setGoal: (goal: Goal) => void;
  setCoaching: (coaching: CoachingType) => void;
  /** Pre-selects options and brings the application form into view (navigating to /coaching if needed). */
  startApplication: (preset?: Partial<Selection>) => void;
};

const ApplicationContext = createContext<ApplicationContextValue | null>(null);
const STORAGE_KEY = "fitologist:application-selection";
const START_ID = "start-training";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(history.state, "", `#${id}`);
  return true;
}

function readStored(): Selection {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { goal: "", coaching: "" };
    const v = JSON.parse(raw) as Partial<Selection>;
    return {
      goal: GOALS.includes(v.goal as Goal) ? (v.goal as Goal) : "",
      coaching: COACHING_TYPES.includes(v.coaching as CoachingType) ? (v.coaching as CoachingType) : "",
    };
  } catch {
    return { goal: "", coaching: "" };
  }
}

/**
 * Goal / coaching choices made anywhere on the site (homepage goals, coaching cards) carry into
 * the application form. Lives in the layout and mirrors to sessionStorage, so the choice survives
 * page navigation and language switches.
 */
export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { href } = useI18n();
  const [selection, setSelection] = useState<Selection>({ goal: "", coaching: "" });
  const [hydrated, setHydrated] = useState(false);

  // Restore after mount (sessionStorage is not available during SSR).
  useEffect(() => {
    const stored = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setSelection((s) => ({ goal: s.goal || stored.goal, coaching: s.coaching || stored.coaching }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      /* storage unavailable — selection still works for this page */
    }
  }, [selection, hydrated]);

  const setGoal = useCallback((goal: Goal) => setSelection((s) => ({ ...s, goal })), []);
  const setCoaching = useCallback(
    (coaching: CoachingType) => setSelection((s) => ({ ...s, coaching })),
    [],
  );

  const startApplication = useCallback(
    (preset?: Partial<Selection>) => {
      if (preset) setSelection((s) => ({ ...s, ...preset }));
      if (!scrollToSection(START_ID)) router.push(href(START_PATH));
    },
    [router, href],
  );

  const value = useMemo(
    () => ({ ...selection, setGoal, setCoaching, startApplication }),
    [selection, setGoal, setCoaching, startApplication],
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplication must be used inside <ApplicationProvider>");
  return ctx;
}
