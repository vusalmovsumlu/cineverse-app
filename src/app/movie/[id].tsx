import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "../../context/AppContext";
import { fetchMovieDetails, getPosterUrl } from "../../services/api";
import { Movie } from "../../types";

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(Array.isArray(id) ? id[0] : id);

  const {
    theme,
    watchlist,
    reviews,
    addToWatchlist,
    changeStatus,
    removeFromWatchlist,
    saveRecentView,
    lang,
    t,
  } = useApp();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<
    {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[]
  >([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchMovieDetails(movieId);
      setMovie(data.movie);
      setCast(data.cast);
      setTrailerKey(data.trailerKey);
      await saveRecentView(data.movie);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) loadDetails();
  }, [movieId, lang]);

  const savedItem = watchlist.find((w) => w.id === movieId);
  const movieReviewsCount = reviews.filter((r) => r.movieId === movieId).length;

  const openTrailer = async () => {
    if (!trailerKey) {
      Alert.alert(
        lang === "az" ? "Məlumat" : "Info",
        lang === "az"
          ? "Bu film üçün trailer tapılmadı."
          : "No trailer available for this movie.",
      );
      return;
    }
    const url = `https://www.youtube.com/watch?v=${trailerKey}`;
    await Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text, marginBottom: 12 }}>
          {t("loadError")}
        </Text>
        <Pressable
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={loadDetails}
        >
          <Text style={styles.btnText}>{t("retry")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Image
        source={{ uri: getPosterUrl(movie.backdrop_path || movie.poster_path) }}
        style={styles.backdrop}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{movie.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={[styles.metaText, { color: theme.text }]}>
            {movie.vote_average?.toFixed(1)} / 10
          </Text>
          <Text style={{ color: theme.subtext }}>
            • {movie.release_date?.slice(0, 4) || "N/A"}
          </Text>
          {movie.runtime ? (
            <Text style={{ color: theme.subtext }}>
              • {movie.runtime} {t("minutes")}
            </Text>
          ) : null}
        </View>

        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genreRow}>
            {movie.genres.map((g) => (
              <View
                key={g.id}
                style={[
                  styles.genreBadge,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={{ color: theme.subtext, fontSize: 12 }}>
                  {g.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionRow}>
          {!savedItem ? (
            <Pressable
              style={[styles.btn, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={() => addToWatchlist(movie, "to_watch")}
            >
              <Ionicons name="bookmark-outline" size={18} color="#FFF" />
              <Text style={styles.btnText}>{t("addToWatchlist")}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.btn,
                {
                  backgroundColor:
                    savedItem.status === "watched" ? "#10B981" : theme.card,
                  borderColor: theme.primary,
                  borderWidth: 1,
                  flex: 1,
                },
              ]}
              onPress={() =>
                changeStatus(
                  movie.id,
                  savedItem.status === "to_watch" ? "watched" : "to_watch",
                )
              }
            >
              <Ionicons
                name={
                  savedItem.status === "watched"
                    ? "checkmark-circle"
                    : "time-outline"
                }
                size={18}
                color={savedItem.status === "watched" ? "#FFF" : theme.primary}
              />
              <Text
                style={[
                  styles.btnText,
                  {
                    color:
                      savedItem.status === "watched" ? "#FFF" : theme.primary,
                  },
                ]}
              >
                {savedItem.status === "watched"
                  ? t("watchedStatus")
                  : t("inWatchlist")}
              </Text>
            </Pressable>
          )}

          {savedItem && (
            <Pressable
              style={[styles.iconBtn, { borderColor: theme.danger }]}
              onPress={() => removeFromWatchlist(movie.id)}
            >
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </Pressable>
          )}

          <Pressable
            style={[styles.btn, { backgroundColor: "#EF4444" }]}
            onPress={openTrailer}
          >
            <Ionicons name="logo-youtube" size={18} color="#FFF" />
            <Text style={styles.btnText}>Trailer</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("overview")}
        </Text>
        <Text style={[styles.overview, { color: theme.subtext }]}>
          {movie.overview || t("noOverview")}
        </Text>

        {cast.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t("cast")}
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={cast}
              keyExtractor={(item) => `cast-${item.id}`}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <View style={styles.castCard}>
                  <Image
                    source={{ uri: getPosterUrl(item.profile_path) }}
                    style={styles.castImg}
                  />
                  <Text
                    style={[styles.castName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.castRole, { color: theme.subtext }]}
                    numberOfLines={1}
                  >
                    {item.character}
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <Pressable
          style={[
            styles.reviewNavBtn,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() =>
            router.push({
              pathname: "/movie/reviews",
              params: { movieId: movie.id, movieTitle: movie.title },
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.reviewNavText, { color: theme.text }]}>
              {t("reviewsAndRating")} ({movieReviewsCount})
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backdrop: { width: "100%", height: 220 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  metaText: { fontSize: 14, fontWeight: "700" },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  iconBtn: { padding: 11, borderRadius: 10, borderWidth: 1 },
  btnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  overview: { fontSize: 14, lineHeight: 22 },
  castCard: { width: 90, alignItems: "center" },
  castImg: { width: 70, height: 70, borderRadius: 35, marginBottom: 6 },
  castName: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  castRole: { fontSize: 11, textAlign: "center" },
  reviewNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    marginBottom: 20,
  },
  reviewNavText: { fontSize: 15, fontWeight: "700" },
});
