import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus/400Regular';
import { NotoNastaliqUrdu_400Regular } from '@expo-google-fonts/noto-nastaliq-urdu/400Regular';
import {
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, BackHandler, Share, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Bookmark,
  DEFAULT_SETTINGS,
  Note,
  Settings,
  Track,
  download,
  formatMB,
  isDownloaded as fileExists,
  loadBookmarks,
  loadDuaFavs,
  loadNotes,
  loadProgress,
  loadSettings,
  fetchTracks,
  loadCachedTracks,
  removeDownload,
  saveBookmarks,
  saveDuaFavs,
  saveNotes,
  saveProgress,
  saveSettings,
  sourceFor,
} from './src/library';
import { installCrashHandler, recordError, safe, takeLastCrash } from './src/crash';
import { ErrorBoundary } from './src/ErrorBoundary';
import { RECITERS } from './src/config';
import { arabicNumber } from './src/duas';
import { HIJRI_MONTHS, HIJRI_MONTHS_AR, toHijri } from './src/hijri';
import { AboutScreen } from './src/screens/AboutScreen';
import { DuasScreen } from './src/screens/DuasScreen';
import { FeedbackScreen } from './src/screens/FeedbackScreen';
import { ListScreen } from './src/screens/ListScreen';
import { MoreSheet } from './src/screens/MoreSheet';
import { NoteDraft, NoteEditor } from './src/screens/NoteEditor';
import { NotesScreen } from './src/screens/NotesScreen';
import { QiblaScreen } from './src/screens/QiblaScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SleepSheet } from './src/screens/SleepSheet';
import { SURAHS, surahInfo } from './src/surahs';
import { DARK, LIGHT } from './src/theme';
import { AppCtx, Sleep, SurahGroup, View as Screen } from './src/types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SKIP_SECONDS = 10;
const FADE_SECONDS = 10;

installCrashHandler();
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsDone, fontError] = useFonts({
    Amiri_400Regular,
    Marcellus_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    NotoNastaliqUrdu_400Regular,
  });
  // if a font ever fails to load, carry on with the phone's own font rather than waiting forever
  const fontsLoaded = fontsDone || !!fontError;
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);
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
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [screenKey, setScreenKey] = useState(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [duaFavs, setDuaFavs] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<Screen>('list');
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState(false);
  const [noteDraft, setNoteDraft] = useState<NoteDraft>(null);
  const [today, setToday] = useState(() => new Date());
  const [sleep, setSleepState] = useState<Sleep>({ kind: 'off' });
  const [sleepLeft, setSleepLeft] = useState(0);
  const [repeat, setRepeat] = useState(false);

  const pendingSeek = useRef<number | null>(null);
  const lastSaved = useRef(0);
  const askedNotif = useRef(false);
  const speedRef = useRef(1);
  const lockScreenOn = useRef(false);
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
    safe('speed', () => {
      player.shouldCorrectPitch = true;
      player.setPlaybackRate(speedRef.current);
    });
  }, [player]);

  // ---- load a track (optionally start at a position / autoplay) ----
  const loadTrack = useCallback(
    (list: Track[], i: number, startAt = 0, autoplay = true) => {
      const tr = list[i];
      if (!tr) return;
      setIndex(i);
      pendingSeek.current = startAt > 1 ? startAt : null;
      lastSaved.current = Date.now();
      safe('replace', () => player.replace(sourceFor(tr)));
      safe('volume', () => (player.volume = 1));
      applySpeed();
      const meta = { title: label(tr), artist: `${RECITERS} · Urdu`, albumTitle: 'Quran Safar' };
      // register lock-screen controls once; afterwards only change the title
      if (lockScreenOn.current) safe('lockscreen-update', () => player.updateLockScreenMetadata(meta));
      else
        lockScreenOn.current =
          safe('lockscreen', () => {
            player.setActiveForLockScreen(true, meta, {
              showSeekBackward: true,
              showSeekForward: true,
              seekBackwardIntervalSeconds: SKIP_SECONDS,
              seekForwardIntervalSeconds: SKIP_SECONDS,
            });
            return true;
          }) ?? false;
      if (autoplay) safe('play', () => player.play());
      saveProgress(tr.id, startAt).catch(() => {});
    },
    [player, label, applySpeed],
  );

  // ---- startup: show the saved surah list at once, refresh it quietly in the background ----
  const tracksRef = useRef<Track[]>([]);
  const indexRef = useRef<number | null>(null);
  tracksRef.current = tracks;
  indexRef.current = index;

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((e) => recordError('audio-mode', e));

    const showList = async (list: Track[]) => {
      setTracks(list);
      setError(null);
      setDownloaded(new Set(list.filter((x) => fileExists(x)).map((x) => x.id)));
      const p = await loadProgress();
      const i = p ? list.findIndex((x) => x.id === p.trackId) : -1;
      if (p && i >= 0) loadTrack(list, i, p.position, false); // ready to continue; one tap on Play
    };

    // a newer list from the internet: swap it in without disturbing what is playing
    const swapIn = (fresh: Track[]) => {
      const old = tracksRef.current;
      if (JSON.stringify(old) === JSON.stringify(fresh)) return;
      const curId = indexRef.current != null ? old[indexRef.current]?.id : undefined;
      setTracks(fresh);
      setDownloaded(new Set(fresh.filter((x) => fileExists(x)).map((x) => x.id)));
      if (curId) {
        const ni = fresh.findIndex((x) => x.id === curId);
        setIndex(ni >= 0 ? ni : null);
      }
    };

    (async () => {
      const [s, b, n, f, cached] = await Promise.all([
        loadSettings(),
        loadBookmarks(),
        loadNotes(),
        loadDuaFavs(),
        loadCachedTracks(),
      ]);
      setSettings(s);
      speedRef.current = s.speed;
      setBookmarks(b);
      setNotes(n);
      setDuaFavs(f);

      if (cached) {
        await showList(cached);
        fetchTracks(10000)
          .then(swapIn)
          .catch(() => {}); // offline or slow: keep the saved list
      } else {
        try {
          await showList(await fetchTracks(20000));
        } catch {
          setError('Could not load the surah list. Please connect to the internet once and open the app again.');
        }
      }

      takeLastCrash().then((c) => {
        if (!c || c.where === 'qibla') return; // location being off is not a problem with the app
        const details = `Quran Safar problem report\n${c.at}\n${c.where}: ${c.message}\n${c.stack}`;
        Alert.alert(
          'The app had a problem last time',
          'It has been recovered. You can send the details so it can be fixed.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Share details', onPress: () => Share.share({ message: details }).catch(() => {}) },
          ],
        );
      });
    })().catch((e) => recordError('startup', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- once loaded, jump to the saved position and re-apply the speed ----
  useEffect(() => {
    if (!status.isLoaded) return;
    applySpeed();
    if (pendingSeek.current != null) {
      const to = pendingSeek.current;
      pendingSeek.current = null;
      safe('seek', () => player.seekTo(to)?.catch?.(() => {}));
    }
  }, [status.isLoaded, player, applySpeed]);

  // ---- save the position every 5 s while playing, and on pause ----
  useEffect(() => {
    if (!track || pendingSeek.current != null || !status.isLoaded) return;
    const now = Date.now();
    if (!status.playing || now - lastSaved.current > 5000) {
      lastSaved.current = now;
      saveProgress(track.id, status.currentTime).catch(() => {});
    }
  }, [status.currentTime, status.playing, status.isLoaded, track]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active' && track && status.isLoaded && pendingSeek.current == null)
        safe('appstate', () => saveProgress(track.id, player.currentTime).catch(() => {}));
    });
    return () => sub.remove();
  }, [track, player, status.isLoaded]);

  // ---- when a part ends: repeat it, stop for the sleep timer, or continue ----
  useEffect(() => {
    if (!status.didJustFinish || index == null) return;
    if (repeat) {
      safe('repeat', () => {
        player.seekTo(0)?.catch?.(() => {});
        player.play();
      });
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
        safe('sleep-stop', () => {
          player.pause();
          player.volume = 1;
        });
        setSleepState({ kind: 'off' });
      } else if (left <= FADE_SECONDS) {
        safe('sleep-fade', () => (player.volume = left / FADE_SECONDS));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sleep, player]);

  const setSleep = (choice: 'off' | 'end' | number) => {
    safe('volume', () => (player.volume = 1));
    if (choice === 'off') setSleepState({ kind: 'off' });
    else if (choice === 'end') setSleepState({ kind: 'end' });
    else {
      setSleepLeft(choice * 60);
      setSleepState({ kind: 'minutes', minutes: choice, endsAt: Date.now() + choice * 60_000 });
    }
  };

  // ---- Android back button: close sheets first, then go back to the list ----
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menu) return setMenu(false), true;
      if (noteDraft) return setNoteDraft(null), true;
      if (sheet) return setSheet(false), true;
      if (view !== 'list') return setView('list'), true;
      return false;
    });
    return () => sub.remove();
  }, [menu, noteDraft, sheet, view]);

  // ---- keep the date fresh when the app comes back after midnight ----
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => st === 'active' && setToday(new Date()));
    return () => sub.remove();
  }, []);

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
    safe('playpause', () => (status.playing ? player.pause() : player.play()));
  };

  const skip = (delta: number) => {
    if (!track) return;
    const d = status.duration || Infinity;
    safe('skip', () => player.seekTo(Math.min(Math.max(0, status.currentTime + delta), d - 0.5))?.catch?.(() => {}));
  };

  const go = (delta: number) => {
    if (index == null) return;
    const n = index + delta;
    if (n >= 0 && n < tracks.length) loadTrack(tracks, n, 0, true);
  };

  const pick = (i: number) => {
    ensureNotifPermission();
    if (i === index) {
      if (!status.playing) safe('play', () => player.play());
    } else loadTrack(tracks, i, 0, true);
    setView('player');
  };

  // ---- downloads (kept in memory so the list doesn't check files on every redraw) ----
  const isDownloaded = useCallback((tr: Track) => downloaded.has(tr.id), [downloaded]);
  const markDownloaded = (id: string, on: boolean) =>
    setDownloaded((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleDownload = async (tr: Track) => {
    if (downloading[tr.id]) return;
    if (isDownloaded(tr)) {
      Alert.alert('Remove download?', `${label(tr)} will stream from the internet again.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            safe('remove', () => removeDownload(tr));
            markDownloaded(tr.id, false);
          },
        },
      ]);
      return;
    }
    setDownloading((d) => ({ ...d, [tr.id]: true }));
    try {
      await download(tr);
      markDownloaded(tr.id, true);
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
              markDownloaded(todo[k].id, true);
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

  // ---- lookups ----
  const indexById = useMemo(() => {
    const m: Record<string, number> = {};
    tracks.forEach((tr, i) => (m[tr.id] = i));
    return m;
  }, [tracks]);
  const trackById = (id: string) => (id in indexById ? { track: tracks[indexById[id]], i: indexById[id] } : null);
  const trackForAyah = (surah: number, ayah: number) =>
    tracks.findIndex((tr) => {
      if (tr.surah !== surah) return false;
      const m = tr.ayahs.match(/(\d+)\s*-\s*(\d+)/);
      return !m || (ayah >= +m[1] && ayah <= +m[2]);
    });

  const resume = (trackId: string, position: number) => {
    const i = indexById[trackId];
    if (i == null) return;
    ensureNotifPermission();
    if (i === index && status.isLoaded) {
      safe('seek', () => player.seekTo(position)?.catch?.(() => {}));
      safe('play', () => player.play());
    } else loadTrack(tracks, i, position, true);
    setView('player');
  };

  // ---- bookmarks (with the exact time) ----
  const persistBookmarks = (next: Bookmark[]) => {
    setBookmarks(next);
    saveBookmarks(next).catch(() => {});
  };
  const isBookmarked = (id: string) => bookmarks.some((b) => b.trackId === id);
  const toggleBookmark = () => {
    if (!track) return;
    if (isBookmarked(track.id)) persistBookmarks(bookmarks.filter((b) => b.trackId !== track.id));
    else persistBookmarks([...bookmarks, { trackId: track.id, position: Math.floor(status.currentTime || 0), savedAt: Date.now() }]);
  };
  const removeBookmark = (id: string) => persistBookmarks(bookmarks.filter((b) => b.trackId !== id));

  // ---- notes ----
  const persistNotes = (next: Note[]) => {
    setNotes(next);
    saveNotes(next).catch(() => {});
  };
  const saveNote = (text: string, link: { trackId: string; position: number } | null, existing: Note | null) => {
    const now = Date.now();
    if (existing)
      persistNotes(notes.map((n) => (n.id === existing.id ? { ...n, text, trackId: link?.trackId ?? null, position: link?.position ?? 0, updatedAt: now } : n)));
    else
      persistNotes([
        ...notes,
        { id: `${now}-${Math.random().toString(36).slice(2, 7)}`, text, trackId: link?.trackId ?? null, position: link?.position ?? 0, createdAt: now, updatedAt: now },
      ]);
    setNoteDraft(null);
  };
  const deleteNote = (id: string) => persistNotes(notes.filter((n) => n.id !== id));

  // ---- dua favourites ----
  const toggleDuaFav = (id: string) =>
    setDuaFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      saveDuaFavs(next).catch(() => {});
      return next;
    });

  // ---- dates ----
  const hijri = toHijri(today, settings.hijriOffset);
  const gregorianText = `${DAYS[today.getDay()]}, ${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
  const hijriText = hijri ? `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year} AH` : '';
  const hijriArabic = hijri ? `${arabicNumber(hijri.day)} ${HIJRI_MONTHS_AR[hijri.month - 1]}` : '';
  const adjustHijri = () => {
    const o = settings.hijriOffset;
    const setOffset = (v: number) => updateSettings({ hijriOffset: Math.max(-2, Math.min(2, v)) });
    Alert.alert(
      'Adjust Islamic date',
      `The Islamic date can differ by a day where you live because of moon sighting.\n\nCurrent adjustment: ${o > 0 ? '+' : ''}${o} day${Math.abs(o) === 1 ? '' : 's'}`,
      [
        { text: '−1 day', onPress: () => setOffset(o - 1) },
        { text: 'Reset', onPress: () => setOffset(0) },
        { text: '+1 day', onPress: () => setOffset(o + 1) },
      ],
      { cancelable: true },
    );
  };

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
    seek: (sec) => void safe('seek', () => player.seekTo(sec)?.catch?.(() => {})),
    isDownloaded,
    downloading,
    toggleDownload,
    downloadAll,
    bulk,
    trackById,
    trackForAyah,
    resume,
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    notes,
    openNoteEditor: (note) => setNoteDraft({ note }),
    deleteNote,
    duaFavs,
    toggleDuaFav,
    duaLang: settings.duaLang ?? 'both',
    setDuaLang: (duaLang) => updateSettings({ duaLang }),
    gregorianText,
    hijriText,
    hijriArabic,
    adjustHijri,
    speed: settings.speed,
    setSpeed,
    toggleTheme: () => updateSettings({ theme: dark ? 'light' : 'dark' }),
    sleep,
    sleepLeft,
    setSleep,
    repeat,
    toggleRepeat: () => setRepeat((r) => !r),
    view,
    navigate: (v) => setView(v),
    openMenu: () => setMenu(true),
    openPlayer: () => setView('player'),
    closePlayer: () => setView('list'),
    openSheet: () => setSheet(true),
    closeSheet: () => setSheet(false),
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={view === 'list' || view === 'about' || dark ? 'light' : 'dark'} />
      <ErrorBoundary
        key={screenKey}
        t={t}
        onReset={() => {
          setSheet(false);
          setView('list');
          setScreenKey((k) => k + 1);
        }}
      >
        {view === 'player' && track ? (
          <PlayerScreen app={app} />
        ) : view === 'qibla' ? (
          <QiblaScreen app={app} />
        ) : view === 'notes' ? (
          <NotesScreen app={app} />
        ) : view === 'saved' ? (
          <SavedScreen app={app} />
        ) : view === 'duas' ? (
          <DuasScreen app={app} />
        ) : view === 'feedback' ? (
          <FeedbackScreen app={app} />
        ) : view === 'about' ? (
          <AboutScreen app={app} />
        ) : (
          <ListScreen app={app} error={error} />
        )}
        <SleepSheet app={app} visible={sheet} />
        <MoreSheet app={app} visible={menu} onClose={() => setMenu(false)} />
        <NoteEditor app={app} draft={noteDraft} onClose={() => setNoteDraft(null)} onSave={saveNote} />
      </ErrorBoundary>
    </View>
  );
}
