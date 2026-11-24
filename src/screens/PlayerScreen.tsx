// Full Now playing screen: medallion, title, reciter, seek bar, controls, speed / sleep / repeat / note,
// and every part of the surah (listened ones ticked). When a part ends: "Up next in 5 s".
// Swipe left (or tap "Quran text") to read along; with an Arabic reciter the ayah being recited is highlighted.
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, ScrollViewInstance, StyleSheet, Text as RNText, TextProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime } from '../library';
import { surahInfo } from '../surahs';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { EqBars, HoverPressable, Medallion } from '../ui';

const Text = (p: TextProps) => <RNText maxFontSizeMultiplier={1.3} {...p} />;
import { PlayerTextPage } from './ReadScreens';

export function PlayerScreen({ app }: { app: AppCtx }) {
  const { t, track } = app;
  const insets = useSafeAreaInsets();
  const [barW, setBarW] = useState(1);
  const [pageW, setPageW] = useState(0);
  const [pageH, setPageH] = useState(0);
  const [page, setPage] = useState(0);
  const pager = useRef<ScrollViewInstance>(null);
  const goPage = (p: number) => {
    setPage(p);
    pager.current?.scrollTo({ x: p * pageW, animated: true });
  };
  if (!track) return null;

  const info = surahInfo(track.surah);
  const ar = app.arabicPos;
  const partPct = app.duration ? Math.min(1, app.currentTime / app.duration) : 0;
  const pct = ar ? Math.min(1, (ar.i + partPct) / ar.n) : partPct;
  const saved = app.isBookmarked(track.id);
  const parts = app.groups.find((g) => g.info.n === track.surah)?.parts ?? [];
  const nextAfter = app.index != null ? app.tracks[app.index + 1] : undefined;
  const nextOther = nextAfter && nextAfter.surah !== track.surah ? nextAfter : undefined;
  const listenedHere = parts.filter((p) => app.listened.has(p.track.id)).length;
  const speedText = `${app.speed}×`;
  const sleepText =
    app.sleep.kind === 'off'
      ? 'Sleep'
      : app.sleep.kind === 'end'
        ? 'End of part'
        : `${Math.ceil(app.sleepLeft / 60)} min`;

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
        <View style={[styles.tabs, { backgroundColor: t.segment }]} accessibilityRole="tablist">
          {['Player', 'Quran text'].map((label, p) => (
            <Pressable
              key={label}
              onPress={() => goPage(p)}
              accessibilityRole="tab"
              accessibilityState={{ selected: page === p }}
              style={[styles.tab, page === p && { backgroundColor: t.surface }]}
            >
              <Text style={[styles.tabText, { color: page === p ? t.text : t.muted }]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={app.toggleBookmark}
          accessibilityLabel={ar ? (saved ? 'Remove bookmark from this ayah' : 'Bookmark this ayah') : saved ? 'Remove bookmark' : 'Bookmark this moment'}
          style={[styles.roundBtn, { backgroundColor: t.surface, borderColor: t.line }]}
        >
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={t.goldText} />
        </Pressable>
      </View>

      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
        onLayout={(e) => (setPageW(e.nativeEvent.layout.width), setPageH(e.nativeEvent.layout.height))}
        onMomentumScrollEnd={(e) => pageW && setPage(Math.round(e.nativeEvent.contentOffset.x / pageW))}
      >
      <ScrollView
        style={{ width: pageW || undefined, height: pageH || undefined }}
        contentContainerStyle={[styles.inner, { paddingHorizontal: 24, flexGrow: 1, paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
      >
      <View style={{ marginTop: 26 }}>
        <Medallion t={t} ar={info.ar} surah={info.n} />
      </View>

      <View style={styles.titleBox}>
        <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>
          {app.label(track)}
        </Text>
        <Text style={[styles.sub, { color: t.muted }]} numberOfLines={1}>
          {ar ? `Ayah ${ar.ayah} · ${ar.i + 1} of ${ar.n} in this part` : app.ayahText(track)}
        </Text>
        <Pressable
          onPress={app.openReciters}
          accessibilityLabel={`Reciter: ${app.reciterName}. Change reciter`}
          style={[styles.reciter, { backgroundColor: t.surface, borderColor: t.line }]}
        >
          <Ionicons name="headset-outline" size={16} color={t.goldText} />
          <Text style={[styles.reciterText, { color: t.text }]} numberOfLines={1}>
            {app.reciterName}
          </Text>
          <Ionicons name="chevron-down" size={15} color={t.muted} />
        </Pressable>
      </View>

      <Pressable
        onLayout={(e) => setBarW(e.nativeEvent.layout.width)}
        onPress={(e) => {
          const f = Math.max(0, Math.min(1, e.nativeEvent.locationX / barW));
          if (ar) app.goAyah(Math.min(ar.n - 1, Math.floor(f * ar.n)));
          else if (app.duration) app.seek(f * app.duration);
        }}
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
        <Text style={[styles.time, { color: t.muted }]}>{ar ? `Ayah ${ar.ayah}` : formatTime(app.currentTime)}</Text>
        <Text style={[styles.time, { color: t.muted }]}>
          {app.buffering && app.playing
            ? 'Loading…'
            : ar
              ? `${ar.n - ar.i - 1} ayah${ar.n - ar.i - 1 === 1 ? '' : 's'} left`
              : app.duration
                ? `−${formatTime(Math.max(0, app.duration - app.currentTime))}`
                : ''}
        </Text>
      </View>

      <View style={styles.controls}>
        <Ctrl icon="play-skip-back" label="Previous part" color={t.ctrl} onPress={() => app.go(-1)} size={26} />
        <Ctrl icon="play-back" label={ar ? 'Previous ayah' : 'Back 10 seconds'} num={ar ? '' : '10'} color={t.ctrl} onPress={() => app.skip(-10)} size={30} />
        <Pressable
          onPress={app.playPause}
          accessibilityLabel={app.playing ? 'Pause' : 'Play'}
          style={[styles.play, { backgroundColor: t.playBg }]}
        >
          <Ionicons name={app.playing ? 'pause' : 'play'} size={34} color={t.playIcon} style={app.playing ? null : { marginLeft: 4 }} />
        </Pressable>
        <Ctrl icon="play-forward" label={ar ? 'Next ayah' : 'Forward 10 seconds'} num={ar ? '' : '10'} color={t.ctrl} onPress={() => app.skip(10)} size={30} />
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
            {app.repeat ? 'Repeat on' : 'Repeat'}
          </Text>
        </Pressable>
        <Pressable onPress={() => app.openNoteEditor(null)} style={[styles.chip, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Ionicons name="create-outline" size={21} color={t.goldText} />
          <Text style={[styles.chipText, { color: t.muted }]}>Note</Text>
        </Pressable>
      </View>

      {parts.length > 1 && (
        <View style={{ marginTop: 22, gap: 6 }}>
          <View style={styles.partsHead}>
            <Text style={[styles.partsTitle, { color: t.text }]}>All parts · {info.name}</Text>
            <Text style={[styles.partsCount, { color: t.muted }]}>
              {listenedHere} of {parts.length} listened
            </Text>
          </View>
          {parts.map(({ track: p, i }) => {
            const on = i === app.index;
            const done = app.listened.has(p.id);
            const isNext = app.index != null && i === app.index + 1;
            return (
              <HoverPressable
                key={p.id}
                onPress={() => (on ? app.playPause() : app.pick(i))}
                accessibilityLabel={`Part ${p.part}, ${app.ayahText(p)}${on ? ', playing' : done ? ', listened' : ''}`}
                style={[styles.partRow, { backgroundColor: on ? t.activeBg : t.surface, borderColor: on ? t.green : t.line }]}
                hoverStyle={{ backgroundColor: on ? t.activeBg : t.segment }}
              >
                <View style={[styles.partDot, { backgroundColor: on ? t.header : done ? t.green : t.segment }]}>
                  {on ? (
                    <EqBars color={t.gold} playing={app.playing} size={12} />
                  ) : done ? (
                    <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                  ) : (
                    <Text style={[styles.partNum, { color: t.muted }]}>{p.part}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.partName, { color: on ? t.green : t.text }]}>Part {p.part}</Text>
                  <Text style={[styles.partAyahs, { color: t.muted }]} numberOfLines={1}>
                    {app.ayahText(p)}
                  </Text>
                </View>
                <Text style={[styles.partTag, { color: on ? t.green : t.goldText }]}>
                  {on ? (app.playing ? 'PLAYING' : 'PAUSED') : isNext ? 'Up next' : done ? 'Listened' : ''}
                </Text>
              </HoverPressable>
            );
          })}
        </View>
      )}
      <View style={{ flex: 1 }} />
      {nextOther ? (
        <Pressable onPress={() => app.go(1)} style={[styles.upNext, { backgroundColor: t.surface, borderColor: t.line, marginTop: 16 }]}>
          <Text style={[styles.upLabel, { color: t.goldText }]}>NEXT SURAH</Text>
          <Text style={[styles.upText, { color: t.text }]} numberOfLines={1}>
            {app.label(nextOther)} · {app.ayahText(nextOther)}
          </Text>
          <Ionicons name="play-skip-forward-outline" size={18} color={t.muted} />
        </Pressable>
      ) : null}
      </ScrollView>

      <View style={[styles.page, { width: pageW || undefined, height: pageH || undefined, paddingTop: 14 }]}>
        <PlayerTextPage app={app} />
        <View style={[styles.mini, { backgroundColor: t.header }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.miniTitle, { color: t.headerText }]} numberOfLines={1}>
              {app.label(track)}
            </Text>
            <Text style={[styles.miniSub, { color: t.headerMuted }]} numberOfLines={1}>
              {ar ? `Ayah ${ar.ayah}` : `${formatTime(app.currentTime)}${app.duration ? ` / ${formatTime(app.duration)}` : ''}`} · {app.reciterName}
            </Text>
          </View>
          <Pressable onPress={app.openReciters} accessibilityLabel="Change reciter" hitSlop={6} style={styles.miniBtn}>
            <Ionicons name="headset-outline" size={21} color={t.headerText} />
          </Pressable>
          <Pressable onPress={() => app.skip(-10)} accessibilityLabel={ar ? 'Previous ayah' : 'Back 10 seconds'} hitSlop={6} style={styles.miniBtn}>
            <Ionicons name="play-back" size={22} color={t.headerText} />
          </Pressable>
          <Pressable onPress={app.playPause} accessibilityLabel={app.playing ? 'Pause' : 'Play'} style={[styles.miniPlay, { backgroundColor: t.gold }]}>
            <Ionicons name={app.playing ? 'pause' : 'play'} size={22} color={t.onGold} style={app.playing ? null : { marginLeft: 3 }} />
          </Pressable>
        </View>
      </View>
      </ScrollView>
      {app.upNext && (
        <View style={[styles.overlay, { backgroundColor: t.scrim }]}>
          <View style={[styles.upCard, { backgroundColor: t.sheet }]}>
            <Text style={[styles.upLabel, { color: t.goldText }]}>UP NEXT</Text>
            <Text style={[styles.upTitle, { color: t.text }]}>
              {app.label(app.upNext.track)}
            </Text>
            <Text style={[styles.upText, { color: t.muted, flex: 0 }]}>
              {app.ayahText(app.upNext.track)} · starts in {app.upNext.left} s
            </Text>
            <View style={[styles.countBar, { backgroundColor: t.track }]}>
              <View style={{ width: `${(app.upNext.left / 5) * 100}%`, height: 4, backgroundColor: t.accent }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={app.playUpNext} style={[styles.upBtn, { backgroundColor: t.header }]}>
                <Ionicons name="play" size={16} color={t.gold} />
                <Text style={[styles.upBtnText, { color: t.headerText }]}>Play now</Text>
              </Pressable>
              <Pressable onPress={app.cancelUpNext} style={[styles.upBtn, { backgroundColor: t.surface, borderWidth: 1, borderColor: t.line }]}>
                <Text style={[styles.upBtnText, { color: t.text }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function Ctrl({
  icon,
  label,
  color,
  size,
  onPress,
  num = '10',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  num?: string;
  color: string;
  size: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} hitSlop={8} style={styles.ctrl}>
      <Ionicons name={icon} size={size} color={color} />
      {(icon === 'play-back' || icon === 'play-forward') && !!num && (
        <Text style={[styles.ctrlNum, { color }]}>{num}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  topLabel: { fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 1.2 },
  tabs: { flexDirection: 'row', padding: 4, borderRadius: 14, gap: 4, flex: 1, marginHorizontal: 10 },
  tab: { flex: 1, minHeight: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontFamily: FONTS.semibold, fontSize: 13 },
  pager: { flex: 1, marginHorizontal: -24 },
  page: { flex: 1, paddingHorizontal: 24 },
  mini: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, padding: 12, borderRadius: 20 },
  miniTitle: { fontFamily: FONTS.semibold, fontSize: 14 },
  miniSub: { fontFamily: FONTS.body, fontSize: 12 },
  miniBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  miniPlay: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
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
  chips: { marginTop: 24, flexDirection: 'row', gap: 8 },
  chip: { flex: 1, minHeight: 64, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
  chipBig: { fontFamily: FONTS.bold, fontSize: 16 },
  chipText: { fontFamily: FONTS.medium, fontSize: 11 },
  upNext: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1 },
  upLabel: { fontFamily: FONTS.semibold, fontSize: 11, letterSpacing: 0.9 },
  upText: { flex: 1, fontFamily: FONTS.body, fontSize: 13 },
  inner: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  reciter: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 38, paddingHorizontal: 14, borderRadius: 19, borderWidth: 1, maxWidth: '100%' },
  reciterText: { fontFamily: FONTS.semibold, fontSize: 13, flexShrink: 1 },
  partsHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 2 },
  partsTitle: { flex: 1, fontFamily: FONTS.display, fontSize: 19 },
  partsCount: { fontFamily: FONTS.body, fontSize: 12 },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1.5 },
  partDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  partNum: { fontFamily: FONTS.bold, fontSize: 12 },
  partName: { fontFamily: FONTS.semibold, fontSize: 14 },
  partAyahs: { fontFamily: FONTS.body, fontSize: 12 },
  partTag: { fontFamily: FONTS.bold, fontSize: 11 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', padding: 20 },
  upCard: { borderRadius: 22, padding: 18, gap: 10, width: '100%', maxWidth: 480, alignSelf: 'center', elevation: 12 },
  upTitle: { fontFamily: FONTS.display, fontSize: 22 },
  countBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  upBtn: { flex: 1, minHeight: 48, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  upBtnText: { fontFamily: FONTS.semibold, fontSize: 15 },
});
