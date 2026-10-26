import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TravelForm from "@/components/TravelForm";
import { packages } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Book Your Travel | Avora Group",
  description: "Flights, holiday packages and tours. Send a request and we will confirm and quote.",
};

const steps = [
  { n: "01", title: "Send your request", text: "Tell us where, when and who is travelling." },
  { n: "02", title: "We confirm and quote", text: "We check availability and send you the best options." },
  { n: "03", title: "Pay after confirmation", text: "Pay by EFT once you approve the quote. No payment is taken on this website." },
];

export default function TravelPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/flight.jpg" eyebrow="Avora Travel" title="Book your next adventure" script="Your Journey, Our Priority" />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Popular packages</p></Reveal>
        <Reveal delay={0.1}><h2 className="mb-14 text-center font-display text-4xl md:text-6xl">Where to next?</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.1} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white/60">
                <div className="relative h-56 overflow-hidden">
                  <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm opacity-75">{p.blurb}</p>
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <p><span className="text-xs uppercase tracking-widest opacity-60">From</span> <span className="font-display text-3xl">{p.from}</span><br /><span className="text-xs opacity-70">{p.unit}</span></p>
                    <a href="#request" className="rounded-full border border-forest px-5 py-2 text-xs tracking-[0.2em] uppercase transition hover:bg-forest hover:text-cream">Enquire</a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs opacity-60">Prices are indicative starting prices and are confirmed in your quote.</p>
      </section>

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

      <section id="request" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24">
        <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Request a quote</p></Reveal>
        <Reveal delay={0.1}><h2 className="mb-10 text-center font-display text-4xl md:text-5xl">Tell us about your trip</h2></Reveal>
        <Reveal delay={0.2}><TravelForm /></Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
