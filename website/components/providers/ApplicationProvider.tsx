"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CoachingType, Goal } from "@/lib/site";

type Selection = { goal: Goal | ""; coaching: CoachingType | "" };

type ApplicationContextValue = Selection & {
  setGoal: (goal: Goal) => void;
  setCoaching: (coaching: CoachingType) => void;
  /** Pre-selects options and brings the application form into view. */
  startApplication: (preset?: Partial<Selection>) => void;
};

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ goal: "", coaching: "" });

  const setGoal = useCallback((goal: Goal) => setSelection((s) => ({ ...s, goal })), []);
  const setCoaching = useCallback(
    (coaching: CoachingType) => setSelection((s) => ({ ...s, coaching })),
    [],
  );

  const startApplication = useCallback((preset?: Partial<Selection>) => {
    if (preset) setSelection((s) => ({ ...s, ...preset }));
    scrollToSection("start-training");
  }, []);

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
