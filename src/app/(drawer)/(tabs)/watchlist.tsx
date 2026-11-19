import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "../../../context/AppContext";
import { getPosterUrl } from "../../../services/api";

export default function WatchlistScreen() {
  const { theme, watchlist, changeStatus, removeFromWatchlist } = useApp();
  const router = useRouter();

  const toWatchList = watchlist.filter((item) => item.status === "to_watch");

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={toWatchList}
        keyExtractor={(item) => `watch-${item.id}`}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() =>
              router.push({ pathname: "/movie/[id]", params: { id: item.id } })
            }
          >
            <Image
              source={{ uri: getPosterUrl(item.poster_path) }}
              style={styles.poster}
            />

            <View style={styles.info}>
              <Text
                style={[styles.title, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.meta, { color: theme.subtext }]}>
                ★ {item.vote_average?.toFixed(1)} •{" "}
                {item.release_date?.slice(0, 4) || "N/A"}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={[styles.watchBtn, { backgroundColor: theme.primary }]}
                  onPress={() => changeStatus(item.id, "watched")}
                >
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.btnText}>İzlədim</Text>
                </Pressable>

                <Pressable
                  style={[styles.deleteBtn, { borderColor: theme.danger }]}
                  onPress={() => removeFromWatchlist(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={theme.danger}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={50} color={theme.subtext} />
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              Watchlist siyahınız boşdur
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  poster: { width: 85, height: 120 },
  info: { flex: 1, padding: 12, justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 13, marginTop: 4 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  watchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: { fontSize: 16, marginTop: 10 },
});
