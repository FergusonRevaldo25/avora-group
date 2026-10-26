// TEMPLATE DATA: replace with Avora's real packages, prices and listings.
export type Package = { id: string; title: string; blurb: string; img: string; from: string; unit: string };

export const packages: Package[] = [
  { id: "flights", title: "Flight Bookings", blurb: "Domestic and international flights at the best available fares.", img: "/images/flight.jpg", from: "R350", unit: "service fee per booking" },
  { id: "island", title: "Island Escapes", blurb: "Overwater villas and beach resorts in the Maldives, Mauritius and Zanzibar.", img: "/images/tropical.jpg", from: "R18,500", unit: "per person sharing" },
  { id: "dubai", title: "Dubai City Break", blurb: "Flights, hotel and transfers for a five-night stay.", img: "/images/city.jpg", from: "R14,900", unit: "per person sharing" },
  { id: "hotels", title: "Hotel and Resort Stays", blurb: "Luxury resorts and boutique hotels matched to your budget.", img: "/images/hotel.jpg", from: "R1,200", unit: "per night" },
  { id: "tours", title: "Guided Tours", blurb: "Curated experiences for individuals, couples, families and groups.", img: "/images/about.jpg", from: "R2,500", unit: "per person" },
  { id: "custom", title: "Custom Itinerary", blurb: "Tell us your dream trip and we will build it around you.", img: "/images/passport.jpg", from: "Quote", unit: "on request" },
];

export type Stay = {
  id: string; name: string; location: string; img: string;
  maxGuests: number; beds: number; baths: number;
  rate: number; cleaning: number; blurb: string;
  blocked: [string, string][]; // [checkIn, checkOut) ranges already taken, YYYY-MM-DD
};

export const stays: Stay[] = [
  { id: "seaview-suite", name: "Seaview Suite", location: "Cape Town, Western Cape", img: "/images/hotel.jpg", maxGuests: 2, beds: 1, baths: 1, rate: 1850, cleaning: 350,
    blurb: "Floor-to-ceiling ocean views, a king bed and a private balcony.", blocked: [["2026-12-20", "2026-12-27"]] },
  { id: "island-villa", name: "Overwater Villa", location: "Zanzibar, Tanzania", img: "/images/tropical.jpg", maxGuests: 4, beds: 2, baths: 2, rate: 4200, cleaning: 600,
    blurb: "Thatched villa over turquoise water with a private plunge pool.", blocked: [["2027-01-02", "2027-01-09"]] },
  { id: "skyline-penthouse", name: "Skyline Penthouse", location: "Dubai, UAE", img: "/images/city.jpg", maxGuests: 4, beds: 2, baths: 2, rate: 3600, cleaning: 500,
    blurb: "High-floor apartment with sweeping skyline views at sunset.", blocked: [] },
];

export function isAvailable(stay: Stay, checkIn: string, checkOut: string) {
  return stay.blocked.every(([s, e]) => checkOut <= s || checkIn >= e);
}
