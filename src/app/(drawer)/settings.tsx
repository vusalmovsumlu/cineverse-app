import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useApp } from "../../context/AppContext";
import { loadData, saveData } from "../../services/db";

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, lang, toggleLanguage, t } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadData<boolean>("notifications", false).then(setNotificationsEnabled);
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Enable notifications from device settings.",
        );
        setNotificationsEnabled(false);
        await saveData("notifications", false);
        return;
      }
    }
    setNotificationsEnabled(value);
    await saveData("notifications", value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      
      <View
        style={[
          styles.row,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.left}>
          <Ionicons name="language-outline" size={22} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t("languageTitle")}
            </Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
              {t("languageSub")}
            </Text>
          </View>
        </View>
        <Pressable
          style={[styles.langBtn, { backgroundColor: theme.primary }]}
          onPress={toggleLanguage}
        >
          <Text style={styles.langBtnText}>
            {lang === "az" ? "AZ 🇦🇿" : "EN 🇬🇧"}
          </Text>
        </Pressable>
      </View>

      
      <View
        style={[
          styles.row,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.left}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={22}
            color={theme.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t("darkMode")}
            </Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
              {isDark ? t("darkActive") : t("lightActive")}
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      
      <View
        style={[
          styles.row,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.left}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={theme.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t("notifications")}
            </Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
              {t("notificationsSub")}
            </Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  sub: { fontSize: 13, marginTop: 2 },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  langBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});
