import Link from "next/link";
import Image from "next/image";

export default function SiteNav() {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-cream/80 px-4 py-2 backdrop-blur-md md:px-12">
      <Link href="/"><Image src="/images/logo.png" alt="Avora Group" width={120} height={90} className="h-12 w-auto md:h-14" priority /></Link>
      <div className="flex gap-3 text-[10px] tracking-[0.15em] uppercase sm:gap-8 sm:text-xs sm:tracking-[0.2em]">
        <Link href="/travel" className="transition hover:text-gold">Travel</Link>
        <Link href="/stays" className="transition hover:text-gold">Stays</Link>
        <Link href="/about" className="transition hover:text-gold">About</Link>
        <Link href="/#contact" className="transition hover:text-gold">Contact</Link>
      </div>
    </nav>
  );
}
