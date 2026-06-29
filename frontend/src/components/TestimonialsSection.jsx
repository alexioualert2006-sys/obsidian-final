import React, { useEffect, useRef, useState } from "react";

const VOICES = [
  {
    id: "01",
    quote:
      "OBSIDIAN didn't just redesign our site — they redesigned how the market sees us. Inbound tripled in six weeks.",
    attribution: "Strategy Director, Financial Services",
  },
  {
    id: "02",
    quote:
      "Every competitor looks amateur next to what they built for us. That alone was worth ten times the fee.",
    attribution: "Founder, Luxury Brand",
  },
  {
    id: "03",
    quote:
      "It's the only website I've ever been proud to send to a billionaire. Worth every euro.",
    attribution: "Managing Partner, Law Firm",
  },
];

function VoiceCard({ voice, idx }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      data-testid={`voice-${voice.id}`}
      className={`group relative flex flex-col h-full pt-10 md:pt-12 pr-6 transition-all duration-[1200ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${idx * 120}ms` }}
    >
      {/* Top hairline + violet tick */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.10]" aria-hidden="true" />
      <span
        className="absolute -top-px left-0 h-px w-10 bg-[#8B5CF6] transition-all duration-700 group-hover:w-24"
        aria-hidden="true"
        style={{ boxShadow: "0 0 12px rgba(139,92,246,0.55)" }}
      />

      <span
        className="text-[#8B5CF6]/70 leading-none mb-6"
        aria-hidden="true"
        style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300, fontSize: "2.4rem" }}
      >
        “
      </span>

      <blockquote
        data-testid={`voice-quote-${voice.id}`}
        className="text-white/85 leading-relaxed"
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 200,
          letterSpacing: "0.005em",
          fontSize: "clamp(1.15rem, 1.7vw, 1.45rem)",
        }}
      >
        {voice.quote}
      </blockquote>

      <div className="flex-1" />

      <p
        data-testid={`voice-attribution-${voice.id}`}
        className="mt-10 text-[10px] tracking-[0.4em] uppercase text-white/45"
      >
        <span className="inline-block w-6 h-px bg-white/30 align-middle mr-3" />
        {voice.attribution}
      </p>
    </article>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="voices"
      data-testid="voices-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="voices-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §06
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="voices-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Client Voices
          </p>
          <h2
            data-testid="voices-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            What it&rsquo;s like
            <br />
            on the other side.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Names are withheld under NDA. The outcomes are not.
          </p>
        </div>
      </div>

      {/* Voices grid */}
      <div className="px-8 md:px-16 pb-32 md:pb-48 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
        {VOICES.map((v, i) => (
          <VoiceCard key={v.id} voice={v} idx={i} />
        ))}
      </div>
    </section>
  );
}
