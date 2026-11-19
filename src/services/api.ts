import axios from "axios";
import { Genre, Movie } from "../types";

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN || "";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

api.interceptors.request.use((config) => {
  if (TOKEN.startsWith("eyJ")) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
  } else {
    config.params = { ...config.params, api_key: TOKEN };
  }
  return config;
});

export const getPosterUrl = (path?: string | null) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

export const fetchTrending = async (): Promise<Movie[]> => {
  const res = await api.get("/trending/movie/week");
  return res.data.results;
};

export const fetchPopular = async (page = 1): Promise<Movie[]> => {
  const res = await api.get("/movie/popular", { params: { page } });
  return res.data.results;
};

export const fetchTopRated = async (page = 1): Promise<Movie[]> => {
  const res = await api.get("/movie/top_rated", { params: { page } });
  return res.data.results;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const res = await api.get("/genre/movie/list");
  return res.data.genres;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await api.get("/search/movie", { params: { query } });
  return res.data.results;
};

export const filterMovies = async (
  genreId?: number | null,
  minRating?: number,
): Promise<Movie[]> => {
  const params: any = { sort_by: "popularity.desc" };
  if (genreId) params.with_genres = genreId;
  if (minRating) params["vote_average.gte"] = minRating;

  const res = await api.get("/discover/movie", { params });
  return res.data.results;
};

export const fetchMovieDetails = async (id: string | number) => {
  const [detailsRes, creditsRes, videosRes] = await Promise.all([
    api.get(`/movie/${id}`),
    api.get(`/movie/${id}/credits`),
    api.get(`/movie/${id}/videos`),
  ]);

  const trailer = videosRes.data.results.find(
    (v: any) =>
      v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );

  return {
    movie: detailsRes.data as Movie,
    cast: creditsRes.data.cast.slice(0, 10) as {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[],
    trailerKey: trailer ? (trailer.key as string) : null,
  };
};
