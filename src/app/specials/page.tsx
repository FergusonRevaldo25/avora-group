import type { Metadata } from "next";
import TripCollectionPage from "@/components/TripCollectionPage";
import { trips } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Travel Specials | Avora Group",
  description: "Sample travel specials for the Avora trip catalogue.",
};

export default function SpecialsPage() {
  return <TripCollectionPage eyebrow="Limited-time ideas" title="Specials worth a closer look" script="Sample offers for inspiration." trips={trips.filter((trip) => trip.specialPrice !== undefined)} />;
}