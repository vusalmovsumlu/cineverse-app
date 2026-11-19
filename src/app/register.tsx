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

export default function RegisterScreen() {
  const { theme, register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (name.trim().length < 2) {
      setError("Ad ən azı 2 simvol olmalıdır.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Düzgün email ünvanı daxil edin.");
      return;
    }
    if (password.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }

    setError("");
    await register(name, email);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <View style={styles.header}>
          <Ionicons name="person-add" size={44} color={theme.primary} />
          <Text style={[styles.logo, { color: theme.text }]}>Qeydiyyat</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Yeni CineVerse hesabı yaradın
          </Text>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <TextInput
          placeholder="Adınız"
          placeholderTextColor={theme.subtext}
          value={name}
          onChangeText={setName}
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
          placeholder="Email"
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
          placeholder="Şifrə (min. 6 simvol)"
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
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Hesab yarat</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={{ color: theme.subtext }}>Artıq hesabınız var? </Text>
          <Link
            href="/login"
            style={{ color: theme.primary, fontWeight: "700" }}
          >
            Daxil ol
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { fontSize: 28, fontWeight: "800", marginTop: 8 },
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
