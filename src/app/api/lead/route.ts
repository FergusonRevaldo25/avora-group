import { leadSchema, LEAD_LABELS } from "@/lib/lead";
import { clientIp, isLimited, sameOrigin, reply, escapeHtml, oneLine } from "@/lib/guard";

const MAX_BODY = 10_000;

export async function POST(req: Request) {
  if (isLimited(clientIp(req))) return reply({ error: "Too many requests. Please try again later." }, 429);
  if (!sameOrigin(req)) return reply({ error: "Forbidden." }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return reply({ error: "Unsupported content type." }, 415);
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) return reply({ error: "Request too large." }, 413);

  let body: unknown;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }

  // Honeypot: real people never fill this hidden field.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return reply({ ok: true });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return reply({ error: "Please check your details and try again." }, 400);
  const { type, ...rest } = parsed.data;
  const subject = `New ${LEAD_LABELS[type]} enquiry`;
  const rows = Object.entries(rest)
    .filter(([k]) => k !== "consent")
    .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0"><strong>${escapeHtml(oneLine(k))}</strong></td><td>${escapeHtml(String(v ?? "-") || "-")}</td></tr>`)
    .join("") + `<tr><td style="padding:4px 14px 4px 0"><strong>consent</strong></td><td>given</td></tr>`;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    if (process.env.NODE_ENV === "production") return reply({ error: "Service unavailable." }, 500);
    console.log(`[lead:dev] ${subject} (email not configured, nothing sent)`);
    return reply({ ok: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: rest.email, subject, html: `<table>${rows}</table>` }),
    });
    if (!res.ok) return reply({ error: "Could not send your message. Please try again." }, 502);
  } catch {
    return reply({ error: "Could not send your message. Please try again." }, 502);
  }
  return reply({ ok: true });
}
