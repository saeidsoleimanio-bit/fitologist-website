import { NextResponse, type NextRequest } from "next/server";
import en from "@/lib/i18n/dictionaries/en";
import { fullNumber, isInPerson, sanitizeLead, validateLead, type LeadInput } from "@/lib/lead";

/**
 * POST /api/lead — lead delivery (FITOLOGIST_SPEC.md §6.4).
 * Validates server-side, drops honeypot submissions silently, rate-limits per IP, then delivers to
 * Telegram (instant notification) and a Google Sheet (lead log). 200 {ok:true} if at least one
 * delivery succeeded, otherwise 502. Secrets come from environment variables only.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const DELIVERY_TIMEOUT_MS = 8000;
/** Basic per-instance rate limit (serverless instances do not share memory). */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT.max;
}

type Meta = { language: string; source: string; bmi: string; utm_source: string; utm_campaign: string };

function readMeta(raw: Record<string, unknown>): Meta {
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max).trim() : "");
  const language = str(raw.language, 5);
  const source = str(raw.source, 200);
  const bmi = str(raw.bmi, 5);
  return {
    language: ["en", "ar", "fa"].includes(language) ? language : "en",
    source: source.startsWith("/") ? source : "",
    bmi: /^\d{1,2}(\.\d)?$/.test(bmi) ? bmi : "",
    utm_source: str(raw.utm_source, 100),
    utm_campaign: str(raw.utm_campaign, 100),
  };
}

/** "2026-10-02 14:05" in Dubai time. */
function dubaiTimestamp(date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Human-readable values (English labels — this is the owner's notification). */
function describe(lead: LeadInput) {
  const l = en.lead;
  const inPerson = isInPerson(lead.type);
  return {
    whatsapp: `+${fullNumber(lead.countryCode, lead.phone)}`,
    sex: lead.sex ? l.sexOptions[lead.sex] : "",
    goals: lead.goals.map((g) => en.goals[g]).join(", "),
    type: lead.type ? l.types[lead.type] : "",
    frequency: inPerson && lead.frequency ? l.frequencies[lead.frequency] : "",
    area: inPerson ? lead.area.replace(/\s+/g, " ").trim() : "",
    times: lead.times.map((t) => l.timesOptions[t]).join(", "),
    notes: lead.notes.trim(),
  };
}

async function sendTelegram(lead: LeadInput, meta: Meta, timestamp: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const d = describe(lead);
  const lines = [
    "🔔 New lead — fitologist.me",
    "",
    `Name: ${lead.name.trim()}`,
    `WhatsApp: ${d.whatsapp}`,
    `Age: ${lead.age}`,
    d.sex && `Sex: ${d.sex}`,
    `Goals: ${d.goals}`,
    `Training type: ${d.type}`,
    d.frequency && `How often: ${d.frequency}`,
    d.area && `Area: ${d.area}`,
    d.times && `Preferred time: ${d.times}`,
    d.notes && `Notes: ${d.notes}`,
    "",
    `Language: ${meta.language.toUpperCase()}`,
    `Source page: ${meta.source || "—"}`,
    meta.bmi && `BMI: ${meta.bmi}`,
    (meta.utm_source || meta.utm_campaign) && `UTM: ${meta.utm_source || "—"} / ${meta.utm_campaign || "—"}`,
    `Time (Dubai): ${timestamp}`,
    "",
    `Chat: https://wa.me/${fullNumber(lead.countryCode, lead.phone)}`,
  ].filter((x): x is string => typeof x === "string");

  const base = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  const res = await fetch(`${base}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), disable_web_page_preview: true }),
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });
  return res.ok;
}

async function sendSheet(lead: LeadInput, meta: Meta, timestamp: string): Promise<boolean> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return false;
  const d = describe(lead);
  // Column order matches scripts/sheets-webhook.gs
  const row = {
    timestamp,
    name: lead.name.trim(),
    whatsapp: d.whatsapp,
    age: lead.age,
    goals: d.goals,
    type: d.type,
    frequency: d.frequency,
    area: d.area,
    times: d.times,
    notes: d.notes,
    language: meta.language,
    source: meta.source,
    bmi: meta.bmi,
    utm_source: meta.utm_source,
    utm_campaign: meta.utm_campaign,
    sex: d.sex,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
    redirect: "follow",
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });
  if (!res.ok) return false;
  // The Apps Script answers {"ok":true}; accept any 2xx if the body isn't JSON.
  const text = await res.text();
  try {
    return (JSON.parse(text) as { ok?: boolean }).ok !== false;
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw || typeof raw !== "object") return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const lead = sanitizeLead(raw);
  // Honeypot filled → silently drop (looks like success to the bot).
  if (lead.company.trim() !== "") return NextResponse.json({ ok: true });

  const errors = validateLead(lead, en.lead.errors);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "invalid", fields: Object.keys(errors) }, { status: 400 });
  }

  const meta = readMeta(raw);
  const timestamp = dubaiTimestamp();
  const results = await Promise.allSettled([sendTelegram(lead, meta, timestamp), sendSheet(lead, meta, timestamp)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);

  if (!delivered) {
    console.error("[lead] no delivery succeeded", results.map((r) => (r.status === "fulfilled" ? r.value : String(r.reason))));
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
