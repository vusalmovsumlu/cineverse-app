import axios from 'axios';
import { Language } from '../i18n';
import { Genre, Movie } from '../types';

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN || '';

let currentApiLang: 'az-AZ' | 'en-US' = 'az-AZ';

export const setApiLanguage = (lang: Language) => {
  currentApiLang = lang === 'az' ? 'az-AZ' : 'en-US';
};

const AZ_GENRES: Record<number, string> = {
  28: 'Döyüş',
  12: 'Macəra',
  16: 'Animasiya',
  35: 'Komediya',
  80: 'Cinayət',
  99: 'Sənədli',
  18: 'Dram',
  10751: 'Ailəvi',
  14: 'Fantastika',
  36: 'Tarixi',
  27: 'Qorxu',
  10402: 'Musiqili',
  9648: 'Detektiv',
  10749: 'Romantik',
  878: 'Elmi-fantastika',
  10770: 'TV Film',
  53: 'Triller',
  10752: 'Müharibə',
  37: 'Vestern',
};

const localizeGenres = (genres: Genre[]): Genre[] => {
  if (currentApiLang !== 'az-AZ') return genres;
  return genres.map((g) => ({
    id: g.id,
    name: AZ_GENRES[g.id] || g.name || 'Digər',
  }));
};

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

api.interceptors.request.use((config) => {
  if (TOKEN.startsWith('eyJ')) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
  } else {
    config.params = { ...config.params, api_key: TOKEN };
  }
  config.params = { language: currentApiLang, ...config.params };
  return config;
});

export const getPosterUrl = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/300x450?text=No+Poster';

export const fetchTrending = async (): Promise<Movie[]> => {
  const res = await api.get('/trending/movie/week');
  return res.data.results;
};

export const fetchPopular = async (page = 1): Promise<Movie[]> => {
  const res = await api.get('/movie/popular', { params: { page } });
  return res.data.results;
};

export const fetchTopRated = async (page = 1): Promise<Movie[]> => {
  const res = await api.get('/movie/top_rated', { params: { page } });
  return res.data.results;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const res = await api.get('/genre/movie/list', { params: { language: 'en-US' } });
  return localizeGenres(res.data.genres);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await api.get('/search/movie', { params: { query } });
  return res.data.results;
};

export const filterMovies = async (genreId?: number | null, minRating?: number): Promise<Movie[]> => {
  const params: any = { sort_by: 'popularity.desc' };
  if (genreId) params.with_genres = genreId;
  if (minRating) params['vote_average.gte'] = minRating;

  const res = await api.get('/discover/movie', { params });
  return res.data.results;
};

export const fetchMovieDetails = async (id: string | number) => {
  const [detailsRes, creditsRes, videosRes] = await Promise.all([
    api.get(`/movie/${id}`),
    api.get(`/movie/${id}/credits`),
    api.get(`/movie/${id}/videos`, { params: { language: 'en-US' } }),
  ]);

  const movie = detailsRes.data as Movie;

  if (!movie.overview && currentApiLang === 'az-AZ') {
    const enRes = await api.get(`/movie/${id}`, { params: { language: 'en-US' } });
    movie.overview = enRes.data.overview;
  }

  if (movie.genres) {
    movie.genres = localizeGenres(movie.genres);
  }

  const youtubeVideos = videosRes.data.results.filter((v: any) => v.site === 'YouTube');
  const trailer =
    youtubeVideos.find((v: any) => v.type === 'Trailer') ||
    youtubeVideos.find((v: any) => v.type === 'Teaser') ||
    youtubeVideos[0];

  return {
    movie,
    cast: creditsRes.data.cast.slice(0, 10) as {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[],
    trailerKey: trailer ? (trailer.key as string) : null,
  };
};