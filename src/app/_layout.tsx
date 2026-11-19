import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider, useApp } from "../context/AppContext";

function RootNavigator() {
  const { user, isLoading, hasSeenOnboarding, isDark, theme, t } = useApp();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !rootNavigationState?.key) return;

    const current = segments[0];

    if (!hasSeenOnboarding && current !== "onboarding") {
      router.replace("/onboarding");
    } else if (
      hasSeenOnboarding &&
      !user &&
      current !== "login" &&
      current !== "register"
    ) {
      router.replace("/login");
    } else if (
      hasSeenOnboarding &&
      user &&
      (!current ||
        current === "login" ||
        current === "register" ||
        current === "onboarding")
    ) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [user, isLoading, hasSeenOnboarding, segments, rootNavigationState?.key]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie/[id]"
          options={{ title: t("movieDetails") }}
        />
        <Stack.Screen name="movie/reviews" options={{ title: t("reviews") }} />
        <Stack.Screen
          name="movie/edit-review"
          options={{ title: t("editReview") }}
        />
      </Stack>

      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0B0B13",
          }}
        >
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
