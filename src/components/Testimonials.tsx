import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/testimonials";

export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-forest py-24 text-cream">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="mb-14 text-center text-sm tracking-[0.5em] uppercase text-gold">Kind words</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name + i} delay={i * 0.1} className="h-full">
              <figure className="h-full rounded-2xl border border-gold/30 bg-forest-deep/60 p-8">
                <blockquote className="font-display text-2xl leading-snug">{t.quote}</blockquote>
                <figcaption className="mt-5 text-sm opacity-75">{t.name}{t.trip ? `, ${t.trip}` : ""}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
