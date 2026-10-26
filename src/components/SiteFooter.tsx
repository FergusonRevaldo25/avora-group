import { Phone, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-forest-deep px-6 py-16 text-center text-cream">
      <p className="font-script text-4xl text-gold md:text-5xl">Let&apos;s Plan Your Next Trip</p>
      <div className="mt-8 flex flex-col items-center gap-3 text-sm">
        <a href="tel:+27784689886" className="flex items-center gap-3 transition hover:text-gold"><Phone size={16} /> +27 78 468 9886</a>
        <a href="mailto:hello@avoragroup.co.za" className="flex items-center gap-3 transition hover:text-gold"><Mail size={16} /> hello@avoragroup.co.za</a>
        <span className="flex items-center gap-3"><MapPin size={16} /> Cape Town, South Africa</span>
      </div>
      <p className="mt-10 text-xs tracking-[0.4em] uppercase opacity-60">Local Getaways. International Dreams.</p>
    </footer>
  );
}
