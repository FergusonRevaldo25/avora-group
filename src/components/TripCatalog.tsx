"use client";

import { useMemo, useState } from "react";
import TripGrid from "@/components/TripGrid";
import { trips, tripRegions } from "@/lib/trips";

export default function TripCatalog() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [maxBudget, setMaxBudget] = useState(70000);
  const [duration, setDuration] = useState("");
  const [month, setMonth] = useState("");

  const months = useMemo(
    () => Array.from(new Set(trips.flatMap((trip) => trip.departures.map((item) => item.dateISO.slice(0, 7))))).sort(),
    []
  );

  const visibleTrips = trips.filter((trip) => {
    const query = search.trim().toLowerCase();
    const searchMatches = !query || `${trip.title} ${trip.destination} ${trip.region}`.toLowerCase().includes(query);
    const regionMatches = selectedRegion === "All" || trip.region === selectedRegion;

    const tripDays = Number(trip.duration.match(/\d+/)?.[0] ?? 0);
    const durationMatches =
      duration === "" ||
      (duration === "short" && tripDays <= 5) ||
      (duration === "medium" && tripDays >= 6 && tripDays <= 8) ||
      (duration === "long" && tripDays >= 9);

    const prices = [
      trip.priceFrom,
      ...(trip.specialPrice ? [trip.specialPrice] : []),
      ...trip.departures.map((item) => item.priceFrom),
    ];
    const budgetMatches = Math.min(...prices) <= maxBudget;
    const monthMatches = !month || trip.departures.some((item) => item.dateISO.startsWith(month));

    return searchMatches && regionMatches && durationMatches && budgetMatches && monthMatches;
  });

  return (
    <>
      <div className="mb-8 grid gap-5 rounded-2xl border border-forest/10 bg-white/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="trip-search" className="mb-2 block text-xs tracking-[0.15em] uppercase">Destination or trip</label>
          <input
            id="trip-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Start typing a destination"
            className="w-full rounded-lg border border-forest/15 bg-cream px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="trip-budget" className="mb-2 block text-xs tracking-[0.15em] uppercase">Maximum sample budget</label>
          <input
            id="trip-budget"
            type="range"
            min={0}
            max={70000}
            step={1000}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="mt-3 w-full accent-forest"
          />
          <output htmlFor="trip-budget" className="mt-2 block text-sm font-medium">
            Up to R{maxBudget.toLocaleString("en-ZA")}
          </output>
        </div>

        <div>
          <label htmlFor="trip-duration" className="mb-2 block text-xs tracking-[0.15em] uppercase">Duration</label>
          <select id="trip-duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border border-forest/15 bg-cream px-4 py-3 text-sm">
            <option value="">Any duration</option>
            <option value="short">Up to 5 days</option>
            <option value="medium">6–8 days</option>
            <option value="long">9 days or more</option>
          </select>
        </div>

        <div>
          <label htmlFor="trip-month" className="mb-2 block text-xs tracking-[0.15em] uppercase">Departure month</label>
          <select id="trip-month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-lg border border-forest/15 bg-cream px-4 py-3 text-sm">
            <option value="">Any month</option>
            {months.map((value) => (
              <option key={value} value={value}>
                {new Date(`${value}-01T00:00:00Z`).toLocaleDateString("en-ZA", { month: "long", year: "numeric", timeZone: "UTC" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-3 text-center text-sm font-medium">
        Sample budget: up to R{maxBudget.toLocaleString("en-ZA")}
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
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

      <p className="mb-5 text-center text-sm opacity-70">
        {visibleTrips.length} sample trip{visibleTrips.length === 1 ? "" : "s"} found
      </p>
      <TripGrid trips={visibleTrips} />
    </>
  );
}