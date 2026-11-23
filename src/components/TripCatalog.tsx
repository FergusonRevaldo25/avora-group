"use client";

import { useState } from "react";
import TripGrid from "@/components/TripGrid";
import { trips, tripRegions } from "@/lib/trips";

export default function TripCatalog() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const visibleTrips = selectedRegion === "All"
    ? trips
    : trips.filter((trip) => trip.region === selectedRegion);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {["All", ...tripRegions].map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setSelectedRegion(region)}
            aria-pressed={selectedRegion === region}
            className={`rounded-full border px-5 py-2 text-xs tracking-[0.15em] uppercase transition ${
              selectedRegion === region
                ? "border-forest bg-forest text-cream"
                : "border-forest/20 hover:border-gold hover:text-gold"
            }`}
          >
            {region}
          </button>
        ))}
      </div>
      <TripGrid trips={visibleTrips} />
    </>
  );
}