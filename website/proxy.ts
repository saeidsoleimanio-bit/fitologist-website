import { NextResponse, type NextRequest } from "next/server";

const PREFIXED = ["fa", "ar"];
/** Set by the language switcher; remembers the visitor's choice (§10.1). */
const LANG_COOKIE = "fit_lang";
/** Locales that were removed — permanently redirected to the English home page. */
const REMOVED = ["ru"];

/**
 * Locale routing:
 * - `/fa/...`, `/ar/...`  → served as-is (`app/[lang]`).
 * - unprefixed URL + `fit_lang` cookie = fa/ar → 307 to that language (the visitor chose it).
 * - `/ru`, `/ru/...`      → 301 to `/` (Russian was removed).
 * - `/coaching`, `/fa|ar/coaching` → 301 to `/plans`, `/fa|ar/plans`.
 * - `/c`                  → 302 to /floor-test with the card UTM (printed QR code).
 * - `/en/...`             → 308 to the clean unprefixed URL (English is the default).
 * - everything else       → internally rewritten to `/en/...` (URL stays clean).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // Printed card QR (https://www.fitologist.me/c): 302, so the destination can change without reprinting.
  if (pathname === "/c") {
    const url = request.nextUrl.clone();
    url.pathname = "/floor-test";
    url.search = "?utm_source=card&utm_medium=print&utm_campaign=floor-test";
    return NextResponse.redirect(url, 302);
  }

  if (REMOVED.includes(first)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // /coaching was replaced by /plans (301, query kept).
  const coaching = pathname.match(/^(\/(?:fa|ar))?\/coaching(?=\/|$)/);
  if (coaching) {
    const url = request.nextUrl.clone();
    url.pathname = `${coaching[1] ?? ""}/plans`;
    return NextResponse.redirect(url, 301);
  }

  if (PREFIXED.includes(first)) return NextResponse.next();

  if (first === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // Remembered choice: an unprefixed (English) URL opens in the language the visitor picked.
  const remembered = request.cookies.get(LANG_COOKIE)?.value;
  if (remembered && PREFIXED.includes(remembered)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${remembered}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, public images and any file with an extension (robots.txt, icon.png…).
  matcher: ["/((?!api|_next|images|.*\\..*).*)"],
};
