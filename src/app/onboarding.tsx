import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";

const SLIDES = [
  {
    icon: "film" as const,
    title: "Filmləri Kəşf Et",
    desc: "Ən son trend, populyar və yüksək reytinqli filmləri bir yerdə izlə.",
  },
  {
    icon: "bookmark" as const,
    title: "Şəxsi Watchlist Yarat",
    desc: "İzləmək istədiyin və bitirdiyin filmləri siyahına əlavə et.",
  },
  {
    icon: "star" as const,
    title: "Qiymətləndir və Rəy Yaz",
    desc: "Filmlərə 1-5 ulduz ver, fikirlərini bölüş və statistikanı gör.",
  },
];

export default function OnboardingScreen() {
  const { theme, finishOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    scaleAnim.setValue(0.5);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleNext = async () => {
    if (step < SLIDES.length - 1) {
      setStep(step + 1);
    } else {
      await finishOnboarding();
    }
  };

  const current = SLIDES[step];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Pressable onPress={finishOnboarding} style={styles.skipBtn}>
        <Text style={{ color: theme.subtext, fontSize: 15 }}>Keç</Text>
      </Pressable>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.card, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name={current.icon} size={64} color={theme.primary} />
        </Animated.View>

        <Text style={[styles.title, { color: theme.text }]}>
          {current.title}
        </Text>
        <Text style={[styles.desc, { color: theme.subtext }]}>
          {current.desc}
        </Text>

        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === step ? theme.primary : theme.border,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {step === SLIDES.length - 1 ? "Başla" : "Növbəti"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "space-between" },
  skipBtn: { alignSelf: "flex-end", padding: 8 },
  center: { alignItems: "center", paddingHorizontal: 12 },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  desc: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  dots: { flexDirection: "row", gap: 8, marginTop: 28 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  button: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
