"""Video recommendation engine.

Pipeline:
1. Build a TF-IDF (unigrams+bigrams, sublinear tf) matrix over video text (title+description+tags+subject).
2. Content similarity: cosine similarity between videos.
3. User profile vector: weighted average of the TF-IDF vectors of videos the student has interacted
   with, weighted by recency decay and completion percentage.
4. Cold start: if the student has no history, the profile becomes the centroid of videos matching
   their enrolled grade/subject; if still nothing, fall back to global popularity.
5. Final score = w_content * content_sim(candidate, best-matching watched video)
               + w_profile * cosine(candidate, profile_vector)
               + w_popularity * normalized_popularity
               + w_recency * normalized_recency
   Already-completed videos (watchedPercent >= 90) are excluded.
"""
from __future__ import annotations

import math
import os
import time
from dataclasses import dataclass, field

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .text import preprocess, tokenize

DEFAULT_WEIGHTS = {
    "content": float(os.getenv("REC_WEIGHT_CONTENT", 0.55)),
    "profile": float(os.getenv("REC_WEIGHT_PROFILE", 0.35)),
    "popularity": float(os.getenv("REC_WEIGHT_POPULARITY", 0.05)),
    "recency": float(os.getenv("REC_WEIGHT_RECENCY", 0.05)),
}


@dataclass
class Video:
    id: str
    title: str = ""
    description: str = ""
    tags: str = ""
    subject: str = ""
    grade: str = ""
    created_at: float = field(default_factory=time.time)  # epoch seconds
    popularity: int = 0  # e.g. number of interactions

    def text(self) -> str:
        return f"{self.title} {self.description} {self.tags} {self.subject}"


@dataclass
class Interaction:
    student_id: str
    video_id: str
    watched_percent: float = 0.0
    rating: float | None = None
    timestamp: float = field(default_factory=time.time)


class RecommendationEngine:
    def __init__(self, videos: list[Video], weights: dict | None = None):
        self.videos = videos
        self.video_index = {v.id: i for i, v in enumerate(videos)}
        self.weights = weights or DEFAULT_WEIGHTS
        self._fit()

    def _fit(self):
        if not self.videos:
            self.matrix = None
            self.vectorizer = None
            return
        corpus = [preprocess(v.text()) for v in self.videos]
        self.vectorizer = TfidfVectorizer(
            sublinear_tf=True,
            ngram_range=(1, 2),
            tokenizer=str.split,
            preprocessor=lambda x: x,
            token_pattern=None,
        )
        self.matrix = self.vectorizer.fit_transform(corpus)

    def _popularity_scores(self) -> np.ndarray:
        if not self.videos:
            return np.array([])
        pops = np.array([v.popularity for v in self.videos], dtype=float)
        max_pop = pops.max() if pops.size and pops.max() > 0 else 1.0
        return pops / max_pop

    def _recency_scores(self) -> np.ndarray:
        if not self.videos:
            return np.array([])
        now = time.time()
        ages_days = np.array([(now - v.created_at) / 86400.0 for v in self.videos])
        return np.exp(-ages_days / 30.0)  # ~30-day half-life-ish decay

    def _profile_vector(self, interactions: list[Interaction]):
        """Recency- and completion-weighted average of the student's watched-video vectors."""
        if not interactions or self.matrix is None:
            return None
        now = time.time()
        rows = []
        weights = []
        for it in interactions:
            idx = self.video_index.get(it.video_id)
            if idx is None:
                continue
            age_days = max((now - it.timestamp) / 86400.0, 0)
            recency_weight = math.exp(-age_days / 14.0)
            completion_weight = max(min(it.watched_percent / 100.0, 1.0), 0.05)
            weight = recency_weight * completion_weight
            rows.append(idx)
            weights.append(weight)
        if not rows:
            return None
        weights = np.array(weights)
        weights = weights / weights.sum()
        sub = self.matrix[rows].toarray()
        profile = np.average(sub, axis=0, weights=weights)
        return profile.reshape(1, -1)

    def _cold_start_profile(self, grade: str | None, subject: str | None):
        if self.matrix is None:
            return None
        idxs = [
            i for i, v in enumerate(self.videos)
            if (grade is None or v.grade == grade) and (subject is None or v.subject == subject)
        ]
        if not idxs:
            return None
        sub = self.matrix[idxs].toarray()
        return sub.mean(axis=0).reshape(1, -1)

    def recommend(
        self,
        student_id: str | None,
        grade: str | None,
        subject: str | None,
        interactions: list[Interaction],
        top_n: int = 5,
    ) -> list[dict]:
        if not self.videos or self.matrix is None:
            return []

        completed_ids = {it.video_id for it in interactions if it.watched_percent >= 90}
        student_interactions = [it for it in interactions if it.student_id == student_id]

        profile = self._profile_vector(student_interactions)
        cold_start = profile is None
        if profile is None:
            profile = self._cold_start_profile(grade, subject)

        popularity = self._popularity_scores()
        recency = self._recency_scores()

        if profile is not None:
            profile_sim = cosine_similarity(profile, self.matrix).flatten()
        else:
            profile_sim = np.zeros(len(self.videos))

        # Content similarity: best match against anything the student has already watched,
        # falling back to similarity against the cold-start subject/grade centroid.
        watched_idxs = [self.video_index[it.video_id] for it in student_interactions if it.video_id in self.video_index]
        if watched_idxs:
            content_sim = cosine_similarity(self.matrix[watched_idxs], self.matrix).max(axis=0)
            content_sim = np.asarray(content_sim).flatten()
        else:
            content_sim = profile_sim.copy()

        w = self.weights
        scores = (
            w["content"] * content_sim
            + w["profile"] * profile_sim
            + w["popularity"] * popularity
            + w["recency"] * recency
        )

        results = []
        for i, v in enumerate(self.videos):
            if v.id in completed_ids:
                continue
            reason_terms = self._top_matching_terms(i, profile)
            results.append({
                "videoId": v.id,
                "score": float(scores[i]),
                "reason": "cold_start: popular in your grade/subject" if cold_start and not reason_terms
                else ("matches: " + ", ".join(reason_terms) if reason_terms else "popular pick"),
            })

        results.sort(key=lambda r: (-r["score"], r["videoId"]))
        return results[:top_n]

    def _top_matching_terms(self, video_idx: int, profile) -> list[str]:
        if profile is None or self.vectorizer is None:
            return []
        feature_names = np.array(self.vectorizer.get_feature_names_out())
        video_vec = self.matrix[video_idx].toarray().flatten()
        combined = video_vec * profile.flatten()
        if combined.sum() == 0:
            return []
        top_idx = np.argsort(combined)[::-1][:3]
        return [feature_names[i] for i in top_idx if combined[i] > 0]
