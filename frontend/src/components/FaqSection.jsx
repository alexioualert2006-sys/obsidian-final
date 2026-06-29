import React, { useState } from "react";

/**
 * NOTE: These six questions are taken directly from the marketing site.
 * The answers were written to match OBSIDIAN's positioning (7-day Starter
 * delivery, € pricing, senior in-house team). Edit any answer freely.
 */
const FAQS = [
  {
    id: "01",
    q: "How long does it take?",
    a: "Starter sites ship in seven business days. Pro is a priority three-week build, and Elite is scoped per project. We lock a delivery date at kickoff and hold ourselves to it.",
  },
  {
    id: "02",
    q: "Do I need to provide content?",
    a: "It helps, but it isn't required. We can start from a short brief, and on Pro and Elite we handle strategy and copywriting so the words match the design.",
  },
  {
    id: "03",
    q: "How many revisions?",
    a: "Every build includes two full revision rounds, plus unlimited small tweaks until you're happy before we launch.",
  },
  {
    id: "04",
    q: "What if I don't like the result?",
    a: "You see the creative direction early in the design phase, so there are no surprises at the end. If the first concept misses, we redirect at no extra cost.",
  },
  {
    id: "05",
    q: "Do you offer payment plans?",
    a: "Yes. The standard split is 50% to begin and 50% on launch. Larger Elite projects can be broken into milestone payments.",
  },
  {
    id: "06",
    q: "What makes OBSIDIAN different?",
    a: "Real 3D and WebGL built in-house, a small senior team with no handoffs, and a fixed delivery date. Most studios ship templates — we build a presence that defines your category.",
  },
];

function FaqRow({ item, idx }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-testid={`faq-row-${item.id}`}
      className="premium-row border-t border-white/[0.08] px-4 -mx-4 rounded-sm"
    >
      <button
        type="button"
        data-testid={`faq-question-${item.id}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full flex items-center gap-6 py-7 md:py-9 text-left"
      >
        <span
          className="text-white/35 text-[11px] tracking-[0.42em] uppercase shrink-0"
          style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 300 }}
        >
          {item.id}
        </span>
        <span
          className="flex-1 text-white/85 group-hover:text-white transition-colors duration-500"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.005em",
            fontSize: "clamp(1.1rem, 1.9vw, 1.5rem)",
          }}
        >
          {item.q}
        </span>
        <span
          className="shrink-0 text-white/50 group-hover:text-[#8B5CF6] transition-all duration-500"
          aria-hidden="true"
          style={{
            fontSize: "1.4rem",
            lineHeight: 1,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-[600ms] ease-out"
        style={{ maxHeight: open ? "260px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p
          data-testid={`faq-answer-${item.id}`}
          className="pb-9 pl-0 md:pl-[3.4rem] max-w-2xl text-white/60 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem" }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="faq-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §07
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="faq-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            FAQ
          </p>
          <h2
            data-testid="faq-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            Answers.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Everything operators ask before a first call. Anything else — reach out
            and we&rsquo;ll answer in plain terms.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="px-8 md:px-16 pb-32 md:pb-48">
        <div className="border-b border-white/[0.08]">
          {FAQS.map((f, i) => (
            <FaqRow key={f.id} item={f} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
