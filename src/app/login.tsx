import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";

export default function LoginScreen() {
  const { theme, login, lang, t } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError(
        lang === "az"
          ? "Düzgün email ünvanı daxil edin."
          : "Please enter a valid email.",
      );
      return;
    }
    if (password.length < 6) {
      setError(
        lang === "az"
          ? "Şifrə ən azı 6 simvol olmalıdır."
          : "Password must be at least 6 characters.",
      );
      return;
    }

    setError("");
    await login(email);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <View style={styles.header}>
          <Ionicons name="film" size={48} color={theme.primary} />
          <Text style={[styles.logo, { color: theme.text }]}>CineVerse</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            {t("loginSubtitle")}
          </Text>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <TextInput
          placeholder={t("emailPlaceholder")}
          placeholderTextColor={theme.subtext}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />

        <TextInput
          placeholder={t("passwordPlaceholder")}
          placeholderTextColor={theme.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>{t("loginBtn")}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={{ color: theme.subtext }}>{t("noAccount")}</Text>
          <Link
            href="/register"
            style={{ color: theme.primary, fontWeight: "700" }}
          >
            {t("registerTitle")}
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 32 },
  logo: { fontSize: 30, fontWeight: "800", marginTop: 8 },
  subtitle: { fontSize: 15, marginTop: 4 },
  error: { marginBottom: 12, textAlign: "center", fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
});
