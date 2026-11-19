export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
}

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: string; 
  status: 'to_watch' | 'watched';
}

export interface Review {
  id: number;
  movieId: number;
  movieTitle: string;
  userName: string;
  rating: number; 
  comment: string;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
  avatarUri?: string;
}