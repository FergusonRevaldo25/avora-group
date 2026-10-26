import { NextResponse } from "next/server";
import { contactSchema, escapeHtml, oneLine } from "@/lib/contact";

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

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isLimited(ip)) return reply({ error: "Too many requests. Please try again later." }, 429);
  if (!sameOrigin(req)) return reply({ error: "Forbidden." }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return reply({ error: "Unsupported content type." }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return reply({ error: "Message too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }

  // Honeypot: real people never fill this hidden field. Pretend success to bots.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return reply({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return reply({ error: "Please check your details and try again." }, 400);
  const { name, email, phone, message } = parsed.data;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    if (process.env.NODE_ENV === "production") return reply({ error: "Service unavailable." }, 500);
    console.log("[contact:dev] enquiry received (email not configured, nothing sent)");
    return reply({ ok: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New enquiry from ${oneLine(name)}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!res.ok) return reply({ error: "Could not send your message. Please try again." }, 502);
  } catch {
    return reply({ error: "Could not send your message. Please try again." }, 502);
  }
  return reply({ ok: true });
}
