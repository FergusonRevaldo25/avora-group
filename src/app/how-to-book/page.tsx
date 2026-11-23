import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "How to Book | Avora Group",
  description: "Learn how to request and confirm a trip with Avora Group.",
};

const steps = [
  ["01", "Choose a trip or share an idea", "Browse the sample trips or tell us the destination, dates and travel style you have in mind."],
  ["02", "Send an enquiry", "Use the trip enquiry link or contact Avora directly. We will check the details and availability."],
  ["03", "Review your quote", "Avora will confirm the itinerary, inclusions, terms and price before you decide."],
  ["04", "Confirm and prepare", "Once you accept the confirmed quote, Avora will send the next steps and travel information."],
];

export default function HowToBookPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/passport.jpg" eyebrow="Your trip, clearly explained" title="How booking with Avora works" script="A thoughtful journey starts with a conversation." />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map(([number, title, text]) => (
            <article key={number} className="rounded-2xl border border-forest/10 bg-white/60 p-7">
              <p className="font-display text-5xl text-gold">{number}</p>
              <h2 className="mt-4 font-display text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed opacity-75">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-14">
          <h2 className="font-display text-3xl">A few useful notes</h2>
          <div className="mt-5 space-y-3">
            <details className="rounded-xl border border-forest/10 bg-white/60 p-5">
              <summary className="cursor-pointer font-medium">Do I pay on this website?</summary>
              <p className="mt-3 text-sm leading-relaxed opacity-75">No. This site collects trip enquiries only. Avora confirms the quote and payment instructions with you separately.</p>
            </details>
            <details className="rounded-xl border border-forest/10 bg-white/60 p-5">
              <summary className="cursor-pointer font-medium">Are the sample prices and dates confirmed?</summary>
              <p className="mt-3 text-sm leading-relaxed opacity-75">No. Sample listings are placeholders for the site design. Confirmed offers, availability and terms must be supplied by Avora.</p>
            </details>
            <details className="rounded-xl border border-forest/10 bg-white/60 p-5">
              <summary className="cursor-pointer font-medium">Can I ask for a custom itinerary?</summary>
              <p className="mt-3 text-sm leading-relaxed opacity-75">Yes. Send your preferred dates, destination, traveller count and budget through the travel request form.</p>
            </details>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/travel#request" className="inline-flex rounded-full bg-forest px-8 py-4 text-xs tracking-[0.2em] uppercase text-cream hover:bg-forest-deep">
            Request a travel quote
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}