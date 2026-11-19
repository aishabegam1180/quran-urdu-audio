// Duas from the Quran: full ayahs (Tanzil text, unchanged) with the dua words
// highlighted, Jalandhari's Urdu translation, categories, search, favourites, share.
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { arabicNumber, Dua, DUA_CATEGORIES, DUAS } from '../duas';
import { surahInfo } from '../surahs';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

const FILTERS = [
  { key: 'all', label: 'All' },
  ...DUA_CATEGORIES,
  { key: 'prophets', label: 'Prophets' },
  { key: 'favourites', label: 'Favourites' },
];

export function duaRef(d: Dua) {
  const first = d.ayahs[0].a;
  const last = d.ayahs[d.ayahs.length - 1].a;
  return `${surahInfo(d.s).name} ${d.s}:${first}${last !== first ? `–${last}` : ''}`;
}

export function DuasScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return DUAS.filter((d) => {
      if (filter === 'prophets' && !d.prophet) return false;
      if (filter === 'favourites' && !app.duaFavs.includes(d.id)) return false;
      if (!['all', 'prophets', 'favourites'].includes(filter) && !d.cats.includes(filter)) return false;
      if (!k) return true;
      const hay = [d.title, d.who, duaRef(d), ...d.cats, ...d.ayahs.map((a) => a.ur)].join(' ').toLowerCase();
      return hay.includes(k);
    });
  }, [filter, q, app.duaFavs]);

  const share = (d: Dua) => {
    const arabic = d.ayahs.map((a) => `${a.pre ? a.pre + ' ' : ''}${a.dua} ﴿${arabicNumber(a.a)}﴾`).join(' ');
    const urdu = d.ayahs.map((a) => a.ur).join(' ');
    Share.share({ message: `${d.title}\n\n${arabic}\n\n${urdu}\n\n— ${duaRef(d)}\n\nShared from Quran Safar – Urdu Tarjuma` }).catch(() => {});
  };

  const listen = (d: Dua) => {
    const i = app.trackForAyah(d.s, d.ayahs[0].a);
    if (i >= 0) app.pick(i);
  };

  const card = ({ item: d }: { item: Dua }) => {
    const fav = app.duaFavs.includes(d.id);
    return (
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
        <View style={styles.cardTop}>
          <Text style={[styles.title, { color: t.text }]}>{d.title}</Text>
          <Text style={[styles.ref, { color: t.goldText, backgroundColor: t.segment }]}>{duaRef(d)}</Text>
        </View>
        <Text style={[styles.ar, { color: t.muted }]}>
          {d.ayahs.map((a) => (
            <Text key={a.a}>
              {a.pre ? `${a.pre} ` : ''}
              <Text style={{ color: t.dark ? t.gold : t.green }}>{a.dua}</Text>
              <Text style={{ color: t.goldText }}>{` ﴿${arabicNumber(a.a)}﴾ `}</Text>
            </Text>
          ))}
        </Text>
        <Text style={[styles.ur, { color: t.text }]}>{d.ayahs.map((a) => a.ur).join(' ')}</Text>
        <View style={[styles.actions, { borderTopColor: t.line }]}>
          <Pressable onPress={() => listen(d)} style={[styles.listen, { backgroundColor: t.activeBg }]}>
            <Ionicons name="play" size={13} color={t.green} />
            <Text style={[styles.listenText, { color: t.green }]}>Listen</Text>
          </Pressable>
          <Pressable
            onPress={() => app.toggleDuaFav(d.id)}
            accessibilityLabel={fav ? 'Remove from favourites' : 'Add to favourites'}
            style={[styles.round, { borderColor: t.line }]}
          >
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={17} color={t.goldText} />
          </Pressable>
          <Pressable onPress={() => share(d)} accessibilityLabel="Share this dua" style={[styles.round, { borderColor: t.line }]}>
            <Ionicons name="share-social-outline" size={17} color={t.muted} />
          </Pressable>
          <Text style={[styles.who, { color: t.muted }]} numberOfLines={1}>
            {d.who}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top + 10 }}>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <ScreenHeader t={t} title="Duas from the Quran" subtitle="أدعية من القرآن الكريم" onBack={() => app.navigate('list')} />
        <View style={[styles.search, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Ionicons name="search" size={18} color={t.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search: forgiveness, parents, Musa…"
            placeholderTextColor={t.muted}
            accessibilityLabel="Search duas"
            style={[styles.input, { color: t.text }]}
          />
        </View>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, { borderColor: on ? t.pillActive : t.line, backgroundColor: on ? t.pillActive : t.pill }]}
              >
                <Text style={[styles.chipText, { color: on ? t.pillActiveText : t.text }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        renderItem={card}
        extraData={[app.duaFavs, t]}
        initialNumToRender={4}
        windowSize={5}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 + insets.bottom, gap: 12 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<Text style={[styles.count, { color: t.muted }]}>{list.length} duas</Text>}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: t.muted }]}>
            {filter === 'favourites' ? 'Tap the heart on a dua to keep it here.' : 'No dua matches your search.'}
          </Text>
        }
        ListFooterComponent={
          <Text style={[styles.credit, { color: t.muted }]}>
            Arabic text: Tanzil Project (
            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://tanzil.net').catch(() => {})}>
              tanzil.net
            </Text>
            ) · Urdu translation: Fateh Muhammad Jalandhari
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  input: { flex: 1, fontFamily: FONTS.body, fontSize: 14, paddingVertical: 0 },
  chips: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, justifyContent: 'center' },
  chipText: { fontFamily: FONTS.semibold, fontSize: 13 },
  count: { fontFamily: FONTS.body, fontSize: 12, marginBottom: 2, marginLeft: 4 },
  card: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontFamily: FONTS.bold, fontSize: 14, lineHeight: 20 },
  ref: { fontFamily: FONTS.semibold, fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  ar: { fontFamily: FONTS.arabic, fontSize: 22, lineHeight: 44, textAlign: 'right', writingDirection: 'rtl' },
  ur: { fontFamily: FONTS.urdu, fontSize: 14, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, paddingTop: 10 },
  listen: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, borderRadius: 18 },
  listenText: { fontFamily: FONTS.semibold, fontSize: 13 },
  round: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  who: { flex: 1, textAlign: 'right', fontFamily: FONTS.body, fontSize: 11 },
  empty: { fontFamily: FONTS.body, fontSize: 14, textAlign: 'center', padding: 28 },
  credit: { fontFamily: FONTS.body, fontSize: 11, lineHeight: 16, marginTop: 6, marginHorizontal: 4 },
});
