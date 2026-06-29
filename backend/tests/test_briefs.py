"""Backend tests for OBSIDIAN: /api health, projects, briefs validation, rate limit, Resend no-op."""
import os
import time
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

EXPECTED_SLUGS = [
    "lumiere-atelier",
    "vault-holdings",
    "atrium-residences",
    "solas-studios",
    "northbound-aviation",
]


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
class TestHealth:
    def test_api_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# --- Projects ---
class TestProjects:
    def test_list_projects(self, session):
        r = session.get(f"{API}/projects")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) == 5

        # sorted by index 01..05
        indices = [it["index"] for it in items]
        assert indices == ["01", "02", "03", "04", "05"], f"got {indices}"

        required = ["id", "slug", "index", "title", "client", "sector", "year",
                    "scope", "image", "overview", "challenge", "approach", "stats",
                    "next_slug"]
        for it in items:
            for f in required:
                assert f in it, f"missing field {f} on {it.get('slug')}"
            assert isinstance(it["stats"], list) and len(it["stats"]) > 0
            for s in it["stats"]:
                assert "label" in s and "value" in s

        slugs = [it["slug"] for it in items]
        for s in EXPECTED_SLUGS:
            assert s in slugs

    def test_get_project_by_slug(self, session):
        r = session.get(f"{API}/projects/atrium-residences")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "atrium-residences"
        assert data["title"] == "Atrium Residences"
        assert data["index"] == "03"
        assert isinstance(data["stats"], list) and len(data["stats"]) > 0

    def test_get_project_404(self, session):
        r = session.get(f"{API}/projects/nonexistent-slug-xyz")
        assert r.status_code == 404


# --- Briefs validation ---
# Use a class-unique X-Forwarded-For so this class does not consume the
# rate-limit bucket for the burst test.
class TestBriefsValidation:
    XFF = "192.0.2.31"

    def test_invalid_email_returns_422_with_pydantic_detail(self, session):
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "company": "Acme",
            "project_type": "New 3D site",
            "budget": "$100k\u2013$250k",
            "message": "x",
        }
        r = session.post(
            f"{API}/briefs", json=payload, headers={"X-Forwarded-For": self.XFF}
        )
        assert r.status_code == 422, r.text
        body = r.json()
        detail = body.get("detail")
        assert isinstance(detail, list) and len(detail) >= 1, f"got {body}"
        err = detail[0]
        loc = err.get("loc", [])
        msg = (err.get("msg") or "").lower()
        assert "email" in loc, f"loc did not contain 'email': {loc}"
        assert "valid email" in msg or "value is not a valid email" in msg


# --- Rate limit (per-IP via X-Forwarded-For) ---
class TestBriefsRateLimit:
    # Fresh IP literal; iteration_2 mentioned 203.0.113.42 and 198.51.100.7 are
    # partially consumed in this process memory, so we use new ones.
    XFF_BURST = "203.0.113.77"
    XFF_SECOND = "198.51.100.55"

    def _payload(self, i):
        return {
            "name": "TEST_RateLimit",
            "email": f"rl{i}+test@example.com",
            "company": "TEST_RL",
            "project_type": "Other",
            "budget": "Under $50k",
            "message": f"rl-{i}",
        }

    def test_sixth_post_returns_429(self, session):
        statuses = []
        for i in range(6):
            r = session.post(
                f"{API}/briefs",
                json=self._payload(i),
                headers={"X-Forwarded-For": self.XFF_BURST},
            )
            statuses.append(r.status_code)

        assert statuses[:5] == [200, 200, 200, 200, 200], f"first 5 should be 200, got {statuses}"
        assert statuses[5] == 429, f"6th should be 429, got {statuses}"

        # 429 body should mention rate limit
        r6 = session.post(
            f"{API}/briefs",
            json=self._payload(99),
            headers={"X-Forwarded-For": self.XFF_BURST},
        )
        assert r6.status_code == 429
        try:
            body = r6.json()
            detail = (body.get("detail") or body.get("error") or "")
            assert "rate limit" in str(detail).lower() or "5 per" in str(detail).lower(), body
        except ValueError:
            assert "rate limit" in r6.text.lower()

    def test_other_ip_still_allowed(self, session):
        # A different real IP must still go through (proves bucket is per-IP, not global).
        r = session.post(
            f"{API}/briefs",
            json=self._payload("other"),
            headers={"X-Forwarded-For": self.XFF_SECOND},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and len(data["id"]) > 0


# --- Resend graceful no-op (RESEND_API_KEY="" in backend/.env) ---
class TestResendNoOp:
    XFF = "192.0.2.99"  # fresh bucket

    def test_brief_persists_and_email_no_op(self, session):
        payload = {
            "name": "TEST_ResendNoOp",
            "email": "noop+test@example.com",
            "company": "TEST_Resend",
            "project_type": "New 3D site",
            "budget": "$50k\u2013$100k",
            "message": "resend-noop test",
        }
        r = session.post(
            f"{API}/briefs", json=payload, headers={"X-Forwarded-For": self.XFF}
        )
        assert r.status_code == 200, r.text
        data = r.json()
        brief_id = data.get("id")
        assert brief_id and isinstance(brief_id, str) and len(brief_id) >= 8

        # Give background task a moment to run, then assert persistence via GET
        time.sleep(0.5)
        rl = session.get(f"{API}/briefs")
        assert rl.status_code == 200
        ids = [b["id"] for b in rl.json()]
        assert brief_id in ids, f"newly-created brief {brief_id} not found in list"
