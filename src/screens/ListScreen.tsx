// Home screen: header with Continue listening, search, Surahs / Juz / Saved tabs,
// the surah list (multi-part surahs open into their parts) and the mini player.
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECITERS } from '../config';
import { Track, formatTime } from '../library';
import { SavedList } from './SavedScreen';
import { JUZ, searchKey } from '../surahs';
import { FONTS } from '../theme';
import { AppCtx, Part, SurahGroup } from '../types';
import { HeaderPattern, StarBadge } from '../ui';

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
    () => ({ open, index: app.index, playing: app.playing, downloading: app.downloading, isDownloaded: app.isDownloaded, t }),
    [open, app.index, app.playing, app.downloading, app.isDownloaded, t],
  );

  const pct = app.duration ? Math.min(1, app.currentTime / app.duration) : 0;

  // ---------- pieces ----------
  const header = (
    <View
      style={[styles.header, { backgroundColor: t.header, paddingTop: insets.top + 16 }]}
      onLayout={(e) => (setHeaderW(e.nativeEvent.layout.width), setHeaderH(e.nativeEvent.layout.height))}
    >
      <HeaderPattern color={t.gold} width={headerW} height={headerH} />
      <View style={styles.headerRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.headerAr, { color: t.gold }]}>القرآن الكريم</Text>
          <Text style={[styles.h1, { color: t.headerText }]}>Quran Safar</Text>
          <Text style={[styles.h2, { color: t.headerMuted }]}>Urdu Tarjuma · {RECITERS}</Text>
        </View>
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

      {app.track && (
        <Pressable
          onPress={() => (app.playing ? null : app.playPause(), app.openPlayer())}
          style={[styles.continueCard, { backgroundColor: t.card, borderColor: t.headerLine }]}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.eyebrow, { color: t.gold }]}>
              {app.playing ? 'NOW LISTENING' : 'CONTINUE LISTENING'}
            </Text>
            <Text style={[styles.cardTitle, { color: t.headerText }]} numberOfLines={1}>
              {app.label(app.track)}
            </Text>
            <Text style={[styles.cardSub, { color: t.headerMuted }]} numberOfLines={1}>
              {app.ayahText(app.track)}
              {app.duration ? ` · ${formatTime(app.currentTime)} of ${formatTime(app.duration)}` : ''}
            </Text>
            <View style={[styles.cardBar, { backgroundColor: t.headerLine }]}>
              <View style={{ width: `${pct * 100}%`, height: 4, backgroundColor: t.gold }} />
            </View>
          </View>
          <View style={[styles.cardPlay, { backgroundColor: t.gold }]}>
            <Ionicons name={app.playing ? 'pause' : 'play'} size={22} color={t.onGold} style={app.playing ? null : { marginLeft: 3 }} />
          </View>
        </Pressable>
      )}
    </View>
  );

  const tabs = (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
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
    return (
      <Pressable
        key={tr.id}
        onPress={() => app.pick(i)}
        style={[styles.partRow, { backgroundColor: active ? t.activeBg : 'transparent' }]}
      >
        <Text style={[styles.partName, { color: t.text }]} numberOfLines={1}>
          {withSurah ? app.label(tr) : `Part ${tr.part}`}
        </Text>
        <Text style={[styles.partAyahs, { color: t.muted }]} numberOfLines={1}>
          {app.ayahText(tr)}
        </Text>
        {active && app.playing && <Ionicons name="stats-chart" size={14} color={t.green} accessibilityLabel="Now playing" />}
        <Pressable onPress={() => app.toggleDownload(tr)} hitSlop={12} accessibilityLabel="Download for offline">
          {dlIcon(tr)}
        </Pressable>
      </Pressable>
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
            backgroundColor: isOpen ? t.surface : playingHere && !multi ? t.activeBg : 'transparent',
            borderColor: isOpen ? t.line : 'transparent',
          },
        ]}
      >
        <Pressable
          onPress={() => (multi ? setOpen(isOpen ? null : g.info.n) : app.pick(g.parts[0].i))}
          style={styles.surahRow}
        >
          <StarBadge n={g.info.n} t={t} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.surahName, { color: t.text }]} numberOfLines={1}>
              {g.info.name}
            </Text>
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
        </Pressable>
        {isOpen && <View style={styles.parts}>{g.parts.map((p) => partRow(p))}</View>}
      </View>
    );
  };

  const empty = (text: string) => (
    <View style={styles.empty}>
      <Text style={[styles.emptyText, { color: t.muted }]}>{text}</Text>
    </View>
  );

  const padBottom = (app.track ? 100 : 24) + insets.bottom;
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
        contentContainerStyle={[styles.listPad, { paddingBottom: padBottom }]}
        keyboardShouldPersistTaps="handled"
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
        contentContainerStyle={[styles.listPad, bottomPad]}
        renderItem={({ item: j }) => (
          <Pressable onPress={() => j.i >= 0 && app.pick(j.i)} style={styles.surahRow}>
            <StarBadge n={j.n} t={t} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.surahName, { color: t.text }]}>Para {j.n} · {j.name}</Text>
              <Text style={[styles.surahMeta, { color: t.muted }]}>
                Starts at {j.surahName}, ayah {j.ayah}
              </Text>
            </View>
            <Ionicons name="play-circle-outline" size={24} color={t.green} />
          </Pressable>
        )}
      />
    );
  else body = <SavedList app={app} bottomPad={padBottom} />;

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      {header}
      {tabs}
      <View style={{ flex: 1 }}>{body}</View>

      {app.track && (
        <Pressable
          onPress={app.openPlayer}
          style={[styles.mini, { backgroundColor: t.mini, bottom: 14 + insets.bottom }]}
        >
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[styles.miniTitle, { color: t.miniText }]} numberOfLines={1}>
              {app.label(app.track)}
            </Text>
            <Text style={[styles.miniSub, { color: t.miniMuted }]} numberOfLines={1}>
              {app.sleep.kind !== 'off'
                ? `Sleep timer · ${app.sleep.kind === 'end' ? 'end of part' : `${Math.ceil(app.sleepLeft / 60)} min`}`
                : `${RECITERS} · Urdu`}
            </Text>
          </View>
          <Pressable
            onPress={app.playPause}
            accessibilityLabel={app.playing ? 'Pause' : 'Play'}
            style={[styles.miniPlay, { backgroundColor: t.gold }]}
          >
            <Ionicons name={app.playing ? 'pause' : 'play'} size={20} color={t.onGold} style={app.playing ? null : { marginLeft: 2 }} />
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerAr: { fontFamily: FONTS.arabic, fontSize: 22, lineHeight: 32 },
  h1: { fontFamily: FONTS.display, fontSize: 30, lineHeight: 34 },
  h2: { fontFamily: FONTS.body, fontSize: 13 },
  dateRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1 },
  dateMain: { fontFamily: FONTS.semibold, fontSize: 14 },
  dateSub: { fontFamily: FONTS.body, fontSize: 12 },
  dateAr: { fontFamily: FONTS.arabic, fontSize: 16, lineHeight: 24, maxWidth: 104, textAlign: 'right' },
  circleBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bulkText: { fontFamily: FONTS.bold, fontSize: 11 },
  continueCard: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 18, borderWidth: 1 },
  eyebrow: { fontFamily: FONTS.semibold, fontSize: 11, letterSpacing: 0.9 },
  cardTitle: { fontFamily: FONTS.semibold, fontSize: 16 },
  cardSub: { fontFamily: FONTS.body, fontSize: 12 },
  cardBar: { marginTop: 6, height: 4, borderRadius: 2, overflow: 'hidden' },
  cardPlay: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
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
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 10, borderRadius: 12 },
  partName: { fontFamily: FONTS.semibold, fontSize: 13, minWidth: 54, flexShrink: 1 },
  partAyahs: { flex: 1, fontFamily: FONTS.body, fontSize: 13 },
  empty: { padding: 32, alignItems: 'center' },
  emptyText: { fontFamily: FONTS.body, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  mini: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: 20,
    elevation: 10,
  },
  miniTitle: { fontFamily: FONTS.semibold, fontSize: 14 },
  miniSub: { fontFamily: FONTS.body, fontSize: 12 },
  miniPlay: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
