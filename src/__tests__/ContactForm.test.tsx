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
