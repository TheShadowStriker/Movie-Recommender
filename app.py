import streamlit as st
import pickle

import requests
def fetch(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=fe2ce19291ccd229a7b9befe7f9091ce&language=en-US".format(movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data.get('poster_path')
    if poster_path:
        return "https://image.tmdb.org/t/p/w500/" + poster_path
    else:
        return "https://via.placeholder.com/500"
similarity = pickle.load(open('C:/Users/Lenovo/PycharmProjects/PythonProject/similarity.pkl', 'rb'))
def recommend(movie):
    movie_index = movies_list[movies_list['title'] == movie].index[0]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended_movies = []
    recommended_movies_poster = []
    for i in movie_list:
        movie_id = movies_list.iloc[i[0]].movie_id
        recommended_movies.append(movies_list.iloc[i[0]].title)
        recommended_movies_poster.append(fetch(movie_id))
    return recommended_movies,recommended_movies_poster
movies_list = pickle.load(open("C:/Users/Lenovo/PycharmProjects/PythonProject/movie.pkl", "rb"))
st.title("Movie Recommendation System")
option = st.selectbox("Movie Name", movies_list['title'])
if st.button("Predict"):
    names,poster = recommend(option)
    col1, col2, col3 ,col4 ,col5 = st.columns(5)
    with col1:
        st.header(names[0])
        st.image(poster[0])
    with col2:
        st.header(names[1])
        st.image(poster[1])
    with col3:
        st.header(names[2])
        st.image(poster[2])
    with col4:
        st.header(names[3])
        st.image(poster[3])
    with col5:
        st.header(names[4])
        st.image(poster[4])


