"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";

const { ga4Id, metaPixelId } = site.analytics;

/** Section that contains a link → fallback `location` for WhatsApp clicks. */
const zoneOf = (el: Element) => el.closest("[data-wa], [id], header, footer");

/**
 * GA4 + Meta Pixel (§10.3), rendered only when an ID is set. Click tracking is delegated:
 * - `[data-cta="<location>"]`  → cta_click { location }
 * - WhatsApp links             → whatsapp_click { location } (Meta: Contact), except the Body Check
 *   result link (`data-track="bmi_whatsapp"`) → bmi_whatsapp_click { category }.
 * Programmatic events (bmi_calculated, bmi_to_form, form_submit) call `track()` directly.
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ga4Id && !metaPixelId) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a, button");
      if (!el) return;
      const cta = el.getAttribute("data-cta");
      if (cta) track("cta_click", { location: cta });
      const href = el.getAttribute("href") ?? "";
      if (/wa\.me|api\.whatsapp\.com/.test(href)) {
        if (el.getAttribute("data-track") === "bmi_whatsapp") {
          track("bmi_whatsapp_click", { category: el.getAttribute("data-category") ?? "" });
        } else {
          const zone = zoneOf(el);
          const location =
            el.getAttribute("data-wa") ?? zone?.getAttribute("data-wa") ?? zone?.id ?? zone?.tagName.toLowerCase() ?? "page";
          track("whatsapp_click", { location });
        }
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Pixel page views on client-side navigation (GA4 enhanced measurement tracks history changes itself).
  useEffect(() => {
    if (metaPixelId) window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!ga4Id && !metaPixelId) return null;
  return (
    <>
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});`}
          </Script>
        </>
      )}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});`}
        </Script>
      )}
    </>
  );
}
