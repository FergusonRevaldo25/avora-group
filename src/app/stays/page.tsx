import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import StaysExplorer from "@/components/StaysExplorer";

export const metadata: Metadata = {
  title: "Stays | Avora Group",
  description: "Beautiful places to stay. Choose your dates, see an estimate and request to book.",
};

const steps = [
  { n: "01", title: "Choose your dates", text: "Pick a stay, your dates and number of guests to see an estimated total." },
  { n: "02", title: "Request to book", text: "Send your details and we check availability for you." },
  { n: "03", title: "Pay after confirmation", text: "Once confirmed, we send your invoice and you pay by EFT. Nothing is charged online." },
];

export default function StaysPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/hotel.jpg" eyebrow="Avora Stays" title="Stay somewhere unforgettable" script="Local Getaways. International Dreams." />
      <StaysExplorer />
      <section className="bg-forest py-24 text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <p className="font-display text-5xl text-gold">{s.n}</p>
              <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 opacity-75">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
