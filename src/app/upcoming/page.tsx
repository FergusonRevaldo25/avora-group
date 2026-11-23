import type { Metadata } from "next";
import TripCollectionPage from "@/components/TripCollectionPage";
import { trips } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Upcoming Departures | Avora Group",
  description: "Browse sample upcoming group travel departures from Avora.",
};

export default function UpcomingPage() {
  return <TripCollectionPage eyebrow="Plan ahead" title="Upcoming journeys" script="Find a date that works for you." trips={trips} />;
}