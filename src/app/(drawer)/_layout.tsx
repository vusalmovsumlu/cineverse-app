import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { useApp } from "../../context/AppContext";

export default function DrawerLayout() {
  const { theme, t } = useApp();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.card },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.subtext,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "CineVerse",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="film-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Drawer.Screen
        name="watched"
        options={{
          title: t("watchedMovies"),
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: t("settings"),
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Drawer>
  );
}
