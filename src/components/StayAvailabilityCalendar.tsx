"use client";

import { useState } from "react";
import { isAvailable, type Stay } from "@/lib/pricing";
import { todayISO } from "@/lib/trip";

type Props = {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function nextISODate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function StayAvailabilityCalendar({
  stay,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = todayISO();
  const baseMonth = new Date(`${today.slice(0, 7)}-01T00:00:00Z`);

  function renderMonth(offset: number) {
    const first = new Date(Date.UTC(baseMonth.getUTCFullYear(), baseMonth.getUTCMonth() + monthOffset + offset, 1));
    const year = first.getUTCFullYear();
    const month = first.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const firstWeekday = first.getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const title = first.toLocaleDateString("en-ZA", { month: "long", year: "numeric", timeZone: "UTC" });

    return (
      <div key={monthKey}>
        <h3 className="mb-4 text-center font-display text-xl">{title}</h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((day) => (
            <span key={day} className="py-2 text-xs font-medium opacity-60">{day}</span>
          ))}

          {Array.from({ length: firstWeekday }, (_, index) => (
            <span key={`blank-${monthKey}-${index}`} aria-hidden="true" />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const iso = `${monthKey}-${String(day).padStart(2, "0")}`;
            const isPast = iso < today;
            const nightAvailable = isAvailable(stay, iso, nextISODate(iso));
            const canCheckout = Boolean(checkIn && !checkOut && iso > checkIn && isAvailable(stay, checkIn, iso));
            const disabled = isPast || (!nightAvailable && !canCheckout);
            const selected = iso === checkIn || iso === checkOut;
            const inRange = Boolean(checkIn && checkOut && iso > checkIn && iso < checkOut);

            let dayClass = "hover:bg-forest/10";
            if (selected) dayClass = "bg-forest text-cream";
            else if (inRange) dayClass = "bg-gold/20 text-forest";
            else if (!nightAvailable) dayClass = "bg-forest/5 text-red-700 line-through";
            if (disabled) dayClass += " cursor-not-allowed opacity-50";

            function chooseDate() {
              if (!checkIn || checkOut || iso <= checkIn) {
                onCheckInChange(iso);
                onCheckOutChange("");
                return;
              }
              if (isAvailable(stay, checkIn, iso)) {
                onCheckOutChange(iso);
              }
            }

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={`${iso}${nightAvailable ? ", available" : canCheckout ? ", available for checkout" : ", unavailable"}`}
                title={nightAvailable ? "Available" : canCheckout ? "Can be selected as checkout" : "Unavailable"}
                onClick={chooseDate}
                className={`mx-auto h-9 w-9 rounded-full text-sm transition ${dayClass}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section aria-label={`${stay.name} availability calendar`} className="mx-auto mt-16 max-w-5xl rounded-2xl border border-forest/10 bg-white/70 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold">Choose your dates</p>
          <h2 className="mt-1 font-display text-3xl">Check availability</h2>
          <p className="mt-2 text-sm opacity-70">Select check-in, then check-out. Availability reflects manually entered dates and needs confirmation.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMonthOffset((value) => value - 1)} aria-label="Previous month" className="h-10 w-10 rounded-full border border-forest/20 hover:bg-forest/5">&larr;</button>
          <button type="button" onClick={() => setMonthOffset((value) => value + 1)} aria-label="Next month" className="h-10 w-10 rounded-full border border-forest/20 hover:bg-forest/5">&rarr;</button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>

      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-forest/10 pt-5 text-xs">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-forest/30" /> Available</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-forest text-cream" /> Selected</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-forest/10" /> Unavailable</span>
      </div>
    </section>
  );
}