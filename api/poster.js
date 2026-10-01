export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const movieId = request.query.movieId;
  const apiKey = process.env.TMDB_API_KEY;

  if (!/^\d+$/.test(String(movieId ?? ""))) {
    return response.status(400).json({ error: "A valid movieId is required" });
  }
  if (!apiKey) {
    return response.status(503).json({ error: "Movie posters are not configured" });
  }

  try {
    const detailsUrl = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
    detailsUrl.searchParams.set("api_key", apiKey);
    detailsUrl.searchParams.set("language", "en-US");

    const tmdbResponse = await fetch(detailsUrl);
    if (!tmdbResponse.ok) {
      return response.status(502).json({ error: "Could not retrieve movie poster" });
    }

    const details = await tmdbResponse.json();
    const url = details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : null;

    response.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return response.status(200).json({ url });
  } catch {
    return response.status(502).json({ error: "Could not retrieve movie poster" });
  }
}