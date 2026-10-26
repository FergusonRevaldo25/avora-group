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
