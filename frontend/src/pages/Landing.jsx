import React, { Suspense, useEffect, useRef, useState } from "react";
import ObsidianCrystal from "@/components/ObsidianCrystal";
import WorkSection from "@/components/WorkSection";
import ApproachSection from "@/components/ApproachSection";
import WhyDimensionSection from "@/components/WhyDimensionSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    // Stagger reveal on mount
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      scrollRef.current = Math.min(Math.max(window.scrollY / h, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <main
      data-testid="hero-section"
      className="relative w-full h-screen overflow-hidden text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Background grain + subtle vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 grain-overlay" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.07) 0%, rgba(10,10,12,0) 55%)",
        }}
      />

      {/* Top navigation — minimal */}
      <header className="relative z-20 flex items-center justify-between px-8 md:px-16 pt-8">
        <div
          data-testid="brand-mark"
          className="text-[11px] tracking-[0.42em] uppercase text-white/70"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          Obsidian
          <span className="ml-2 text-white/30">/ Studio</span>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.32em] uppercase text-white/55">
          <a href="#work" data-testid="nav-work" className="hover:text-white transition-colors duration-500">
            Work
          </a>
          <a href="#approach" data-testid="nav-approach" className="hover:text-white transition-colors duration-500">
            Approach
          </a>
          <a href="#contact" data-testid="nav-contact" className="hover:text-white transition-colors duration-500">
            Contact
          </a>
        </nav>
        <div
          data-testid="status-indicator"
          className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-white/45"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          Booking 2026
        </div>
      </header>

      {/* Hero content grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 px-8 md:px-16 h-[calc(100vh-96px)]">
        {/* LEFT: copy */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div
            className={`transition-all duration-[1400ms] ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "120ms" }}
          >
            <p
              data-testid="hero-eyebrow"
              className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
            >
              <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
              Interactive 3D Studio
            </p>
          </div>

          <h1
            data-testid="hero-headline"
            className={`obsidian-headline text-white leading-[0.92] transition-all duration-[1600ms] ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.06em",
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              transitionDelay: "220ms",
            }}
          >
            OBSIDIAN
          </h1>

          <p
            data-testid="hero-subheadline"
            className={`mt-10 max-w-xl text-white/65 leading-relaxed transition-all duration-[1600ms] ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
              letterSpacing: "0.01em",
              transitionDelay: "380ms",
            }}
          >
            We build 3D websites that make other businesses look small.
          </p>

          <div
            className={`mt-12 flex items-center gap-6 transition-all duration-[1400ms] ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "560ms" }}
          >
            <a
              href="#work"
              data-testid="view-work-btn"
              className="obsidian-btn group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15"
            >
              <span>View Our Work</span>
              <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
            </a>

            <a
              href="#contact"
              data-testid="brief-link"
              className="text-[11px] tracking-[0.32em] uppercase text-white/45 hover:text-white transition-colors duration-500"
            >
              Start a brief
            </a>
          </div>
        </div>

        {/* RIGHT: 3D crystal */}
        <div
          data-testid="crystal-stage"
          className={`lg:col-span-6 relative h-full min-h-[420px] transition-opacity duration-[1800ms] ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Faint violet halo behind crystal */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0) 50%)",
              filter: "blur(20px)",
            }}
          />
          <Suspense fallback={null}>
            <ObsidianCrystal scrollRef={scrollRef} />
          </Suspense>
        </div>
      </div>

      {/* Bottom meta strip */}
      <div className="absolute bottom-6 left-8 right-8 md:left-16 md:right-16 z-20 flex items-end justify-between text-[10px] tracking-[0.32em] uppercase text-white/35">
        <span data-testid="footer-coord">N 40.7128° / W 74.0060°</span>
        <span data-testid="footer-scroll" className="hidden md:inline">
          Scroll
          <span className="inline-block w-px h-4 bg-white/30 align-middle ml-3" />
        </span>
        <span data-testid="footer-index">Index — 01 / 08</span>
      </div>
    </main>
    <WorkSection />
    <ApproachSection />
    <WhyDimensionSection />
    <PricingSection />
    <TestimonialsSection />
    <FaqSection />
    <ContactSection />
    <Footer />
    </>
  );
}
