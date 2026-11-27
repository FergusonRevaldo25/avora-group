"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

const promoSlides = [
  {
    eyebrow: "AVORA ESCAPE SALE",
    title: "Up to 50% off selected journeys",
    description: "Ask Avora about current offers, dates and terms.",
    button: "Explore the sale",
    href: "/specials",
    image: "/images/avora-hero.jpg",
  },
  {
    eyebrow: "MOROCCO IN FOCUS",
    title: "A stay with stories to tell",
    description: "Explore a different side of travel with Avora.",
    button: "Explore destinations",
    href: "/destinations",
    image: "/images/morocco-riad.jpg",
  },
  {
    eyebrow: "NAMIBIA, UNDER THE STARS",
    title: "Make room for a little wonder",
    description: "Ask Avora about journeys and stays that fit your plans.",
    button: "Explore destinations",
    href: "/destinations",
    image: "/images/namibia-lodge.jpg",
  },
  {
    eyebrow: "KYOTO MOMENTS",
    title: "Let the journey take you somewhere new",
    description: "Discover travel inspiration and ask Avora what is available.",
    button: "Explore trips",
    href: "/trips",
    image: "/images/kyoto-street.jpg",
  },
];
const campaigns = [
  {
    title: "Namibia",
    description: "Wide desert landscapes and distinctive lodge stays.",
    image: "/images/namibia-lodge.jpg",
  },
  {
    title: "Kyoto",
    description: "Historic streets, architecture and Japanese culture.",
    image: "/images/kyoto-street.jpg",
  },
  {
    title: "Swiss Alps",
    description: "Mountain scenery and memorable rail journeys.",
    image: "/images/swiss-alps-train.jpeg",
  },
  {
    title: "Victoria Falls",
    description: "A dramatic natural landmark and surrounding wilderness.",
    image: "/images/victoria-falls.jpg",
  },
  {
    title: "Lodge Stays",
    description: "Find a stay that makes time away feel special.",
    image: "/images/luxury-lodge-room.jpg",
  },
  {
    title: "Travel Support",
    description: "Ask Avora about the services available for your journey.",
    image: "/images/airport-concierge.jpg",
  },
];

function askAbout(destination: string) {
  const message = `Hi Avora, please tell me about current travel options for ${destination}.`;
  return `https://wa.me/27786942426?text=${encodeURIComponent(message)}`;
}

export default function AvoraCampaigns() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [signupStatus, setSignupStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);
  const [promoHovered, setPromoHovered] = useState(false);

  function movePromo(direction: number) {
    setPromoIndex((current) => (current + direction + promoSlides.length) % promoSlides.length);
  }

  useEffect(() => {
    if (promoPaused || promoHovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promoSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [promoPaused, promoHovered]);

  useEffect(() => {
    if (isPaused || campaigns.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % campaigns.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  function moveSlide(direction: number) {
    setActiveSlide((current) => (current + direction + campaigns.length) % campaigns.length);
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupStatus("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const consent = form.get("consent") === "on";

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          consent,
          source: "homepage-travel-updates",
        }),
      });

      if (!response.ok) {
        throw new Error("Signup could not be submitted.");
      }

      event.currentTarget.reset();
      setSignupStatus("Thank you. Your request has been received.");
    } catch {
      setSignupStatus("We could not submit that just now. Please contact Avora on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-label="Avora travel offers and updates" className="mx-auto w-full max-w-7xl space-y-8 px-5 py-12 md:py-16">
      <section
        aria-label="Avora promotional offers"
        className="relative isolate h-[270px] overflow-hidden rounded-3xl bg-[#123b32] text-white shadow-md sm:h-[230px]"
        onMouseEnter={() => setPromoHovered(true)}
        onMouseLeave={() => setPromoHovered(false)}
        onFocusCapture={() => setPromoHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPromoHovered(false);
          }
        }}
      >
        {promoSlides.map((slide, index) => {
          let offset = (index - promoIndex + promoSlides.length) % promoSlides.length;
          if (offset > promoSlides.length / 2) offset -= promoSlides.length;

          return (
            <article
              key={slide.title}
              aria-hidden={offset !== 0}
              className="absolute inset-0 transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(10, 40, 33, .91), rgba(10, 40, 33, .55) 52%, rgba(10, 40, 33, .12)), url('${slide.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translateX(${offset * 100}%)`,
                opacity: offset === 0 ? 1 : 0.7,
              }}
            >
              <div className="relative z-10 flex h-full items-center px-6 pb-14 pt-6 sm:px-10 sm:pb-12 md:px-12">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e7c982]">{slide.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">{slide.title}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-5 text-white/90 sm:text-base">{slide.description}</p>
                  <Link
                    href={slide.href}
                    tabIndex={offset === 0 ? 0 : -1}
                    className="mt-4 inline-flex rounded-full bg-[#e7c982] px-5 py-2.5 text-sm font-semibold text-[#153d34] transition hover:bg-white"
                  >
                    {slide.button}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2 sm:bottom-4 sm:right-6">
          <button type="button" aria-label="Previous promotion" onClick={() => movePromo(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-black/25 text-white hover:bg-black/50">&lt;</button>
          <div className="flex items-center gap-1.5">
            {promoSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show promotion ${index + 1}`}
                aria-current={promoIndex === index ? "true" : undefined}
                onClick={() => setPromoIndex(index)}
                className={`h-2 rounded-full transition-all ${promoIndex === index ? "w-6 bg-[#e7c982]" : "w-2 bg-white/70"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={promoPaused ? "Resume promotions" : "Pause promotions"}
            aria-pressed={promoPaused}
            onClick={() => setPromoPaused(!promoPaused)}
            className="rounded-full border border-white/50 bg-black/25 px-3 py-2 text-xs text-white hover:bg-black/50"
          >
            {promoPaused ? "Play" : "Pause"}
          </button>
          <button type="button" aria-label="Next promotion" onClick={() => movePromo(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-black/25 text-white hover:bg-black/50">&gt;</button>
        </div>
      </section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Find your kind of escape</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#123b32] md:text-3xl">Explore destinations</h2>
          <p className="mt-2 text-sm text-[#52645e]">A few places to start planning your next journey.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Previous destination" onClick={() => moveSlide(-1)} className="rounded-full border border-[#d8d0c0] px-4 py-2 text-[#123b32] hover:bg-[#f5f0e6]">&lt;</button>
          <button type="button" aria-label="Next destination" onClick={() => moveSlide(1)} className="rounded-full border border-[#d8d0c0] px-4 py-2 text-[#123b32] hover:bg-[#f5f0e6]">&gt;</button>
          <button type="button" aria-pressed={isPaused} onClick={() => setIsPaused(!isPaused)} className="rounded-full border border-[#d8d0c0] px-4 py-2 text-sm text-[#123b32] hover:bg-[#f5f0e6]">
            {isPaused ? "Play" : "Pause"}
          </button>
        </div>
      </div>

      <div
        className="relative mx-auto mt-8 h-[340px] w-full max-w-5xl overflow-hidden [perspective:1400px] sm:h-[400px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsPaused(false);
          }
        }}
      >
        {campaigns.map((campaign, index) => {
          let offset = (index - activeSlide + campaigns.length) % campaigns.length;
          if (offset > campaigns.length / 2) offset -= campaigns.length;
          const distance = Math.abs(offset);

          return (
            <a
              key={campaign.title}
              href={askAbout(campaign.title)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ask Avora about ${campaign.title}`}
              aria-hidden={distance > 1 ? true : undefined}
              tabIndex={distance > 1 ? -1 : 0}
              className="absolute left-1/2 top-0 h-full w-[86%] max-w-[500px] overflow-hidden rounded-3xl bg-cover bg-center text-white shadow-2xl transition-all duration-700 ease-in-out motion-reduce:transition-none"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(10, 40, 33, .02), rgba(10, 40, 33, .84)), url('${campaign.image}')`,
                transform: `translateX(calc(-50% + ${offset * 92}%)) translateZ(${-distance * 90}px) rotateY(${-offset * 16}deg) scale(${1 - distance * 0.12})`,
                opacity: distance > 1 ? 0 : 1,
                zIndex: campaigns.length - distance,
                pointerEvents: distance > 1 ? "none" : "auto",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e7c982]">Avora destination</p>
                <h3 className="mt-2 text-3xl font-semibold sm:text-4xl">{campaign.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/90">{campaign.description}</p>
                <span className="mt-5 inline-flex rounded-full bg-[#e7c982] px-5 py-2.5 text-sm font-semibold text-[#153d34]">Ask Avora</span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="flex justify-center gap-2" aria-label="Choose a destination slide">
        {campaigns.map((campaign, index) => (
          <button
            key={campaign.title}
            type="button"
            aria-label={`Show ${campaign.title}`}
            aria-current={activeSlide === index ? "true" : undefined}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-[#123b32]" : "w-2.5 bg-[#c9c1b2]"}`}
          />
        ))}
      </div>
      <section id="avora-planning-visuals" aria-label="Plan your journey" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <a
          href="https://wa.me/27786942426?text=Hi%20Avora%2C%20I%20would%20like%20help%20planning%20a%20trip."
          target="_blank"
          rel="noreferrer"
          className="relative flex min-h-64 items-end overflow-hidden rounded-2xl bg-cover bg-center p-5 text-white"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(10,40,33,.04), rgba(10,40,33,.82)), url('/images/travel-consultation.jpeg')" }}
        >
          <div>
            <h3 className="text-xl font-semibold">Plan with Avora</h3>
            <p className="mt-1 text-sm text-white/90">Ask us about destinations, dates and trip details.</p>
          </div>
        </a>

        <Link
          href="/how-to-book"
          className="relative flex min-h-64 items-end overflow-hidden rounded-2xl bg-cover bg-center p-5 text-white"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(10,40,33,.04), rgba(10,40,33,.82)), url('/images/airport-departures.jpg')" }}
        >
          <div>
            <h3 className="text-xl font-semibold">Start your journey</h3>
            <p className="mt-1 text-sm text-white/90">See how to prepare and what to expect.</p>
          </div>
        </Link>

        <Link
          href="/trips"
          className="relative flex min-h-64 items-end overflow-hidden rounded-2xl bg-cover bg-center p-5 text-white"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(10,40,33,.04), rgba(10,40,33,.82)), url('/images/coach-interior.jpg')" }}
        >
          <div>
            <h3 className="text-xl font-semibold">Travel together</h3>
            <p className="mt-1 text-sm text-white/90">Transport arrangements are confirmed for each trip.</p>
          </div>
        </Link>

        <Link
          href="/how-to-book"
          className="relative flex min-h-64 items-end overflow-hidden rounded-2xl bg-cover bg-center p-5 text-white"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(10,40,33,.04), rgba(10,40,33,.82)), url('/images/travel-essentials.jpeg')" }}
        >
          <div>
            <h3 className="text-xl font-semibold">Get ready to go</h3>
            <p className="mt-1 text-sm text-white/90">Find practical information before you travel.</p>
          </div>
        </Link>
      </section>
      <div className="grid overflow-hidden rounded-3xl border border-[#e7e0d4] bg-[#f7f3ea] md:grid-cols-[.9fr_1.1fr]">
        <div className="flex flex-col justify-center p-6 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a27b37]">Travel notes from Avora</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#123b32] md:text-3xl">Get occasional trip updates</h2>
          <p className="mt-3 text-sm leading-6 text-[#52645e]">
            Sign up for travel inspiration and updates about Avora journeys. You can unsubscribe at any time.
          </p>
          <a href="/privacy" className="mt-3 text-sm text-[#52645e] underline">Read our privacy notice</a>
        </div>

        <form onSubmit={submitSignup} className="grid gap-4 bg-white p-6 md:grid-cols-2 md:p-9">
          <label className="text-sm font-medium text-[#173c34]">
            First name
            <input name="name" autoComplete="given-name" required maxLength={100} className="mt-2 w-full rounded-lg border border-[#d8d0c0] p-3" />
          </label>
          <label className="text-sm font-medium text-[#173c34]">
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 w-full rounded-lg border border-[#d8d0c0] p-3" />
          </label>
          <label className="flex items-start gap-3 text-sm text-[#52645e] md:col-span-2">
            <input name="consent" type="checkbox" required className="mt-1 accent-[#123b32]" />
            <span>I agree to receive occasional travel updates from Avora Group.</span>
          </label>
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#123b32] px-6 py-3 font-semibold text-white hover:bg-[#1d5145] disabled:opacity-60 md:col-span-2 md:justify-self-start">
            {isSubmitting ? "Signing up..." : "Sign me up"}
          </button>
          <p role="status" aria-live="polite" className="text-sm text-[#40534d] md:col-span-2">{signupStatus}</p>
        </form>
      </div>
    </section>
  );
}