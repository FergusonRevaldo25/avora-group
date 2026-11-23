import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import { trips } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Travel Gallery | Avora Group",
  description: "Explore destination imagery for sample Avora travel ideas.",
};

export default function GalleryPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/about.jpg" eyebrow="Travel inspiration" title="A glimpse of the journey" script="Places, moments and possibilities." />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-8 rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm">
          These are representative sample images from the current Avora site. Replace them with approved Avora trip photography before launch.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.slug} href={`/trips/${trip.slug}`} className="group relative min-h-80 overflow-hidden rounded-2xl bg-forest text-cream">
              <Image src={trip.image} alt={trip.destination} fill className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-gold">Sample gallery</p>
                <h2 className="mt-2 font-display text-2xl">{trip.destination}</h2>
                <p className="mt-2 text-sm opacity-80">{trip.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}