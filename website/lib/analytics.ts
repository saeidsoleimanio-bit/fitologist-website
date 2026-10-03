/**
 * Tracking helpers (§10.3). GA4 and Meta Pixel load only when their IDs are set in
 * config/site.ts; until then every call here is a silent no-op.
 */
type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta Pixel standard events mapped from our GA4 events. */
const PIXEL_EVENTS: Partial<Record<string, string>> = {
  form_submit: "Lead",
  whatsapp_click: "Contact",
  bmi_whatsapp_click: "Contact",
};

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const pixel = PIXEL_EVENTS[event];
  if (pixel) window.fbq?.("track", pixel, params);
}
