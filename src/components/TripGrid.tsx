import TripCard from "@/components/TripCard";
import type { Trip } from "@/lib/trips";

export default function TripGrid({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return (
      <div className="rounded-2xl border border-forest/10 bg-white/60 p-10 text-center">
        <h2 className="font-display text-2xl">No trips listed here yet</h2>
        <p className="mt-2 text-sm opacity-70">Check back soon or send Avora a trip request.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
    </div>
  );
}