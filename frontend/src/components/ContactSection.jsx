import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PROJECT_TYPES = [
  "New 3D site",
  "Configurator",
  "Interactive report",
  "Other",
];

const BUDGETS = ["€2,500", "€5,000", "€10,000", "Custom"];

const CALENDLY_URL = "https://calendly.com/alexioualert2006/30min";

function Field({
  label,
  htmlFor,
  children,
  testid,
}) {
  return (
    <div className="flex flex-col gap-3" data-testid={testid}>
      <label
        htmlFor={htmlFor}
        className="text-[10px] tracking-[0.42em] uppercase text-white/40"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full bg-transparent text-white placeholder-white/25 " +
  "border-0 border-b border-white/15 focus:border-[#8B5CF6] " +
  "outline-none px-0 py-3 text-[0.95rem] leading-snug " +
  "transition-colors duration-500";

export default function ContactSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    project_type: "",
    budget: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [briefId, setBriefId] = useState("");

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

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email.";
    if (!form.project_type) return "Please choose a project type.";
    if (!form.budget) return "Please choose a budget range.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      const backend = process.env.REACT_APP_BACKEND_URL;
      if (!backend) {
        setError(
          "Online brief intake isn't connected yet — please use the Book 30-Min Call button above and we'll take it from there."
        );
        setSubmitting(false);
        return;
      }
      const res = await axios.post(`${backend}/api/briefs`, form);
      setBriefId(res.data?.id || "");
      setSuccess(true);
    } catch (err) {
      let msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong. Please try again.";
      if (err?.response?.status === 429) {
        msg = "You've sent several briefs from this address. Please try again in an hour.";
      } else if (Array.isArray(msg)) {
        // FastAPI 422 returns a list of errors — pull the email message if present
        const emailErr = msg.find((m) => m?.loc?.includes("email"));
        msg = emailErr ? "Please enter a valid email." : "Submission failed.";
      }
      setError(typeof msg === "string" ? msg : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      data-testid="contact-section"
      className="relative w-full text-white"
      style={{ backgroundColor: "#0A0A0C" }}
    >
      {/* Section heading */}
      <div className="px-8 md:px-16 pt-32 md:pt-48 pb-12 grid grid-cols-12 gap-6 border-t border-white/[0.06]">
        <div className="col-span-12 md:col-span-1">
          <span
            data-testid="contact-section-index"
            className="text-[10px] tracking-[0.42em] uppercase text-white/35"
          >
            §08
          </span>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p
            data-testid="contact-section-eyebrow"
            className="mb-8 text-[11px] tracking-[0.42em] uppercase text-white/40"
          >
            <span className="inline-block w-8 h-px bg-white/40 align-middle mr-4" />
            Contact
          </p>
          <h2
            data-testid="contact-section-headline"
            className="text-white leading-[0.95]"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.01em",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
            }}
          >
            Let&rsquo;s build something
            <br />
            no one forgets.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:items-end">
          <p
            data-testid="contact-section-sub"
            className="text-white/55 max-w-sm leading-relaxed mt-6 md:mt-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Tell us about your project. We take on a limited number of
            engagements each quarter.
          </p>
        </div>
      </div>

      {/* Calendly — book a call directly */}
      <div className="px-8 md:px-16 pb-2 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-start-2 md:col-span-10">
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 py-7 px-7 md:px-9 border border-white/[0.08]" style={{ backgroundColor: "rgba(139,92,246,0.03)" }}>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.42em] uppercase text-white/40 mb-2">
                Prefer to talk?
              </p>
              <p
                className="text-white/85"
                style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 200, fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
              >
                Book a free 30-minute call.
              </p>
            </div>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-calendly-btn"
              className="obsidian-btn group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-[#8B5CF6]/45 self-start md:self-auto"
            >
              <span>Book 30-Min Call</span>
              <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        className={`px-8 md:px-16 pb-32 md:pb-48 transition-all duration-[1200ms] ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {!success ? (
          <form
            data-testid="brief-form"
            onSubmit={onSubmit}
            noValidate
            className="grid grid-cols-12 gap-x-10 gap-y-12 md:gap-y-16 mt-8 md:mt-16"
          >
            {/* Left column — basic identity */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-12 md:gap-14">
              <Field label="Name" htmlFor="brief-name" testid="field-name">
                <input
                  id="brief-name"
                  data-testid="brief-input-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Kerrigan"
                  value={form.name}
                  onChange={setField("name")}
                  className={inputBase}
                  required
                />
              </Field>

              <Field label="Email" htmlFor="brief-email" testid="field-email">
                <input
                  id="brief-email"
                  data-testid="brief-input-email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@yourbrand.com"
                  value={form.email}
                  onChange={setField("email")}
                  className={inputBase}
                  required
                />
              </Field>

              <Field
                label="Company"
                htmlFor="brief-company"
                testid="field-company"
              >
                <input
                  id="brief-company"
                  data-testid="brief-input-company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your brand"
                  value={form.company}
                  onChange={setField("company")}
                  className={inputBase}
                />
              </Field>
            </div>

            {/* Right column — project shape */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-12 md:gap-14">
              <Field
                label="Project Type"
                htmlFor="brief-project-type"
                testid="field-project-type"
              >
                <div className="relative">
                  <select
                    id="brief-project-type"
                    data-testid="brief-input-project-type"
                    value={form.project_type}
                    onChange={setField("project_type")}
                    className={`${inputBase} appearance-none pr-8 cursor-pointer ${
                      form.project_type ? "text-white" : "text-white/25"
                    }`}
                    required
                  >
                    <option value="" disabled className="bg-[#0A0A0C]">
                      Choose one
                    </option>
                    {PROJECT_TYPES.map((p) => (
                      <option key={p} value={p} className="bg-[#0A0A0C] text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                  <span
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/40 text-xs"
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </div>
              </Field>

              <Field
                label="Budget Range"
                htmlFor="brief-budget"
                testid="field-budget"
              >
                <div className="relative">
                  <select
                    id="brief-budget"
                    data-testid="brief-input-budget"
                    value={form.budget}
                    onChange={setField("budget")}
                    className={`${inputBase} appearance-none pr-8 cursor-pointer ${
                      form.budget ? "text-white" : "text-white/25"
                    }`}
                    required
                  >
                    <option value="" disabled className="bg-[#0A0A0C]">
                      Choose a range
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-[#0A0A0C] text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                  <span
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/40 text-xs"
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </div>
              </Field>

              <div className="hidden md:block" />
            </div>

            {/* Message — full width */}
            <div className="col-span-12">
              <Field
                label="Project Details"
                htmlFor="brief-message"
                testid="field-message"
              >
                <textarea
                  id="brief-message"
                  data-testid="brief-input-message"
                  value={form.message}
                  onChange={setField("message")}
                  placeholder="What are you building, who is it for, and what does success look like?"
                  rows={5}
                  className={`${inputBase} resize-none`}
                />
              </Field>
            </div>

            {/* Error */}
            {error && (
              <div
                data-testid="brief-error"
                className="col-span-12 text-[12px] tracking-[0.18em] uppercase text-[#f5b8b8]"
              >
                {error}
              </div>
            )}

            {/* Submit row */}
            <div className="col-span-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6">
              <p
                className="text-[11px] tracking-[0.32em] uppercase text-white/35 max-w-md"
                data-testid="brief-disclaimer"
              >
                <span className="inline-block w-6 h-px bg-white/30 align-middle mr-3" />
                We reply to every qualified brief within 48 hours.
              </p>
              <button
                type="submit"
                disabled={submitting}
                data-testid="brief-submit-btn"
                className="obsidian-btn group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? "Submitting" : "Submit Brief"}</span>
                <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
              </button>
            </div>
          </form>
        ) : (
          <div
            data-testid="brief-success"
            className="mt-8 md:mt-16 grid grid-cols-12 gap-10 items-start"
          >
            <div className="col-span-12 md:col-span-1">
              <span
                className="text-[10px] tracking-[0.42em] uppercase text-[#8B5CF6]"
                style={{ textShadow: "0 0 10px rgba(139,92,246,0.55)" }}
              >
                Received
              </span>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h3
                className="text-white leading-[1.02]"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 200,
                  fontSize: "clamp(1.8rem, 3.4vw, 3rem)",
                }}
              >
                Thank you, {form.name.split(" ")[0] || "friend"}.
                <br />
                Your brief is in our queue.
              </h3>
              <p
                className="mt-6 max-w-xl text-white/65 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                A partner will reach out at <span className="text-white">{form.email}</span>{" "}
                within 48 hours. If your project is a fit, we&rsquo;ll schedule a
                discovery call and share three recent case studies under NDA.
              </p>
              {briefId && (
                <p
                  data-testid="brief-id"
                  className="mt-10 text-[10px] tracking-[0.42em] uppercase text-white/35"
                >
                  Brief reference — {briefId.slice(0, 8)}
                </p>
              )}

              <button
                type="button"
                data-testid="brief-reset-btn"
                onClick={() => {
                  setForm({
                    name: "",
                    email: "",
                    company: "",
                    project_type: "",
                    budget: "",
                    message: "",
                  });
                  setBriefId("");
                  setError("");
                  setSuccess(false);
                }}
                className="obsidian-btn mt-12 group inline-flex items-center gap-3 px-7 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white border border-white/15"
              >
                <span>Submit Another Brief</span>
                <span className="inline-block w-5 h-px bg-white/70 group-hover:bg-[#8B5CF6] group-hover:w-8 transition-all duration-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div className="px-8 md:px-16 py-10 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] tracking-[0.42em] uppercase text-white/35">
        <span data-testid="footer-brand">OBSIDIAN — Brief Intake</span>
        <span data-testid="footer-quarter">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5CF6] align-middle mr-3 shadow-[0_0_10px_#8B5CF6]" />
          Q1 2026 — 2 slots remaining
        </span>
        <span data-testid="footer-coord-bottom">Confidential by default</span>
      </div>
    </section>
  );
}
