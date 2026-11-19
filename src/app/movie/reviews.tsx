import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useApp } from "../../context/AppContext";

export default function ReviewsScreen() {
  const { movieId, movieTitle } = useLocalSearchParams<{
    movieId: string;
    movieTitle: string;
  }>();
  const numericMovieId = Number(Array.isArray(movieId) ? movieId[0] : movieId);
  const titleText = Array.isArray(movieTitle)
    ? movieTitle[0]
    : movieTitle || "Film";

  const { theme, reviews, addReview, removeReview } = useApp();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const movieReviews = reviews.filter((r) => r.movieId === numericMovieId);

  const handleAdd = async () => {
    if (!comment.trim()) {
      Alert.alert("Xəta", "Zəhmət olmasa rəy mətnini yazın.");
      return;
    }
    await addReview(numericMovieId, titleText, rating, comment.trim());
    setComment("");
    setRating(5);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Rəyi sil", "Bu rəyi silmək istədiyinizə əminsiniz?", [
      { text: "Ləğv et", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => removeReview(id) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={movieReviews}
        keyExtractor={(item) => `rev-${item.id}`}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View
            style={[
              styles.formCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.movieName, { color: theme.text }]}>
              {titleText}
            </Text>
            <Text style={[styles.label, { color: theme.subtext }]}>
              Qiymətiniz (1–5 ulduz):
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={28}
                    color="#F59E0B"
                  />
                </Pressable>
              ))}
            </View>

            <TextInput
              placeholder="Film haqqında fikrinizi yazın..."
              placeholderTextColor={theme.subtext}
              value={comment}
              onChangeText={setComment}
              multiline
              style={[
                styles.input,
                {
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />

            <Pressable
              style={[styles.submitBtn, { backgroundColor: theme.primary }]}
              onPress={handleAdd}
            >
              <Text style={styles.submitText}>Rəy əlavə et</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.reviewCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.reviewHeader}>
              <View>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {item.userName}
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 12 }}>
                  {item.createdAt}
                </Text>
              </View>

              <View style={styles.starsSmall}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= item.rating ? "star" : "star-outline"}
                    size={15}
                    color="#F59E0B"
                  />
                ))}
              </View>
            </View>

            <Text style={[styles.comment, { color: theme.text }]}>
              {item.comment}
            </Text>

            <View style={styles.cardActions}>
              <Pressable
                style={styles.iconAction}
                onPress={() =>
                  router.push({
                    pathname: "/movie/edit-review",
                    params: {
                      reviewId: item.id,
                      initialRating: item.rating,
                      initialComment: item.comment,
                    },
                  })
                }
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={theme.primary}
                />
                <Text
                  style={{
                    color: theme.primary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Redaktə et
                </Text>
              </Pressable>

              <Pressable
                style={styles.iconAction}
                onPress={() => confirmDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color={theme.danger} />
                <Text
                  style={{
                    color: theme.danger,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Sil
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{ color: theme.subtext, textAlign: "center", marginTop: 24 }}
          >
            Bu filmə hələ rəy yazılmayıb.
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  movieName: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 13, marginBottom: 8 },
  starsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  submitBtn: { paddingVertical: 13, borderRadius: 10, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  reviewCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: { fontSize: 15, fontWeight: "700" },
  starsSmall: { flexDirection: "row", gap: 2 },
  comment: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cardActions: { flexDirection: "row", gap: 16 },
  iconAction: { flexDirection: "row", alignItems: "center", gap: 4 },
});
