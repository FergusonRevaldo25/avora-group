import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import TripGrid from "@/components/TripGrid";
import type { Trip } from "@/lib/trips";

export default function TripCollectionPage({
  eyebrow,
  title,
  script,
  trips,
}: {
  eyebrow: string;
  title: string;
  script: string;
  trips: Trip[];
}) {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/tropical.jpg" eyebrow={eyebrow} title={title} script={script} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm leading-relaxed">
          <strong>Sample content:</strong> these example trips, dates and prices demonstrate the page layout. Confirmed Avora offers should replace them before publication.
        </div>
        <TripGrid trips={trips} />
        <div className="mt-14 text-center">
          <Link href="/travel#request" className="inline-flex rounded-full bg-forest px-8 py-4 text-xs tracking-[0.2em] uppercase text-cream transition hover:bg-forest-deep">
            Plan a trip with Avora
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}