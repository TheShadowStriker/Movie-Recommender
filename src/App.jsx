import { useEffect, useState } from "react";

function Poster({ movie }) {
  const [posterUrl, setPosterUrl] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/poster?movieId=${encodeURIComponent(movie.id)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (active) setPosterUrl(result?.url ?? "");
      })
      .catch(() => {
        if (active) setPosterUrl("");
      });

    return () => {
      active = false;
    };
  }, [movie.id]);

  if (posterUrl) {
    return (
      <img
        className="movie-poster"
        src={posterUrl}
        alt={`Poster for ${movie.title}`}
        loading="lazy"
        onError={() => setPosterUrl("")}
      />
    );
  }

  return (
    <div className="poster-placeholder" aria-label={`No poster for ${movie.title}`}>
      <span>{movie.title}</span>
      <small>POSTER UNAVAILABLE</small>
    </div>
  );
}

function App() {
  const [catalog, setCatalog] = useState([]);
  const [catalogState, setCatalogState] = useState("loading");
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/catalog.json")
      .then((response) => {
        if (!response.ok) throw new Error("Catalog request failed");
        return response.json();
      })
      .then((movies) => {
        setCatalog(movies);
        setCatalogState("ready");
      })
      .catch(() => setCatalogState("error"));
  }, []);

  function findRecommendations(event) {
    event.preventDefault();
    const movie = catalog.find(
      (entry) => entry.title.toLocaleLowerCase() === query.trim().toLocaleLowerCase(),
    );

    if (!movie) {
      setRecommendations([]);
      setMessage("Choose a title from the movie list to get recommendations.");
      return;
    }

    setRecommendations(movie.recommendations);
    setMessage("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Reelgood home">
          <span className="wordmark-mark">R</span>
          <span>reelgood</span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          <span>THE MOVIE MATCHER</span>
        </div>
      </header>

      <section className="search-panel" aria-labelledby="page-title">
        <div className="search-copy">
          <p className="eyebrow">A GOOD FILM IS CLOSER THAN YOU THINK</p>
          <h1 id="page-title">Find your<br />next favorite.</h1>
          <p className="lede">
            Pick a movie you love. We&apos;ll find five more with a similar mix of story,
            genres, and cast.
          </p>
        </div>

        <form className="movie-search" onSubmit={findRecommendations}>
          <label htmlFor="movie-title">Start with a movie</label>
          <div className="search-row">
            <input
              id="movie-title"
              list="movie-catalog"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={catalogState === "loading" ? "Loading movies..." : "Search 4,806 films"}
              disabled={catalogState !== "ready"}
              autoComplete="off"
            />
            <datalist id="movie-catalog">
              {catalog.map((movie) => (
                <option key={movie.id} value={movie.title} />
              ))}
            </datalist>
            <button type="submit" disabled={catalogState !== "ready"}>
              Find matches <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
          <p className="search-hint">
            {catalogState === "error"
              ? "The movie catalog could not be loaded. Refresh to try again."
              : message || "Recommendations are based on plot, genres, keywords, and cast."}
          </p>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        <div className="results-heading">
          <div>
            <p className="eyebrow">YOUR NEXT DOUBLE FEATURE</p>
            <h2>{recommendations.length ? "Because you liked it" : "Ready when you are"}</h2>
          </div>
          {recommendations.length > 0 && (
            <span className="result-count">{recommendations.length} PICKS</span>
          )}
        </div>

        {recommendations.length > 0 ? (
          <div className="movie-grid">
            {recommendations.map((movie, index) => (
              <article className="movie-card" key={movie.id} style={{ "--order": index }}>
                <div className="poster-frame">
                  <span className="pick-number">0{index + 1}</span>
                  <Poster movie={movie} />
                </div>
                <div className="movie-title-row">
                  <h3>{movie.title}</h3>
                  <span aria-hidden="true">+</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-orbit" aria-hidden="true">R</span>
            <p>
              {catalogState === "loading"
                ? "Putting the collection together..."
                : "Your picks will land here. Choose a movie to get started."}
            </p>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>REELGOOD MOVIE MATCHER</span>
        <span>POSTERS PROVIDED BY TMDB</span>
      </footer>
    </main>
  );
}

export default App;