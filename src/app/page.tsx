"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane, BedDouble, Briefcase, MapPin, Home as HomeIcon, ShieldCheck, Star, Heart, UserRound, Phone, Mail, Globe } from "lucide-react";
import Reveal from "@/components/Reveal";
import FooterLinks from "@/components/FooterLinks";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const services = [
  { icon: Plane, title: "Flight Bookings", text: "Domestic & international flights at the best rates, tailored to your schedule and budget." },
  { icon: BedDouble, title: "Accommodation", text: "From luxury resorts to boutique stays, we'll find the perfect place for you." },
  { icon: Briefcase, title: "Tours & Travel Packages", text: "Curated experiences for individuals, couples, families and groups." },
  { icon: MapPin, title: "Local & International", text: "Explore your local gems or discover new countries. We've got you covered." },
  { icon: HomeIcon, title: "Property", text: "Investment and holiday properties for your future." },
];

const destinations = [
  { img: "/images/tropical.jpg", title: "Island Escapes", sub: "Maldives ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Mauritius ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Zanzibar", cls: "md:row-span-2" },
  { img: "/images/city.jpg", title: "City Breaks", sub: "Dubai & beyond", cls: "md:col-span-2" },
  { img: "/images/hotel.jpg", title: "Stay in Style", sub: "Resorts & boutique stays", cls: "" },
  { img: "/images/flight.jpg", title: "Fly Anywhere", sub: "Domestic & international", cls: "" },
];

const promises = [
  { icon: Globe, label: "Trusted Partner" },
  { icon: ShieldCheck, label: "Safe & Secure Bookings" },
  { icon: Star, label: "Affordable Rates" },
  { icon: UserRound, label: "Personalised Service" },
  { icon: Heart, label: "Unforgettable Experiences" },
];

function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: 1.18 }} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main>
      {/* NAV */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-forest/10 bg-cream/95 px-5 py-3 text-forest shadow-sm backdrop-blur-md md:px-8 xl:px-12">
        <a href="#top"><Image src="/images/logo.png" alt="Avora Group" width={120} height={90} className="h-14 w-auto" priority /></a>
        <div className="hidden items-center gap-3 whitespace-nowrap text-sm font-medium tracking-[0.08em] uppercase text-forest xl:flex xl:gap-4 2xl:gap-6">
          <Link href="/travel" className="transition hover:text-gold">Travel</Link>
          <Link href="/trips" className="transition hover:text-gold">Trips</Link>
          <Link href="/destinations" className="transition hover:text-gold">Destinations</Link>
          <Link href="/stays" className="transition hover:text-gold">Stays</Link>
          <Link href="/about" className="transition hover:text-gold">About</Link>
          <Link href="/specials" className="transition hover:text-gold">Specials</Link>
          <Link href="/upcoming" className="transition hover:text-gold">Upcoming</Link>
          <Link href="/calendar" className="transition hover:text-gold">Calendar</Link>
          <Link href="/how-to-book" className="transition hover:text-gold">How to Book</Link>
          <Link href="/gallery" className="transition hover:text-gold">Gallery</Link>
          <a href="#services" className="transition hover:text-gold">Services</a>
          <a href="#why" className="transition hover:text-gold">Why Avora</a>
          <a href="#contact" className="transition hover:text-gold">Contact</a>
        </div>
        <details className="relative xl:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-forest/30 px-4 py-2 text-sm font-medium tracking-[0.08em] uppercase text-forest [&::-webkit-details-marker]:hidden">Menu</summary>
          <div className="absolute right-0 top-full z-50 mt-2 grid max-h-[75vh] min-w-56 gap-4 overflow-y-auto rounded-xl border border-forest/10 bg-cream p-5 text-sm font-medium tracking-[0.08em] uppercase text-forest shadow-xl">
            <Link href="/travel">Travel</Link>
            <Link href="/trips">Trips</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/stays">Stays</Link>
            <Link href="/about">About</Link>
            <Link href="/specials">Specials</Link>
            <Link href="/upcoming">Upcoming</Link>
            <Link href="/calendar">Calendar</Link>
            <Link href="/how-to-book">How to Book</Link>
            <Link href="/gallery">Gallery</Link>
            <a href="#services">Services</a>
            <a href="#why">Why Avora</a>
            <a href="#contact">Contact</a>
          </div>
        </details>
      </motion.nav>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -z-10">
          <Image src="/images/hero.jpg" alt="Traveller overlooking the sea at sunset" fill priority sizes="100vw" className="object-cover object-[70%_center] md:object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
        </motion.div>

        <motion.div style={{ y: textY, opacity: fade }} className="max-w-3xl px-6 pt-20 md:px-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
            className="mb-5 text-xs tracking-[0.4em] uppercase">Travel &nbsp;|&nbsp; Stay &nbsp;|&nbsp; Explore &nbsp;|&nbsp; More</motion.p>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-8xl">
            <span className="block overflow-hidden"><motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>More Destinations.</motion.span></span>
            <span className="block overflow-hidden"><motion.span className="block italic" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>More Possibilities.</motion.span></span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }}
            className="mt-6 font-script text-4xl text-[#8a6a1f] md:text-5xl">Your Journey, Our Priority</motion.p>
          <motion.a href="#contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            className="mt-10 inline-block rounded-full bg-forest px-9 py-4 text-xs font-medium tracking-[0.25em] uppercase text-cream shadow-xl">
            Plan Your Next Trip
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="h-10 w-px bg-forest/60" />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-28 md:grid-cols-2">
        <Reveal>
          <div className="relative">
            <ParallaxImage src="/images/about.jpg" alt="Traveller watching a plane take off" className="h-[520px] rounded-[2rem]" />
            <div className="absolute -bottom-10 -right-4 hidden h-52 w-52 overflow-hidden rounded-2xl border-4 border-cream shadow-2xl md:block">
              <Image src="/images/passport.jpg" alt="Passport, map and sunglasses" fill sizes="208px" className="object-cover" />
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal><p className="mb-4 text-xs tracking-[0.4em] uppercase text-gold">About Avora Group</p></Reveal>
          <Reveal delay={0.1}><h2 className="font-display text-4xl leading-tight md:text-5xl">A multi-sector business with a passion for travel.</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 text-lg leading-relaxed opacity-80">
            We specialise in helping you explore the world. Whether it&apos;s a quick local getaway or an international adventure, we make it happen.
          </p></Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-forest py-28 text-cream">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal><h2 className="mb-16 text-center text-sm tracking-[0.5em] uppercase text-gold">Our Services</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  className="h-full rounded-2xl border border-gold/30 bg-forest-deep/60 p-8">
                  <s.icon className="mb-5 h-9 w-9 text-gold" strokeWidth={1.3} />
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-3 opacity-75">{s.text}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="mx-auto max-w-6xl px-6 py-28">
        <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Inspiration</p></Reveal>
        <Reveal delay={0.1}><h2 className="mb-14 text-center font-display text-4xl md:text-6xl">Where to next?</h2></Reveal>
        <div className="grid gap-5 md:grid-cols-3 md:auto-rows-[280px]">
          {destinations.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.1} className={`h-72 md:h-auto ${d.cls}`}>
              <div className="group relative h-full w-full overflow-hidden rounded-2xl">
                <Image src={d.img} alt={d.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6 text-cream">
                  <h3 className="font-display text-3xl">{d.title}</h3>
                  <p className="mt-1 text-sm tracking-wider opacity-80">{d.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WAYS TO BOOK */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-28 md:grid-cols-2">
        <Reveal>
          <Link href="/travel" className="group relative block h-80 overflow-hidden rounded-2xl">
            <Image src="/images/flight.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />
            <div className="absolute bottom-0 p-8 text-cream">
              <h3 className="font-display text-4xl">Book your travel</h3>
              <p className="mt-2 opacity-80">Flights, tours and holiday packages</p>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/stays" className="group relative block h-80 overflow-hidden rounded-2xl">
            <Image src="/images/hotel.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />
            <div className="absolute bottom-0 p-8 text-cream">
              <h3 className="font-display text-4xl">Find a place to stay</h3>
              <p className="mt-2 opacity-80">Choose your dates and request to book</p>
            </div>
          </Link>
        </Reveal>
      </section>

      <Testimonials />

      {/* WHY */}
      <section id="why" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {promises.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08} className="text-center">
              <p.icon className="mx-auto mb-4 h-9 w-9 text-gold" strokeWidth={1.2} />
              <p className="text-xs tracking-[0.25em] uppercase">{p.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="mx-auto max-w-2xl px-6 pb-28">
        <Reveal><p className="mb-3 text-center text-xs tracking-[0.4em] uppercase text-gold">Enquire</p></Reveal>
        <Reveal delay={0.1}><h2 className="mb-10 text-center font-display text-4xl md:text-5xl">Tell us about your trip</h2></Reveal>
        <Reveal delay={0.2}><ContactForm /></Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden py-32 text-cream">
        <Image src="/images/city.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-forest-deep/85" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal><p className="font-script text-6xl text-gold md:text-7xl">Let&apos;s Plan Your Next Trip</p></Reveal>
          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col items-center gap-4 text-lg">
              <a href="tel:+27786942426" className="flex items-center gap-3 transition hover:text-gold"><Phone size={18} /> 078 694 2426</a>
              <a href="mailto:hello@avoratravel.co.za" className="flex items-center gap-3 transition hover:text-gold"><Mail size={18} /> hello@avoratravel.co.za</a>
              <span className="flex items-center gap-3"><MapPin size={18} /> Cape Town, South Africa</span>
            </div>
          </Reveal>
          <p className="mt-16 text-xs tracking-[0.4em] uppercase opacity-60">Local Getaways. International Dreams.</p>
        </div>
      </section>
      <FooterLinks />
    </main>
  );
}




