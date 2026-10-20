import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

from .engine import Interaction, RecommendationEngine, Video

load_dotenv()

app = FastAPI(title="EduTrack Recommender")

_MONGO_CLIENT = None


def get_db():
    global _MONGO_CLIENT
    if _MONGO_CLIENT is None:
        import pymongo
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/edutrack")
        _MONGO_CLIENT = pymongo.MongoClient(uri, serverSelectionTimeoutMS=3000)
    return _MONGO_CLIENT.get_default_database()


class RecommendRequest(BaseModel):
    studentId: str | None = None
    grade: str | None = None
    subject: str | None = None
    excludeIds: list[str] | None = None


def _to_epoch(value) -> float:
    if value is None:
        return time.time()
    if hasattr(value, "timestamp"):
        try:
            return value.timestamp()
        except Exception:
            return time.time()
    return time.time()


def load_videos(db) -> list[Video]:
    videos = []
    interaction_counts: dict[str, int] = {}
    for doc in db.video_interactions.find({}, {"videoId": 1}):
        vid = doc.get("videoId")
        if vid:
            interaction_counts[vid] = interaction_counts.get(vid, 0) + 1

    for doc in db.videos.find({}):
        vid = str(doc.get("_id"))
        videos.append(Video(
            id=vid,
            title=doc.get("title", ""),
            description=doc.get("description", ""),
            tags=" ".join(doc.get("tags", [])) if isinstance(doc.get("tags"), list) else str(doc.get("tags", "")),
            subject=doc.get("subject", ""),
            grade=str(doc.get("grade", "")),
            created_at=_to_epoch(doc.get("createdAt")),
            popularity=interaction_counts.get(vid, 0),
        ))
    return videos


def load_interactions(db) -> list[Interaction]:
    interactions = []
    for doc in db.video_interactions.find({}):
        interactions.append(Interaction(
            student_id=doc.get("studentId", ""),
            video_id=doc.get("videoId", ""),
            watched_percent=float(doc.get("watchedPercent", 0)),
            rating=doc.get("rating"),
            timestamp=_to_epoch(doc.get("completedAt")),
        ))
    return interactions


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend")
def recommend(req: RecommendRequest):
    try:
        db = get_db()
        videos = load_videos(db)
        interactions = load_interactions(db)
    except Exception:
        # Mongo unreachable: behave like "no data" so the caller's fallback kicks in.
        return {"recommendations": []}

    if req.excludeIds:
        exclude = set(req.excludeIds)
        videos = [v for v in videos if v.id not in exclude]

    engine = RecommendationEngine(videos)
    recs = engine.recommend(req.studentId, req.grade, req.subject, interactions, top_n=5)
    return {"recommendations": recs}
