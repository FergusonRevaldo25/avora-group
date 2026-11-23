export type Post = { slug: string; title: string; date: string; excerpt: string; img: string; body: { h?: string; p: string }[] };

// DRAFT articles: review and personalise before launch. Add new ones to this list.
export const posts: Post[] = [
  {
    slug: "zanzibar-best-time-to-visit",
    title: "When is the best time to visit Zanzibar?",
    date: "2026-10-26",
    excerpt: "A simple guide to the seasons, so you can match your dates to the weather you want.",
    img: "/images/tropical.jpg",
    body: [
      { p: "Zanzibar sits just south of the equator, so it is warm all year round. What changes is the rain, the humidity and how busy the beaches are." },
      { h: "The drier months", p: "Generally, June to October and December to February are the drier, sunnier periods, which makes them popular for beach holidays. Expect more visitors and higher prices around December and January, so book early." },
      { h: "The rainy months", p: "The long rains usually fall from about March to May, with shorter showers around November. Some resorts offer lower rates then, and the island is quieter and very green." },
      { h: "Not sure which dates suit you?", p: "Tell us when you can travel and what you want from the trip, and we will suggest the best fit and send a quote." },
    ],
  },
  {
    slug: "pre-flight-checklist",
    title: "Your pre-flight checklist for an international trip",
    date: "2026-10-26",
    excerpt: "The simple things to check before you leave, so nothing catches you out at the airport.",
    img: "/images/flight.jpg",
    body: [
      { p: "A little preparation makes the start of a trip much calmer. Here is what we suggest checking a few weeks before you fly." },
      { h: "Passport", p: "Check your passport is valid for your whole trip and has enough blank pages. Many countries require extra validity beyond your return date, often six months, so confirm the rules for your destination." },
      { h: "Visas and entry rules", p: "Entry requirements depend on your nationality and destination, and they can change. Check them with the destination's official sources well before you travel." },
      { h: "Insurance and copies", p: "Take out travel insurance, and keep copies of your passport, tickets and bookings somewhere separate from the originals." },
      { h: "Airport day", p: "Airlines usually recommend arriving well ahead of international departures, often about three hours. Check your own airline's guidance." },
    ],
  },
];
