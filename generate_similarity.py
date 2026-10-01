import pickle
from pathlib import Path

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

root = Path(__file__).resolve().parent
with (root / "movie.pkl").open("rb") as movie_file:
	movies = pickle.load(movie_file)

vectorizer = CountVectorizer(max_features=5000, stop_words="english")
vectors = vectorizer.fit_transform(movies["tags"].fillna("")).toarray()
similarity = cosine_similarity(vectors)

with (root / "similarity.pkl").open("wb") as similarity_file:
	pickle.dump(similarity, similarity_file)

print("Similarity matrix generated successfully!")
