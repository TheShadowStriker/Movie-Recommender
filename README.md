# Reelgood Movie Recommender

A content-based movie recommender built from movie descriptions, genres, keywords, and cast. The original prototype uses Streamlit and scikit-learn; the Vercel deployment uses a React/Vite interface, a precomputed recommendation catalog, and a small serverless function for TMDB poster lookup.

## Run the Vercel app locally

```bash
npm install
python -m pip install -r requirements-build.txt
python scripts/build_catalog.py
npm run dev
```

The development server is available at `http://localhost:5173`. To show movie posters locally, set `TMDB_API_KEY` in your shell before starting Vite. The recommendation catalog is committed at `public/catalog.json`; rerun the Python generator after changing `movie.pkl`.

## Deploy on Vercel

1. Import `TheShadowStriker/Movie-Recommender` into Vercel.
2. Use the project root as the Root Directory, `npm run build` as the Build Command, and `dist` as the Output Directory.
3. Add `TMDB_API_KEY` to the Vercel project environment variables for Preview and Production, then redeploy.

The key is read only by `api/poster.js` and is never sent to the browser. Rotate the TMDB key that was previously committed in the public repository before deploying; removing it from source does not invalidate the exposed key.

## Recommendation data

`movie.pkl` contains 4,806 movie records. `scripts/build_catalog.py` applies the same 5,000-feature English-stop-word `CountVectorizer` and cosine similarity used by the prototype, then writes the five closest titles per movie to `public/catalog.json`. Vercel serves that catalog as a static asset, avoiding model startup and large dense similarity matrices in serverless functions.

## Legacy Streamlit prototype

The original Streamlit prototype is retained as `streamlit_app.py`. Run it locally after installing `requirements-legacy.txt` and generating `similarity.pkl`:

```bash
python -m pip install -r requirements-legacy.txt
python generate_similarity.py
streamlit run streamlit_app.py
```