import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "../../../context/AppContext";

export default function ProfileScreen() {
  const { theme, user, stats, reviews, updateAvatar, logout } = useApp();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "İcazə verilmədi",
        "Profil şəkli seçmək üçün qalereya icazəsi lazımdır.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await updateAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Profil şəkli və məlumatlar */}
      <View style={styles.header}>
        <Pressable onPress={pickImage} style={styles.avatarWrapper}>
          {user?.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.card },
              ]}
            >
              <Ionicons name="person" size={44} color={theme.primary} />
            </View>
          )}
          <View
            style={[styles.cameraBadge, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </Pressable>

        <Text style={[styles.name, { color: theme.text }]}>
          {user?.name || "İstifadəçi"}
        </Text>
        <Text style={[styles.email, { color: theme.subtext }]}>
          {user?.email}
        </Text>
      </View>

      {/* Statistika kartları */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        İzləmə Statistikası
      </Text>
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="film-outline" size={24} color={theme.primary} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.totalWatched}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            İzlənilib
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="heart-outline" size={24} color={theme.primary} />
          <Text
            style={[styles.statValue, { color: theme.text }]}
            numberOfLines={1}
          >
            {stats.favoriteGenre}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Sevimli janr
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="star-outline" size={24} color="#F59E0B" />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.averageRating}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Orta reytinq
          </Text>
        </View>
      </View>

      {/* Rəy sayı məlumatı */}
      <View
        style={[
          styles.infoBox,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={{ color: theme.text, fontWeight: "600" }}>
          Yazılmış ümumi rəy sayı
        </Text>
        <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16 }}>
          {reviews.length}
        </Text>
      </View>

      {/* Çıxış düyməsi */}
      <Pressable
        style={[styles.logoutBtn, { borderColor: theme.danger }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.danger} />
        <Text style={{ color: theme.danger, fontWeight: "700", fontSize: 15 }}>
          Hesabdan çıx
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginBottom: 28 },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 22, fontWeight: "700" },
  email: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  statValue: { fontSize: 16, fontWeight: "800", textAlign: "center" },
  statLabel: { fontSize: 12 },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
