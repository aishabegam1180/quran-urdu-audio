// Home screen: header (shrinks to one line when the list is scrolled), search, Surahs / Juz / Saved tabs,
// the surah list (multi-part surahs open into their parts; the one playing glows) and one player bar.
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text as RNText,
  TextInput,
  TextProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECITERS } from '../config';
import { Track, formatTime } from '../library';
import { SavedList } from './SavedScreen';
import { JUZ, searchKey } from '../surahs';
import { VerseOfDayCard } from './ReadScreens';
import { FONTS } from '../theme';
import { AppCtx, Part, SurahGroup } from '../types';
import { EqBars, HeaderPattern, HoverPressable, StarBadge } from '../ui';

// Labels grow with the phone's text size but are capped, so large text doesn't push the list off the screen.
const Text = (p: TextProps) => <RNText maxFontSizeMultiplier={1.3} {...p} />;
const MAX_W = 760; // tablets and laptops: keep the list a readable width

type Tab = 'Surahs' | 'Juz' | 'Saved';

export function ListScreen({ app, error }: { app: AppCtx; error: string | null }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Surahs');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number | null>(app.track?.surah ?? null);
  const listRef = useRef<FlatList<SurahGroup>>(null);
  const [headerW, setHeaderW] = useState(400);
  const [headerH, setHeaderH] = useState(260);
  const [miniH, setMiniH] = useState(76);
  // the big header folds into one line once the list is scrolled, and comes back at the top
  const [compact, setCompact] = useState(false);
  const compactRef = useRef(false);
  const dragged = useRef(false); // only fold after the person scrolls, not when the list jumps to the playing surah
  const onScroll = useRef((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (!dragged.current && !compactRef.current) return;
    const want = compactRef.current ? y > 8 : y > 80;
    if (want !== compactRef.current) {
      compactRef.current = want;
      LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
      setCompact(want);
    }
  }).current;
  const onDrag = useRef(() => {
    dragged.current = true;
  }).current;

  // open the surah that is playing when the app starts
  const startSurah = app.track?.surah;
  const scrolled = useRef(false);
  useEffect(() => {
    if (startSurah == null || scrolled.current || !app.groups.length) return;
    scrolled.current = true;
    setOpen(startSurah);
    const i = app.groups.findIndex((g) => g.info.n === startSurah);
    if (i > 0) setTimeout(() => listRef.current?.scrollToIndex({ index: i, viewPosition: 0.1, animated: false }), 400);
  }, [startSurah, app.groups]);

  const filtered = useMemo(() => {
    const q = searchKey(query.trim());
    if (!q) return app.groups;
    return app.groups.filter(
      (g) =>
        String(g.info.n) === q ||
        searchKey(g.info.name).includes(q) ||
        searchKey(g.info.meaning).includes(q) ||
        g.info.ar.includes(query.trim()),
    );
  }, [query, app.groups]);

  const juzRows = useMemo(
    () =>
      JUZ.map((j) => {
        const i = app.trackForAyah(j.surah, j.ayah);
        const g = app.groups.find((x) => x.info.n === j.surah);
        return { ...j, i, surahName: g?.info.name ?? `Surah ${j.surah}` };
      }),
    [app.tracks, app.groups], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // only redraw list rows when something they show changes (not on every progress tick)
  const listExtra = useMemo(
    () => ({ open, index: app.index, playing: app.playing, downloading: app.downloading, isDownloaded: app.isDownloaded, t, listened: app.listened }),
    [open, app.index, app.playing, app.downloading, app.isDownloaded, t, app.listened],
  );

  const pct = app.arabicPos
    ? Math.min(1, (app.arabicPos.i + (app.duration ? app.currentTime / app.duration : 0)) / app.arabicPos.n)
    : app.duration
      ? Math.min(1, app.currentTime / app.duration)
      : 0;

  // ---------- pieces ----------
  const buttons = (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={app.toggleTheme}
            accessibilityLabel={t.dark ? 'Switch to light theme' : 'Switch to dark theme'}
            style={[styles.circleBtn, { borderColor: t.headerLine }]}
          >
            <Ionicons name={t.dark ? 'sunny-outline' : 'moon-outline'} size={19} color={t.headerText} />
          </Pressable>
          <Pressable
            onPress={app.downloadAll}
            disabled={!!app.bulk || !app.tracks.length}
            accessibilityLabel="Download all for offline"
            style={[styles.circleBtn, { borderColor: t.headerLine }]}
          >
            {app.bulk ? (
              <Text style={[styles.bulkText, { color: t.headerText }]}>
                {Math.round((app.bulk.done / app.bulk.total) * 100)}%
              </Text>
            ) : (
              <Ionicons name="download-outline" size={20} color={t.headerText} />
            )}
          </Pressable>
          <Pressable
            onPress={app.openMenu}
            accessibilityLabel="More"
            style={[styles.circleBtn, { borderColor: t.headerLine, backgroundColor: t.card }]}
          >
            <Ionicons name="menu" size={21} color={t.headerText} />
          </Pressable>
        </View>
  );

  const header = compact ? (
    <View style={[styles.header, styles.headerCompact, { backgroundColor: t.header, paddingTop: insets.top + 8 }]}>
      <View style={[styles.headerRow, styles.inner, { alignItems: 'center' }]}>
        <Text style={[styles.h1Small, { color: t.headerText, flex: 1 }]} numberOfLines={1}>
          Quran Safar
        </Text>
        {buttons}
      </View>
    </View>
  ) : (
    <View
      style={[styles.header, { backgroundColor: t.header, paddingTop: insets.top + 16 }]}
      onLayout={(e) => (setHeaderW(e.nativeEvent.layout.width), setHeaderH(e.nativeEvent.layout.height))}
    >
      <HeaderPattern color={t.gold} width={headerW} height={headerH} />
      <View style={styles.inner}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.headerAr, { color: t.gold }]}>القرآن الكريم</Text>
          <Text style={[styles.h1, { color: t.headerText }]}>Quran Safar</Text>
          <Text style={[styles.h2, { color: t.headerMuted }]}>Urdu Tarjuma · {RECITERS}</Text>
          <Pressable
            onPress={() => app.navigate('streak')}
            accessibilityLabel={`Daily streak: ${app.streak.current} ${app.streak.current === 1 ? 'day' : 'days'}. Open streak.`}
            style={[styles.streakBtn, { borderColor: app.streak.doneToday ? 'rgba(242,181,74,0.7)' : t.headerLine, backgroundColor: app.streak.doneToday ? 'rgba(242,181,74,0.18)' : 'transparent' }]}
          >
            <Ionicons name={app.streak.doneToday ? 'flame' : 'flame-outline'} size={16} color="#F2B54A" />
            <Text style={[styles.streakText, { color: t.headerText }]}>
              {app.streak.current > 0
                ? `${app.streak.current}-day streak${app.streak.doneToday ? '' : ' · listen 1 min today'}`
                : 'Start your daily streak · listen 1 min'}
            </Text>
          </Pressable>
        </View>
        {buttons}
      </View>

      {!!app.hijriText && (
        <Pressable
          onPress={app.adjustHijri}
          accessibilityLabel={`${app.hijriText}, ${app.gregorianText}. Tap to adjust the Islamic date.`}
          style={[styles.dateRow, { borderColor: t.headerLine }]}
        >
          <Ionicons name="moon-outline" size={18} color={t.gold} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.dateMain, { color: t.headerText }]}>
              {app.hijriText}
            </Text>
            <Text style={[styles.dateSub, { color: t.headerMuted }]}>
              {app.gregorianText}
            </Text>
          </View>
          <Text style={[styles.dateAr, { color: t.gold }]} numberOfLines={2}>
            {app.hijriArabic}
          </Text>
        </Pressable>
      )}

      </View>
    </View>
  );

  const todayKey = `${app.today.getFullYear()}-${app.today.getMonth() + 1}-${app.today.getDate()}`;
  const showVerse = !query && !compact && tab !== 'Saved' && app.reading.votdHidden !== todayKey;

  const tabs = (
    <View style={[styles.inner, { paddingHorizontal: 20, paddingTop: showVerse ? 0 : compact ? 10 : 16, gap: compact ? 10 : 14 }]}>
      {showVerse && <VerseOfDayCard app={app} />}
      {tab !== 'Saved' && (
      <View style={[styles.search, { backgroundColor: t.surface, borderColor: t.line }]}>
        <Ionicons name="search" size={18} color={t.muted} />
        <TextInput
          value={query}
          onChangeText={(q) => (setQuery(q), q && setTab('Surahs'))}
          placeholder="Search by name or number…"
          placeholderTextColor={t.muted}
          accessibilityLabel="Search surahs"
          style={[styles.searchInput, { color: t.text }]}
          returnKeyType="search"
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={t.muted} />
          </Pressable>
        )}
      </View>
      )}
      <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 6 }}>
        {(['Surahs', 'Juz', 'Saved'] as Tab[]).map((label) => {
          const on = tab === label;
          return (
            <Pressable
              key={label}
              onPress={() => setTab(label)}
              style={[
                styles.pill,
                { borderColor: on ? t.pillActive : t.line, backgroundColor: on ? t.pillActive : t.pill },
              ]}
            >
              <Text style={[styles.pillText, { color: on ? t.pillActiveText : t.text }]}>
                {label}
                {label === 'Saved' && app.bookmarks.length ? ` · ${app.bookmarks.length}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const dlIcon = (tr: Track) =>
    app.downloading[tr.id] ? (
      <ActivityIndicator size="small" color={t.green} />
    ) : (
      <Ionicons
        name={app.isDownloaded(tr) ? 'checkmark-circle' : 'arrow-down-circle-outline'}
        size={22}
        color={app.isDownloaded(tr) ? t.green : t.muted}
      />
    );

  const partRow = ({ track: tr, i }: Part, withSurah = false) => {
    const active = i === app.index;
    const done = app.listened.has(tr.id);
    return (
      <HoverPressable
        key={tr.id}
        onPress={() => app.pick(i)}
        style={[styles.partRow, { backgroundColor: active ? t.activeBg : 'transparent', borderColor: active ? t.green : 'transparent' }]}
        hoverStyle={{ backgroundColor: active ? t.activeBg : t.segment }}
      >
        <Text style={[styles.partName, { color: t.text }]} numberOfLines={1}>
          {withSurah ? app.label(tr) : `Part ${tr.part}`}
        </Text>
        <Text style={[styles.partAyahs, { color: t.muted }]} numberOfLines={1}>
          {app.ayahText(tr)}
        </Text>
        {active ? (
          <EqBars color={t.green} playing={app.playing} size={14} />
        ) : done ? (
          <Ionicons name="checkmark" size={15} color={t.green} accessibilityLabel="Listened" />
        ) : null}
        <Pressable onPress={() => app.toggleDownload(tr)} hitSlop={12} accessibilityLabel="Download for offline">
          {dlIcon(tr)}
        </Pressable>
      </HoverPressable>
    );
  };

  const surahRow = ({ item: g }: { item: SurahGroup }) => {
    const multi = g.parts.length > 1;
    const isOpen = multi && open === g.info.n;
    const playingHere = app.track?.surah === g.info.n;
    const offline = g.parts.filter((p) => app.isDownloaded(p.track)).length;
    const meta = [
      g.info.meaning,
      `${g.info.ayahs} ayahs`,
      multi ? `${g.parts.length} parts` : null,
      multi && offline ? `${offline} offline` : null,
    ]
      .filter(Boolean)
      .join(' · ');
    return (
      <View
        style={[
          styles.surahCard,
          {
            backgroundColor: playingHere ? t.activeBg : isOpen ? t.surface : 'transparent',
            borderColor: playingHere ? t.green : isOpen ? t.line : 'transparent',
            borderWidth: playingHere ? 1.5 : 1,
          },
        ]}
      >
        <HoverPressable
          onPress={() => (multi ? setOpen(isOpen ? null : g.info.n) : app.pick(g.parts[0].i))}
          style={[styles.surahRow, { borderRadius: 15 }]}
          hoverStyle={{ backgroundColor: playingHere ? 'transparent' : t.segment }}
        >
          <StarBadge n={g.info.n} t={t} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.surahName, { color: playingHere ? t.green : t.text, flexShrink: 1 }]} numberOfLines={1}>
                {g.info.name}
              </Text>
              {playingHere && <EqBars color={t.green} playing={app.playing} size={13} />}
            </View>
            <Text style={[styles.surahMeta, { color: t.muted }]} numberOfLines={1}>
              {meta}
            </Text>
          </View>
          <Text style={[styles.surahAr, { color: t.green }]}>{g.info.ar}</Text>
          {multi ? (
            <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={t.muted} />
          ) : (
            <Pressable onPress={() => app.toggleDownload(g.parts[0].track)} hitSlop={12} accessibilityLabel="Download for offline">
              {dlIcon(g.parts[0].track)}
            </Pressable>
          )}
        </HoverPressable>
        {isOpen && <View style={styles.parts}>{g.parts.map((p) => partRow(p))}</View>}
      </View>
    );
  };

  const empty = (text: string) => (
    <View style={styles.empty}>
      <Text style={[styles.emptyText, { color: t.muted }]}>{text}</Text>
    </View>
  );

  const padBottom = (app.track ? miniH + 30 : 24) + insets.bottom;
  const bottomPad = { paddingBottom: padBottom };

  // The surah list is rebuilt only when what it shows changes, not on every
  // half-second progress update while audio plays.
  const surahList = useMemo(
    () => (
      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(g) => String(g.info.n)}
        renderItem={surahRow}
        extraData={listExtra}
        contentContainerStyle={[styles.listPad, styles.inner, { paddingBottom: padBottom }]}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        onScrollBeginDrag={onDrag}
        scrollEventThrottle={32}
        onScrollToIndexFailed={() => {}}
        ListEmptyComponent={empty('No surah matches your search.')}
        initialNumToRender={14}
        windowSize={7}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, listExtra, padBottom, app.groups],
  );

  let body;
  if (error) body = empty(error);
  else if (!app.tracks.length) body = <ActivityIndicator style={{ marginTop: 40 }} size="large" color={t.green} />;
  else if (tab === 'Surahs') body = surahList;
  else if (tab === 'Juz')
    body = (
      <FlatList
        data={juzRows}
        keyExtractor={(j) => String(j.n)}
        contentContainerStyle={[styles.listPad, styles.inner, bottomPad]}
        onScroll={onScroll}
        onScrollBeginDrag={onDrag}
        scrollEventThrottle={32}
        renderItem={({ item: j }) => (
          <HoverPressable onPress={() => j.i >= 0 && app.pick(j.i)} style={[styles.surahRow, { borderRadius: 15 }]} hoverStyle={{ backgroundColor: t.segment }}>
            <StarBadge n={j.n} t={t} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.surahName, { color: t.text }]}>Para {j.n} · {j.name}</Text>
              <Text style={[styles.surahMeta, { color: t.muted }]}>
                Starts at {j.surahName}, ayah {j.ayah}
              </Text>
            </View>
            <Ionicons name="play-circle-outline" size={24} color={t.green} />
          </HoverPressable>
        )}
      />
    );
  else body = <SavedList app={app} bottomPad={padBottom} onScroll={onScroll} onScrollBeginDrag={onDrag} />;

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      {header}
      {tabs}
      <View style={{ flex: 1 }}>{body}</View>

      {app.track && (
        <Pressable
          onPress={app.openPlayer}
          onLayout={(e) => setMiniH(e.nativeEvent.layout.height)}
          accessibilityLabel={`${app.playing ? 'Now playing' : 'Continue listening'}: ${app.label(app.track)}. Open player`}
          style={[styles.mini, { backgroundColor: t.mini, bottom: 14 + insets.bottom }]}
        >
          <View style={[styles.miniInner, styles.inner]}>
            <View style={{ width: 22, alignItems: 'center' }}>
              <EqBars color={t.gold} playing={app.playing} size={18} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.miniEyebrow, { color: t.gold }]} numberOfLines={1}>
                {app.upNext ? `UP NEXT IN ${app.upNext.left} S` : app.playing ? 'NOW PLAYING' : 'CONTINUE LISTENING'}
              </Text>
              <Text style={[styles.miniTitle, { color: t.miniText }]} numberOfLines={1}>
                {app.label(app.upNext?.track ?? app.track)}
              </Text>
              <Text style={[styles.miniSub, { color: t.miniMuted }]} numberOfLines={1}>
                {app.sleep.kind !== 'off'
                  ? `Sleep timer · ${app.sleep.kind === 'end' ? 'end of part' : `${Math.ceil(app.sleepLeft / 60)} min`}`
                  : app.arabicPos
                    ? `Ayah ${app.arabicPos.ayah} · ${app.reciterName}`
                    : app.duration
                      ? `${formatTime(app.currentTime)} of ${formatTime(app.duration)} · ${app.reciterName}`
                      : app.reciterName}
              </Text>
            </View>
            <Pressable
              onPress={app.playPause}
              accessibilityLabel={app.playing ? 'Pause' : 'Play'}
              style={[styles.miniPlay, { backgroundColor: t.gold }]}
            >
              <Ionicons name={app.playing ? 'pause' : 'play'} size={20} color={t.onGold} style={app.playing ? null : { marginLeft: 2 }} />
            </Pressable>
          </View>
          <View style={[styles.miniBar, { backgroundColor: t.headerLine }]}>
            <View style={{ width: `${pct * 100}%`, height: 3, backgroundColor: t.gold }} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  headerCompact: { paddingBottom: 10, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  inner: { width: '100%', maxWidth: MAX_W, alignSelf: 'center' },
  h1Small: { fontFamily: FONTS.display, fontSize: 22 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerAr: { fontFamily: FONTS.arabic, fontSize: 22, lineHeight: 32 },
  h1: { fontFamily: FONTS.display, fontSize: 30, lineHeight: 34 },
  h2: { fontFamily: FONTS.body, fontSize: 13 },
  dateRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1 },
  dateMain: { fontFamily: FONTS.semibold, fontSize: 14 },
  dateSub: { fontFamily: FONTS.body, fontSize: 12 },
  dateAr: { fontFamily: FONTS.arabic, fontSize: 16, lineHeight: 24, maxWidth: 104, textAlign: 'right' },
  circleBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  streakBtn: { alignSelf: 'flex-start', marginTop: 6, minHeight: 32, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  streakText: { fontFamily: FONTS.semibold, fontSize: 12 },
  bulkText: { fontFamily: FONTS.bold, fontSize: 11 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontFamily: FONTS.body, fontSize: 15, paddingVertical: 0 },
  pill: { height: 36, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, justifyContent: 'center' },
  pillText: { fontFamily: FONTS.semibold, fontSize: 13 },
  listPad: { paddingHorizontal: 12, paddingTop: 4 },
  surahCard: { marginBottom: 6, borderRadius: 16, borderWidth: 1 },
  surahRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, minHeight: 64 },
  surahName: { fontFamily: FONTS.semibold, fontSize: 16 },
  surahMeta: { fontFamily: FONTS.body, fontSize: 12 },
  surahAr: { fontFamily: FONTS.arabic, fontSize: 20, lineHeight: 30 },
  parts: { paddingLeft: 64, paddingRight: 12, paddingBottom: 10, gap: 2 },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1 },
  partName: { fontFamily: FONTS.semibold, fontSize: 13, minWidth: 54, flexShrink: 1 },
  partAyahs: { flex: 1, fontFamily: FONTS.body, fontSize: 13 },
  empty: { padding: 32, alignItems: 'center' },
  emptyText: { fontFamily: FONTS.body, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  mini: { position: 'absolute', left: 12, right: 12, borderRadius: 20, elevation: 10, overflow: 'hidden' },
  miniInner: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 14, paddingRight: 10 },
  miniEyebrow: { fontFamily: FONTS.semibold, fontSize: 10, letterSpacing: 0.8 },
  miniBar: { height: 3 },
  miniTitle: { fontFamily: FONTS.semibold, fontSize: 14 },
  miniSub: { fontFamily: FONTS.body, fontSize: 12 },
  miniPlay: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
