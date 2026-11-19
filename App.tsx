import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus/400Regular';
import {
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, BackHandler, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DEFAULT_SETTINGS,
  Settings,
  Track,
  download,
  formatMB,
  isDownloaded,
  loadBookmarks,
  loadProgress,
  loadSettings,
  loadTracks,
  removeDownload,
  saveBookmarks,
  saveProgress,
  saveSettings,
  sourceFor,
} from './src/library';
import { ListScreen } from './src/screens/ListScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SleepSheet } from './src/screens/SleepSheet';
import { SURAHS, surahInfo } from './src/surahs';
import { DARK, LIGHT } from './src/theme';
import { AppCtx, Sleep, SurahGroup } from './src/types';

const SKIP_SECONDS = 10;
const FADE_SECONDS = 10;

export default function App() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Marcellus_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  return (
    <SafeAreaProvider>
      {fontsLoaded ? (
        <Main />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#0B2F23', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={LIGHT.gold} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

function Main() {
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const scheme = useColorScheme();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const [, refresh] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<'list' | 'player'>('list');
  const [sheet, setSheet] = useState(false);
  const [sleep, setSleepState] = useState<Sleep>({ kind: 'off' });
  const [sleepLeft, setSleepLeft] = useState(0);
  const [repeat, setRepeat] = useState(false);

  const pendingSeek = useRef<number | null>(null);
  const lastSaved = useRef(0);
  const askedNotif = useRef(false);
  const speedRef = useRef(1);
  speedRef.current = settings.speed;

  const dark = settings.theme === 'system' ? scheme === 'dark' : settings.theme === 'dark';
  const t = dark ? DARK : LIGHT;
  const track = index != null ? tracks[index] : null;

  // ---- tracks grouped by surah ----
  const groups = useMemo<SurahGroup[]>(() => {
    const by: Record<number, SurahGroup> = {};
    tracks.forEach((tr, i) => {
      (by[tr.surah] ??= { info: surahInfo(tr.surah), parts: [] }).parts.push({ track: tr, i });
    });
    return SURAHS.map((s) => by[s.n]).filter(Boolean);
  }, [tracks]);

  const partsPerSurah = useMemo(() => {
    const m: Record<number, number> = {};
    tracks.forEach((tr) => (m[tr.surah] = (m[tr.surah] ?? 0) + 1));
    return m;
  }, [tracks]);

  const label = useCallback(
    (tr: Track) => `${surahInfo(tr.surah).name}${partsPerSurah[tr.surah] > 1 ? ` · Part ${tr.part}` : ''}`,
    [partsPerSurah],
  );
  const ayahText = (tr: Track) => tr.ayahs.replace(/(\d)\s*-\s*(\d)/, '$1–$2');

  const applySpeed = useCallback(() => {
    try {
      player.shouldCorrectPitch = true;
      player.setPlaybackRate(speedRef.current);
    } catch {}
  }, [player]);

  // ---- load a track (optionally start at a position / autoplay) ----
  const loadTrack = useCallback(
    (list: Track[], i: number, startAt = 0, autoplay = true) => {
      const tr = list[i];
      if (!tr) return;
      setIndex(i);
      pendingSeek.current = startAt > 1 ? startAt : null;
      lastSaved.current = Date.now();
      player.replace(sourceFor(tr));
      player.volume = 1;
      applySpeed();
      player.setActiveForLockScreen(
        true,
        { title: label(tr), artist: 'Mishary Alafasy · Urdu', albumTitle: 'Quran Safar' },
        {
          showSeekBackward: true,
          showSeekForward: true,
          seekBackwardIntervalSeconds: SKIP_SECONDS,
          seekForwardIntervalSeconds: SKIP_SECONDS,
        },
      );
      if (autoplay) player.play();
      saveProgress(tr.id, startAt);
    },
    [player, label, applySpeed],
  );

  // ---- startup: audio mode, saved settings, track list, last position ----
  useEffect(() => {
    (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
      const [s, b] = await Promise.all([loadSettings(), loadBookmarks()]);
      setSettings(s);
      speedRef.current = s.speed;
      setBookmarks(b);
      try {
        const list = await loadTracks();
        setTracks(list);
        const p = await loadProgress();
        const i = p ? list.findIndex((x) => x.id === p.trackId) : -1;
        if (p && i >= 0) loadTrack(list, i, p.position, false); // ready to continue; one tap on Play
      } catch {
        setError('Could not load the surah list. Connect to the internet once and try again.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- once loaded, jump to the saved position and re-apply the speed ----
  useEffect(() => {
    if (!status.isLoaded) return;
    applySpeed();
    if (pendingSeek.current != null) {
      const to = pendingSeek.current;
      pendingSeek.current = null;
      player.seekTo(to);
    }
  }, [status.isLoaded, player, applySpeed]);

  // ---- save the position every 5 s while playing, and on pause ----
  useEffect(() => {
    if (!track || pendingSeek.current != null || !status.isLoaded) return;
    const now = Date.now();
    if (!status.playing || now - lastSaved.current > 5000) {
      lastSaved.current = now;
      saveProgress(track.id, status.currentTime);
    }
  }, [status.currentTime, status.playing, status.isLoaded, track]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active' && track && status.isLoaded && pendingSeek.current == null)
        saveProgress(track.id, player.currentTime);
    });
    return () => sub.remove();
  }, [track, player, status.isLoaded]);

  // ---- when a part ends: repeat it, stop for the sleep timer, or continue ----
  useEffect(() => {
    if (!status.didJustFinish || index == null) return;
    if (repeat) {
      player.seekTo(0);
      player.play();
    } else if (sleep.kind === 'end') {
      setSleepState({ kind: 'off' });
      if (index + 1 < tracks.length) loadTrack(tracks, index + 1, 0, false);
      else saveProgress(tracks[index].id, 0);
    } else if (index + 1 < tracks.length) loadTrack(tracks, index + 1, 0, true);
    else saveProgress(tracks[index].id, 0);
  }, [status.didJustFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- sleep timer: count down, fade out over the last 10 s, then pause ----
  useEffect(() => {
    if (sleep.kind !== 'minutes') return;
    const tick = () => {
      const left = Math.max(0, (sleep.endsAt - Date.now()) / 1000);
      setSleepLeft(left);
      if (left <= 0) {
        player.pause();
        player.volume = 1;
        setSleepState({ kind: 'off' });
      } else if (left <= FADE_SECONDS) {
        player.volume = left / FADE_SECONDS;
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sleep, player]);

  const setSleep = (choice: 'off' | 'end' | number) => {
    player.volume = 1;
    if (choice === 'off') setSleepState({ kind: 'off' });
    else if (choice === 'end') setSleepState({ kind: 'end' });
    else {
      setSleepLeft(choice * 60);
      setSleepState({ kind: 'minutes', minutes: choice, endsAt: Date.now() + choice * 60_000 });
    }
  };

  // ---- Android back button closes the sheet, then the player ----
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sheet) return setSheet(false), true;
      if (view === 'player') return setView('list'), true;
      return false;
    });
    return () => sub.remove();
  }, [sheet, view]);

  // ---- controls ----
  const ensureNotifPermission = () => {
    if (!askedNotif.current) {
      askedNotif.current = true;
      requestNotificationPermissionsAsync().catch(() => {});
    }
  };

  const playPause = () => {
    if (!track) return void (tracks.length && loadTrack(tracks, 0));
    ensureNotifPermission();
    status.playing ? player.pause() : player.play();
  };

  const skip = (delta: number) => {
    if (!track) return;
    const d = status.duration || Infinity;
    player.seekTo(Math.min(Math.max(0, status.currentTime + delta), d - 0.5));
  };

  const go = (delta: number) => {
    if (index == null) return;
    const n = index + delta;
    if (n >= 0 && n < tracks.length) loadTrack(tracks, n, 0, true);
  };

  const pick = (i: number) => {
    ensureNotifPermission();
    if (i === index) {
      if (!status.playing) player.play();
    } else loadTrack(tracks, i, 0, true);
    setView('player');
  };

  // ---- downloads ----
  const toggleDownload = async (tr: Track) => {
    if (downloading[tr.id]) return;
    if (isDownloaded(tr)) {
      Alert.alert('Remove download?', `${label(tr)} will stream from the internet again.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => (removeDownload(tr), refresh((x) => x + 1)) },
      ]);
      return;
    }
    setDownloading((d) => ({ ...d, [tr.id]: true }));
    try {
      await download(tr);
    } catch {
      Alert.alert('Download failed', 'Please check your internet connection and try again.');
    }
    setDownloading((d) => ({ ...d, [tr.id]: false }));
  };

  const downloadAll = () => {
    const todo = tracks.filter((x) => !isDownloaded(x));
    if (!todo.length) return Alert.alert('All surahs are already downloaded.');
    const size = formatMB(todo.reduce((s, x) => s + (x.bytes || 0), 0));
    Alert.alert('Download all for offline?', `${todo.length} files, about ${size}. Wi-Fi recommended.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Download',
        onPress: async () => {
          setBulk({ done: 0, total: todo.length });
          let failed = 0;
          for (let k = 0; k < todo.length; k++) {
            try {
              await download(todo[k]);
            } catch {
              failed++;
            }
            setBulk({ done: k + 1, total: todo.length });
          }
          setBulk(null);
          if (failed) Alert.alert(`${failed} files failed`, 'Tap the download button again to retry them.');
        },
      },
    ]);
  };

  // ---- bookmarks and settings ----
  const toggleBookmark = (id: string) =>
    setBookmarks((b) => {
      const next = b.includes(id) ? b.filter((x) => x !== id) : [...b, id];
      saveBookmarks(next);
      return next;
    });

  const updateSettings = (patch: Partial<Settings>) =>
    setSettings((s) => {
      const next = { ...s, ...patch };
      saveSettings(next);
      return next;
    });

  const setSpeed = (speed: number) => {
    speedRef.current = speed;
    updateSettings({ speed });
    applySpeed();
  };

  const app: AppCtx = {
    t,
    tracks,
    groups,
    index,
    track,
    playing: status.playing,
    currentTime: status.currentTime,
    duration: status.duration,
    buffering: status.isBuffering,
    label,
    partLabel: (tr) => `Part ${tr.part}`,
    ayahText,
    pick,
    playPause,
    skip,
    go,
    seek: (sec) => player.seekTo(sec),
    isDownloaded,
    downloading,
    toggleDownload,
    downloadAll,
    bulk,
    bookmarks,
    toggleBookmark,
    speed: settings.speed,
    setSpeed,
    toggleTheme: () => updateSettings({ theme: dark ? 'light' : 'dark' }),
    sleep,
    sleepLeft,
    setSleep,
    repeat,
    toggleRepeat: () => setRepeat((r) => !r),
    openPlayer: () => setView('player'),
    closePlayer: () => setView('list'),
    openSheet: () => setSheet(true),
    closeSheet: () => setSheet(false),
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={view === 'list' || dark ? 'light' : 'dark'} />
      {view === 'player' && track ? <PlayerScreen app={app} /> : <ListScreen app={app} error={error} />}
      <SleepSheet app={app} visible={sheet} />
    </View>
  );
}
