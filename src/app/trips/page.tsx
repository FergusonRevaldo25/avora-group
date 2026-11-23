import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import TripCatalog from "@/components/TripCatalog";

export const metadata: Metadata = {
  title: "Explore Trips | Avora Group",
  description: "Browse sample Avora group trips and travel ideas by region.",
};

export default function TripsPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/flight.jpg" eyebrow="Avora Journeys" title="Find a trip that feels like yours" script="Thoughtfully planned. Made to explore." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm leading-relaxed">
          <strong>Sample content:</strong> these example trips, dates and prices demonstrate the layout. Confirmed Avora offers should replace them before publication.
        </div>
        <TripCatalog />
      </section>
      <SiteFooter />
    </main>
  );
}