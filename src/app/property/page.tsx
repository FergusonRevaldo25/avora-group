import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import LeadForm, { type LeadField } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Property, Coming Soon | Avora Group",
  description: "Investment and holiday properties are coming soon. Join the waitlist to hear first.",
};

const fields: LeadField[] = [
  { name: "name", label: "Your name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel" },
  { name: "interest", label: "I am interested in", type: "select", required: true,
    options: ["Investment property", "Holiday property", "Both"] },
];

export default function PropertyPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/tropical.jpg" eyebrow="Avora Property" title="Property, coming soon" script="Investment and holiday properties for your future" />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <Reveal><p className="mb-10 text-center text-lg opacity-80">
          We are preparing our property offering. Join the waitlist and we will let you know as soon as it is ready.
        </p></Reveal>
        <Reveal delay={0.1}>
          <LeadForm kind="waitlist" fields={fields} button="Join the waitlist"
            successTitle="You are on the list" successText="Thank you. We will be in touch when our property offering launches." />
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
