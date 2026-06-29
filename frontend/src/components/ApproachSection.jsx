import React, { Suspense, useEffect, useRef, useState } from "react";
import StepShape from "@/components/StepShape";

const STEPS = [
  {
    id: "01",
    name: "Discover",
    variant: "tetra",
    sentence:
      "We learn your brand, your goals, and what your competitors can't do.",
    note: "Audit · Positioning · References",
  },
  {
    id: "02",
    name: "Design",
    variant: "octa",
    sentence:
      "We design the 3D experience and the brand system around it.",
    note: "Concept · Art Direction · Prototypes",
  },
  {
    id: "03",
    name: "Build",
    variant: "icosa",
    sentence:
      "We engineer it in WebGL to run smoothly in any browser.",
    note: "WebGL · Shaders · Performance",
  },
  {
    id: "04",
    name: "Launch",
    variant: "shard",
    sentence:
      "We ship it, host it, and make sure it performs.",
    note: "Deploy · Monitor · Iterate",
  },
];

function StepRow({ step, isLast }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Defer mounting the heavy R3F canvas until just before it scrolls in
          requestAnimationFrame(() => setCanRender3D(true));
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-testid={`approach-step-${step.id}`}
      className={`relative grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 transition-all duration-[1200ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Vertical timeline rail — left of the row */}
      <div className="hidden md:block absolute left-[calc(8.333%+12px)] top-0 bottom-0 w-px bg-white/[0.08]" aria-hidden="true" />
      {/* Node dot */}
      <div
        className="hidden md:block absolute top-12 w-2.5 h-2.5 rounded-full"
        style={{
          left: "calc(8.333% + 12px)",
          transform: "translateX(-50%)",
          background: "#8B5CF6",
          boxShadow: "0 0 14px rgba(139,92,246,0.55)",
        }}
        aria-hidden="true"
      />

      {/* Index */}
      <div className="col-span-12 md:col-span-1 flex md:block items-baseline gap-4">
        <span
          data-testid={`approach-step-index-${step.id}`}
          className="text-white/40 text-[11px] tracking-[0.42em] uppercase"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          {step.id}
        </span>
      </div>

      {/* 3D shape */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <div
          data-testid={`approach-step-shape-${step.id}`}
          className="relative aspect-square w-[140px] sm:w-[170px] md:w-full md:max-w-[200px]"
        >
          {/* Faint halo behind the shape */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0) 55%)",
              filter: "blur(14px)",
            }}
          />
          {canRender3D && (
            <Suspense fallback={null}>
              <StepShape variant={step.variant} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Copy */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col justify-center">
        <p
          data-testid={`approach-step-note-${step.id}`}
          className="mb-3 text-[10px] tracking-[0.4em] uppercase text-white/40"
        >
          {step.note}
        </p>
        <h3
          data-testid={`approach-step-name-${step.id}`}
          className="text-white leading-[0.95]"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.01em",
            fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
          }}
        >
          {step.name}
        </h3>
        <p
          data-testid={`approach-step-sentence-${step.id}`}
          className="mt-4 max-w-xl text-white/65 leading-relaxed"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "1rem",
          }}
        >
          {step.sentence}
        </p>
      </div>

      {/* Connector horizontal tick between steps (mobile-friendly subtle accent) */}
      {!isLast && (
        <div className="col-span-12 md:hidden flex items-center justify-center pt-2">
          <span className="block w-px h-10 bg-white/10" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export default function ApproachSection() {
  return (
    <section
      id="approach"
      data-testid="approach-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="approach-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §03
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="approach-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Approach
          </p>
          <h2
            data-testid="approach-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            Four steps,
            <br />
            one obsessive standard.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Each engagement moves through the same four phases. Each phase is run by
            the same small team — no handoffs, no outsourced work.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-8 md:px-16 pb-24 md:pb-32 relative">
        {STEPS.map((s, i) => (
          <StepRow key={s.id} step={s} isLast={i === STEPS.length - 1} />
        ))}
      </div>
    </section>
  );
}
