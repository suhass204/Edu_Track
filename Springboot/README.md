# EduTrack — Spring Boot edition

Rewrite of `p4` (Node/Express + React + MongoDB) with:
- `backend/` — Spring Boot 3 (Java 17) API, MongoDB Atlas, JWT-capable auth (BCrypt), identical endpoints/JSON shapes to p4.
- `frontend/` — the same React app from p4, unchanged except the API base URL now comes from an env var.
- `recommender/` — Python FastAPI microservice doing TF-IDF + user-profile video recommendations.
- `db/` — schema reference + idempotent index/seed scripts.

See [MIGRATION_NOTES.md](MIGRATION_NOTES.md) for the full endpoint map, schema, and every
behavioural decision made during the rewrite.

## Run locally

```bash
# 1. backend (needs MONGODB_URI pointing at Atlas or a local Mongo)
cd backend
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
./mvnw spring-boot:run

# 2. recommender
cd recommender
python -m venv .venv && source .venv/Scripts/activate   # or .venv/bin/activate on Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 3. frontend
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

Default admin (seeded automatically on backend startup): `admin123@gmail.com` / `admin123`
(login is by **email**, not username).

## Env vars

| Service | Var | Purpose |
|---|---|---|
| backend | MONGODB_URI | Atlas connection string, must include `/edutrack` db name |
| backend | JWT_SECRET | signing key |
| backend | ALLOWED_ORIGINS | CORS, comma-separated |
| backend | RECOMMENDER_URL | base URL of the recommender service |
| backend | GEMINI_API_KEY | Google Generative Language API key (chatbot + progress analysis) |
| backend | PORT | listen port (Render injects this) |
| recommender | MONGODB_URI | same Atlas connection string |
| recommender | REC_WEIGHT_* | scoring weights (content/profile/popularity/recency) |
| frontend | VITE_API_URL | backend base URL, baked in at build time |

## Deploy

`render.yaml` at the repo root defines all three services as a Render Blueprint
(`edutrack-api`, `edutrack-recommender`, `edutrack-web`). Push to the branch Render tracks and
create the blueprint from the Render dashboard (or `render blueprint launch` with the CLI),
then set the `sync: false` secrets (`MONGODB_URI`, `GEMINI_API_KEY`) in the dashboard.

## Known limitations

- Render's free tier spins down idle instances; first request after idle can take up to ~60-90s
  (cold start) for the API, recommender, and the embedded JVM/uvicorn startup.
- Note/PDF uploads are stored on the API container's local disk (`uploads/`), which is ephemeral
  on Render's free tier — uploaded files are lost on redeploy/restart. A production deployment
  should move this to S3/Cloud Storage/a Render persistent disk.
- p4 had no authentication/authorization middleware at all (every endpoint was publicly
  callable); this rewrite keeps that behaviour unchanged for frontend compatibility, only adding
  BCrypt hashing and (currently unused by the frontend) JWT issuance.
- `p4/backend/.env` contains real MongoDB Atlas credentials checked into git history; this is a
  pre-existing issue in `p4` and was left untouched per the "don't modify p4" instruction — it
  should be rotated and scrubbed from history separately.
