import Image from "next/image";
import Link from "next/link";
import { formatZAR } from "@/lib/trip";
import type { Trip } from "@/lib/trips";

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/trips/${trip.slug}`} className="relative block h-56 overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.destination}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-forest">
          Sample trip
        </span>
        {trip.specialPrice && (
          <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] tracking-[0.15em] uppercase text-forest-deep">
            Sample special
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs tracking-[0.2em] uppercase text-gold">{trip.destination}</p>
        <Link href={`/trips/${trip.slug}`} className="mt-2 font-display text-2xl hover:text-gold">
          {trip.title}
        </Link>
        <p className="mt-2 text-xs opacity-60">{trip.duration} · {trip.region}</p>
        <p className="mt-4 text-sm leading-relaxed opacity-75">{trip.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p>
            {trip.specialPrice ? (
              <>
                <span className="block text-xs opacity-60 line-through">{formatZAR(trip.priceFrom)}</span>
                <span className="font-display text-3xl">{formatZAR(trip.specialPrice)}</span>
              </>
            ) : (
              <span className="font-display text-3xl">{formatZAR(trip.priceFrom)}</span>
            )}
            <span className="block text-xs opacity-70">sample price per person</span>
          </p>
          <Link
            href={`/trips/${trip.slug}`}
            className="rounded-full border border-forest px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition hover:bg-forest hover:text-cream"
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}