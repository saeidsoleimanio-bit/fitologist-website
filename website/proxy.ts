import { NextResponse, type NextRequest } from "next/server";

const PREFIXED = ["ar", "ru"];

/**
 * Locale routing:
 * - `/ar/...`, `/ru/...`  → served as-is (`app/[lang]`).
 * - `/en/...`             → 308 to the clean unprefixed URL (English is the default).
 * - everything else       → internally rewritten to `/en/...` (URL stays clean).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

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
  // Skip Next internals, public images and any file with an extension (robots.txt, icon.png…).
  matcher: ["/((?!_next|images|.*\\..*).*)"],
};
