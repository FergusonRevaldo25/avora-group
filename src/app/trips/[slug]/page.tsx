import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { company } from "@/lib/company";
import { formatZAR } from "@/lib/trip";
import { trips } from "@/lib/trips";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = trips.find((item) => item.slug === slug);
  return {
    title: trip ? `${trip.title} | Avora Group` : "Trip | Avora Group",
    description: trip?.summary ?? "Explore an Avora travel idea.",
  };
}

export default async function TripDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const trip = trips.find((item) => item.slug === slug);
  if (!trip) notFound();

  const whatsappText = encodeURIComponent(`Hi Avora, I would like to ask about the sample trip: ${trip.title}.`);
  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${whatsappText}`;

  return (
    <main>
      <SiteNav />
      <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-forest-deep px-6 pb-14 pt-32 text-cream">
        <Image src={trip.image} alt={trip.destination} fill priority className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl">
          <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold">{trip.destination} · {trip.region}</p>
          <h1 className="max-w-3xl font-display text-5xl md:text-7xl">{trip.title}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-85">{trip.duration}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="rounded-2xl border border-gold/40 bg-white/60 p-5 text-sm leading-relaxed">
          <strong>Sample trip page:</strong> dates, itinerary, inclusions and prices are illustrative placeholders. Confirm all details with Avora before booking.
        </p>

        <section className="grid gap-12 py-14 lg:grid-cols-[1.5fr_0.8fr]">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">The experience</p>
            <h2 className="mt-3 font-display text-4xl">A little more about this journey</h2>
            <p className="mt-5 leading-relaxed opacity-80">{trip.summary}</p>

            <h3 className="mt-10 font-display text-2xl">Trip highlights</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {trip.highlights.map((item) => <li key={item} className="rounded-xl bg-white/60 p-4 text-sm">{item}</li>)}
            </ul>

            <h3 className="mt-10 font-display text-2xl">Sample itinerary</h3>
            <ol className="mt-4 space-y-4">
              {trip.itinerary.map((item) => (
                <li key={item.day} className="border-l-2 border-gold pl-5">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold">{item.day}</p>
                  <h4 className="mt-1 font-medium">{item.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed opacity-75">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <aside className="h-fit rounded-2xl bg-forest p-7 text-cream">
            <p className="text-xs tracking-[0.2em] uppercase text-gold">Sample price</p>
            {trip.specialPrice ? (
              <>
                <p className="mt-2 text-sm line-through opacity-60">{formatZAR(trip.priceFrom)} per person</p>
                <p className="font-display text-4xl">{formatZAR(trip.specialPrice)}</p>
              </>
            ) : (
              <p className="mt-2 font-display text-4xl">{formatZAR(trip.priceFrom)}</p>
            )}
            <p className="text-sm opacity-75">per person · sample only</p>
            <div className="my-6 border-t border-gold/30 pt-5">
              <h2 className="font-display text-2xl">Sample departures</h2>
              <ul className="mt-3 space-y-3 text-sm">
                {trip.departures.map((departure) => (
                  <li key={departure.dateISO} className="flex justify-between gap-3 border-b border-cream/10 pb-3">
                    <span>{departure.label}</span>
                    <span className="whitespace-nowrap text-gold">{formatZAR(departure.priceFrom)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/travel#request" className="block rounded-full bg-cream px-6 py-3 text-center text-xs tracking-[0.15em] uppercase text-forest transition hover:bg-gold">
              Request a quote
            </Link>
            <a href={whatsappUrl} className="mt-3 block text-center text-xs underline underline-offset-4">
              Ask Avora on WhatsApp
            </a>
            <p className="mt-5 text-xs leading-relaxed opacity-60">No online payment is taken. Avora confirms availability and pricing before payment.</p>
          </aside>
        </section>

        <section className="grid gap-8 border-t border-forest/10 py-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">What the sample includes</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {trip.included.map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">Not included in the sample</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {trip.notIncluded.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}