"use client";
import { useState } from "react";
import { field, label } from "@/components/ui";
import { todayISO } from "@/lib/trip";

type Status = "idle" | "sending" | "sent" | "error";

export default function TravelForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (data.departDate < todayISO()) {
      setError("Please choose a departure date that is not in the past.");
      setStatus("error");
      return;
    }
    if (data.returnDate && data.returnDate < data.departDate) {
      setError("Your return date must be after your departure date.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "travel", ...data }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Something went wrong.");
      setRef(j.ref ?? "");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-white/70 p-10 text-center">
        <p className="font-display text-3xl">Request received</p>
        <p className="mt-2 text-sm tracking-widest uppercase text-gold">Reference {ref}</p>
        <p className="mt-4 opacity-80">We will confirm availability and send you a quote. No payment is needed until you approve it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="service" className={label}>What do you need?</label>
          <select id="service" name="service" required className={field} defaultValue="package">
            <option value="flights">Flights</option>
            <option value="package">Holiday package</option>
            <option value="accommodation">Accommodation</option>
            <option value="tour">Tour</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="destination" className={label}>Destination</label>
          <input id="destination" name="destination" required minLength={2} maxLength={100} className={field} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label htmlFor="departDate" className={label}>Depart</label>
          <input id="departDate" name="departDate" type="date" required className={field} />
        </div>
        <div>
          <label htmlFor="returnDate" className={label}>Return (optional)</label>
          <input id="returnDate" name="returnDate" type="date" className={field} />
        </div>
        <div>
          <label htmlFor="travellers" className={label}>Travellers</label>
          <input id="travellers" name="travellers" type="number" min={1} max={30} defaultValue={2} required className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="budget" className={label}>Budget (optional)</label>
        <select id="budget" name="budget" className={field} defaultValue="">
          <option value="">Not sure yet</option>
          <option value="Under R10,000">Under R10,000</option>
          <option value="R10,000 - R25,000">R10,000 - R25,000</option>
          <option value="R25,000 - R50,000">R25,000 - R50,000</option>
          <option value="R50,000+">R50,000+</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone</label>
          <input id="phone" name="phone" type="tel" required minLength={7} maxLength={30} autoComplete="tel" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="notes" className={label}>Anything else we should know? (optional)</label>
        <textarea id="notes" name="notes" rows={4} maxLength={1500} className={field} />
      </div>

      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <p className="text-xs opacity-60">No payment is taken on this website. Please do not include ID or passport numbers here.</p>
      {status === "error" && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === "sending"}
        className="rounded-full bg-forest px-9 py-4 text-xs font-medium tracking-[0.25em] uppercase text-cream shadow-lg transition hover:bg-forest-deep disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Request a quote"}
      </button>
    </form>
  );
}
