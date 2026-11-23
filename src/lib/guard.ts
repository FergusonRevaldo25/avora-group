import { NextResponse } from "next/server";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
// In-memory limiter: fine for launch. Move to Upstash/Redis if traffic grows.
const hits = new Map<string, number[]>();

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

export function isLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

export function sameOrigin(req: Request) {
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

export const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
