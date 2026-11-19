import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MovieCard } from "../../../components/MovieCard";
import { useApp } from "../../../context/AppContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { filterMovies, searchMovies } from "../../../services/api";
import { Movie } from "../../../types";

const CARD_WIDTH = (Dimensions.get("window").width - 44) / 2;
const RATINGS = [0, 6, 7, 8];

export default function SearchScreen() {
  const { theme, genres, recentSearches, saveRecentSearch, lang, t } = useApp();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      try {
        setLoading(true);
        if (debouncedQuery.trim()) {
          const data = await searchMovies(debouncedQuery.trim());
          const filtered = data.filter((m) => {
            const matchGenre = selectedGenre
              ? m.genre_ids?.includes(selectedGenre)
              : true;
            const matchRating =
              minRating > 0 ? m.vote_average >= minRating : true;
            return matchGenre && matchRating;
          });
          setResults(filtered);
          await saveRecentSearch(debouncedQuery.trim());
        } else {
          const data = await filterMovies(selectedGenre, minRating);
          setResults(data);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedQuery, selectedGenre, minRating, lang]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.searchBox,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={theme.subtext} />
        <TextInput
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={theme.subtext}
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { color: theme.text }]}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.subtext} />
          </Pressable>
        )}
      </View>

      {!query && recentSearches.length > 0 && (
        <View style={styles.chipWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContent}
          >
            {recentSearches.map((item) => (
              <Pressable
                key={item}
                onPress={() => setQuery(item)}
                style={[
                  styles.chip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Ionicons name="time-outline" size={14} color={theme.subtext} />
                <Text style={{ color: theme.subtext, fontSize: 13 }}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.chipWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContent}
        >
          <Pressable
            onPress={() => setSelectedGenre(null)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedGenre === null ? theme.primary : theme.card,
                borderColor:
                  selectedGenre === null ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={{
                color: selectedGenre === null ? "#FFF" : theme.text,
                fontSize: 13,
              }}
            >
              {t("allGenres")}
            </Text>
          </Pressable>

          {genres.map((g) => {
            const active = selectedGenre === g.id;
            return (
              <Pressable
                key={g.id}
                onPress={() => setSelectedGenre(active ? null : g.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.primary : theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={{ color: active ? "#FFF" : theme.text, fontSize: 13 }}
                >
                  {g.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.ratingRow}>
        <Text style={{ color: theme.subtext, fontSize: 13 }}>
          {t("minRating")}
        </Text>
        {RATINGS.map((r) => {
          const active = minRating === r;
          return (
            <Pressable
              key={r}
              onPress={() => setMinRating(r)}
              style={[
                styles.ratingChip,
                { backgroundColor: active ? theme.primary : theme.card },
              ]}
            >
              <Text
                style={{
                  color: active ? "#FFF" : theme.text,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {r === 0 ? t("all") : `${r}+ ★`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item) => `search-${item.id}`}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              width={CARD_WIDTH}
              onPress={() =>
                router.push({
                  pathname: "/movie/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={44} color={theme.subtext} />
              <Text style={{ color: theme.subtext, marginTop: 10 }}>
                {t("noMoviesFound")}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 15 },
  chipWrapper: { marginBottom: 12 },
  chipContent: { gap: 8, alignItems: "center" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  ratingChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
});
