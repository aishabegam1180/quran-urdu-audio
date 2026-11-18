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

/** Loads the track list from the internet, falling back to the last saved copy (offline). */
export async function loadTracks(): Promise<Track[]> {
  try {
    const res = await fetch(AUDIO_BASE + 'manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tracks: Track[] = data.tracks;
    await AsyncStorage.setItem(KEY_MANIFEST, JSON.stringify(tracks));
    return tracks;
  } catch (err) {
    const cached = await AsyncStorage.getItem(KEY_MANIFEST);
    if (cached) return JSON.parse(cached);
    throw err;
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
