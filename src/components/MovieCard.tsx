import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { getPosterUrl } from '../services/api';
import { Movie } from '../types';

interface Props {
  movie: Movie;
  onPress: () => void;
  width?: number;
}

export const MovieCard = ({ movie, onPress, width = 155 }: Props) => {
  const { theme } = useApp();

  return (
    <Pressable style={[styles.card, { width, backgroundColor: theme.card }]} onPress={onPress}>
      <Image
        source={{ uri: getPosterUrl(movie.poster_path) }}
        style={[styles.poster, { height: width * 1.45 }]}
      />
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {movie.title}
        </Text>
        <View style={styles.row}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={[styles.sub, { color: theme.subtext }]}>
            {movie.vote_average?.toFixed(1) || '0.0'} • {movie.release_date?.slice(0, 4) || 'N/A'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  poster: { width: '100%' },
  body: { padding: 8 },
  title: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sub: { fontSize: 12 },
});