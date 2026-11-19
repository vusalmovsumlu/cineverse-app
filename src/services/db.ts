import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { Movie, Review, User, WatchlistItem } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("cineverse.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        vote_average REAL,
        release_date TEXT,
        genre_ids TEXT,
        status TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieId INTEGER NOT NULL,
        movieTitle TEXT NOT NULL,
        userName TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }
};

export const getWatchlistDB = async (): Promise<WatchlistItem[]> => {
  if (!db) await initDatabase();
  return await db!.getAllAsync<WatchlistItem>("SELECT * FROM watchlist");
};

export const insertWatchlistDB = async (item: WatchlistItem) => {
  if (!db) await initDatabase();
  await db?.runAsync(
    "INSERT OR REPLACE INTO watchlist (id, title, poster_path, vote_average, release_date, genre_ids, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      item.id,
      item.title,
      item.poster_path,
      item.vote_average,
      item.release_date,
      item.genre_ids,
      item.status,
    ],
  );
};

export const updateWatchStatusDB = async (
  id: number,
  status: "to_watch" | "watched",
) => {
  if (!db) await initDatabase();
  await db?.runAsync("UPDATE watchlist SET status = ? WHERE id = ?", [
    status,
    id,
  ]);
};

export const deleteWatchlistDB = async (id: number) => {
  if (!db) await initDatabase();
  await db?.runAsync("DELETE FROM watchlist WHERE id = ?", [id]);
};

export const getReviewsDB = async (): Promise<Review[]> => {
  if (!db) await initDatabase();
  return await db!.getAllAsync<Review>(
    "SELECT * FROM reviews ORDER BY id DESC",
  );
};

export const insertReviewDB = async (review: Omit<Review, "id">) => {
  if (!db) await initDatabase();
  await db?.runAsync(
    "INSERT INTO reviews (movieId, movieTitle, userName, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      review.movieId,
      review.movieTitle,
      review.userName,
      review.rating,
      review.comment,
      review.createdAt,
    ],
  );
};

export const updateReviewDB = async (
  id: number,
  rating: number,
  comment: string,
) => {
  if (!db) await initDatabase();
  await db?.runAsync(
    "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
    [rating, comment, id],
  );
};

export const deleteReviewDB = async (id: number) => {
  if (!db) await initDatabase();
  await db?.runAsync("DELETE FROM reviews WHERE id = ?", [id]);
};

export const saveToken = async (token: string) => {
  if (Platform.OS === "web") return AsyncStorage.setItem("token", token);
  await SecureStore.setItemAsync("token", token);
};

export const getToken = async () => {
  if (Platform.OS === "web") return AsyncStorage.getItem("token");
  return SecureStore.getItemAsync("token");
};

export const removeToken = async () => {
  if (Platform.OS === "web") return AsyncStorage.removeItem("token");
  await SecureStore.deleteItemAsync("token");
};

export const saveData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadData = async <T>(key: string, fallback: T): Promise<T> => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

export type { Movie, User };
