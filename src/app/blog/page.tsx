import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Travel Blog | Avora Group",
  description: "Travel tips, destination guides and inspiration from Avora Group.",
};

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function BlogPage() {
  return (
    <main>
      <SiteNav />
      <PageHero img="/images/flight.jpg" eyebrow="The Avora Blog" title="Travel tips and inspiration" script="More Destinations. More Possibilities." />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-24 md:grid-cols-2">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1} className="h-full">
            <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white/60">
              <div className="relative h-64 overflow-hidden">
                <Image src={p.img} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
              </div>
              <div className="p-6">
                <p className="text-xs tracking-[0.2em] uppercase text-gold">{fmtDate(p.date)}</p>
                <h2 className="mt-2 font-display text-3xl">{p.title}</h2>
                <p className="mt-2 opacity-75">{p.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <section className="bg-forest py-24 text-cream">
        <div className="mx-auto max-w-xl px-6">
          <Reveal><h2 className="mb-3 text-center font-display text-4xl">Get travel news and deals</h2></Reveal>
          <Reveal delay={0.1}><p className="mb-8 text-center opacity-75">No spam. Unsubscribe whenever you like.</p></Reveal>
          <Reveal delay={0.2}>
            <div className="rounded-2xl bg-cream p-8 text-forest">
              <LeadForm kind="newsletter" button="Subscribe"
                fields={[{ name: "email", label: "Email", type: "email", required: true, wide: true }]}
                successTitle="You are subscribed" successText="Thank you. We will be in touch with travel news and offers." />
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
