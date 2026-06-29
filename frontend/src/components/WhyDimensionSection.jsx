import React, { useEffect, useRef, useState } from "react";

const POINTS = [
  {
    id: "01",
    label: "Memorability",
    headline: "Stand out instantly.",
    sentence:
      "In a sea of flat templates, a 3D site is remembered before a word is read.",
  },
  {
    id: "02",
    label: "Attention",
    headline: "Hold attention longer.",
    sentence:
      "Interactive depth keeps visitors exploring instead of bouncing.",
  },
  {
    id: "03",
    label: "Perception",
    headline: "Signal premium.",
    sentence:
      "The businesses that look the most expensive are the ones that win the room.",
  },
];

function PointCard({ point, idx }) {
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
      data-testid={`why-point-${point.id}`}
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

      {/* Index + tiny label */}
      <div className="flex items-baseline gap-4 mb-10 md:mb-14">
        <span
          data-testid={`why-point-index-${point.id}`}
          className="text-white/40 text-[11px] tracking-[0.42em] uppercase"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          {point.id}
        </span>
        <span
          data-testid={`why-point-label-${point.id}`}
          className="text-[10px] tracking-[0.4em] uppercase text-white/40"
        >
          {point.label}
        </span>
      </div>

      <h3
        data-testid={`why-point-headline-${point.id}`}
        className="text-white leading-[1.02]"
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.005em",
          fontSize: "clamp(1.6rem, 2.3vw, 2.1rem)",
        }}
      >
        {point.headline}
      </h3>

      <p
        data-testid={`why-point-sentence-${point.id}`}
        className="mt-6 text-white/65 leading-relaxed max-w-sm"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: "1rem",
        }}
      >
        {point.sentence}
      </p>

      <div className="flex-1" />
    </article>
  );
}

export default function WhyDimensionSection() {
  return (
    <section
      id="why"
      data-testid="why-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="why-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §04
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="why-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Why 3D
          </p>
          <h2
            data-testid="why-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            The case
            <br />
            for dimension.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Flat design has been free for a decade. Distinction now lives in depth,
            motion, and the quiet confidence of a site that costs something to build.
          </p>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="px-8 md:px-16 pb-32 md:pb-48 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
        {POINTS.map((p, i) => (
          <PointCard key={p.id} point={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
