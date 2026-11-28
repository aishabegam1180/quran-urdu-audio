// Reading the Quran: surah picker, the reading page, the ayah options sheet,
// the verse-of-the-day card on the home screen, and the text page inside the player.
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ayahIndex,
  loadQuran,
  parseRef,
  partRange,
  QURAN_FONT,
  quranLoaded,
  QuranText,
  rangeText,
  showsBismillah,
  verseOfDay,
} from '../quran';
import { ayahKey, ReadMode } from '../reading';
import { searchKey, SURAHS, surahInfo } from '../surahs';
import { FONTS, Theme } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader, StarBadge } from '../ui';

// ---------- shared ----------

/** Loads the Quran text the first time it is needed (a second or two), then keeps it. */
export function useQuran(delayMs = 0) {
  const [q, setQ] = useState<QuranText | null>(quranLoaded());
  const [failed, setFailed] = useState(false);
  const load = () => {
    setFailed(false);
    loadQuran().then(setQ, () => setFailed(true));
  };
  useEffect(() => {
    if (q) return;
    // the home screen waits a moment so the app opens first, then loads the text
    const id = setTimeout(load, delayMs);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { q, failed, retry: load };
}

function Loading({ t, failed, retry }: { t: Theme; failed: boolean; retry: () => void }) {
  return (
    <View style={styles.center}>
      {failed ? (
        <>
          <Text style={[styles.small, { color: t.muted, textAlign: 'center' }]}>The Quran text could not be opened.</Text>
          <Pressable onPress={retry} style={[styles.btn, { backgroundColor: t.playBg }]}>
            <Text style={[styles.btnText, { color: t.playIcon }]}>Try again</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator size="large" color={t.green} />
      )}
    </View>
  );
}

const MODES: { id: ReadMode; label: string }[] = [
  { id: 'ar', label: 'Arabic' },
  { id: 'ur', label: '+ Urdu' },
  { id: 'en', label: '+ English' },
  { id: 'all', label: 'All' },
];

function ModeSwitch({ app, dark }: { app: AppCtx; dark?: boolean }) {
  const { t } = app;
  const mode = app.reading.mode;
  return (
    <View style={[styles.modes, { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : t.segment }]} accessibilityRole="tablist">
      {MODES.map((m) => {
        const on = m.id === mode;
        return (
          <Pressable
            key={m.id}
            onPress={() => app.setReading({ mode: m.id })}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.mode, on && { backgroundColor: dark ? t.gold : t.surface }]}
          >
            <Text style={[styles.modeText, { color: on ? (dark ? t.onGold : t.text) : dark ? t.headerText : t.muted }]}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** One ayah: number, Indo-Pak Arabic, and the translations the reader chose. */
export const AyahRow = memo(function AyahRow({
  t,
  q,
  surah,
  ayah,
  mode,
  notes,
  marked,
  playing,
  onPress,
}: {
  t: Theme;
  q: QuranText;
  surah: number;
  ayah: number;
  mode: ReadMode;
  notes: number;
  marked: boolean;
  playing: boolean;
  onPress: (surah: number, ayah: number) => void;
}) {
  const i = ayahIndex(surah, ayah);
  const showUr = mode === 'ur' || mode === 'all';
  const showEn = mode === 'en' || mode === 'all';
  return (
    <Pressable
      onPress={() => onPress(surah, ayah)}
      accessibilityLabel={`Ayah ${ayah}. Tap for options`}
      style={[styles.ayah, { backgroundColor: playing ? t.activeBg : t.surface, borderColor: playing ? t.green : t.line }]}
    >
      <View style={styles.ayahTop}>
        <View style={[styles.num, { borderColor: t.gold }]}>
          <Text style={[styles.numText, { color: t.goldText }]}>{ayah}</Text>
        </View>
        {notes > 0 && (
          <View style={[styles.badge, { backgroundColor: t.chipOn }]}>
            <Ionicons name="document-text-outline" size={13} color={t.chipOnText} />
            <Text style={[styles.badgeText, { color: t.chipOnText }]}>{notes}</Text>
          </View>
        )}
        {marked && <Ionicons name="bookmark" size={15} color={t.goldText} />}
        <View style={{ flex: 1 }} />
        <Ionicons name="ellipsis-horizontal" size={18} color={t.muted} />
      </View>
      <Text style={[styles.arabic, { color: t.text }]}>{q.ar[i]}</Text>
      {/* a clear gap and a thin line between the Arabic, the Urdu and the English */}
      {showUr && (
        <View style={[styles.trBlock, { borderTopColor: t.line }]}>
          <Text style={[styles.urdu, { color: t.text }]}>{q.ur[i]}</Text>
        </View>
      )}
      {showEn && (
        <View style={[styles.trBlock, { borderTopColor: t.line }]}>
          <Text style={[styles.english, { color: t.text }]}>{q.en[i]}</Text>
        </View>
      )}
    </Pressable>
  );
});

function Bismillah({ t, q }: { t: Theme; q: QuranText }) {
  return <Text style={[styles.bismillah, { color: t.green }]}>{q.ar[0].replace(/\s*[۟-ۭۖ-ۜ]+\s*$/, '')}</Text>;
}

function notesCount(app: AppCtx) {
  const m = new Map<string, number>();
  for (const n of app.notes) if (n.ayah) m.set(n.ayah, (m.get(n.ayah) ?? 0) + 1);
  return m;
}

// ---------- Read Quran: choose a surah ----------

export function ReadHomeScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const last = app.reading.lastRead;
  const ref = parseRef(query);
  const rows = useMemo(() => {
    const k = searchKey(query);
    if (!k) return SURAHS;
    return SURAHS.filter((s) => String(s.n) === query.trim() || searchKey(s.name).includes(k) || searchKey(s.meaning).includes(k));
  }, [query]);

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10 }]}>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <ScreenHeader t={t} title="Read Quran" subtitle="Indo-Pak script · Urdu & English" onBack={() => app.navigate('list')} />
        {last && !query && (
          <Pressable onPress={() => app.openReader(last.surah, last.ayah)} style={[styles.continue, { backgroundColor: t.header }]}>
            <View style={[styles.contIcon, { backgroundColor: 'rgba(212,175,99,0.18)' }]}>
              <Ionicons name="book-outline" size={24} color={t.gold} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.eyebrow, { color: t.gold }]}>CONTINUE READING</Text>
              <Text style={[styles.contTitle, { color: t.headerText }]}>
                {surahInfo(last.surah).name} · Ayah {last.ayah}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={t.headerText} />
          </Pressable>
        )}
        <View style={[styles.search, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Ionicons name="search" size={18} color={t.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search surah, or type 2:255"
            placeholderTextColor={t.muted}
            accessibilityLabel="Search surahs or go to an ayah"
            style={[styles.searchInput, { color: t.text }]}
            returnKeyType="go"
            onSubmitEditing={() => ref && app.openReader(ref.surah, ref.ayah)}
          />
          {!!query && (
            <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={t.muted} />
            </Pressable>
          )}
        </View>
        {ref && /[:.\s]/.test(query.trim()) && (
          <Pressable onPress={() => app.openReader(ref.surah, ref.ayah)} style={[styles.goRow, { backgroundColor: t.activeBg, borderColor: t.green }]}>
            <Ionicons name="arrow-forward-circle" size={22} color={t.green} />
            <Text style={[styles.goText, { color: t.text }]}>
              Go to {surahInfo(ref.surah).name}, ayah {ref.ayah}
            </Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(s) => String(s.n)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 2 }}
        initialNumToRender={16}
        renderItem={({ item: s }) => (
          <Pressable onPress={() => app.openReader(s.n, 1)} style={styles.surahRow}>
            <StarBadge n={s.n} t={t} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.surahName, { color: t.text }]}>{s.name}</Text>
              <Text style={[styles.small, { color: t.muted }]}>
                {s.meaning} · {s.ayahs} ayahs
              </Text>
            </View>
            <Text style={[styles.surahAr, { color: t.green }]}>{s.ar}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.small, { color: t.muted, textAlign: 'center', marginTop: 30 }]}>No surah matches your search.</Text>}
      />
    </View>
  );
}

// ---------- Reading page ----------

export function ReadSurahScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const { q, failed, retry } = useQuran();
  const target = app.readTarget ?? { surah: 1, ayah: 1 };
  const info = surahInfo(target.surah);
  const listRef = useRef<FlatList<number>>(null);
  const ayahs = useMemo(() => Array.from({ length: info.ayahs }, (_, i) => i + 1), [info.ayahs]);
  const counts = useMemo(() => notesCount(app), [app.notes]); // eslint-disable-line react-hooks/exhaustive-deps
  const marks = useMemo(() => new Set(app.reading.marks), [app.reading.marks]);
  const mode = app.reading.mode;
  const playingKey = app.ayahPlaying;
  const surahRef = useRef(target.surah);
  surahRef.current = target.surah;
  const saveRef = useRef(app.saveLastRead);
  saveRef.current = app.saveLastRead;

  // remember where the reader is (the first ayah on screen)
  const onViewable = useRef(({ viewableItems }: { viewableItems: { item: unknown; isViewable: boolean }[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first && typeof first.item === 'number') saveRef.current(surahRef.current, first.item);
  }).current;

  // follow the recitation: keep the ayah being recited on screen
  useEffect(() => {
    if (!q || !playingKey) return;
    const [s, a] = playingKey.split(':').map(Number);
    if (s !== target.surah || !a) return;
    listRef.current?.scrollToIndex({ index: a - 1, animated: true, viewPosition: 0.2 });
  }, [playingKey, q, target.surah]);

  // jump to the requested ayah once the text is ready
  useEffect(() => {
    if (!q || target.ayah <= 1) return;
    const id = setTimeout(() => listRef.current?.scrollToIndex({ index: target.ayah - 1, animated: false, viewOffset: 8 }), 60);
    return () => clearTimeout(id);
  }, [q, target.surah, target.ayah]);

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.readHeader, { backgroundColor: t.header, paddingTop: insets.top + 10 }]}>
        <View style={styles.readTop}>
          <Pressable onPress={() => app.navigate('readhome')} accessibilityLabel="Back" style={[styles.round, { borderColor: t.headerLine }]}>
            <Ionicons name="chevron-back" size={22} color={t.headerText} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.readTitle, { color: t.headerText }]} numberOfLines={1}>
              {info.name}
            </Text>
            <Text style={[styles.small, { color: t.headerMuted }]} numberOfLines={1}>
              {info.meaning} · {info.ayahs} ayahs
            </Text>
          </View>
          <Pressable
            onPress={() =>
              app.track?.surah === target.surah && app.arabicPos ? app.playPause() : app.playSurahFromReader(target.surah)
            }
            onLongPress={app.openReciters}
            accessibilityLabel={`Listen to this surah: ${app.reciterName}`}
            style={[styles.round, { borderColor: t.headerLine }]}
          >
            <Ionicons
              name={app.track?.surah === target.surah && app.arabicPos && app.playing ? 'pause' : 'headset-outline'}
              size={20}
              color={t.gold}
            />
          </Pressable>
        </View>
        <ModeSwitch app={app} dark />
        <Pressable onPress={app.openReciters} accessibilityLabel={`Reciter: ${app.reciterName}. Change reciter`} style={[styles.reciterChip, { borderColor: t.headerLine }]}>
          <Ionicons name="headset-outline" size={14} color={t.gold} />
          <Text style={[styles.tiny, { color: t.headerText, flexShrink: 1 }]} numberOfLines={1} maxFontSizeMultiplier={1.3}>
            {app.reciterName}
            {app.reciter === 'urdu' ? ' · choose an Arabic reciter to follow along' : ''}
          </Text>
          <Ionicons name="chevron-down" size={13} color={t.headerMuted} />
        </Pressable>
      </View>
      {!q ? (
        <Loading t={t} failed={failed} retry={retry} />
      ) : (
        <FlatList
          ref={listRef}
          data={ayahs}
          keyExtractor={(a) => String(a)}
          extraData={`${mode}|${playingKey}|${app.notes.length}|${app.reading.marks.length}`}
          contentContainerStyle={{ padding: 14, paddingBottom: insets.bottom + 30, gap: 16 }}
          ListHeaderComponent={showsBismillah(target.surah) ? <Bismillah t={t} q={q} /> : undefined}
          initialNumToRender={8}
          windowSize={9}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 40 }}
          onScrollToIndexFailed={(e) => {
            listRef.current?.scrollToOffset({ offset: e.averageItemLength * e.index, animated: false });
            setTimeout(() => listRef.current?.scrollToIndex({ index: e.index, animated: false, viewOffset: 8 }), 120);
          }}
          renderItem={({ item: a }) => (
            <AyahRow
              t={t}
              q={q}
              surah={target.surah}
              ayah={a}
              mode={mode}
              notes={counts.get(ayahKey(target.surah, a)) ?? 0}
              marked={marks.has(ayahKey(target.surah, a))}
              playing={playingKey === ayahKey(target.surah, a)}
              onPress={app.openAyah}
            />
          )}
        />
      )}
    </View>
  );
}

// ---------- Ayah options sheet ----------

export function AyahSheet({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const sel = app.ayahSheet;
  const q = quranLoaded();
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [sel?.surah, sel?.ayah]);
  if (!sel || !q) return null;
  const key = ayahKey(sel.surah, sel.ayah);
  const i = ayahIndex(sel.surah, sel.ayah);
  const info = surahInfo(sel.surah);
  const myNotes = app.notes.filter((n) => n.ayah === key);
  const marked = app.reading.marks.includes(key);
  const playing = app.ayahPlaying === key;
  const shareText = `${q.ar[i]}\n\n${q.ur[i]}\n\n${q.en[i]}\n\n— ${info.name} ${key}\n(Quran Safar – Urdu Tarjuma)`;

  const actions: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; primary?: boolean }[] = [
    {
      label: playing ? 'Stop' : 'Play ayah',
      icon: playing ? 'stop' : 'play',
      primary: true,
      onPress: () => (playing ? app.stopAyah() : app.playAyahs(sel.surah, sel.ayah, sel.ayah)),
    },
    { label: 'Add note', icon: 'create-outline', onPress: () => app.openAyahNote(key) },
    { label: `Notes (${myNotes.length})`, icon: 'document-text-outline', onPress: () => (app.closeAyah(), app.navigate('notes')) },
    { label: marked ? 'Bookmarked' : 'Bookmark', icon: marked ? 'bookmark' : 'bookmark-outline', onPress: () => app.toggleAyahMark(key) },
    {
      label: copied ? 'Copied' : 'Copy',
      icon: copied ? 'checkmark' : 'copy-outline',
      onPress: () => Clipboard.setStringAsync(shareText).then(() => setCopied(true), () => {}),
    },
    { label: 'Share', icon: 'share-social-outline', onPress: () => Share.share({ message: shareText }).catch(() => {}) },
  ];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={app.closeAyah} statusBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} onPress={app.closeAyah} accessibilityLabel="Close" />
      <View style={styles.sheetWrap} pointerEvents="box-none">
        <View style={[styles.sheet, { backgroundColor: t.sheet, paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.handle, { backgroundColor: t.line }]} />
          <View style={styles.sheetHead}>
            <Text style={[styles.sheetTitle, { color: t.text }]}>
              {info.name} · Ayah {sel.ayah}
            </Text>
            {myNotes.length > 0 && (
              <Text style={[styles.badgeText, styles.notesPill, { color: t.chipOnText, backgroundColor: t.chipOn }]}>
                {myNotes.length} {myNotes.length === 1 ? 'note' : 'notes'} on this ayah
              </Text>
            )}
          </View>
          <ScrollView style={{ maxHeight: 300 }} contentContainerStyle={{ gap: 8 }}>
            <Text style={[styles.arabic, { color: t.text }]}>{q.ar[i]}</Text>
            <Text style={[styles.urdu, { color: t.text }]}>{q.ur[i]}</Text>
            <Text style={[styles.english, { color: t.text }]}>{q.en[i]}</Text>
          </ScrollView>
          <View style={styles.actions}>
            {actions.map((a) => (
              <Pressable
                key={a.label}
                onPress={a.onPress}
                style={[styles.action, { backgroundColor: a.primary ? t.playBg : t.surface, borderColor: a.primary ? t.playBg : t.line }]}
              >
                <Ionicons name={a.icon} size={18} color={a.primary ? t.playIcon : t.text} />
                <Text style={[styles.actionText, { color: a.primary ? t.playIcon : t.text }]} numberOfLines={1}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.tiny, { color: t.muted }]}>Ayah audio: Mishary Rashid Alafasy</Text>
        </View>
      </View>
    </Modal>
  );
}

// ---------- Verse of the day (home screen) ----------

export function VerseOfDayCard({ app }: { app: AppCtx }) {
  const { t } = app;
  const { q } = useQuran(1500);
  const v = verseOfDay(app.today);
  if (!q) return null;
  const info = surahInfo(v.surah);
  const ar = rangeText(q, 'ar', v.surah, v.from, v.to);
  const ur = rangeText(q, 'ur', v.surah, v.from, v.to);
  const en = rangeText(q, 'en', v.surah, v.from, v.to);
  const lang = app.duaLang;
  const playing = !!app.ayahPlaying && app.ayahPlaying.startsWith(`${v.surah}:`) && app.ayahRange === v.ref;
  const share = () =>
    Share.share({ message: `Verse of the day\n\n${ar}\n\n${ur}\n\n${en}\n\n— ${info.name} ${v.ref}\n(Quran Safar – Urdu Tarjuma)` }).catch(() => {});

  return (
    <View style={[styles.votd, { backgroundColor: t.surface, borderColor: t.line }]} accessibilityLabel="Verse of the day">
      <View style={styles.votdHead}>
        <Ionicons name="star-outline" size={16} color={t.goldText} />
        <Text style={[styles.votdLabel, { color: t.goldText }]}>VERSE OF THE DAY</Text>
        <Text style={[styles.tiny, { color: t.muted, flex: 1 }]} numberOfLines={1}>
          · {info.name} {v.ref}
        </Text>
        <Pressable onPress={app.hideVerseOfDay} accessibilityLabel="Close verse of the day for today" hitSlop={8} style={[styles.x, { backgroundColor: t.segment }]}>
          <Ionicons name="close" size={16} color={t.muted} />
        </Pressable>
      </View>
      <Pressable onPress={() => app.openAyah(v.surah, v.from)} accessibilityLabel="Open this verse in full" style={{ gap: 4 }}>
        <Text style={[styles.arabic, styles.votdAr, { color: t.text }]} numberOfLines={2}>
          {ar}
        </Text>
        {/* one translation here to keep the card short; tap to see everything */}
        {lang === 'en' ? (
          <Text style={[styles.english, { color: t.text }]} numberOfLines={2}>
            {en}
          </Text>
        ) : (
          <Text style={[styles.urdu, { color: t.text }]} numberOfLines={2}>
            {ur}
          </Text>
        )}
        <Text style={[styles.tiny, { color: t.goldText }]}>Tap to read in full</Text>
      </Pressable>
      <View style={styles.votdBtns}>
        <Pressable
          onPress={() => (playing ? app.stopAyah() : app.playAyahs(v.surah, v.from, v.to, v.ref))}
          style={[styles.vBtn, { backgroundColor: t.playBg }]}
        >
          <Ionicons name={playing ? 'stop' : 'play'} size={14} color={t.playIcon} />
          <Text style={[styles.vBtnText, { color: t.playIcon }]}>{playing ? 'Stop' : 'Listen'}</Text>
        </Pressable>
        <Pressable onPress={() => app.openReader(v.surah, v.from)} style={[styles.vBtn, { borderColor: t.line, borderWidth: 1 }]}>
          <Text style={[styles.vBtnText, { color: t.text }]}>Read surah</Text>
        </Pressable>
        <Pressable onPress={share} style={[styles.vBtn, { borderColor: t.line, borderWidth: 1 }]}>
          <Text style={[styles.vBtnText, { color: t.text }]}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------- Quran text page inside the player ----------

export function PlayerTextPage({ app }: { app: AppCtx }) {
  const { t, track } = app;
  const { q, failed, retry } = useQuran();
  const listRef = useRef<FlatList<number>>(null);
  const playingKey = app.ayahPlaying;
  const partFrom = track ? partRange(track.ayahs, surahInfo(track.surah).ayahs).from : 1;
  // follow the recitation (Arabic reciters play ayah by ayah)
  useEffect(() => {
    if (!q || !playingKey || !track) return;
    const [s, a] = playingKey.split(':').map(Number);
    if (s !== track.surah || a < partFrom) return;
    listRef.current?.scrollToIndex({ index: a - partFrom, animated: true, viewPosition: 0.2 });
  }, [playingKey, q, track, partFrom]);
  const counts = useMemo(() => notesCount(app), [app.notes]); // eslint-disable-line react-hooks/exhaustive-deps
  const marks = useMemo(() => new Set(app.reading.marks), [app.reading.marks]);
  if (!track) return null;
  const info = surahInfo(track.surah);
  const { from, to } = partRange(track.ayahs, info.ayahs);
  const list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (!q) return <Loading t={t} failed={failed} retry={retry} />;
  return (
    <View style={{ flex: 1 }}>
      <ModeSwitch app={app} />
      {!!app.arabicPos && (
        <Text style={[styles.tiny, { color: t.goldText, textAlign: 'center', marginTop: 8 }]}>
          The ayah being recited is highlighted and the page follows along
        </Text>
      )}
      <FlatList
        ref={listRef}
        data={list}
        keyExtractor={(a) => String(a)}
        style={{ marginTop: 10 }}
        onScrollToIndexFailed={(e) => {
          listRef.current?.scrollToOffset({ offset: e.averageItemLength * e.index, animated: false });
          setTimeout(() => listRef.current?.scrollToIndex({ index: e.index, animated: true, viewPosition: 0.2 }), 150);
        }}
        extraData={`${app.reading.mode}|${app.ayahPlaying}|${app.notes.length}|${app.reading.marks.length}`}
        contentContainerStyle={{ gap: 16, paddingBottom: 12 }}
        initialNumToRender={6}
        windowSize={7}
        ListHeaderComponent={
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text style={[styles.tiny, { color: t.muted, textAlign: 'center' }]}>Swipe right to go back to the player</Text>
            {from === 1 && showsBismillah(track.surah) ? <Bismillah t={t} q={q} /> : null}
          </View>
        }
        renderItem={({ item: a }) => (
          <AyahRow
            t={t}
            q={q}
            surah={track.surah}
            ayah={a}
            mode={app.reading.mode}
            notes={counts.get(ayahKey(track.surah, a)) ?? 0}
            marked={marks.has(ayahKey(track.surah, a))}
            playing={app.ayahPlaying === ayahKey(track.surah, a)}
            onPress={app.openAyah}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  small: { fontFamily: FONTS.body, fontSize: 13 },
  tiny: { fontFamily: FONTS.body, fontSize: 12 },
  btn: { height: 48, paddingHorizontal: 22, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONTS.semibold, fontSize: 15 },
  modes: { flexDirection: 'row', padding: 4, borderRadius: 14, gap: 4 },
  mode: { flex: 1, minHeight: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modeText: { fontFamily: FONTS.semibold, fontSize: 12 },
  ayah: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  trBlock: { borderTopWidth: StyleSheet.hairlineWidth * 2, paddingTop: 12 },
  ayahTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  num: { minWidth: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  numText: { fontFamily: FONTS.bold, fontSize: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontFamily: FONTS.semibold, fontSize: 12 },
  arabic: { fontFamily: QURAN_FONT, fontSize: 27, lineHeight: 58, textAlign: 'right', writingDirection: 'rtl' },
  urdu: { fontFamily: FONTS.urdu, fontSize: 16, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  english: { fontFamily: FONTS.body, fontSize: 15, lineHeight: 23 },
  bismillah: { fontFamily: QURAN_FONT, fontSize: 28, lineHeight: 60, textAlign: 'center', marginVertical: 4 },
  continue: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20 },
  contIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 0.6 },
  contTitle: { fontFamily: FONTS.semibold, fontSize: 16 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontFamily: FONTS.body, fontSize: 15, paddingVertical: 10 },
  goRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14 },
  goText: { fontFamily: FONTS.semibold, fontSize: 14 },
  surahRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  surahName: { fontFamily: FONTS.semibold, fontSize: 16 },
  surahAr: { fontFamily: FONTS.arabic, fontSize: 21 },
  readHeader: { paddingHorizontal: 16, paddingBottom: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, gap: 12 },
  readTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  readTitle: { fontFamily: FONTS.display, fontSize: 24 },
  reciterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, maxWidth: '100%' },
  round: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { paddingHorizontal: 20, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 12 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center' },
  sheetHead: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  sheetTitle: { fontFamily: FONTS.bold, fontSize: 16 },
  notesPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  action: { width: '48.5%', minHeight: 50, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  actionText: { fontFamily: FONTS.semibold, fontSize: 13, flexShrink: 1 },
  votd: { marginTop: 14, padding: 14, borderRadius: 20, borderWidth: 1, gap: 6 },
  votdHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  votdLabel: { fontFamily: FONTS.bold, fontSize: 12, letterSpacing: 0.5 },
  votdAr: { fontSize: 22, lineHeight: 46 },
  x: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  votdBtns: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  vBtn: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  vBtnText: { fontFamily: FONTS.semibold, fontSize: 13 },
});
