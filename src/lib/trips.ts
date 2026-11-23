export type TripRegion = "Local" | "Africa" | "Middle East" | "Asia" | "Europe";

export type TripDeparture = {
  dateISO: string;
  label: string;
  priceFrom: number;
};

export type Trip = {
  slug: string;
  title: string;
  destination: string;
  region: TripRegion;
  duration: string;
  image: string;
  summary: string;
  priceFrom: number;
  specialPrice?: number;
  departures: TripDeparture[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day: string; title: string; description: string }[];
};

export const trips: Trip[] = [
  {
    slug: "cape-town-coastal-escape",
    title: "Cape Town Coastal Escape",
    destination: "Cape Town, South Africa",
    region: "Local",
    duration: "4 days / 3 nights",
    image: "/images/city.jpg",
    summary: "A sample city-and-coast break with time for mountain views, ocean air and relaxed local exploring.",
    priceFrom: 8990,
    departures: [
      { dateISO: "2027-02-12", label: "12–15 February 2027", priceFrom: 8990 },
      { dateISO: "2027-04-16", label: "16–19 April 2027", priceFrom: 9490 },
    ],
    highlights: ["Scenic city viewpoints", "Coastal time", "Small-group travel"],
    included: ["Sample return transport", "Sample accommodation", "Selected group activities"],
    notIncluded: ["Meals not listed in the final itinerary", "Personal spending", "Optional activities"],
    itinerary: [
      { day: "Day 1", title: "Arrive and settle in", description: "Meet the group, check in and enjoy a relaxed welcome evening." },
      { day: "Day 2", title: "City and coast", description: "Explore selected city highlights and spend time along the coast." },
      { day: "Day 3", title: "A day at your pace", description: "Choose a relaxed local outing or an optional activity." },
      { day: "Day 4", title: "Farewell", description: "Enjoy breakfast before the return journey." },
    ],
  },
  {
    slug: "mozambique-coast-escape",
    title: "Mozambique Coast Escape",
    destination: "Maputo and the coast",
    region: "Africa",
    duration: "5 days / 4 nights",
    image: "/images/tropical.jpg",
    summary: "A sample cross-border coastal journey combining beach time, local flavours and guided exploring.",
    priceFrom: 10990,
    departures: [
      { dateISO: "2027-03-25", label: "25–29 March 2027", priceFrom: 10990 },
      { dateISO: "2027-06-10", label: "10–14 June 2027", priceFrom: 11490 },
    ],
    highlights: ["Coastal downtime", "Guided local visit", "Group transport"],
    included: ["Sample return transport", "Sample accommodation", "Selected guided activities"],
    notIncluded: ["Passport and border fees", "Meals not listed in the final itinerary", "Personal spending"],
    itinerary: [
      { day: "Day 1", title: "Travel to the coast", description: "Depart with the group and settle into your accommodation." },
      { day: "Day 2", title: "Coastal day", description: "Enjoy time by the water and a group outing." },
      { day: "Day 3", title: "Local discovery", description: "Explore a local market or neighbourhood with a guide." },
      { day: "Day 4", title: "Choose your pace", description: "Take a quiet beach day or select an optional activity." },
      { day: "Day 5", title: "Return journey", description: "Check out and travel back with the group." },
    ],
  },
  {
    slug: "zanzibar-island-retreat",
    title: "Zanzibar Island Retreat",
    destination: "Zanzibar, Tanzania",
    region: "Africa",
    duration: "7 days / 6 nights",
    image: "/images/tropical.jpg",
    summary: "A sample island stay with warm-water beaches, cultural discovery and time to slow down.",
    priceFrom: 24990,
    specialPrice: 22990,
    departures: [
      { dateISO: "2027-04-10", label: "10–16 April 2027", priceFrom: 22990 },
      { dateISO: "2027-08-07", label: "7–13 August 2027", priceFrom: 24990 },
    ],
    highlights: ["Island accommodation", "Local culture", "Time to relax"],
    included: ["Sample accommodation", "Selected transfers", "Activities listed in the final itinerary"],
    notIncluded: ["International flights unless confirmed", "Travel documents", "Meals not listed in the final itinerary"],
    itinerary: [
      { day: "Day 1", title: "Island arrival", description: "Meet the local team and transfer to your accommodation." },
      { day: "Day 2", title: "Settle into the island", description: "Enjoy a relaxed day and get to know the area." },
      { day: "Day 3", title: "Culture and history", description: "Take a guided sample visit to a historic neighbourhood." },
      { day: "Day 4", title: "Coast and water", description: "Spend the day by the ocean or choose an optional excursion." },
      { day: "Day 5", title: "Island at your pace", description: "Enjoy free time or join a group activity." },
      { day: "Day 6", title: "Last full day", description: "Make the most of the island before departure." },
      { day: "Day 7", title: "Depart", description: "Check out and transfer for your return journey." },
    ],
  },
  {
    slug: "dubai-city-and-desert",
    title: "Dubai City and Desert",
    destination: "Dubai, United Arab Emirates",
    region: "Middle East",
    duration: "6 days / 5 nights",
    image: "/images/city.jpg",
    summary: "A sample city break pairing skyline sights with a desert experience and time to explore.",
    priceFrom: 28990,
    departures: [
      { dateISO: "2027-06-15", label: "15–20 June 2027", priceFrom: 28990 },
      { dateISO: "2027-10-05", label: "5–10 October 2027", priceFrom: 30990 },
    ],
    highlights: ["Modern city landmarks", "Sample desert outing", "Group travel support"],
    included: ["Sample accommodation", "Selected transfers", "Activities listed in the final itinerary"],
    notIncluded: ["Flights unless confirmed", "Visa or travel-document costs", "Personal spending"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Dubai", description: "Transfer to your accommodation and settle in." },
      { day: "Day 2", title: "City highlights", description: "Explore a selection of modern landmarks with the group." },
      { day: "Day 3", title: "Old and new", description: "Discover contrasting neighbourhoods and local food stops." },
      { day: "Day 4", title: "Desert experience", description: "Join a sample guided desert outing." },
      { day: "Day 5", title: "Free day", description: "Shop, relax or choose an optional activity." },
      { day: "Day 6", title: "Depart", description: "Check out and transfer for your return journey." },
    ],
  },
  {
    slug: "europe-grand-journey",
    title: "Europe Grand Journey",
    destination: "Selected European cities",
    region: "Europe",
    duration: "12 days / 11 nights",
    image: "/images/passport.jpg",
    summary: "A sample multi-city itinerary designed around landmark sights, local culture and shared travel.",
    priceFrom: 59990,
    specialPrice: 55990,
    departures: [
      { dateISO: "2027-09-05", label: "5–16 September 2027", priceFrom: 55990 },
      { dateISO: "2027-11-01", label: "1–12 November 2027", priceFrom: 59990 },
    ],
    highlights: ["Multi-city route", "Guided city walks", "Shared group experiences"],
    included: ["Sample accommodation", "Selected local transfers", "Activities listed in the final itinerary"],
    notIncluded: ["International flights unless confirmed", "Visas and travel documents", "Meals not listed in the final itinerary"],
    itinerary: [
      { day: "Days 1–2", title: "First city", description: "Arrive, settle in and explore selected neighbourhoods." },
      { day: "Days 3–5", title: "On to the next stop", description: "Travel between cities and enjoy guided sample experiences." },
      { day: "Days 6–8", title: "Culture and cuisine", description: "Discover local sights and enjoy time to explore independently." },
      { day: "Days 9–11", title: "Final city", description: "Take in the last highlights and share a farewell evening." },
      { day: "Day 12", title: "Return journey", description: "Check out and travel home." },
    ],
  },
];

export const tripRegions = ["Local", "Africa", "Middle East", "Asia", "Europe"] as const;