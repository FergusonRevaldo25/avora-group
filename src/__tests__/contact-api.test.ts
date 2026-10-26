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
