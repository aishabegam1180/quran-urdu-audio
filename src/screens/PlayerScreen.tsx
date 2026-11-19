// Full Now playing screen: medallion, title, seek bar, controls, speed / sleep / repeat, up next.
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime } from '../library';
import { surahInfo } from '../surahs';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { Medallion } from '../ui';

export function PlayerScreen({ app }: { app: AppCtx }) {
  const { t, track } = app;
  const insets = useSafeAreaInsets();
  const [barW, setBarW] = useState(1);
  if (!track) return null;

  const info = surahInfo(track.surah);
  const pct = app.duration ? Math.min(1, app.currentTime / app.duration) : 0;
  const saved = app.bookmarks.includes(track.id);
  const next = app.index != null ? app.tracks[app.index + 1] : undefined;
  const speedText = `${app.speed}×`;
  const sleepText =
    app.sleep.kind === 'off'
      ? 'Sleep timer'
      : app.sleep.kind === 'end'
        ? 'Sleep · end of part'
        : `Sleep · ${Math.ceil(app.sleepLeft / 60)} min`;

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 18 }]}>
      <View style={styles.top}>
        <Pressable
          onPress={app.closePlayer}
          accessibilityLabel="Back to surah list"
          style={[styles.roundBtn, { backgroundColor: t.surface, borderColor: t.line }]}
        >
          <Ionicons name="chevron-down" size={22} color={t.text} />
        </Pressable>
        <Text style={[styles.topLabel, { color: t.muted }]}>NOW PLAYING</Text>
        <Pressable
          onPress={() => app.toggleBookmark(track.id)}
          accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark this part'}
          style={[styles.roundBtn, { backgroundColor: t.surface, borderColor: t.line }]}
        >
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={t.goldText} />
        </Pressable>
      </View>

      <View style={{ marginTop: 26 }}>
        <Medallion t={t} ar={info.ar} surah={info.n} />
      </View>

      <View style={styles.titleBox}>
        <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>
          {app.label(track)}
        </Text>
        <Text style={[styles.sub, { color: t.muted }]} numberOfLines={1}>
          {[app.ayahText(track), 'Mishary Alafasy · Urdu'].filter(Boolean).join(' · ')}
        </Text>
      </View>

      <Pressable
        onLayout={(e) => setBarW(e.nativeEvent.layout.width)}
        onPress={(e) => app.duration && app.seek((e.nativeEvent.locationX / barW) * app.duration)}
        accessibilityLabel="Seek"
        style={styles.barHit}
      >
        <View style={[styles.bar, { backgroundColor: t.track }]}>
          <View style={{ width: `${pct * 100}%`, height: 6, borderRadius: 3, backgroundColor: t.accent }} />
        </View>
        <View
          style={[
            styles.thumb,
            { left: pct * barW - 8, backgroundColor: t.accent, borderColor: t.bg },
          ]}
        />
      </Pressable>
      <View style={styles.times}>
        <Text style={[styles.time, { color: t.muted }]}>{formatTime(app.currentTime)}</Text>
        <Text style={[styles.time, { color: t.muted }]}>
          {app.buffering && app.playing
            ? 'Loading…'
            : app.duration
              ? `−${formatTime(Math.max(0, app.duration - app.currentTime))}`
              : ''}
        </Text>
      </View>

      <View style={styles.controls}>
        <Ctrl icon="play-skip-back" label="Previous part" color={t.ctrl} onPress={() => app.go(-1)} size={26} />
        <Ctrl icon="play-back" label="Back 10 seconds" color={t.ctrl} onPress={() => app.skip(-10)} size={30} />
        <Pressable
          onPress={app.playPause}
          accessibilityLabel={app.playing ? 'Pause' : 'Play'}
          style={[styles.play, { backgroundColor: t.playBg }]}
        >
          <Ionicons name={app.playing ? 'pause' : 'play'} size={34} color={t.playIcon} style={app.playing ? null : { marginLeft: 4 }} />
        </Pressable>
        <Ctrl icon="play-forward" label="Forward 10 seconds" color={t.ctrl} onPress={() => app.skip(10)} size={30} />
        <Ctrl icon="play-skip-forward" label="Next part" color={t.ctrl} onPress={() => app.go(1)} size={26} />
      </View>

      <View style={styles.chips}>
        <Pressable onPress={app.openSheet} style={[styles.chip, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.chipBig, { color: t.goldText }]}>{speedText}</Text>
          <Text style={[styles.chipText, { color: t.muted }]}>Speed</Text>
        </Pressable>
        <Pressable
          onPress={app.openSheet}
          style={[
            styles.chip,
            {
              backgroundColor: app.sleep.kind !== 'off' ? t.chipOn : t.surface,
              borderColor: app.sleep.kind !== 'off' ? t.chipOnText : t.line,
            },
          ]}
        >
          <Ionicons name="moon-outline" size={20} color={app.sleep.kind !== 'off' ? t.chipOnText : t.goldText} />
          <Text style={[styles.chipText, { color: app.sleep.kind !== 'off' ? t.chipOnText : t.muted }]} numberOfLines={1}>
            {sleepText}
          </Text>
        </Pressable>
        <Pressable
          onPress={app.toggleRepeat}
          style={[
            styles.chip,
            { backgroundColor: app.repeat ? t.chipOn : t.surface, borderColor: app.repeat ? t.chipOnText : t.line },
          ]}
        >
          <Ionicons name="repeat" size={22} color={app.repeat ? t.chipOnText : t.goldText} />
          <Text style={[styles.chipText, { color: app.repeat ? t.chipOnText : t.muted }]}>
            {app.repeat ? 'Repeat · on' : 'Repeat · off'}
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />
      {next ? (
        <Pressable onPress={() => app.go(1)} style={[styles.upNext, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.upLabel, { color: t.goldText }]}>UP NEXT</Text>
          <Text style={[styles.upText, { color: t.text }]} numberOfLines={1}>
            {next.surah === track.surah ? `Part ${next.part}` : app.label(next)} · {app.ayahText(next)}
          </Text>
          <Ionicons name="play-skip-forward-outline" size={18} color={t.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Ctrl({
  icon,
  label,
  color,
  size,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  size: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} hitSlop={8} style={styles.ctrl}>
      <Ionicons name={icon} size={size} color={color} />
      {(icon === 'play-back' || icon === 'play-forward') && (
        <Text style={[styles.ctrlNum, { color }]}>10</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  topLabel: { fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 1.2 },
  titleBox: { marginTop: 24, alignItems: 'center', gap: 6 },
  title: { fontFamily: FONTS.display, fontSize: 28, textAlign: 'center' },
  sub: { fontFamily: FONTS.body, fontSize: 14 },
  barHit: { marginTop: 22, paddingVertical: 12, justifyContent: 'center' },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  thumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 3 },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { fontFamily: FONTS.medium, fontSize: 12, fontVariant: ['tabular-nums'] },
  controls: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctrl: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  ctrlNum: { position: 'absolute', bottom: 2, fontFamily: FONTS.bold, fontSize: 9 },
  play: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  chips: { marginTop: 24, flexDirection: 'row', gap: 10 },
  chip: { flex: 1, minHeight: 64, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
  chipBig: { fontFamily: FONTS.bold, fontSize: 16 },
  chipText: { fontFamily: FONTS.medium, fontSize: 11 },
  upNext: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1 },
  upLabel: { fontFamily: FONTS.semibold, fontSize: 11, letterSpacing: 0.9 },
  upText: { flex: 1, fontFamily: FONTS.body, fontSize: 13 },
});
