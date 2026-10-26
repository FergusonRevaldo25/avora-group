import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PageHero({ img, eyebrow, title, script }: { img: string; eyebrow: string; title: string; script: string }) {
  return (
    <section className="relative flex min-h-[65vh] items-end overflow-hidden">
      <Image src={img} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/45 to-forest-deep/25" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 text-cream">
        <Reveal><p className="mb-4 text-xs tracking-[0.4em] uppercase text-gold">{eyebrow}</p></Reveal>
        <Reveal delay={0.1}><h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-7xl">{title}</h1></Reveal>
        <Reveal delay={0.2}><p className="mt-5 font-script text-4xl text-gold md:text-5xl">{script}</p></Reveal>
      </div>
    </section>
  );
}
