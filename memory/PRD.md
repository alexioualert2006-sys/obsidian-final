# OBSIDIAN — Interactive 3D Studio Landing

## Original Problem Statement
Landing page for OBSIDIAN — a studio that designs and builds high-end interactive 3D websites for other businesses. Dark luxury, cinematic mood (#0A0A0C background, electric violet #8B5CF6 accent). Built section-by-section over multiple turns; user approved each section before the next.

## User Choices
- 3D library: React Three Fiber + drei
- Crystal: Tall vertical shard (custom faceted bipyramid)
- Font: Unbounded (display) + Inter (body)
- Layout: Asymmetric, editorial, generous whitespace

## Stack
- Frontend: React 19 + craco, Tailwind, three, @react-three/fiber, @react-three/drei
- Backend: FastAPI + MongoDB (briefs persistence)

## Implemented (complete site)
1. **Hero** (`/app/frontend/src/pages/Landing.jsx`, `components/ObsidianCrystal.jsx`)
   - R3F canvas: custom flat-shaded bipyramid shard, MeshPhysicalMaterial (black glass + clearcoat), Fresnel rim-shader (electric violet), procedural Lightformer environment (no HDR download), inner violet pointLight
   - Autonomous Y rotation + smoothed mouse-driven tilt
   - Camera z=7.5 fov=36 → full shard always in frame
   - Top nav, eyebrow, OBSIDIAN headline (Unbounded 200), subheading, "View Our Work" pill button with violet hover glow
2. **Selected Work** (`components/WorkSection.jsx`) — §02
   - 5 editorial case studies (Lumière Atelier, Vault & Holdings, Atrium Residences, Solas Studios, Northbound Aviation)
   - Alternating image/copy layout, scope tag pills, corner ticks, hover violet edge accent
3. **Approach** (`components/ApproachSection.jsx`, `StepShape.jsx`) — §03
   - 4 steps: Discover (tetrahedron), Design (octahedron), Build (icosahedron), Launch (mini shard)
   - Vertical timeline with thin white rail + glowing violet nodes
   - Each step has its own small R3F canvas, same black-glass + Fresnel rim
4. **Why 3D** (`components/WhyDimensionSection.jsx`) — §04
   - 3-column grid: Memorability / Attention / Perception
   - Top hairline + violet tick (grows on hover)
5. **Contact** (`components/ContactSection.jsx`, backend `POST /api/briefs`) — §05
   - Premium minimal form: thin underline fields, 2-column layout + full-width textarea
   - POSTs to `/api/briefs`, server-side validation (project_type, budget, email format)
   - Success state with personalised thank-you + brief-id chip
6. **Footer** (`components/Footer.jsx`)
   - Huge OBSIDIAN wordmark, tagline, large mailto link to hello@obsidian.studio
   - Nav (Work, Approach, Contact), Social (Instagram, LinkedIn, X / Twitter), copyright row

## Backend API
- `POST /api/briefs` — accepts `{name, email, company, project_type, budget, message}`; validates against allowed enums; returns `BriefSubmission`
- `GET /api/briefs` — sorted-by-date list

## Test Credentials
N/A — no auth.

## Verified
- testing_agent_v3 iteration 1: backend 8/8 pass, frontend 100% — no defects.
- Crystal verified non-clipped at viewport heights 900 / 720 / 640.

## Backlog
- P2: Reset/"submit another brief" CTA on Contact success state
- P2: Page transitions, scroll-linked crystal animation, ambient sound
- P2: CMS-backed projects (FastAPI + Mongo), case-study detail pages
- P2: Stricter email validation (Pydantic EmailStr), rate limiting on brief intake
