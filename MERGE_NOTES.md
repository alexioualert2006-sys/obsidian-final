# OBSIDIAN — Merged Site (Notes)

This is your **Emergent 3D site** with the **Lovable marketing content merged in**. The
3D crystal hero and all original 3D code is **untouched**.

## What was added (from the marketing site)
- **Pricing section** (`frontend/src/components/PricingSection.jsx`) — Starter €2,500,
  Pro €5,000 (Most Popular), Elite €10,000, Retainer €1,500/mo, with full feature lists.
- **Testimonials section** (`frontend/src/components/TestimonialsSection.jsx`) — the 3
  client quotes.
- **FAQ section** (`frontend/src/components/FaqSection.jsx`) — the 6 questions. ⚠️ The
  *answers* were written fresh to match your positioning (the originals were hidden in
  collapsed accordions and couldn't be read from the live site). Edit them freely in that file.
- **Calendly booking** — a "Book 30-Min Call" button in the Contact section, linking to
  `https://calendly.com/alexioualert2006/30min`.
- **Real socials** in the footer — Instagram (`obsidian5469`) and X (`ChrisAlexo9931`).
- **Budget options** in the contact form changed from USD to your real € tiers.
- **SEO** title + description updated to your marketing copy.

## What was kept from the Emergent site (unchanged)
- The 3D obsidian crystal hero (`ObsidianCrystal.jsx`) — **not modified**.
- Work / portfolio section, Approach section (with 3D shapes), "Why 3D" section.
- The contact form wired to your FastAPI backend (`/api/briefs`).

## Page order
Hero (3D) → Work → Approach → Why 3D → Pricing → Testimonials → FAQ → Contact → Footer

## Running it locally
```bash
cd frontend
yarn install        # or: npm install
# create frontend/.env with:
#   REACT_APP_BACKEND_URL=https://your-backend-url
yarn start
```

The **backend** (`backend/`) needs its own `.env` (these secrets are NOT in the export):
```
MONGO_URL=...
DB_NAME=...
RESEND_API_KEY=...     # if you use the email-on-submit feature
```
If you only want the public marketing site live and don't need the brief form saving to a
database yet, you can deploy just the `frontend/` — the form will simply error on submit
until the backend URL is set. The Calendly button works with no backend at all.

## Deploying
Easiest path: push this repo back to GitHub and deploy `frontend/` on Vercel or Netlify
(build command `yarn build`, output `build/`). Set `REACT_APP_BACKEND_URL` in the host's
environment variables.
