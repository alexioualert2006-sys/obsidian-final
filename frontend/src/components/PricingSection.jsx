import React, { useEffect, useRef, useState } from "react";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "€2,500",
    cadence: "",
    blurb:
      "Your first premium presence. Crafted to make you look like the real deal from day one.",
    features: [
      "5-page custom website",
      "Premium design system",
      "Mobile + desktop optimization",
      "Basic SEO setup",
      "7 business days",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "€5,000",
    cadence: "",
    blurb:
      "The site that closes clients. Built to convert serious traffic into serious revenue.",
    features: [
      "10-page conversion site",
      "Bespoke 3D & motion",
      "CMS + analytics setup",
      "Advanced SEO + speed",
      "Priority 3-week delivery",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: "€10,000",
    cadence: "",
    blurb:
      "Full digital domination. The flagship experience that defines your category.",
    features: [
      "Unlimited pages & systems",
      "Custom Three.js experience",
      "Strategy + copywriting",
      "White-glove launch",
      "60-day post-launch support",
    ],
    popular: false,
  },
  {
    id: "retainer",
    name: "Retainer",
    price: "€40",
    cadence: "/mo",
    blurb:
      "A light care plan that keeps your site online, backed up, and up to date.",
    features: [
      "Hosting & uptime monitoring",
      "Monthly backups",
      "Small content & text updates",
      "Email support",
    ],
    popular: false,
  },
];

function TierCard({ tier, idx }) {
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      data-testid={`pricing-tier-${tier.id}`}
      className={`group premium-card relative flex flex-col h-full p-8 md:p-9 border transition-all duration-[1200ms] ease-out ${
        tier.popular
          ? "border-[#8B5CF6]/45"
          : "border-white/[0.08] hover:border-white/20"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: `${idx * 110}ms`,
        backgroundColor: tier.popular ? "rgba(139,92,246,0.035)" : "rgba(255,255,255,0.012)",
      }}
    >
      {/* Violet glow accent for the popular tier */}
      {tier.popular && (
        <span
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ boxShadow: "inset 0 0 50px rgba(139,92,246,0.10)" }}
        />
      )}

      {/* Most Popular badge */}
      {tier.popular && (
        <span
          data-testid="pricing-popular-badge"
          className="absolute -top-px left-8 -translate-y-1/2 px-3 py-1 text-[9px] tracking-[0.42em] uppercase text-white bg-[#8B5CF6]"
          style={{ boxShadow: "0 0 18px rgba(139,92,246,0.5)" }}
        >
          Most Popular
        </span>
      )}

      <h3
        data-testid={`pricing-name-${tier.id}`}
        className="text-white"
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.04em",
          fontSize: "1.05rem",
        }}
      >
        {tier.name}
      </h3>

      <div className="mt-6 flex items-baseline gap-1">
        <span
          data-testid={`pricing-price-${tier.id}`}
          className="text-white"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 200,
            letterSpacing: "0.005em",
            fontSize: "clamp(2rem, 3vw, 2.6rem)",
          }}
        >
          {tier.price}
        </span>
        {tier.cadence && (
          <span className="text-white/45 text-sm tracking-[0.1em]">{tier.cadence}</span>
        )}
      </div>

      <p
        className="mt-5 text-white/60 leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem" }}
      >
        {tier.blurb}
      </p>

      <ul className="mt-8 flex flex-col gap-3.5">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-white/70"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.88rem" }}
          >
            <span className="mt-[6px] inline-block w-1.5 h-1.5 rotate-45 bg-[#8B5CF6] shrink-0" aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      <a
        href="#contact"
        data-testid={`pricing-cta-${tier.id}`}
        className="obsidian-btn mt-10 group/btn inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15"
      >
        <span>Get Started</span>
        <span className="inline-block w-4 h-px bg-white/70 group-hover/btn:bg-[#8B5CF6] group-hover/btn:w-7 transition-all duration-500" />
      </a>
    </article>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="pricing-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §05
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="pricing-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Investment
          </p>
          <h2
            data-testid="pricing-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            Pricing for
            <br />
            serious operators.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Fixed-price engagements with a delivery date locked at kickoff. Starter
            ships in seven business days — no retainers required to begin.
          </p>
        </div>
      </div>

      {/* Tier grid */}
      <div className="px-8 md:px-16 pb-32 md:pb-48 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-transparent">
        {TIERS.map((t, i) => (
          <TierCard key={t.id} tier={t} idx={i} />
        ))}
      </div>
    </section>
  );
}
