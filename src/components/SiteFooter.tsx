import { Phone, Mail, MapPin } from "lucide-react";
import FooterLinks from "@/components/FooterLinks";
import { company } from "@/lib/company";

export default function SiteFooter() {
  return (
    <footer>
      <div className="bg-forest-deep px-6 pt-16 text-center text-cream">
        <p className="font-script text-4xl text-gold md:text-5xl">Let&apos;s Plan Your Next Trip</p>
        <div className="mt-8 flex flex-col items-center gap-3 pb-12 text-sm">
          <a href={company.phoneHref} className="flex items-center gap-3 transition hover:text-gold"><Phone size={16} /> {company.phone}</a>
          <a href={`mailto:${company.email}`} className="flex items-center gap-3 transition hover:text-gold"><Mail size={16} /> {company.email}</a>
          <span className="flex items-center gap-3"><MapPin size={16} /> {company.address}</span>
        </div>
      </div>
      <FooterLinks />
    </footer>
  );
}
