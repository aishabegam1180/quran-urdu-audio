// Track list, saved progress and offline downloads. Everything is stored on
// the phone itself, so each person's phone keeps its own place.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

const REPO = 'aishabegam1180/quran-urdu-audio';
const AUDIO_BASE = `https://github.com/${REPO}/releases/download/audio/`;

export type Track = {
  id: string; // "001-01"
  surah: number;
  part: number;
  title: string; // "Sura Al-Fatiha"
  ayahs: string; // "Ayahs 1-7" (may be empty)
  file: string; // "001-01.mp3"
  bytes: number;
};

export type Progress = { trackId: string; position: number; savedAt: number };

const KEY_MANIFEST = 'manifest.v1';
const KEY_PROGRESS = 'progress.v1';

/** The surah list saved on the phone from last time (instant, works offline). */
export async function loadCachedTracks(): Promise<Track[] | null> {
  try {
    const cached = await AsyncStorage.getItem(KEY_MANIFEST);
    const list = cached ? (JSON.parse(cached) as Track[]) : null;
    return list && list.length ? list : null;
  } catch {
    return null;
  }
}

/** Fetches the latest surah list from the internet, giving up after `timeoutMs`, and saves it. */
export async function fetchTracks(timeoutMs: number): Promise<Track[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(AUDIO_BASE + 'manifest.json', { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tracks: Track[] = data.tracks;
    if (!Array.isArray(tracks) || !tracks.length) throw new Error('empty list');
    await AsyncStorage.setItem(KEY_MANIFEST, JSON.stringify(tracks));
    return tracks;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadProgress(): Promise<Progress | null> {
  const raw = await AsyncStorage.getItem(KEY_PROGRESS);
  return raw ? JSON.parse(raw) : null;
}

export async function saveProgress(trackId: string, position: number) {
  const p: Progress = { trackId, position: Math.max(0, position), savedAt: Date.now() };
  await AsyncStorage.setItem(KEY_PROGRESS, JSON.stringify(p));
}

// ---------- bookmarks, notes, favourites and settings ----------
const KEY_BOOKMARKS_OLD = 'bookmarks.v1'; // list of track ids (before bookmarks had a time)
const KEY_BOOKMARKS = 'bookmarks.v2';
const KEY_NOTES = 'notes.v1';
const KEY_DUA_FAVS = 'duaFavs.v1';
const KEY_SETTINGS = 'settings.v1';

export type ThemeChoice = 'system' | 'light' | 'dark';
export type Settings = { speed: number; theme: ThemeChoice; hijriOffset: number };
export const DEFAULT_SETTINGS: Settings = { speed: 1, theme: 'system', hijriOffset: 0 };

export type Bookmark = { trackId: string; position: number; savedAt: number };
export type Note = {
  id: string;
  text: string;
  trackId: string | null; // the part it is linked to, if any
  position: number; // seconds into that part
  createdAt: number;
  updatedAt: number;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Bookmarks with the exact time. Older bookmarks (ids only) are kept, starting at 0:00. */
export async function loadBookmarks(): Promise<Bookmark[]> {
  const v2 = await readJson<Bookmark[] | null>(KEY_BOOKMARKS, null);
  if (v2) return v2;
  const old = await readJson<string[]>(KEY_BOOKMARKS_OLD, []);
  return old.map((trackId) => ({ trackId, position: 0, savedAt: Date.now() }));
}

export async function saveBookmarks(list: Bookmark[]) {
  await AsyncStorage.setItem(KEY_BOOKMARKS, JSON.stringify(list));
}

export const loadNotes = () => readJson<Note[]>(KEY_NOTES, []);
export async function saveNotes(list: Note[]) {
  await AsyncStorage.setItem(KEY_NOTES, JSON.stringify(list));
}

export const loadDuaFavs = () => readJson<string[]>(KEY_DUA_FAVS, []);
export async function saveDuaFavs(ids: string[]) {
  await AsyncStorage.setItem(KEY_DUA_FAVS, JSON.stringify(ids));
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(s: Settings) {
  await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(s));
}

// ---------- offline downloads ----------
const audioDir = new Directory(Paths.document, 'audio');

function localFile(t: Track) {
  return new File(audioDir, t.file);
}

export function isDownloaded(t: Track) {
  try {
    return localFile(t).exists;
  } catch {
    return false;
  }
}

/** Plays from the phone if downloaded, otherwise streams from the internet. */
export function sourceFor(t: Track) {
  return isDownloaded(t) ? localFile(t).uri : AUDIO_BASE + t.file;
}

export async function download(t: Track) {
  if (!audioDir.exists) audioDir.create({ intermediates: true });
  const tmp = new File(audioDir, t.file + '.part');
  if (tmp.exists) tmp.delete();
  await File.downloadFileAsync(AUDIO_BASE + t.file, tmp);
  tmp.move(localFile(t)); // only becomes "downloaded" once complete
}

export function removeDownload(t: Track) {
  const f = localFile(t);
  if (f.exists) f.delete();
}

export function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? h + ':' : ''}${mm}:${String(s).padStart(2, '0')}`;
}

export function formatMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
