from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
cv = CountVectorizer(max_features = 5000,stop_words = "english")
movies = pickle.load(open("movie.pkl", "rb"))
vectors = cv.fit_transform(movies['tags']).toarray()
similarity = cosine_similarity(vectors)
pickle.dump(similarity,open('similarity.pkl','wb'))
print("Similarity matrix generated successfully!")
