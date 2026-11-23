import Link from "next/link";
import { company } from "@/lib/company";

const links: [string, string][] = [
  ["About", "/about"], ["Travel", "/travel"], ["Trips", "/trips"], ["Destinations", "/destinations"],
  ["Specials", "/specials"], ["Upcoming", "/upcoming"], ["Calendar", "/calendar"], ["How to Book", "/how-to-book"],
  ["Gallery", "/gallery"], ["Stays", "/stays"], ["Corporate", "/corporate"],
  ["Property", "/property"], ["Blog", "/blog"], ["Partner with us", "/partners"], ["Privacy", "/privacy"], ["Terms", "/terms"],
];

export default function FooterLinks() {
  return (
    <div className="bg-forest-deep px-6 pb-10 pt-2 text-center text-cream">
      <nav aria-label="Footer" className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-gold/20 pt-8 text-xs tracking-[0.2em] uppercase">
        {links.map(([t, h]) => <Link key={h} href={h} className="opacity-70 transition hover:text-gold hover:opacity-100">{t}</Link>)}
      </nav>
      <p className="mt-6 text-xs opacity-40">&copy; {company.year} {company.name}. All rights reserved.</p>
    </div>
  );
}
