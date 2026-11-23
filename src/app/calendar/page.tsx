import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import { formatZAR } from "@/lib/trip";
import { trips } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Departure Calendar | Avora Group",
  description: "View sample travel departure dates for Avora trips.",
};

export default function CalendarPage() {
  const departures = trips
    .flatMap((trip) => trip.departures.map((departure) => ({ trip, departure })))
    .sort((a, b) => a.departure.dateISO.localeCompare(b.departure.dateISO));

  return (
    <main>
      <SiteNav />
      <PageHero img="/images/passport.jpg" eyebrow="Dates at a glance" title="Departure calendar" script="A little planning goes a long way." />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-8 rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm">
          Sample dates and prices only. Confirm actual departures and availability with Avora.
        </p>
        <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white/60">
          {departures.map(({ trip, departure }) => (
            <div key={`${trip.slug}-${departure.dateISO}`} className="grid gap-3 border-b border-forest/10 p-5 last:border-0 sm:grid-cols-[1fr_1.5fr_auto_auto] sm:items-center">
              <p className="text-sm text-gold">{departure.label}</p>
              <Link href={`/trips/${trip.slug}`} className="font-display text-xl hover:text-gold">{trip.title}</Link>
              <p className="text-sm">{formatZAR(departure.priceFrom)} sample</p>
              <Link href={`/trips/${trip.slug}`} className="text-xs tracking-[0.15em] uppercase underline underline-offset-4">Details</Link>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}