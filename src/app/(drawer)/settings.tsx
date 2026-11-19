import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { loadData, saveData } from '../../services/db';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadData<boolean>('notifications', false).then(setNotificationsEnabled);
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İcazə rədd edildi', 'Bildirişləri aktiv etmək üçün telefon ayarlarından icazə verin.');
        setNotificationsEnabled(false);
        await saveData('notifications', false);
        return;
      }
    }
    setNotificationsEnabled(value);
    await saveData('notifications', value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.left}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={theme.primary} />
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Qaranlıq Rejim (Dark Mode)</Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
              {isDark ? 'Aktivdir' : 'Açıq tema aktivdir'}
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.left}>
          <Ionicons name="notifications-outline" size={22} color={theme.primary} />
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Bildirişlər</Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
              Yeni filmlər haqqında xatırlatmalar
            </Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
});