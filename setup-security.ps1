$ErrorActionPreference = "Stop"

if (-not (Test-Path "package.json") -or -not (Test-Path "src\app")) {
  Write-Host "Run this from inside the avora-group folder." -ForegroundColor Red
  exit 1
}

if (Test-Path next.config.ts) { Copy-Item next.config.ts next.config.ts.bak -Force }
New-Item -ItemType Directory -Force src\lib, src\components, src\app\api\contact, src\__tests__, e2e, .github\workflows, public\.well-known | Out-Null

# ---------- next.config.ts (security headers) ----------
@'
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Next.js needs inline scripts/styles, so 'unsafe-inline' is kept for those two.
// Everything else is locked to our own origin.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
'@ | Set-Content next.config.ts -Encoding utf8

# ---------- validation helpers ----------
@'
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  phone: z.string().trim().max(30).regex(/^[+0-9 ()-]*$/).optional(),
  message: z.string().trim().min(10).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
'@ | Set-Content src\lib\contact.ts -Encoding utf8

# ---------- API route ----------
@'
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
'@ | Set-Content src\app\api\contact\route.ts -Encoding utf8

# ---------- ContactForm component ----------
@'
"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const field = "w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-white/70 p-10 text-center">
        <p className="font-display text-3xl">Thank you!</p>
        <p className="mt-2 opacity-80">We&apos;ve received your enquiry and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-xs tracking-[0.2em] uppercase">Your name</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs tracking-[0.2em] uppercase">Email</label>
          <input id="email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs tracking-[0.2em] uppercase">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-xs tracking-[0.2em] uppercase">How can we help?</label>
        <textarea id="message" name="message" required minLength={10} maxLength={2000} rows={5} className={field} />
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <p className="text-xs opacity-60">
        By sending this you agree to us contacting you about your enquiry. Please don&apos;t include ID or passport numbers here.
      </p>

      {status === "error" && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === "sending"}
        className="rounded-full bg-forest px-9 py-4 text-xs font-medium tracking-[0.25em] uppercase text-cream shadow-lg transition hover:bg-forest-deep disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
'@ | Set-Content src\components\ContactForm.tsx -Encoding utf8

# ---------- add the form to the page ----------
$p = "src\app\page.tsx"
$c = Get-Content $p -Raw
if (-not $c.Contains('ContactForm')) {
  $c = $c.Replace('import Reveal from "@/components/Reveal";', 'import Reveal from "@/components/Reveal";' + "`n" + 'import ContactForm from "@/components/ContactForm";')
  $section = @'
      {/* ENQUIRY */}
      <section id="enquire" className="mx-auto max-w-2xl px-6 pb-28">
        <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Enquire</p></Reveal>
        <Reveal delay={0.1}><h2 className="mb-10 text-center font-display text-4xl md:text-5xl">Tell us about your trip</h2></Reveal>
        <Reveal delay={0.2}><ContactForm /></Reveal>
      </section>

      {/* CONTACT */}
'@
  $c = $c.Replace('      {/* CONTACT */}', $section)
  Set-Content $p $c -Encoding utf8
}

# ---------- vitest config ----------
@'
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
'@ | Set-Content vitest.config.mts -Encoding utf8

# ---------- unit tests ----------
@'
import { describe, it, expect } from "vitest";
import { contactSchema, escapeHtml, oneLine } from "@/lib/contact";

const valid = { name: "Jane Doe", email: "jane@example.com", message: "I would like to book flights to Dubai." };

describe("contactSchema", () => {
  it("accepts valid input", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a bad email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("rejects a too-short message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
  it("rejects odd characters in phone", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "<script>" }).success).toBe(false);
  });
  it("trims and lowercases the email", () => {
    const r = contactSchema.parse({ ...valid, email: "  JANE@Example.COM " });
    expect(r.email).toBe("jane@example.com");
  });
});

describe("escapeHtml", () => {
  it("neutralises HTML", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});

describe("oneLine", () => {
  it("removes line breaks (header-injection guard)", () => {
    expect(oneLine("a\r\nBcc: evil@x.com")).toBe("a Bcc: evil@x.com");
  });
});
'@ | Set-Content src\__tests__\contact-lib.test.ts -Encoding utf8

@'
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/contact/route";

const valid = { name: "Jane Doe", email: "jane@example.com", message: "I would like to book flights to Dubai." };

const make = (body: unknown, ip: string, extra: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip, ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  it("accepts a valid enquiry", async () => {
    expect((await POST(make(valid, "1.1.1.1"))).status).toBe(200);
  });
  it("rejects an invalid email", async () => {
    expect((await POST(make({ ...valid, email: "nope" }, "1.1.1.2"))).status).toBe(400);
  });
  it("silently accepts honeypot submissions", async () => {
    const res = await POST(make({ ...valid, website: "http://spam.com" }, "1.1.1.3"));
    expect(res.status).toBe(200);
  });
  it("blocks cross-origin requests", async () => {
    const res = await POST(make(valid, "1.1.1.4", { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });
  it("rejects oversized bodies", async () => {
    expect((await POST(make("x".repeat(20000), "1.1.1.5"))).status).toBe(413);
  });
  it("rejects non-JSON content", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST", headers: { "content-type": "text/plain", "x-forwarded-for": "1.1.1.6" }, body: "hello",
    });
    expect((await POST(req)).status).toBe(415);
  });
  it("rate limits repeat senders", async () => {
    let last = 0;
    for (let i = 0; i < 6; i++) last = (await POST(make(valid, "10.0.0.9"))).status;
    expect(last).toBe(429);
  });
});
'@ | Set-Content src\__tests__\contact-api.test.ts -Encoding utf8

@'
// @vitest-environment jsdom
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi, afterEach } from "vitest";
import ContactForm from "@/components/ContactForm";

afterEach(() => cleanup());

async function fillAndSubmit() {
  const user = userEvent.setup();
  render(<ContactForm />);
  await user.type(screen.getByLabelText(/your name/i), "Jane Doe");
  await user.type(screen.getByLabelText(/^email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/how can we help/i), "I would like to book flights.");
  await user.click(screen.getByRole("button", { name: /send enquiry/i }));
}

it("shows a thank-you message after a successful send", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));
  await fillAndSubmit();
  expect(await screen.findByText(/thank you/i)).toBeTruthy();
});

it("shows the server error when sending fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Too many requests." }) }));
  await fillAndSubmit();
  expect(await screen.findByRole("alert")).toBeTruthy();
});
'@ | Set-Content src\__tests__\ContactForm.test.tsx -Encoding utf8

# ---------- Playwright e2e ----------
@'
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
'@ | Set-Content playwright.config.ts -Encoding utf8

@'
import { test, expect } from "@playwright/test";

test("home page shows the key content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("More Destinations");
  await expect(page.locator('a[href="mailto:hello@avoragroup.co.za"]')).toHaveCount(1);
  await expect(page.locator('a[href="tel:+27784689886"]')).toHaveCount(1);
});

test("no console errors or CSP violations", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("sends security headers", async ({ request }) => {
  const h = (await request.get("/")).headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["strict-transport-security"]).toContain("max-age");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("contact API rejects bad input", async ({ request }) => {
  const res = await request.post("/api/contact", { data: { name: "x" } });
  expect(res.status()).toBe(400);
});

test("enquiry form does not submit when empty", async ({ page }) => {
  await page.goto("/#enquire");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.getByText(/thank you/i)).toHaveCount(0);
});
'@ | Set-Content e2e\home.spec.ts -Encoding utf8

# ---------- env example, security.txt, CI, dependabot ----------
@'
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@avoragroup.co.za
CONTACT_FROM_EMAIL=Avora Group <noreply@avoragroup.co.za>
'@ | Set-Content .env.example -Encoding ascii

@'
Contact: mailto:hello@avoragroup.co.za
Expires: 2027-10-23T00:00:00.000Z
Preferred-Languages: en
'@ | Set-Content public\.well-known\security.txt -Encoding ascii

@'
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npm audit --omit=dev --audit-level=high
'@ | Set-Content .github\workflows\ci.yml -Encoding ascii

@'
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
'@ | Set-Content .github\dependabot.yml -Encoding ascii

# ---------- npm scripts ----------
npm pkg set scripts.test="vitest run"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set "scripts.test:e2e=playwright test"
npm pkg set "scripts.audit:prod=npm audit --omit=dev"

Write-Host ""
Write-Host "Setup complete. Now run: npm test" -ForegroundColor Green
