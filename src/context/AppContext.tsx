import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Language, TranslationKey, Translations } from "../i18n";
import { fetchGenres, setApiLanguage } from "../services/api";
import {
  deleteReviewDB,
  deleteWatchlistDB,
  getReviewsDB,
  getToken,
  getWatchlistDB,
  initDatabase,
  insertReviewDB,
  insertWatchlistDB,
  loadData,
  removeToken,
  saveData,
  saveToken,
  updateReviewDB,
  updateWatchStatusDB,
} from "../services/db";
import { Colors, ThemeType } from "../theme";
import { Genre, Movie, Review, User, WatchlistItem } from "../types";

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  isDark: boolean;
  lang: Language;
  theme: ThemeType;
  watchlist: WatchlistItem[];
  reviews: Review[];
  genres: Genre[];
  recentViews: Movie[];
  recentSearches: string[];
  stats: { totalWatched: number; favoriteGenre: string; averageRating: string };
  t: (key: TranslationKey) => string;
  toggleTheme: () => Promise<void>;
  toggleLanguage: () => Promise<void>;
  finishOnboarding: () => Promise<void>;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (uri: string) => Promise<void>;
  addToWatchlist: (
    movie: Movie,
    status?: "to_watch" | "watched",
  ) => Promise<void>;
  changeStatus: (id: number, status: "to_watch" | "watched") => Promise<void>;
  removeFromWatchlist: (id: number) => Promise<void>;
  addReview: (
    movieId: number,
    movieTitle: string,
    rating: number,
    comment: string,
  ) => Promise<void>;
  editReview: (id: number, rating: number, comment: string) => Promise<void>;
  removeReview: (id: number) => Promise<void>;
  saveRecentView: (movie: Movie) => Promise<void>;
  saveRecentSearch: (query: string) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Language>("az");

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [recentViews, setRecentViews] = useState<Movie[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const startApp = async () => {
      try {
        await initDatabase();

        const [
          token,
          savedUser,
          onboarded,
          savedDark,
          savedLang,
          dbWatchlist,
          dbReviews,
          views,
          searches,
        ] = await Promise.all([
          getToken(),
          loadData<User | null>("user", null),
          loadData<boolean>("onboarding", false),
          loadData<boolean>("isDark", true),
          loadData<Language>("lang", "az"),
          getWatchlistDB(),
          getReviewsDB(),
          loadData<Movie[]>("recentViews", []),
          loadData<string[]>("recentSearches", []),
        ]);

        if (token && savedUser) setUser(savedUser);
        setHasSeenOnboarding(onboarded);
        setIsDark(savedDark);
        setLang(savedLang);
        setApiLanguage(savedLang);
        setWatchlist(dbWatchlist);
        setReviews(dbReviews);
        setRecentViews(views);
        setRecentSearches(searches);

        fetchGenres()
          .then(setGenres)
          .catch(() => {});
      } finally {
        setIsLoading(false);
      }
    };

    startApp();
  }, []);

  const t = (key: TranslationKey): string => Translations[lang][key] || key;

  const toggleLanguage = async () => {
    const next: Language = lang === "az" ? "en" : "az";
    setLang(next);
    setApiLanguage(next);
    await saveData("lang", next);
    fetchGenres()
      .then(setGenres)
      .catch(() => {});
  };

  const stats = useMemo(() => {
    const watched = watchlist.filter((w) => w.status === "watched");
    const counts: Record<number, number> = {};

    watched.forEach((m) => {
      const ids: number[] = JSON.parse(m.genre_ids || "[]");
      ids.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });

    let topId = 0;
    let max = 0;
    Object.entries(counts).forEach(([id, count]) => {
      if (count > max) {
        max = count;
        topId = Number(id);
      }
    });

    const favoriteGenre =
      genres.find((g) => g.id === topId)?.name || Translations[lang].none;
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : "0.0";

    return { totalWatched: watched.length, favoriteGenre, averageRating };
  }, [watchlist, reviews, genres, lang]);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await saveData("isDark", next);
  };

  const finishOnboarding = async () => {
    setHasSeenOnboarding(true);
    await saveData("onboarding", true);
  };

  const register = async (name: string, email: string) => {
    const newUser: User = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    await saveData("user", newUser);
    await saveToken("token_" + Date.now());
    setUser(newUser);
  };

  const login = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const saved = await loadData<User | null>("user", null);
    const activeUser: User =
      saved && saved.email === cleanEmail
        ? saved
        : { name: cleanEmail.split("@")[0], email: cleanEmail };

    await saveData("user", activeUser);
    await saveToken("token_" + Date.now());
    setUser(activeUser);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  const updateAvatar = async (avatarUri: string) => {
    if (!user) return;
    const updated = { ...user, avatarUri };
    setUser(updated);
    await saveData("user", updated);
  };

  const addToWatchlist = async (
    movie: Movie,
    status: "to_watch" | "watched" = "to_watch",
  ) => {
    const item: WatchlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      genre_ids: JSON.stringify(
        movie.genre_ids || movie.genres?.map((g) => g.id) || [],
      ),
      status,
    };
    await insertWatchlistDB(item);
    setWatchlist(await getWatchlistDB());
  };

  const changeStatus = async (id: number, status: "to_watch" | "watched") => {
    await updateWatchStatusDB(id, status);
    setWatchlist(await getWatchlistDB());
  };

  const removeFromWatchlist = async (id: number) => {
    await deleteWatchlistDB(id);
    setWatchlist(await getWatchlistDB());
  };

  const addReview = async (
    movieId: number,
    movieTitle: string,
    rating: number,
    comment: string,
  ) => {
    await insertReviewDB({
      movieId,
      movieTitle,
      userName: user?.name || "User",
      rating,
      comment,
      createdAt: new Date().toLocaleDateString(),
    });
    setReviews(await getReviewsDB());
  };

  const editReview = async (id: number, rating: number, comment: string) => {
    await updateReviewDB(id, rating, comment);
    setReviews(await getReviewsDB());
  };

  const removeReview = async (id: number) => {
    await deleteReviewDB(id);
    setReviews(await getReviewsDB());
  };

  const saveRecentView = async (movie: Movie) => {
    const updated = [
      movie,
      ...recentViews.filter((m) => m.id !== movie.id),
    ].slice(0, 10);
    setRecentViews(updated);
    await saveData("recentViews", updated);
  };

  const saveRecentSearch = async (query: string) => {
    const q = query.trim();
    if (!q) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 6);
    setRecentSearches(updated);
    await saveData("recentSearches", updated);
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        hasSeenOnboarding,
        isDark,
        lang,
        theme,
        watchlist,
        reviews,
        genres,
        recentViews,
        recentSearches,
        stats,
        t,
        toggleTheme,
        toggleLanguage,
        finishOnboarding,
        login,
        register,
        logout,
        updateAvatar,
        addToWatchlist,
        changeStatus,
        removeFromWatchlist,
        addReview,
        editReview,
        removeReview,
        saveRecentView,
        saveRecentSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
