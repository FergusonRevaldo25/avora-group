import { NextResponse } from "next/server";
import { bookingSchema, escapeHtml, oneLine } from "@/lib/booking";
import { stays, isAvailable } from "@/lib/pricing";
import { formatZAR, isRealDate, nightsBetween, stayQuote, todayISO } from "@/lib/trip";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY = 10_000;
// In-memory limiter: fine for launch. Move to Upstash/Redis if traffic grows.
const hits = new Map<string, number[]>();

function isLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const allowed = [req.headers.get("host"), req.headers.get("x-forwarded-host"), new URL(req.url).host];
    return allowed.includes(originHost);
  } catch {
    return false;
  }
}

const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const row = (label: string, value: string) =>
  `<tr><td style="padding:4px 14px 4px 0"><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isLimited(ip)) return reply({ error: "Too many requests. Please try again later." }, 429);
  if (!sameOrigin(req)) return reply({ error: "Forbidden." }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return reply({ error: "Unsupported content type." }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return reply({ error: "Request too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }

  // Honeypot: real people never fill this hidden field.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return reply({ ok: true, ref: "AVR-OK" });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return reply({ error: "Please check your details and try again." }, 400);
  const data = parsed.data;

  const today = todayISO();
  const ref = "AVR-" + Date.now().toString(36).toUpperCase();
  let subject: string;
  let rows: string;

  if (data.type === "stay") {
    const stay = stays.find((s) => s.id === data.stayId);
    if (!stay) return reply({ error: "Unknown stay." }, 400);
    if (!isRealDate(data.checkIn) || !isRealDate(data.checkOut)) return reply({ error: "Invalid dates." }, 400);
    const nights = nightsBetween(data.checkIn, data.checkOut);
    if (data.checkIn < today || nights < 1 || nights > 30) {
      return reply({ error: "Please choose valid dates (1 to 30 nights, not in the past)." }, 400);
    }
    if (data.guests > stay.maxGuests) return reply({ error: `This stay sleeps up to ${stay.maxGuests} guests.` }, 400);
    if (!isAvailable(stay, data.checkIn, data.checkOut)) return reply({ error: "Sorry, those dates are not available." }, 409);

    const q = stayQuote(stay.rate, stay.cleaning, nights); // always recalculated on the server
    subject = `Stay request ${ref}: ${stay.name}`;
    rows = [
      row("Reference", ref), row("Stay", `${stay.name} (${stay.location})`),
      row("Check-in", data.checkIn), row("Check-out", data.checkOut),
      row("Nights", String(nights)), row("Guests", String(data.guests)),
      row("Estimated total", formatZAR(q.total)),
      row("Name", data.name), row("Email", data.email), row("Phone", data.phone), row("Notes", data.notes || "-"),
    ].join("");
  } else {
    if (!isRealDate(data.departDate) || data.departDate < today) return reply({ error: "Please choose a valid departure date." }, 400);
    if (data.returnDate && (!isRealDate(data.returnDate) || data.returnDate < data.departDate)) {
      return reply({ error: "Return date must be after departure." }, 400);
    }
    subject = `Travel request ${ref}: ${oneLine(data.destination)}`;
    rows = [
      row("Reference", ref), row("Service", data.service), row("Destination", data.destination),
      row("Depart", data.departDate), row("Return", data.returnDate || "-"),
      row("Travellers", String(data.travellers)), row("Budget", data.budget || "-"),
      row("Name", data.name), row("Email", data.email), row("Phone", data.phone), row("Notes", data.notes || "-"),
    ].join("");
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    if (process.env.NODE_ENV === "production") return reply({ error: "Service unavailable." }, 500);
    console.log(`[booking:dev] ${subject} (email not configured, nothing sent)`);
    return reply({ ok: true, ref });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, html: `<table>${rows}</table>` }),
    });
    if (!res.ok) return reply({ error: "Could not send your request. Please try again." }, 502);
  } catch {
    return reply({ error: "Could not send your request. Please try again." }, 502);
  }
  return reply({ ok: true, ref });
}
