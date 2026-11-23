import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import LeadForm, { type LeadField } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Partner With Us | Avora Group",
  description: "Hotels, airlines, tour operators, agents and investors: let us work together.",
};

const fields: LeadField[] = [
  { name: "company", label: "Company", required: true },
  { name: "contactName", label: "Contact person", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "partnerType", label: "You are a", type: "select", required: true, wide: true,
    options: ["Hotel or resort", "Airline", "Tour operator", "Travel agent", "Investor", "Other"] },
  { name: "message", label: "How would you like to work together?", type: "textarea", required: true },
];

export default function PartnersPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/passport.jpg" eyebrow="Partnerships" title="Let us build something together" script="More Destinations. More Possibilities." />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <Reveal><p className="mb-10 text-center text-lg opacity-80">
          We are always looking to work with hotels, airlines, tour operators, agents and investors who share our passion for exceptional travel. Tell us a little about you and we will be in touch.
        </p></Reveal>
        <Reveal delay={0.1}>
          <LeadForm kind="partner" fields={fields} button="Send enquiry"
            successTitle="Thank you" successText="We have received your message and will get back to you soon." />
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
