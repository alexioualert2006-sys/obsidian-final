import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function useProject(slug) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError("");
    axios
      .get(`${API}/projects/${slug}`)
      .then((res) => !cancelled && setData(res.data))
      .catch((err) => !cancelled && setError(err?.response?.status === 404 ? "not_found" : "error"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return { data, loading, error };
}

function Reveal({ children, delay = 0, className = "" }) {
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
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useProject(slug);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (loading) {
    return (
      <main
        data-testid="case-study-loading"
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "#0A0A0C" }}
      >
        <span className="text-[10px] tracking-[0.42em] uppercase text-white/40">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8B5CF6] mr-3 align-middle animate-pulse" />
          Loading
        </span>
      </main>
    );
  }

  if (error === "not_found" || !data) {
    return (
      <main
        data-testid="case-study-not-found"
        className="min-h-screen w-full flex flex-col items-center justify-center px-8 text-center"
        style={{ backgroundColor: "#0A0A0C" }}
      >
        <p className="text-[10px] tracking-[0.42em] uppercase text-white/40 mb-6">
          §— · Not Found
        </p>
        <h1
          className="text-white leading-[0.95]"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 200,
            fontSize: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          This case study lives behind the brief.
        </h1>
        <p className="mt-6 text-white/55 max-w-md leading-relaxed">
          The slug you opened isn&rsquo;t public. If you were sent this link, request
          the archive from the contact page.
        </p>
        <Link
          to="/"
          data-testid="back-home-btn"
          className="obsidian-btn mt-12 group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15"
        >
          <span>← Back to Index</span>
        </Link>
      </main>
    );
  }

  return (
    <main
      data-testid="case-study-page"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Top bar — slim */}
      <header className="relative z-20 flex items-center justify-between px-8 md:px-16 pt-8">
        <Link
          to="/"
          data-testid="case-study-back"
          className="text-[11px] tracking-[0.42em] uppercase text-white/70 hover:text-white transition-colors duration-500"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          ← Obsidian / Studio
        </Link>
        <span
          data-testid="case-study-index"
          className="text-[10px] tracking-[0.42em] uppercase text-white/40"
        >
          Case Study — {data.index} / 05
        </span>
      </header>

      {/* Hero — title + meta */}
      <section className="px-8 md:px-16 pt-24 md:pt-40 pb-12 md:pb-20 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-1">
          <span className="text-[10px] tracking-[0.42em] uppercase text-white/35">
            {`\u00a7${data.index}`}
          </span>
        </div>
        <div className="col-span-12 md:col-span-8">
          <Reveal>
            <p
              data-testid="case-study-eyebrow"
              className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/45"
            >
              <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
              {data.sector} · {data.year}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <h1
              data-testid="case-study-title"
              className="text-white leading-[0.94]"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 200,
                letterSpacing: "0.01em",
                fontSize: "clamp(2.6rem, 6vw, 6rem)",
              }}
            >
              {data.title}
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p
              data-testid="case-study-cover-caption"
              className="mt-6 max-w-2xl text-white/65 leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: "1.05rem",
              }}
            >
              {data.cover_caption || data.blurb}
            </p>
          </Reveal>
        </div>
        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <Reveal delay={360}>
            <dl className="grid grid-cols-2 gap-6 md:block md:space-y-6 md:mt-2">
              <Meta label="Client" value={data.client} testid="case-study-client" />
              <Meta label="Year" value={data.year} testid="case-study-year" />
              <Meta
                label="Scope"
                value={(data.scope || []).join(" · ")}
                testid="case-study-scope"
              />
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Cover image */}
      <Reveal delay={120}>
        <div className="px-8 md:px-16 pb-16 md:pb-24">
          <div
            data-testid="case-study-cover"
            className="relative overflow-hidden aspect-[16/8] bg-[#0e0e12]"
          >
            <img
              src={data.image}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,12,0) 35%, rgba(10,10,12,0.55) 100%)",
              }}
            />
            <span className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/35" />
            <span className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/35" />
            <span className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/35" />
            <span className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/35" />
          </div>
        </div>
      </Reveal>

      {/* Narrative — 3 stacked blocks */}
      <section className="px-8 md:px-16 pb-16 md:pb-24 grid grid-cols-12 gap-6 md:gap-12">
        <Block index="A" label="Overview" body={data.overview} testid="block-overview" />
        <Block
          index="B"
          label="The challenge"
          body={data.challenge}
          testid="block-challenge"
        />
        <Block
          index="C"
          label="Our approach"
          body={data.approach}
          testid="block-approach"
        />
      </section>

      {/* Stats / outcomes */}
      {data.stats && data.stats.length > 0 && (
        <section className="px-8 md:px-16 pb-24 md:pb-32 border-t border-white/[0.06] pt-16 md:pt-24 grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[10px] tracking-[0.42em] uppercase text-white/40 mb-4">
              <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
              Outcome
            </p>
            <p
              className="text-white leading-tight max-w-xs"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 200,
                fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
              }}
            >
              The numbers that mattered.
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-10">
            {data.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <div
                  data-testid={`case-stat-${i + 1}`}
                  className="border-t border-white/10 pt-6"
                >
                  <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">
                    {s.label}
                  </p>
                  <p
                    className="text-white"
                    style={{
                      fontFamily: "'Unbounded', sans-serif",
                      fontWeight: 200,
                      fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              </Reveal>
            ))}
            {data.outcome && (
              <p
                data-testid="case-outcome-summary"
                className="col-span-1 md:col-span-3 mt-6 text-white/65 leading-relaxed max-w-3xl"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                {data.outcome}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="px-8 md:px-16 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {data.gallery.map((src, i) => (
            <Reveal key={src + i} delay={i * 140}>
              <div
                data-testid={`case-gallery-${i + 1}`}
                className="relative overflow-hidden aspect-[16/10] bg-[#0e0e12]"
              >
                <img
                  src={src}
                  alt={`${data.title} — ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,10,12,0.0) 60%, rgba(10,10,12,0.45) 100%)",
                  }}
                />
              </div>
            </Reveal>
          ))}
        </section>
      )}

      {/* Next case study + back to index */}
      <section className="px-8 md:px-16 pb-32 md:pb-48 border-t border-white/[0.06] pt-16 md:pt-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <p className="text-[10px] tracking-[0.42em] uppercase text-white/40 mb-4">
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Next
          </p>
          <button
            type="button"
            data-testid="case-next"
            onClick={() => navigate(`/work/${data.next_slug}`)}
            className="group block text-left"
          >
            <span
              className="block text-white/85 group-hover:text-white transition-colors duration-500"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 200,
                letterSpacing: "0.01em",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
              }}
            >
              {(data.next_slug || "")
                .replace(/-/g, " ")
                .replace(/\b\w/g, (m) => m.toUpperCase())}{" "}
              <span className="text-white/40 group-hover:text-[#8B5CF6] transition-colors duration-500">
                →
              </span>
            </span>
          </button>
        </div>
        <Link
          to="/"
          data-testid="case-back-index"
          className="obsidian-btn group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15 self-start"
        >
          <span>← Back to Index</span>
          <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
        </Link>
      </section>
    </main>
  );
}

function Meta({ label, value, testid }) {
  return (
    <div data-testid={testid}>
      <dt className="text-[10px] tracking-[0.42em] uppercase text-white/35 mb-2">
        {label}
      </dt>
      <dd className="text-white/85" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
        {value}
      </dd>
    </div>
  );
}

function Block({ index, label, body, testid }) {
  if (!body) return null;
  return (
    <>
      <div className="col-span-12 md:col-span-1">
        <span
          className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          {index}
        </span>
      </div>
      <div className="col-span-12 md:col-span-3">
        <p className="text-[10px] tracking-[0.42em] uppercase text-white/45">
          <span className="inline-block w-6 h-px bg-white/30 align-middle mr-3" />
          {label}
        </p>
      </div>
      <div className="col-span-12 md:col-span-8">
        <Reveal>
          <p
            data-testid={testid}
            className="text-white/75 leading-[1.7] max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1.05rem" }}
          >
            {body}
          </p>
        </Reveal>
      </div>
      <div className="col-span-12 h-10 md:h-16" />
    </>
  );
}
