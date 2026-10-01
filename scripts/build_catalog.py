import json
import pickle
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import normalize

ROOT = Path(__file__).resolve().parents[1]

with (ROOT / "movie.pkl").open("rb") as movie_file:
    movies = pickle.load(movie_file)

vectorizer = CountVectorizer(max_features=5000, stop_words="english")
vectors = normalize(
    vectorizer.fit_transform(movies["tags"].fillna("").astype(str)),
    norm="l2",
    copy=False,
)
movie_count = len(movies)
catalog = []
batch_size = 128

for batch_start in range(0, movie_count, batch_size):
    batch_end = min(batch_start + batch_size, movie_count)
    score_batch = (vectors[batch_start:batch_end] @ vectors.T).toarray()

    for batch_offset, scores in enumerate(score_batch):
        position = batch_start + batch_offset
        scores[position] = -1
        best_indices = np.argsort(-scores, kind="stable")[:5]
        movie = movies.iloc[position]
        catalog.append(
            {
                "id": int(movie["movie_id"]),
                "title": str(movie["title"]),
                "recommendations": [
                    {
                        "id": int(movies.iloc[best_index]["movie_id"]),
                        "title": str(movies.iloc[best_index]["title"]),
                    }
                    for best_index in best_indices
                ],
            }
        )

output = ROOT / "public" / "catalog.json"
output.parent.mkdir(parents=True, exist_ok=True)
with output.open("w", encoding="utf-8") as catalog_file:
    json.dump(catalog, catalog_file, ensure_ascii=True, separators=(",", ":"))

print(f"Wrote recommendations for {movie_count} movies to {output}")