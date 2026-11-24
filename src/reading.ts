// What the reader remembers on the phone: where you stopped, ayah bookmarks, the
// translation view, and whether today's verse card was closed.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'reading.v1';

export type ReadMode = 'ar' | 'ur' | 'en' | 'all';

export type ReadState = {
  lastRead: { surah: number; ayah: number; at: number } | null;
  marks: string[]; // bookmarked ayahs, "2:255"
  mode: ReadMode;
  votdHidden: string; // day key ("2026-11-24") the card was closed on
};

export const DEFAULT_READ: ReadState = { lastRead: null, marks: [], mode: 'all', votdHidden: '' };

export async function loadReading(): Promise<ReadState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...DEFAULT_READ, ...JSON.parse(raw) } : DEFAULT_READ;
  } catch {
    return DEFAULT_READ;
  }
}

export function saveReading(s: ReadState) {
  return AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
}

export const ayahKey = (surah: number, ayah: number) => `${surah}:${ayah}`;
