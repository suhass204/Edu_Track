# backend/python/video_recommendation.py
import os
from dotenv import load_dotenv
import sys
import json
import pymongo
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

def recommend_videos(grade, subject):
    mongo_uri = os.getenv("MONGO_URI")
    client = pymongo.MongoClient(mongo_uri)
    db = client["test"]
    videos = list(db.videos.find({"grade": grade, "subject": subject}))

    if not videos:
        return []

    # Create text corpus for TF-IDF
    corpus = [
        (
            str(v["_id"]),
            f"{v['title']} {v.get('description', '')} {v.get('subject', '')}"
        )
        for v in videos
    ]

    ids, text_data = zip(*corpus)
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(text_data)

    # Compute similarity with the selected subject
    subject_vector = tfidf.transform([subject])
    similarity_scores = cosine_similarity(subject_vector, tfidf_matrix).flatten()

    # Sort by similarity
    recommendations = sorted(
        zip(ids, similarity_scores), key=lambda x: x[1], reverse=True
    )

    # Top 5 videos
    top_videos = [r[0] for r in recommendations[:5]]
    return top_videos


if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    grade = data.get("grade")
    subject = data.get("subject")

    recommendations = recommend_videos(grade, subject)
    print(json.dumps({"recommendations": recommendations}))
