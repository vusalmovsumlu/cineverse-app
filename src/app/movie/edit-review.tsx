import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useApp } from "../../context/AppContext";

export default function EditReviewScreen() {
  const { reviewId, initialRating, initialComment } = useLocalSearchParams<{
    reviewId: string;
    initialRating: string;
    initialComment: string;
  }>();

  const id = Number(Array.isArray(reviewId) ? reviewId[0] : reviewId);
  const startRating =
    Number(Array.isArray(initialRating) ? initialRating[0] : initialRating) ||
    5;
  const startComment = Array.isArray(initialComment)
    ? initialComment[0]
    : initialComment || "";

  const { theme, editReview } = useApp();
  const router = useRouter();

  const [rating, setRating] = useState(startRating);
  const [comment, setComment] = useState(startComment);

  const handleSave = async () => {
    if (!comment.trim()) {
      Alert.alert("Xəta", "Rəy mətni boş ola bilməz.");
      return;
    }
    await editReview(id, rating, comment.trim());
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.label, { color: theme.subtext }]}>
        Yeni qiymət (1–5 ulduz):
      </Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color="#F59E0B"
            />
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.subtext }]}>Rəy mətni:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      <Pressable
        style={[styles.saveBtn, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Yadda saxla</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  starsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 110,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 20,
  },
  saveBtn: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  saveText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
