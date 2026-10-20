"""Proves the recommender ranks by logic, not by accident, on a small labeled dataset
of Python / Java / Math videos. Prints a precision@k report when run with -s.
"""
import time

from app.engine import Interaction, RecommendationEngine, Video

NOW = time.time()

VIDEOS = [
    Video("py1", "Python Basics", "Learn Python variables and loops", "python coding", "CS", "10", NOW - 86400 * 5, popularity=20),
    Video("py2", "Python Functions", "Deep dive into Python functions and scope", "python coding", "CS", "10", NOW - 86400 * 4, popularity=15),
    Video("py3", "Python Data Structures", "Lists, dicts and sets in Python", "python coding", "CS", "10", NOW - 86400 * 3, popularity=10),
    Video("java1", "Java OOP", "Object oriented programming in Java", "java coding", "CS", "10", NOW - 86400 * 6, popularity=18),
    Video("java2", "Java Collections", "Using the Java collections framework", "java coding", "CS", "10", NOW - 86400 * 2, popularity=12),
    Video("math1", "Algebra Basics", "Solving linear equations", "math algebra", "Mathematics", "10", NOW - 86400 * 10, popularity=25),
    Video("math2", "Geometry Intro", "Angles, triangles and shapes", "math geometry", "Mathematics", "10", NOW - 86400 * 9, popularity=8),
]

PYTHON_IDS = {"py1", "py2", "py3"}
JAVA_IDS = {"java1", "java2"}
MATH_IDS = {"math1", "math2"}


def precision_at_k(recommended_ids: list[str], relevant_ids: set[str], k: int) -> float:
    top_k = recommended_ids[:k]
    if not top_k:
        return 0.0
    hits = sum(1 for r in top_k if r in relevant_ids)
    return hits / len(top_k)


def test_watch_history_ranks_same_topic_above_unrelated():
    interactions = [
        Interaction("alice", "py1", watched_percent=95, timestamp=NOW - 3600),
        Interaction("alice", "py2", watched_percent=80, timestamp=NOW - 7200),
    ]
    engine = RecommendationEngine(VIDEOS)
    recs = engine.recommend("alice", grade="10", subject="CS", interactions=interactions, top_n=len(VIDEOS))
    rec_ids = [r["videoId"] for r in recs]

    p_at_3 = precision_at_k(rec_ids, PYTHON_IDS | JAVA_IDS, 3)
    print(f"\nprecision@3 (CS-relevant) for alice (Python history): {p_at_3:.2f}")
    print("ranking:", rec_ids)

    # py3 (unwatched Python video) must rank above the unrelated math videos.
    assert rec_ids.index("py3") < rec_ids.index("math1")
    assert rec_ids.index("py3") < rec_ids.index("math2")


def test_completed_videos_are_excluded():
    interactions = [
        Interaction("bob", "py1", watched_percent=100, timestamp=NOW - 3600),
    ]
    engine = RecommendationEngine(VIDEOS)
    recs = engine.recommend("bob", grade="10", subject="CS", interactions=interactions, top_n=10)
    rec_ids = [r["videoId"] for r in recs]
    assert "py1" not in rec_ids


def test_cold_start_uses_grade_subject_then_popularity():
    engine = RecommendationEngine(VIDEOS)
    recs = engine.recommend(None, grade="10", subject="Mathematics", interactions=[], top_n=5)
    rec_ids = [r["videoId"] for r in recs]
    print("\ncold-start ranking (Mathematics):", rec_ids)
    # Math videos should dominate the top results for a Mathematics cold-start request.
    assert rec_ids[0] in MATH_IDS


def test_scores_are_descending_and_deterministic():
    interactions = [Interaction("carol", "java1", watched_percent=70, timestamp=NOW - 1000)]
    engine = RecommendationEngine(VIDEOS)
    recs1 = engine.recommend("carol", grade="10", subject="CS", interactions=interactions, top_n=5)
    recs2 = engine.recommend("carol", grade="10", subject="CS", interactions=interactions, top_n=5)

    scores = [r["score"] for r in recs1]
    assert scores == sorted(scores, reverse=True)
    assert [r["videoId"] for r in recs1] == [r["videoId"] for r in recs2]


def test_precision_report_across_users():
    cases = [
        ("alice", [Interaction("alice", "py1", watched_percent=90, timestamp=NOW - 3600)], PYTHON_IDS),
        ("dave", [Interaction("dave", "java1", watched_percent=60, timestamp=NOW - 3600)], JAVA_IDS),
        ("erin", [Interaction("erin", "math1", watched_percent=60, timestamp=NOW - 3600)], MATH_IDS),
    ]
    engine = RecommendationEngine(VIDEOS)
    print("\nPrecision@3 report:")
    total = 0.0
    for student_id, interactions, relevant in cases:
        recs = engine.recommend(student_id, grade="10", subject=None, interactions=interactions, top_n=5)
        rec_ids = [r["videoId"] for r in recs]
        p3 = precision_at_k(rec_ids, relevant, 3)
        total += p3
        print(f"  {student_id}: precision@3={p3:.2f} ranking={rec_ids}")
        assert p3 >= 0.5  # majority of top-3 must match the watched subject
    print(f"  mean precision@3 = {total/len(cases):.2f}")
