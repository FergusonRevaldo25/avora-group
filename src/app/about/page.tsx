import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, ShieldCheck, Star, UserRound, Heart } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { founder } from "@/lib/company";

export const metadata: Metadata = {
  title: "About | Avora Group",
  description: "Avora Group is a multi-sector business with a passion for travel, tourism and exceptional experiences.",
};

const values = [
  { icon: Globe, title: "Trusted partner", text: "Honest advice and clear communication from first enquiry to return flight." },
  { icon: ShieldCheck, title: "Safe and secure", text: "Careful handling of your bookings and your personal information." },
  { icon: Star, title: "Affordable rates", text: "Good value options matched to your budget." },
  { icon: UserRound, title: "Personalised service", text: "Trips shaped around you, not a template." },
  { icon: Heart, title: "Unforgettable experiences", text: "The details that turn a holiday into a memory." },
];

export default function AboutPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/hero.jpg" eyebrow="About Avora Group" title="Travel, stay, explore and more" script="Your Journey, Our Priority" />

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal><p className="font-display text-3xl leading-snug md:text-4xl">
          Avora Group is a multi-sector business with a passion for travel, tourism and exceptional experiences.
        </p></Reveal>
        <Reveal delay={0.15}><p className="mt-8 text-lg leading-relaxed opacity-80">
          We specialise in helping you explore the world. Whether it&apos;s a quick local getaway or an international adventure, we make it happen. From flights and accommodation to tours and travel packages, we look after the details so you can enjoy the journey.
        </p></Reveal>
      </section>

      {founder.name && founder.bio && (
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 md:grid-cols-2">
          {founder.photo ? (
            <Reveal><div className="relative h-96 overflow-hidden rounded-[2rem]">
              <Image src={founder.photo} alt={founder.name} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div></Reveal>
          ) : null}
          <div>
            <Reveal><p className="mb-3 text-xs tracking-[0.4em] uppercase text-gold">{founder.role}</p></Reveal>
            <Reveal delay={0.1}><h2 className="font-display text-4xl">{founder.name}</h2></Reveal>
            <Reveal delay={0.2}><p className="mt-5 leading-relaxed opacity-80">{founder.bio}</p></Reveal>
          </div>
        </section>
      )}

      <section className="bg-forest py-24 text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="text-center">
              <v.icon className="mx-auto mb-4 h-9 w-9 text-gold" strokeWidth={1.2} />
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm opacity-75">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal><h2 className="font-display text-4xl">Ready to start planning?</h2></Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/travel" className="rounded-full bg-forest px-8 py-4 text-xs tracking-[0.25em] uppercase text-cream transition hover:bg-forest-deep">Book travel</Link>
            <Link href="/partners" className="rounded-full border border-forest px-8 py-4 text-xs tracking-[0.25em] uppercase transition hover:bg-forest hover:text-cream">Partner with us</Link>
          </div>
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
