import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function NotFoundScreen() {
  const { theme } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Səhifə tapılmadı (404)
      </Text>
      <Link
        href="/(drawer)/(tabs)"
        style={[styles.link, { color: theme.primary }]}
      >
        Əsas səhifəyə qayıt
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  link: { fontSize: 16, fontWeight: "600" },
});
