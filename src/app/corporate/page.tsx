import type { Metadata } from "next";
import { UserRound, Users, CalendarCheck, FileText } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import LeadForm, { type LeadField } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Corporate Travel | Avora Group",
  description: "Business travel, group trips and events, arranged by one dedicated point of contact.",
};

const benefits = [
  { icon: UserRound, title: "One point of contact", text: "A single person who knows your preferences and handles every booking." },
  { icon: Users, title: "Group and event travel", text: "Teams, conferences, incentives and delegations, coordinated together." },
  { icon: CalendarCheck, title: "Built around your schedule", text: "Itineraries that fit meetings, not the other way round." },
  { icon: FileText, title: "Clear, itemised quotes", text: "Transparent pricing and tidy paperwork for your records." },
];

const fields: LeadField[] = [
  { name: "company", label: "Company", required: true },
  { name: "contactName", label: "Contact person", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "travellers", label: "Number of travellers", type: "number", required: true, min: 1, max: 500, defaultValue: 1, wide: true },
  { name: "message", label: "Tell us about your travel needs", type: "textarea", required: true },
];

export default function CorporatePage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/city.jpg" eyebrow="Avora Corporate" title="Business travel, handled" script="Local Getaways. International Dreams." />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-24 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.08} className="text-center">
            <b.icon className="mx-auto mb-4 h-9 w-9 text-gold" strokeWidth={1.2} />
            <h3 className="font-display text-2xl">{b.title}</h3>
            <p className="mt-2 text-sm opacity-75">{b.text}</p>
          </Reveal>
        ))}
      </section>
      <section className="bg-forest py-24 text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal><h2 className="mb-10 text-center font-display text-4xl md:text-5xl">Request a corporate quote</h2></Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-cream p-8 text-forest">
              <LeadForm kind="corporate" fields={fields} button="Request a quote"
                successTitle="Thank you" successText="We have received your request and will contact you with a quote shortly." />
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
