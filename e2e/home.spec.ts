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
