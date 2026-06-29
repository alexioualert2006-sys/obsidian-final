from fastapi import FastAPI, APIRouter, HTTPException, Request, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import resend
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()


def _client_key(request: Request) -> str:
    """Pick the real client IP behind the k8s ingress.

    SlowAPI's default ``get_remote_address`` keys on ``request.client.host``,
    which in this deployment is the ingress pod IP — multiple ingress pods
    round-robin requests, splitting the per-IP bucket. Prefer the left-most
    untrusted hop in X-Forwarded-For; fall back to the direct peer.
    """
    xff = request.headers.get("x-forwarded-for")
    if xff:
        first = xff.split(",")[0].strip()
        if first:
            return first
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return get_remote_address(request)


# Rate limiter — keyed by real client IP (X-Forwarded-For aware)
limiter = Limiter(key_func=_client_key)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ---------- Brief intake ----------
PROJECT_TYPES = {"New 3D site", "Configurator", "Interactive report", "Other"}
BUDGET_RANGES = {
    "Under $50k",
    "$50k\u2013$100k",  # $50k–$100k
    "$100k\u2013$250k",  # $100k–$250k
    "$250k+",
}


class BriefSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    company: str = Field("", max_length=200)
    project_type: str = Field(..., max_length=80)
    budget: str = Field(..., max_length=80)
    message: str = Field("", max_length=4000)


class BriefSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: str = ""
    project_type: str
    budget: str
    message: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Projects ----------
class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    index: str  # "01"..
    title: str
    client: str
    sector: str
    year: str
    scope: List[str] = []
    image: str
    cover_caption: str = ""
    blurb: str = ""
    overview: str = ""
    challenge: str = ""
    approach: str = ""
    outcome: str = ""
    stats: List[dict] = []  # [{label, value}]
    gallery: List[str] = []
    next_slug: Optional[str] = None


# ---------- Resend notifications ----------
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip()
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL", "").strip()

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def _build_brief_email_html(brief: "BriefSubmission") -> str:
    safe = lambda v: (v or "").replace("<", "&lt;").replace(">", "&gt;")
    rows = [
        ("Name", brief.name),
        ("Email", brief.email),
        ("Company", brief.company or "—"),
        ("Project Type", brief.project_type),
        ("Budget", brief.budget),
        ("Reference", brief.id[:8]),
        ("Received", brief.created_at.isoformat()),
    ]
    row_html = "".join(
        f"<tr><td style='padding:6px 16px 6px 0;color:#888;font:11px/1.6 -apple-system,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.18em;'>{safe(k)}</td>"
        f"<td style='padding:6px 0;color:#fff;font:14px/1.6 -apple-system,Helvetica,sans-serif;'>{safe(v)}</td></tr>"
        for k, v in rows
    )
    message_block = (
        f"<div style='margin-top:24px;padding:16px 18px;border-left:2px solid #8B5CF6;color:#ddd;"
        f"background:#111;font:14px/1.6 -apple-system,Helvetica,sans-serif;white-space:pre-wrap;'>"
        f"{safe(brief.message)}</div>"
        if brief.message
        else ""
    )
    return f"""
<!doctype html>
<html><body style='margin:0;background:#0A0A0C;padding:32px 0;'>
  <table align='center' cellpadding='0' cellspacing='0' width='560' style='background:#0A0A0C;border:1px solid #1c1c22;'>
    <tr><td style='padding:32px 32px 24px 32px;'>
      <div style='font:300 12px/1.6 -apple-system,Helvetica,sans-serif;letter-spacing:0.42em;text-transform:uppercase;color:#888;'>OBSIDIAN · New Brief</div>
      <h1 style='margin:18px 0 4px 0;font:300 28px/1.1 Georgia,serif;color:#fff;letter-spacing:0.01em;'>A new brief just landed.</h1>
      <p style='margin:0;color:#999;font:14px/1.6 -apple-system,Helvetica,sans-serif;'>From {safe(brief.name)} at {safe(brief.company or 'an unnamed company')}.</p>
      <table cellpadding='0' cellspacing='0' style='margin-top:28px;width:100%;'>{row_html}</table>
      {message_block}
      <p style='margin:32px 0 0 0;color:#666;font:11px/1.6 -apple-system,Helvetica,sans-serif;letter-spacing:0.18em;text-transform:uppercase;'>Reply directly to <a style='color:#8B5CF6;text-decoration:none;' href='mailto:{safe(brief.email)}'>{safe(brief.email)}</a></p>
    </td></tr>
  </table>
</body></html>
"""


def _send_brief_notification(brief: "BriefSubmission") -> None:
    """Background task. Never raises — failures are logged and the brief still persists."""
    if not RESEND_API_KEY:
        logger.info("Resend disabled (RESEND_API_KEY missing) — skipping notification for brief %s", brief.id[:8])
        return
    if not NOTIFY_EMAIL:
        logger.info("NOTIFY_EMAIL missing — skipping notification for brief %s", brief.id[:8])
        return
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFY_EMAIL],
            "reply_to": [brief.email],
            "subject": f"OBSIDIAN — new brief: {brief.name} · {brief.budget}",
            "html": _build_brief_email_html(brief),
        }
        result = resend.Emails.send(params)
        logger.info("Brief notification sent (id=%s, resend=%s)", brief.id[:8], (result or {}).get("id"))
    except Exception as e:  # pragma: no cover — keep brief intake resilient
        logger.error("Brief notification failed (id=%s): %s", brief.id[:8], e)


PROJECT_SEED: List[dict] = [
    {
        "slug": "lumiere-atelier",
        "index": "01",
        "title": "Lumi\u00e8re Atelier",
        "client": "Maison Lumi\u00e8re",
        "sector": "Luxury Fashion",
        "year": "2025",
        "scope": ["WebGL Showroom", "Editorial CMS", "Brand System"],
        "image": "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
        "cover_caption": "A volumetric 3D atelier — the seasonal lookbook, in real time.",
        "blurb": "A volumetric 3D atelier replacing the seasonal lookbook \u2014 visitors walk through draped fabric in real time.",
        "overview": "Maison Lumi\u00e8re asked us to retire the seasonal lookbook PDF and build a digital atelier that felt as considered as the garments themselves.",
        "challenge": "Translate the intimacy of a private showing into a website that performs on a phone and respects the bandwidth of editors in Milan, Tokyo and New York.",
        "approach": "We modelled twelve hero pieces in real-time WebGL, draped them with cloth simulation baked to morph targets, and wrote a small editorial CMS so the in-house team could schedule drops without touching code.",
        "outcome": "First-week traffic 4.2\u00d7 the previous season. Average session 3m 41s. Three of five hero pieces sold through within 72 hours of the drop.",
        "stats": [
            {"label": "Traffic vs. prior", "value": "4.2\u00d7"},
            {"label": "Avg. session", "value": "3m 41s"},
            {"label": "Sell-through", "value": "3 / 5 hero"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    {
        "slug": "vault-holdings",
        "index": "02",
        "title": "Vault & Holdings",
        "client": "Vault Capital",
        "sector": "Private Finance",
        "year": "2025",
        "scope": ["Interactive Report", "Data Sculpture", "Dashboard"],
        "image": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
        "cover_caption": "Every figure becomes architecture.",
        "blurb": "Quarterly letters rendered as a navigable 3D vault. Every figure becomes architecture.",
        "overview": "Vault Capital wanted their quarterly letter to feel more like an architectural drawing than a PDF \u2014 a place LPs could walk through.",
        "challenge": "Surface dense return data without dumbing it down, and keep it shippable inside the firm\u2019s compliance window.",
        "approach": "We designed a navigable WebGL vault where each room is a thesis, each pillar a position, each light a return curve. A private dashboard lets the IR team author new rooms in a week.",
        "outcome": "100% of invited LPs opened the report. Average dwell ten times higher than the previous PDF. Two new commitments cited the experience directly.",
        "stats": [
            {"label": "LP open rate", "value": "100%"},
            {"label": "Dwell vs. PDF", "value": "10\u00d7"},
            {"label": "New commits", "value": "2"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    {
        "slug": "atrium-residences",
        "index": "03",
        "title": "Atrium Residences",
        "client": "Atrium Group",
        "sector": "Real Estate",
        "year": "2024",
        "scope": ["3D Tower Tour", "Floor Configurator", "Sales Suite"],
        "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
        "cover_caption": "Buyers walk the tower before it\u2019s poured.",
        "blurb": "Buyers walk every unit before the tower is poured. The sales suite closed nine months ahead of forecast.",
        "overview": "A 64-unit tower, sold off-plan. Atrium asked us to replace a static brochure with a tour you could finish in eight minutes or live in for an hour.",
        "challenge": "Make a building that doesn\u2019t yet exist feel materially real \u2014 light, texture, view, and the shape of a Tuesday morning in it.",
        "approach": "We built a real-time WebGL tower with every floor walkable and every unit configurable. Buyers could swap kitchens, pivot the sofa to the river view, and request a hold from the same screen.",
        "outcome": "Sales suite hit 90% sold-out nine months ahead of forecast. Average configurator session 14 minutes. Eleven holds converted to deposits within the first weekend.",
        "stats": [
            {"label": "Sold-out", "value": "90%"},
            {"label": "Ahead of forecast", "value": "9 mo"},
            {"label": "Avg. config", "value": "14 min"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    {
        "slug": "solas-studios",
        "index": "04",
        "title": "Solas Studios",
        "client": "Solas",
        "sector": "Film & Production",
        "year": "2024",
        "scope": ["Cinematic Reel", "WebGL Player", "Press Vault"],
        "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
        "cover_caption": "A reel, a portfolio, a press kit \u2014 one canvas.",
        "blurb": "A scrubbable, frame-accurate cinematic site that doubles as a press kit and a portfolio.",
        "overview": "Solas\u2019 work is cinematic. Their site couldn\u2019t be a video player wrapped in a logo.",
        "challenge": "Treat the reel as the navigation. Make the press kit an artefact, not a download link.",
        "approach": "We built a custom WebGL player with frame-accurate scrubbing, chapter markers as title cards, and a press vault where every still is timecoded to the reel.",
        "outcome": "Two festival commissions opened with a link to the site. Press downloads tripled the quarter after launch.",
        "stats": [
            {"label": "Festival opens", "value": "2"},
            {"label": "Press downloads", "value": "3\u00d7"},
            {"label": "Avg. dwell", "value": "6m 12s"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1600&q=80",
        ],
    },
    {
        "slug": "northbound-aviation",
        "index": "05",
        "title": "Northbound Aviation",
        "client": "Northbound",
        "sector": "Private Aviation",
        "year": "2024",
        "scope": ["Configurator", "Charter Flow", "Brand Site"],
        "image": "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80",
        "cover_caption": "Spec a cabin, get a quote, in one session.",
        "blurb": "A configurator that lets owners spec a cabin in 3D and receive a charter quote in the same session.",
        "overview": "Northbound\u2019s clients arrive knowing what they want. The website needed to keep up.",
        "challenge": "Combine a high-fidelity cabin configurator with a charter quote flow without making the experience feel like enterprise software.",
        "approach": "We modelled three cabin classes in real-time WebGL with swappable materials, then bound the configurator state to a quiet quoting flow that emails the broker desk on submit.",
        "outcome": "Average request quality (broker-rated) up 38%. Three new charter contracts traced to configurator sessions in the first month.",
        "stats": [
            {"label": "Request quality", "value": "+38%"},
            {"label": "Contracts (mo 1)", "value": "3"},
            {"label": "Time to quote", "value": "< 24h"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1583500178690-f7d29f7c0e9b?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=80",
        ],
    },
]


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/briefs", response_model=BriefSubmission)
@limiter.limit("5/hour")
async def create_brief(
    request: Request,
    payload: BriefSubmissionCreate,
    background: BackgroundTasks,
):
    # EmailStr already validates format; just check the enums.
    if payload.project_type not in PROJECT_TYPES:
        raise HTTPException(status_code=422, detail="Invalid project_type")
    if payload.budget not in BUDGET_RANGES:
        raise HTTPException(status_code=422, detail="Invalid budget")

    brief = BriefSubmission(**payload.model_dump())
    doc = brief.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.briefs.insert_one(doc)

    # Fire-and-forget: notify the studio without blocking the form response.
    background.add_task(_send_brief_notification, brief)
    return brief


@api_router.get("/briefs", response_model=List[BriefSubmission])
async def list_briefs():
    items = await db.briefs.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get("created_at"), str):
            it["created_at"] = datetime.fromisoformat(it["created_at"])
    return items


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    items = await db.projects.find({}, {"_id": 0}).sort("index", 1).to_list(200)
    return items


@api_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    item = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_projects() -> None:
    """Seed the projects collection on first boot (idempotent — upsert by slug)."""
    for i, p in enumerate(PROJECT_SEED):
        nxt = PROJECT_SEED[(i + 1) % len(PROJECT_SEED)]["slug"]
        doc = Project(**p, next_slug=nxt).model_dump()
        await db.projects.update_one(
            {"slug": p["slug"]},
            {"$set": doc, "$setOnInsert": {"created_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
    logger.info("Seeded %d projects.", len(PROJECT_SEED))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
