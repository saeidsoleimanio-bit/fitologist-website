import { NextResponse, type NextRequest } from "next/server";

const PREFIXED = ["ar"];
/** Locales that were removed — permanently redirected to the English home page. */
const REMOVED = ["ru"];

/**
 * Locale routing:
 * - `/ar/...`              → served as-is (`app/[lang]`).
 * - `/ru`, `/ru/...`      → 301 to `/` (Russian was removed).
 * - `/coaching`, `/ar/coaching` → 301 to `/plans`, `/ar/plans`.
 * - `/en/...`             → 308 to the clean unprefixed URL (English is the default).
 * - everything else       → internally rewritten to `/en/...` (URL stays clean).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (REMOVED.includes(first)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // /coaching was replaced by /plans (301, query kept).
  const coaching = pathname.match(/^(\/ar)?\/coaching(?=\/|$)/);
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

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, public images and any file with an extension (robots.txt, icon.png…).
  matcher: ["/((?!api|_next|images|.*\\..*).*)"],
};
