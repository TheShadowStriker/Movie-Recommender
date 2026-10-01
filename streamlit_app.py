import os
import pickle
from pathlib import Path

import requests
import streamlit as st

ROOT = Path(__file__).resolve().parent
st.set_page_config(page_title="Movie Recommender", page_icon="🎬")


@st.cache_resource
def load_data():
    with (ROOT / "movie.pkl").open("rb") as movie_file:
        movies = pickle.load(movie_file)
    with (ROOT / "similarity.pkl").open("rb") as similarity_file:
        similarity = pickle.load(similarity_file)
    return movies, similarity


def fetch_poster(movie_id):
    api_key = os.getenv("TMDB_API_KEY")
    if not api_key:
        return None

    response = requests.get(
        f"https://api.themoviedb.org/3/movie/{movie_id}",
        params={"api_key": api_key, "language": "en-US"},
        timeout=10,
    )
    response.raise_for_status()
    poster_path = response.json().get("poster_path")
    if poster_path:
        return f"https://image.tmdb.org/t/p/w500/{poster_path}"
    return None


movies_list, similarity = load_data()
st.title("Movie Recommendation System")
option = st.selectbox("Movie name", movies_list["title"])

if st.button("Find recommendations"):
    movie_index = movies_list.index[movies_list["title"] == option][0]
    distances = similarity[movie_index]
    recommendations = sorted(
        enumerate(distances), key=lambda item: item[1], reverse=True
    )[1:6]
    columns = st.columns(5)
    for column, (index, _) in zip(columns, recommendations):
        movie = movies_list.iloc[index]
        with column:
            st.subheader(movie["title"])
            try:
                poster = fetch_poster(movie["movie_id"])
            except requests.RequestException:
                poster = None
            if poster:
                st.image(poster)