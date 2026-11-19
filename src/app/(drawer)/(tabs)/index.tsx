import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MovieCard } from "../../../components/MovieCard";
import { useApp } from "../../../context/AppContext";
import {
  fetchPopular,
  fetchTopRated,
  fetchTrending,
} from "../../../services/api";
import { loadData, saveData } from "../../../services/db";
import { Movie } from "../../../types";

const CARD_WIDTH = (Dimensions.get("window").width - 44) / 2;

export default function HomeScreen() {
  const { theme, recentViews } = useApp();
  const router = useRouter();

  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const openMovie = (id: number) => {
    router.push({ pathname: "/movie/[id]", params: { id } });
  };

  const loadMovies = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(false);
      setIsOffline(false);

      const [trendData, topData, popData] = await Promise.all([
        fetchTrending(),
        fetchTopRated(1),
        fetchPopular(1),
      ]);

      setTrending(trendData);
      setTopRated(topData);
      setPopular(popData);
      setPage(1);

      // Offline rejim üçün son filmləri yaddaşda saxlayırıq
      await saveData("cachedMovies", popData);
    } catch {
      const cached = await loadData<Movie[]>("cachedMovies", []);
      if (cached.length > 0) {
        setPopular(cached);
        setIsOffline(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMovies(true);
  };

  const loadMorePopular = async () => {
    if (loadingMore || isOffline) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const more = await fetchPopular(nextPage);
      setPopular((prev) => [...prev, ...more]);
      setPage(nextPage);
    } catch {
      // Səhifələmə xətası olduqda səssiz keçir
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={theme.danger} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          Filmləri yükləmək mümkün olmadı
        </Text>
        <Pressable
          style={[styles.retryBtn, { backgroundColor: theme.primary }]}
          onPress={() => loadMovies()}
        >
          <Text style={styles.retryText}>Yenidən yoxla</Text>
        </Pressable>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.card }]}>
          <Ionicons name="wifi-outline" size={16} color={theme.primary} />
          <Text style={{ color: theme.subtext, fontSize: 13 }}>
            İnternet yoxdur. Keşlənmiş filmlər göstərilir.
          </Text>
        </View>
      )}

      {trending.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Trending
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={trending}
            keyExtractor={(item) => `trend-${item.id}`}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={145}
                onPress={() => openMovie(item.id)}
              />
            )}
          />
        </View>
      )}

      {topRated.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Top Rated
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topRated}
            keyExtractor={(item) => `top-${item.id}`}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={145}
                onPress={() => openMovie(item.id)}
              />
            )}
          />
        </View>
      )}

      {recentViews.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Son baxılanlar
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentViews}
            keyExtractor={(item) => `recent-${item.id}`}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={130}
                onPress={() => openMovie(item.id)}
              />
            )}
          />
        </View>
      )}

      <Text
        style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}
      >
        Popular Movies
      </Text>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={popular}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      keyExtractor={(item, index) => `pop-${item.id}-${index}`}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          width={CARD_WIDTH}
          onPress={() => openMovie(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
        />
      }
      onEndReached={loadMorePopular}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            style={{ marginVertical: 16 }}
            color={theme.primary}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: { fontSize: 16, marginTop: 12, marginBottom: 16 },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#FFFFFF", fontWeight: "600" },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 19, fontWeight: "700", marginBottom: 10 },
});
