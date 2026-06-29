import React from "react";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/obsidian5469" },
  { label: "X / Twitter", href: "https://x.com/ChrisAlexo9931" },
];

const EMAIL = "hello@obsidian.studio";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative w-full text-white border-t border-white/[0.06]"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Faint violet vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.05) 0%, rgba(10,10,12,0) 55%)",
        }}
      />

      <div className="relative px-8 md:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-10 md:gap-12">
          {/* Brand block */}
          <div className="col-span-12 md:col-span-5">
            <h2
              data-testid="footer-wordmark"
              className="text-white leading-[0.9]"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 200,
                letterSpacing: "0.04em",
                fontSize: "clamp(3rem, 7vw, 6.5rem)",
              }}
            >
              OBSIDIAN
            </h2>
            <p
              data-testid="footer-tagline"
              className="mt-6 text-[11px] tracking-[0.42em] uppercase text-white/45"
            >
              <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
              Interactive 3D Studio
            </p>

            {/* Email — large editorial CTA */}
            <a
              href={`mailto:${EMAIL}`}
              data-testid="footer-email"
              className="group inline-flex items-baseline gap-3 mt-12 md:mt-16 text-white/85 hover:text-white transition-colors duration-500"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 200,
                letterSpacing: "0.005em",
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
              }}
            >
              <span className="border-b border-white/15 group-hover:border-[#8B5CF6] transition-colors duration-500 pb-1">
                {EMAIL}
              </span>
              <span
                aria-hidden="true"
                className="text-white/40 group-hover:text-[#8B5CF6] transition-colors duration-500"
              >
                ↗
              </span>
            </a>
          </div>

          {/* Nav */}
          <nav
            data-testid="footer-nav"
            className="col-span-6 md:col-span-3 md:col-start-7 flex flex-col gap-5 md:pt-4"
          >
            <p className="text-[10px] tracking-[0.42em] uppercase text-white/35 mb-3">
              <span className="inline-block w-6 h-px bg-white/30 align-middle mr-3" />
              Index
            </p>
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                data-testid={`footer-nav-${n.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-500 self-start"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  fontSize: "1rem",
                }}
              >
                <span className="inline-block w-0 h-px bg-[#8B5CF6] group-hover:w-6 transition-all duration-500" />
                <span>{n.label}</span>
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-5 md:pt-4">
            <p className="text-[10px] tracking-[0.42em] uppercase text-white/35 mb-3">
              <span className="inline-block w-6 h-px bg-white/30 align-middle mr-3" />
              Elsewhere
            </p>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`footer-social-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-500 self-start"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  fontSize: "1rem",
                }}
              >
                <span className="inline-block w-0 h-px bg-[#8B5CF6] group-hover:w-6 transition-all duration-500" />
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-24 md:mt-32 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[10px] tracking-[0.42em] uppercase text-white/35">
          <span data-testid="footer-copyright">
            © 2026 Obsidian Studio. All rights reserved.
          </span>
          <span data-testid="footer-status" className="inline-flex items-center">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5CF6] align-middle mr-3"
              style={{ boxShadow: "0 0 10px #8B5CF6" }}
            />
            Q1 2026 — 2 slots remaining
          </span>
          <span data-testid="footer-coord">N 40.7128° / W 74.0060°</span>
        </div>
      </div>
    </footer>
  );
}
