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
