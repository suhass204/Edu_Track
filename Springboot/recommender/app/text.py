"""Lightweight text preprocessing: lowercase, tokenize, stopword removal, light suffix stemming.

Deliberately dependency-free (no nltk) so the free-tier Render instance starts fast.
"""
import re

_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "is", "are", "was", "were", "be", "been",
    "being", "to", "of", "in", "on", "at", "by", "for", "with", "about", "as", "into",
    "like", "through", "after", "before", "between", "out", "against", "during", "without",
    "this", "that", "these", "those", "it", "its", "you", "your", "we", "our", "i", "me",
    "they", "them", "their", "he", "she", "his", "her", "will", "would", "can", "could",
    "should", "do", "does", "did", "not", "no", "so", "than", "then", "there", "here",
    "what", "which", "who", "whom", "how", "why", "when", "where", "all", "each", "more",
    "most", "some", "such", "only", "own", "same", "very", "just", "also",
}

_SUFFIXES = ("ing", "edly", "ies", "ied", "es", "ed", "ly", "s")


def _stem(word: str) -> str:
    for suf in _SUFFIXES:
        if word.endswith(suf) and len(word) - len(suf) >= 3:
            return word[: -len(suf)]
    return word


def tokenize(text: str) -> list[str]:
    if not text:
        return []
    words = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return [_stem(w) for w in words if w not in _STOPWORDS and len(w) > 1]


def preprocess(text: str) -> str:
    return " ".join(tokenize(text))
