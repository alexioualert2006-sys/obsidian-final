import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const PROJECTS = [
  {
    index: "01",
    slug: "lumiere-atelier",
    title: "Lumière Atelier",
    client: "Maison Lumière",
    sector: "Luxury Fashion",
    year: "2025",
    scope: ["WebGL Showroom", "Editorial CMS", "Brand System"],
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A volumetric 3D atelier replacing the seasonal lookbook — visitors walk through draped fabric in real time.",
  },
  {
    index: "02",
    slug: "vault-holdings",
    title: "Vault & Holdings",
    client: "Vault Capital",
    sector: "Private Finance",
    year: "2025",
    scope: ["Interactive Report", "Data Sculpture", "Dashboard"],
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "Quarterly letters rendered as a navigable 3D vault. Every figure becomes architecture.",
  },
  {
    index: "03",
    slug: "atrium-residences",
    title: "Atrium Residences",
    client: "Atrium Group",
    sector: "Real Estate",
    year: "2024",
    scope: ["3D Tower Tour", "Floor Configurator", "Sales Suite"],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "Buyers walk every unit before the tower is poured. The sales suite closed nine months ahead of forecast.",
  },
  {
    index: "04",
    slug: "solas-studios",
    title: "Solas Studios",
    client: "Solas",
    sector: "Film & Production",
    year: "2024",
    scope: ["Cinematic Reel", "WebGL Player", "Press Vault"],
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A scrubbable, frame-accurate cinematic site that doubles as a press kit and a portfolio.",
  },
  {
    index: "05",
    slug: "northbound-aviation",
    title: "Northbound Aviation",
    client: "Northbound",
    sector: "Private Aviation",
    year: "2024",
    scope: ["Configurator", "Charter Flow", "Brand Site"],
    image:
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A configurator that lets owners spec a cabin in 3D and receive a charter quote in the same session.",
  },
];

function ProjectRow({ project, idx }) {
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

  const reverse = idx % 2 === 1;

  return (
    <article
      ref={ref}
      data-testid={`project-row-${project.index}`}
      className={`group relative grid grid-cols-12 gap-6 md:gap-10 py-16 md:py-24 border-t border-white/[0.06] transition-all duration-[1400ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Index */}
      <div className="col-span-12 md:col-span-1 flex md:block items-baseline gap-6">
        <span
          data-testid={`project-index-${project.index}`}
          className="text-white/35 text-[11px] tracking-[0.42em] uppercase"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          {project.index}
          <span className="text-white/15"> / {String(PROJECTS.length).padStart(2, "0")}</span>
        </span>
      </div>

      {/* Image */}
      <div
        className={`col-span-12 md:col-span-6 ${reverse ? "md:order-3" : "md:order-2"}`}
      >
        <div
          data-testid={`project-image-${project.index}`}
          className="relative overflow-hidden aspect-[16/10] bg-[#0e0e12]"
        >
          {/* The image */}
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[35%] transition-all duration-[1600ms] ease-out group-hover:opacity-90 group-hover:grayscale-0 group-hover:scale-[1.04]"
          />
          {/* Dark wash */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms] group-hover:opacity-40"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,12,0.25) 0%, rgba(10,10,12,0.65) 100%)",
            }}
          />
          {/* Violet edge accent — appears on hover */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms]"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(139,92,246,0.55), inset 0 0 60px rgba(139,92,246,0.08)",
            }}
          />
          {/* Corner ticks */}
          <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 group-hover:border-[#8B5CF6] transition-colors duration-700" />
          <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/30 group-hover:border-[#8B5CF6] transition-colors duration-700" />
          <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/30 group-hover:border-[#8B5CF6] transition-colors duration-700" />
          <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 group-hover:border-[#8B5CF6] transition-colors duration-700" />
        </div>
      </div>

      {/* Copy */}
      <div
        className={`col-span-12 md:col-span-5 flex flex-col justify-center ${
          reverse ? "md:order-2" : "md:order-3"
        }`}
      >
        <div className="flex items-center gap-4 mb-4 text-[10px] tracking-[0.4em] uppercase text-white/40">
          <span data-testid={`project-sector-${project.index}`}>{project.sector}</span>
          <span className="w-6 h-px bg-white/20" />
          <span data-testid={`project-year-${project.index}`}>{project.year}</span>
        </div>

        <h3
          data-testid={`project-title-${project.index}`}
          className="text-white leading-[0.95]"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.01em",
            fontSize: "clamp(1.8rem, 3.4vw, 3.2rem)",
          }}
        >
          {project.title}
        </h3>

        <p className="mt-2 text-[11px] tracking-[0.32em] uppercase text-white/45">
          <span data-testid={`project-client-${project.index}`}>{project.client}</span>
        </p>

        <p
          className="mt-6 max-w-md text-white/65 leading-relaxed"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "0.95rem",
          }}
        >
          {project.blurb}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.scope.map((s) => (
            <li
              key={s}
              data-testid={`project-scope-${project.index}-${s.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-[10px] tracking-[0.32em] uppercase text-white/50 border border-white/10 rounded-full px-3 py-1.5 hover:border-[#8B5CF6]/50 hover:text-white transition-colors duration-500"
            >
              {s}
            </li>
          ))}
        </ul>

        <Link
          to={`/work/${project.slug}`}
          data-testid={`project-link-${project.index}`}
          className="mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase text-white/75 hover:text-white transition-colors duration-500 self-start"
        >
          <span>Case Study</span>
          <span className="relative inline-block w-6 h-px bg-white/40 group-hover:bg-[#8B5CF6] transition-colors duration-500" />
        </Link>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section
      id="work"
      data-testid="work-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="work-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §02
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="work-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Selected Work
          </p>
          <h2
            data-testid="work-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            Built for brands that
            <br />
            refuse to look ordinary.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            A small set of recent engagements. Most of our work is under NDA — these
            are the ones we&rsquo;re allowed to show.
          </p>
        </div>
      </div>

      {/* Project rows */}
      <div className="px-8 md:px-16">
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.index} project={p} idx={i} />
        ))}
      </div>

      {/* Section footer CTA */}
      <div className="px-8 md:px-16 py-24 md:py-32 border-t border-white/[0.06] flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="text-[11px] tracking-[0.42em] uppercase text-white/40 mb-4">
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Archive
          </p>
          <p
            className="text-white max-w-xl leading-[1.05]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)",
            }}
          >
            Twenty-four more case studies live behind the brief.
          </p>
        </div>
        <a
          href="#contact"
          data-testid="request-archive-btn"
          className="obsidian-btn group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15 self-start"
        >
          <span>Request Archive</span>
          <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
        </a>
      </div>
    </section>
  );
}
