"use client";

import { useMemo, useState } from "react";

const WHATSAPP = "https://wa.me/27786942426";

const destinations = [
  { name: "Greece", region: "Europe", note: "Coastal towns, history and island escapes." },
  { name: "Maldives", region: "Indian Ocean", note: "A tropical escape with clear-water scenery." },
  { name: "Mauritius", region: "Indian Ocean", note: "Island beaches, nature and relaxed stays." },
  { name: "Zanzibar", region: "East Africa", note: "A blend of coastline, culture and island life." },
];

const trips: Array<{ title: string; destination: string; month: string; price: number; href: string }> = [];
const deals: Array<{ title: string; detail: string; href: string }> = [];

// Add only confirmed dates here, in YYYY-MM-DD format.
// These arrays intentionally start empty until Avora confirms availability.
const confirmedDepartureDates: string[] = [];
const fullDepartureDates: string[] = [];

const faqs = [
  {
    q: "How do I find out what a trip includes?",
    a: "Send Avora the trip or destination you are interested in. Avora can confirm the current itinerary, inclusions and price.",
  },
  {
    q: "Are dates and availability guaranteed on this page?",
    a: "Dates are shown as confirmed only when Avora has added them to the availability calendar. Please confirm availability before making plans.",
  },
  {
    q: "How do payments and cancellations work?",
    a: "Payment schedules and cancellation terms can vary by trip. Ask Avora for the current terms before booking.",
  },
  {
    q: "Can I ask about transport, documents or accommodation?",
    a: "Yes. Include your destination and travel dates in your enquiry and Avora can confirm the details for that trip.",
  },
];

function whatsappLink(message: string) {
  return `${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function AvoraTravelFeatures() {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [budget, setBudget] = useState(30000);
  const [searched, setSearched] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const matchingTrips = useMemo(() => {
    return trips.filter((trip) => {
      const destinationMatch = !destination || trip.destination === destination;
      const monthMatch = !month || trip.month === month;
      const budgetMatch = !budget || trip.price <= budget;
      return destinationMatch && monthMatch && budgetMatch;
    });
  }, [destination, month, budget]);

  const calendarCells = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7;
    const days = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: startOffset }, () => null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ];
  }, [calendarMonth]);

  function dateStatus(day: number) {
    const date = `${monthKey(calendarMonth)}-${String(day).padStart(2, "0")}`;
    if (fullDepartureDates.includes(date)) return "full";
    if (confirmedDepartureDates.includes(date)) return "available";
    return "unconfirmed";
  }

  const enquiry = `Hi Avora, please help me find a trip or stay. Destination: ${destination || "Flexible"}. Month: ${month || "Flexible"}. Travellers: ${travellers}. Budget per person: up to R${budget.toLocaleString("en-ZA")}.`;

  return (
    <div className="space-y-16 py-12">
      <section id="trip-finder" className="mx-auto max-w-7xl px-5">
        <div className="rounded-3xl bg-[#f5f0e6] p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Plan your escape</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#123b32] md:text-4xl">Find a trip or stay</h2>
          <p className="mt-3 max-w-2xl text-[#40534d]">Tell us what you have in mind and we&apos;ll help you check the right options.</p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-sm font-medium text-[#173c34]">
              Destination
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white p-3">
                <option value="">Any destination</option>
                {destinations.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-[#173c34]">
              Travel month
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white p-3" />
            </label>
            <label className="text-sm font-medium text-[#173c34]">
              Travellers
              <input type="number" min="1" max="20" value={travellers} onChange={(e) => setTravellers(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white p-3" />
            </label>
            <label className="text-sm font-medium text-[#173c34]">
              Budget per person: R{budget.toLocaleString("en-ZA")}
              <input type="range" min="5000" max="100000" step="1000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="mt-4 w-full accent-[#a27b37]" />
            </label>
            <button type="button" onClick={() => setSearched(true)} className="self-end rounded-xl bg-[#123b32] px-5 py-3 font-semibold text-white hover:bg-[#1d5145]">
              Find options
            </button>
          </div>

          {searched && (
            <div className="mt-6 rounded-2xl bg-white p-5">
              {matchingTrips.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {matchingTrips.map((trip) => (
                    <a key={trip.title} href={trip.href} className="rounded-xl border border-[#e5dfd3] p-4">
                      <strong className="text-[#123b32]">{trip.title}</strong>
                      <p className="mt-1 text-sm text-gray-600">{trip.destination} | {trip.month} | From R{trip.price.toLocaleString("en-ZA")} pp</p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#40534d]">No published matches yet. Send your preferences and Avora can confirm current trip and stay options.</p>
              )}
              <a href={whatsappLink(enquiry)} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-[#a27b37] px-5 py-3 font-semibold text-white">Ask Avora on WhatsApp</a>
            </div>
          )}
        </div>
      </section>

      <section id="availability" className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Plan ahead</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#123b32]">Departure availability</h2>
            <p className="mt-3 text-[#52645e]">Only dates Avora confirms are marked available. Please check with Avora before booking.</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#40534d]">
              <span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-[#4a8b68]" />Available</span>
              <span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-[#b8564d]" />Full</span>
              <span><i className="mr-2 inline-block h-3 w-3 rounded-full border border-gray-300 bg-white" />Not confirmed</span>
            </div>
            <p className="mt-5 text-sm text-[#6a756f]">Availability is enquiry-based until live booking inventory is connected.</p>
          </div>

          <div className="rounded-2xl border border-[#e5dfd3] p-5">
            <div className="flex items-center justify-between">
              <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded-lg border px-3 py-2">&lt;</button>
              <h3 className="font-semibold text-[#123b32]">{calendarMonth.toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}</h3>
              <button type="button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded-lg border px-3 py-2">&gt;</button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2 text-center">
              {calendarCells.map((day, index) => {
                if (!day) return <span key={`blank-${index}`} />;
                const status = dateStatus(day);
                const style = status === "available" ? "bg-[#4a8b68] text-white" : status === "full" ? "bg-[#b8564d] text-white" : "bg-[#f5f3ee] text-[#6b716d]";
                return <span key={day} title={status === "unconfirmed" ? "Availability not confirmed" : status} className={`grid aspect-square place-items-center rounded-full text-sm ${style}`}>{day}</span>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="current-deals" className="mx-auto max-w-7xl px-5">
        <div className="rounded-3xl bg-[#123b32] p-6 text-white md:flex md:items-center md:justify-between md:p-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e4c47e]">Avora offers</p>
            <h2 className="mt-2 text-3xl font-semibold">Current escapes & offers</h2>
            <p className="mt-2 text-white/80">Ask us for current prices, dates and inclusions.</p>
          </div>
          <a href={whatsappLink("Hi Avora, please send me your current travel offers and confirmed dates.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-[#e4c47e] px-5 py-3 font-semibold text-[#123b32] md:mt-0">Ask about current offers</a>
        </div>
        {deals.length > 0 && <div className="mt-5 grid gap-4 md:grid-cols-3">{deals.map((deal) => <a key={deal.title} href={deal.href} className="rounded-2xl border p-5"><strong>{deal.title}</strong><p className="mt-2 text-sm">{deal.detail}</p></a>)}</div>}
      </section>

      <section id="destinations" className="mx-auto max-w-7xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Get inspired</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#123b32]">Find your kind of escape</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((item) => (
            <a key={item.name} href={whatsappLink(`Hi Avora, please tell me about trip and stay options for ${item.name}.`)} target="_blank" rel="noreferrer" className="group min-h-56 overflow-hidden rounded-2xl bg-cover bg-center p-5 text-white shadow-sm transition hover:-translate-y-1" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.72)), url('/images/${item.name.toLowerCase()}.jpg')` }}>
              <span className="text-xs uppercase tracking-widest text-white/80">{item.region}</span>
              <h3 className="mt-20 text-2xl font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-white/90">{item.note}</p>
              <span className="mt-4 inline-block text-sm font-semibold underline">Ask about this destination</span>
            </a>
          ))}
        </div>
      </section>

      <section id="travel-faq" className="mx-auto max-w-4xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Good to know</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#123b32]">Travel questions</h2>
        <div className="mt-5 divide-y divide-[#e5dfd3] border-y border-[#e5dfd3]">
          {faqs.map((faq, index) => (
            <div key={faq.q}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-[#173c34]">
                {faq.q}<span aria-hidden="true">{openFaq === index ? "-" : "+"}</span>
              </button>
              {openFaq === index && <p className="pb-5 pr-8 text-sm leading-6 text-[#52645e]">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section id="travel-updates" className="mx-auto max-w-7xl px-5">
        <div className="rounded-3xl bg-[#f5f0e6] p-6 md:flex md:items-center md:justify-between md:p-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Travel notes from Avora</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#123b32]">Get occasional trip updates</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#52645e]">Join by messaging Avora. We&apos;ll confirm your opt-in before adding your contact to any mailing list.</p>
          </div>
          <a href={whatsappLink("Hi Avora, I would like to opt in to occasional travel and trip updates. Please tell me how to subscribe.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex shrink-0 rounded-xl bg-[#123b32] px-5 py-3 font-semibold text-white md:mt-0">Ask to subscribe</a>
        </div>
      </section>
    </div>
  );
}