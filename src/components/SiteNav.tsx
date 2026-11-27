import Link from "next/link";
import Image from "next/image";

export default function SiteNav() {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-forest/10 bg-cream/95 px-5 py-3 text-forest shadow-sm backdrop-blur-md md:px-8 xl:px-12">
      <Link href="/" className="shrink-0"><Image src="/images/logo.png" alt="Avora Group" width={120} height={90} className="h-12 w-auto shrink-0 md:h-14" priority /></Link>
      <div className="hidden min-w-0 items-center gap-2 whitespace-nowrap text-[13px] font-medium tracking-[0.04em] uppercase text-forest xl:flex 2xl:gap-4 2xl:text-sm">
        <Link href="/travel" className="transition hover:text-gold">Travel</Link>
        <Link href="/trips" className="transition hover:text-gold">Trips</Link>
        <Link href="/destinations" className="transition hover:text-gold">Destinations</Link>
        <Link href="/stays" className="transition hover:text-gold">Stays</Link>
        <Link href="/about" className="transition hover:text-gold">About</Link>
        <Link href="/specials" className="transition hover:text-gold">Specials</Link>
        <Link href="/upcoming" className="transition hover:text-gold">Upcoming</Link>
        <Link href="/calendar" className="transition hover:text-gold">Calendar</Link>
        <Link href="/how-to-book" className="transition hover:text-gold">How to Book</Link>
        <Link href="/gallery" className="transition hover:text-gold">Gallery</Link>
        <Link href="/#services" className="transition hover:text-gold">Services</Link>
        <Link href="/#why" className="transition hover:text-gold">Why Avora</Link>
        <Link href="/#contact" className="transition hover:text-gold">Contact</Link>
      </div>
      <details className="relative xl:hidden">
        <summary className="cursor-pointer list-none rounded-full border border-forest/30 px-4 py-2 text-sm font-medium tracking-[0.08em] uppercase text-forest [&::-webkit-details-marker]:hidden">Menu</summary>
        <div className="absolute right-0 top-full z-50 mt-2 grid max-h-[75vh] min-w-56 gap-4 overflow-y-auto rounded-xl border border-forest/10 bg-cream p-5 text-sm font-medium tracking-[0.08em] uppercase text-forest shadow-xl">
          <Link href="/travel">Travel</Link>
          <Link href="/trips">Trips</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/stays">Stays</Link>
          <Link href="/about">About</Link>
          <Link href="/specials">Specials</Link>
          <Link href="/upcoming">Upcoming</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/how-to-book">How to Book</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#why">Why Avora</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </details>
    </nav>
  );
}
