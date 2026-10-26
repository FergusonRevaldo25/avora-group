"use client";
import { useState } from "react";
import Image from "next/image";
import { BedDouble, Bath, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { field, label } from "@/components/ui";
import { stays, isAvailable } from "@/lib/pricing";
import { formatZAR, nightsBetween, stayQuote, todayISO } from "@/lib/trip";

type Status = "idle" | "sending" | "sent" | "error";

export default function StaysExplorer() {
  const [selectedId, setSelectedId] = useState(stays[0].id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");

  const stay = stays.find((s) => s.id === selectedId) ?? stays[0];
  const guestCount = Math.min(Number(guests), stay.maxGuests);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const validRange = nights >= 1 && nights <= 30;
  const available = !validRange || isAvailable(stay, checkIn, checkOut);
  const quote = validRange && available ? stayQuote(stay.rate, stay.cleaning, nights) : null;

  function choose(id: string) {
    setSelectedId(id);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!validRange) { setError("Please choose check-in and check-out dates (1 to 30 nights)."); setStatus("error"); return; }
    if (checkIn < todayISO()) { setError("Check-in cannot be in the past."); setStatus("error"); return; }
    if (!available) { setError("Sorry, those dates are not available."); setStatus("error"); return; }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stay", stayId: stay.id, checkIn, checkOut, guests: guestCount,
          name: f.get("name"), email: f.get("email"), phone: f.get("phone"),
          notes: f.get("notes"), website: f.get("website"),
        }),
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

  return (
    <section id="stays" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Our stays</p></Reveal>
      <Reveal delay={0.1}><h2 className="mb-14 text-center font-display text-4xl md:text-6xl">Find your place to stay</h2></Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {stays.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.1} className="h-full">
            <div className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white/60 transition ${s.id === selectedId ? "border-gold ring-2 ring-gold/40" : "border-forest/10"}`}>
              <div className="group relative h-60 overflow-hidden">
                <Image src={s.img} alt={s.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-gold">{s.location}</p>
                <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                <p className="mt-2 text-sm opacity-75">{s.blurb}</p>
                <div className="mt-4 flex gap-4 text-sm opacity-80">
                  <span className="flex items-center gap-1"><Users size={15} /> {s.maxGuests}</span>
                  <span className="flex items-center gap-1"><BedDouble size={15} /> {s.beds}</span>
                  <span className="flex items-center gap-1"><Bath size={15} /> {s.baths}</span>
                </div>
                <div className="mt-auto flex items-end justify-between pt-6">
                  <p><span className="font-display text-3xl">{formatZAR(s.rate)}</span> <span className="text-xs opacity-70">per night</span></p>
                  <button type="button" onClick={() => choose(s.id)}
                    className="rounded-full bg-forest px-5 py-2 text-xs tracking-[0.2em] uppercase text-cream transition hover:bg-forest-deep">
                    {s.id === selectedId ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div id="book" className="mt-24 scroll-mt-28">
        {status === "sent" ? (
          <div role="status" className="mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-white/70 p-10 text-center">
            <p className="font-display text-3xl">Booking request received</p>
            <p className="mt-2 text-sm tracking-widest uppercase text-gold">Reference {ref}</p>
            <p className="mt-4 opacity-80">We will confirm availability and send your invoice with payment details. No payment is needed until then.</p>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl bg-forest text-cream">
                <div className="relative h-48">
                  <Image src={stay.img} alt={stay.name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold">{stay.location}</p>
                  <h3 className="mt-1 font-display text-3xl">{stay.name}</h3>
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Rate</span><span>{formatZAR(stay.rate)} per night</span></div>
                    {quote ? (
                      <>
                        <div className="flex justify-between"><span>{quote.nights} night{quote.nights === 1 ? "" : "s"}</span><span>{formatZAR(quote.subtotal)}</span></div>
                        <div className="flex justify-between"><span>Cleaning fee</span><span>{formatZAR(quote.cleaning)}</span></div>
                        <div className="flex justify-between border-t border-gold/40 pt-3 text-lg"><span>Estimated total</span><span className="text-gold">{formatZAR(quote.total)}</span></div>
                      </>
                    ) : (
                      <p className="opacity-70">Choose your dates to see an estimated total.</p>
                    )}
                  </div>
                  <p className="mt-6 text-xs opacity-60">Estimate only. Pay after we confirm your booking and send your invoice.</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5 lg:col-span-3">
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="checkIn" className={label}>Check-in</label>
                  <input id="checkIn" type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="checkOut" className={label}>Check-out</label>
                  <input id="checkOut" type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="guests" className={label}>Guests</label>
                  <select id="guests" value={String(guestCount)} onChange={(e) => setGuests(e.target.value)} className={field}>
                    {Array.from({ length: stay.maxGuests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              {validRange && !available && (
                <p role="alert" className="text-sm text-red-700">Those dates overlap an existing booking. Please try different dates.</p>
              )}
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
                <label htmlFor="notes" className={label}>Special requests (optional)</label>
                <textarea id="notes" name="notes" rows={3} maxLength={1500} className={field} />
              </div>

              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

              {status === "error" && <p role="alert" className="text-sm text-red-700">{error}</p>}

              <button type="submit" disabled={status === "sending"}
                className="rounded-full bg-forest px-9 py-4 text-xs font-medium tracking-[0.25em] uppercase text-cream shadow-lg transition hover:bg-forest-deep disabled:opacity-60">
                {status === "sending" ? "Sending..." : "Request to book"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
