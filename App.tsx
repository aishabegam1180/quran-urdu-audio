import { Ionicons } from '@expo/vector-icons';
import {
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Track,
  download,
  formatMB,
  formatTime,
  isDownloaded,
  loadProgress,
  loadTracks,
  removeDownload,
  saveProgress,
  sourceFor,
} from './src/library';

const GREEN = '#0F5132';
const SKIP_SECONDS = 10;
const ROW_HEIGHT = 64;

export default function App() {
  return (
    <SafeAreaProvider>
      <Player />
    </SafeAreaProvider>
  );
}

function Player() {
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const [, refresh] = useState(0);

  const pendingSeek = useRef<number | null>(null);
  const lastSaved = useRef(0);
  const askedNotif = useRef(false);
  const listRef = useRef<FlatList<Track>>(null);

  const track = index != null ? tracks[index] : null;
  const partsPerSurah = useMemo(() => {
    const m: Record<number, number> = {};
    tracks.forEach((t) => (m[t.surah] = (m[t.surah] ?? 0) + 1));
    return m;
  }, [tracks]);

  const label = (t: Track) =>
    `${t.title}${partsPerSurah[t.surah] > 1 ? ` · Part ${t.part}` : ''}`;

  // ---- load a track (optionally start at a position / autoplay) ----
  const loadTrack = useCallback(
    (list: Track[], i: number, startAt = 0, autoplay = true) => {
      const t = list[i];
      if (!t) return;
      setIndex(i);
      pendingSeek.current = startAt > 1 ? startAt : null;
      lastSaved.current = Date.now();
      player.replace(sourceFor(t));
      player.setActiveForLockScreen(
        true,
        { title: label(t), artist: 'Mishary Alafasy · Urdu', albumTitle: 'Holy Quran' },
        {
          showSeekBackward: true,
          showSeekForward: true,
          seekBackwardIntervalSeconds: SKIP_SECONDS,
          seekForwardIntervalSeconds: SKIP_SECONDS,
        },
      );
      if (autoplay) player.play();
      saveProgress(t.id, startAt);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player, partsPerSurah],
  );

  // ---- startup: audio mode, track list, last position ----
  useEffect(() => {
    (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
      try {
        const list = await loadTracks();
        setTracks(list);
        const p = await loadProgress();
        const i = p ? list.findIndex((t) => t.id === p.trackId) : -1;
        if (p && i >= 0) {
          loadTrack(list, i, p.position, false); // ready to continue; one tap on Play
          setTimeout(() => listRef.current?.scrollToIndex({ index: i, viewPosition: 0.3 }), 300);
        }
      } catch {
        setError('Could not load the surah list. Connect to the internet once and try again.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- once loaded, jump to the saved position ----
  useEffect(() => {
    if (status.isLoaded && pendingSeek.current != null) {
      const to = pendingSeek.current;
      pendingSeek.current = null;
      player.seekTo(to);
    }
  }, [status.isLoaded, player]);

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

  // ---- when a surah ends, continue with the next one ----
  useEffect(() => {
    if (status.didJustFinish && index != null) {
      if (index + 1 < tracks.length) loadTrack(tracks, index + 1, 0, true);
      else saveProgress(tracks[index].id, 0);
    }
  }, [status.didJustFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- controls ----
  const ensureNotifPermission = () => {
    if (!askedNotif.current) {
      askedNotif.current = true;
      requestNotificationPermissionsAsync().catch(() => {});
    }
  };

  const playPause = () => {
    if (!track) return tracks.length && loadTrack(tracks, 0);
    ensureNotifPermission();
    status.playing ? player.pause() : player.play();
  };

  const stop = () => {
    if (!track) return;
    player.pause();
    player.seekTo(0);
    saveProgress(track.id, 0);
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
    if (i === index) return playPause();
    loadTrack(tracks, i, 0, true);
  };

  // ---- downloads ----
  const toggleDownload = async (t: Track) => {
    if (downloading[t.id]) return;
    if (isDownloaded(t)) {
      Alert.alert('Remove download?', `${label(t)} will stream from the internet again.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => (removeDownload(t), refresh((x) => x + 1)) },
      ]);
      return;
    }
    setDownloading((d) => ({ ...d, [t.id]: true }));
    try {
      await download(t);
    } catch {
      Alert.alert('Download failed', 'Please check your internet connection and try again.');
    }
    setDownloading((d) => ({ ...d, [t.id]: false }));
  };

  const downloadAll = () => {
    const todo = tracks.filter((t) => !isDownloaded(t));
    if (!todo.length) return Alert.alert('All surahs are already downloaded.');
    const size = formatMB(todo.reduce((s, t) => s + (t.bytes || 0), 0));
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
          if (failed) Alert.alert(`${failed} files failed`, 'Tap "Download all" again to retry them.');
        },
      },
    ]);
  };

  // ---- UI ----
  const pct = status.duration ? Math.min(1, status.currentTime / status.duration) : 0;
  const [barWidth, setBarWidth] = useState(1);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Holy Quran</Text>
          <Text style={styles.h2}>Arabic recitation with Urdu meaning</Text>
        </View>
        <Pressable onPress={downloadAll} style={styles.headerBtn} disabled={!!bulk || !tracks.length}>
          <Ionicons name="cloud-download-outline" size={18} color="#fff" />
          <Text style={styles.headerBtnText}>
            {bulk ? `${bulk.done}/${bulk.total}` : 'Download all'}
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.err}>{error}</Text>
        </View>
      ) : !tracks.length ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={tracks}
          keyExtractor={(t) => t.id}
          getItemLayout={(_, i) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * i, index: i })}
          onScrollToIndexFailed={() => {}}
          renderItem={({ item, index: i }) => {
            const active = i === index;
            const dl = isDownloaded(item);
            return (
              <Pressable onPress={() => pick(i)} style={[styles.row, active && styles.rowActive]}>
                <View style={[styles.num, active && { backgroundColor: GREEN }]}>
                  <Text style={[styles.numText, active && { color: '#fff' }]}>{item.surah}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={1}>
                    {label(item)}
                  </Text>
                  {!!item.ayahs && <Text style={styles.sub}>{item.ayahs}</Text>}
                </View>
                {active && status.playing && (
                  <Ionicons name="volume-high" size={18} color={GREEN} style={{ marginRight: 10 }} />
                )}
                <Pressable onPress={() => toggleDownload(item)} hitSlop={12}>
                  {downloading[item.id] ? (
                    <ActivityIndicator size="small" color={GREEN} />
                  ) : (
                    <Ionicons
                      name={dl ? 'checkmark-circle' : 'arrow-down-circle-outline'}
                      size={24}
                      color={dl ? GREEN : '#9AA5A0'}
                    />
                  )}
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}

      {/* now playing */}
      <View style={styles.player}>
        <Text style={styles.nowTitle} numberOfLines={1}>
          {track ? label(track) : 'Tap a surah to start listening'}
        </Text>
        {track && (
          <Text style={styles.nowSub}>
            Surah {track.surah}
            {track.ayahs ? ` · ${track.ayahs}` : ''}
            {isDownloaded(track) ? ' · offline' : ''}
          </Text>
        )}

        <Pressable
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          onPress={(e) =>
            status.duration && player.seekTo((e.nativeEvent.locationX / barWidth) * status.duration)
          }
          style={styles.barHit}
        >
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
          </View>
        </Pressable>
        <View style={styles.times}>
          <Text style={styles.time}>{formatTime(status.currentTime)}</Text>
          <Text style={styles.time}>
            {status.isBuffering && status.playing ? 'Loading…' : formatTime(status.duration)}
          </Text>
        </View>

        <View style={styles.controls}>
          <Ctrl icon="play-skip-back" onPress={() => go(-1)} />
          <Ctrl icon="play-back" onPress={() => skip(-SKIP_SECONDS)} />
          <Pressable onPress={playPause} style={styles.playBtn}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={34} color="#fff" />
          </Pressable>
          <Ctrl icon="play-forward" onPress={() => skip(SKIP_SECONDS)} />
          <Ctrl icon="play-skip-forward" onPress={() => go(1)} />
        </View>
        <Pressable onPress={stop} style={styles.stopBtn}>
          <Ionicons name="stop" size={16} color={GREEN} />
          <Text style={styles.stopText}>Stop</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Ctrl({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.ctrl}>
      <Ionicons name={icon} size={26} color={GREEN} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GREEN },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700' },
  h2: { color: '#CFE6D9', fontSize: 13, marginTop: 2 },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ffffff55',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  headerBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  center: { flex: 1, backgroundColor: '#F6F8F7', alignItems: 'center', justifyContent: 'center', padding: 30 },
  err: { textAlign: 'center', color: '#333', fontSize: 15, lineHeight: 22 },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F6F8F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDE3E0',
  },
  rowActive: { backgroundColor: '#E3F1E8' },
  num: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E1E8E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numText: { fontSize: 13, fontWeight: '700', color: GREEN },
  title: { fontSize: 16, color: '#1B2420', fontWeight: '600' },
  sub: { fontSize: 12, color: '#6B7772', marginTop: 2 },
  player: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 12,
  },
  nowTitle: { fontSize: 17, fontWeight: '700', color: '#1B2420', textAlign: 'center' },
  nowSub: { fontSize: 12, color: '#6B7772', textAlign: 'center', marginTop: 2 },
  barHit: { paddingVertical: 10, marginTop: 6 },
  bar: { height: 5, borderRadius: 3, backgroundColor: '#E1E8E4', overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: GREEN },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { fontSize: 12, color: '#6B7772' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 6 },
  ctrl: { padding: 8 },
  playBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 6,
  },
  stopText: { color: GREEN, fontWeight: '600' },
});
