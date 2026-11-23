import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import { trips } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Destinations | Avora Group",
  description: "Explore sample destinations for local and international Avora travel.",
};

export default function DestinationsPage() {
  const destinations = Array.from(new Map(trips.map((trip) => [trip.destination, trip])).values());

  return (
    <main>
      <SiteNav />
      <PageHero img="/images/tropical.jpg" eyebrow="Explore the map" title="Places worth travelling for" script="Local getaways. International dreams." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-10 rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm">
          Sample destination ideas only. Replace these with destinations Avora has confirmed it can offer.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((trip) => (
            <Link key={trip.destination} href={`/trips/${trip.slug}`} className="group relative min-h-80 overflow-hidden rounded-2xl bg-forest text-cream">
              <Image src={trip.image} alt={trip.destination} fill className="object-cover opacity-70 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-gold">{trip.region}</p>
                <h2 className="mt-2 font-display text-3xl">{trip.destination}</h2>
                <p className="mt-2 text-sm opacity-80">Explore sample journey →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}