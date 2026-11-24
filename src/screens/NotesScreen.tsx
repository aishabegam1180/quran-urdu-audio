// Notes list: search, listen from the linked moment, edit, delete, and add new notes.
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime, Note } from '../library';
import { surahInfo } from '../surahs';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

export function shortDate(ms: number) {
  const d = new Date(ms);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function NotesScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return [...app.notes]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter((n) => {
        if (!k) return true;
        const where = n.trackId ? app.trackById(n.trackId) : null;
        return (
          n.text.toLowerCase().includes(k) ||
          (where && app.label(where.track).toLowerCase().includes(k)) ||
          (n.ayah && (n.ayah.includes(k) || surahInfo(Number(n.ayah.split(':')[0])).name.toLowerCase().includes(k)))
        );
      });
  }, [app.notes, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmDelete = (n: Note) =>
    Alert.alert('Delete this note?', n.text.slice(0, 80), [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => app.deleteNote(n.id) },
    ]);

  const row = ({ item: n }: { item: Note }) => {
    const where = n.trackId ? app.trackById(n.trackId) : null;
    const ay = n.ayah ? n.ayah.split(':').map(Number) : null;
    return (
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
        <View style={styles.cardTop}>
          {ay ? (
            <Text style={[styles.tag, { color: t.green, backgroundColor: t.activeBg }]} numberOfLines={1}>
              {surahInfo(ay[0]).name} · {n.ayah}
            </Text>
          ) : where ? (
            <>
              <Text style={[styles.tag, { color: t.green, backgroundColor: t.activeBg }]} numberOfLines={1}>
                {app.label(where.track)}
              </Text>
              <Text style={[styles.at, { color: t.goldText }]}>at {formatTime(n.position)}</Text>
            </>
          ) : (
            <Text style={[styles.tag, { color: t.muted, backgroundColor: t.segment }]}>General note</Text>
          )}
          <Text style={[styles.date, { color: t.muted }]}>{shortDate(n.updatedAt)}</Text>
        </View>
        <Text style={[styles.text, { color: t.text }]}>{n.text}</Text>
        <View style={styles.actions}>
          {ay && (
            <Pressable onPress={() => app.openReader(ay[0], ay[1])} style={styles.action} hitSlop={6}>
              <Ionicons name="book-outline" size={14} color={t.green} />
              <Text style={[styles.actionText, { color: t.green }]}>Read ayah</Text>
            </Pressable>
          )}
          {where && (
            <Pressable onPress={() => app.resume(n.trackId!, n.position)} style={styles.action} hitSlop={6}>
              <Ionicons name="play" size={14} color={t.green} />
              <Text style={[styles.actionText, { color: t.green }]}>Listen from here</Text>
            </Pressable>
          )}
          <Pressable onPress={() => app.openNoteEditor(n)} style={styles.action} hitSlop={6}>
            <Text style={[styles.actionText, { color: t.muted }]}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => confirmDelete(n)} style={styles.action} hitSlop={6}>
            <Text style={[styles.actionText, { color: t.muted }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10 }]}>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <ScreenHeader
          t={t}
          title="Notes"
          onBack={() => app.navigate('list')}
          right={<Text style={[styles.count, { color: t.muted }]}>{app.notes.length} {app.notes.length === 1 ? 'note' : 'notes'}</Text>}
        />
        <View style={[styles.search, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Ionicons name="search" size={18} color={t.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search your notes…"
            placeholderTextColor={t.muted}
            accessibilityLabel="Search notes"
            style={[styles.input, { color: t.text }]}
          />
        </View>
      </View>
      <FlatList
        data={list}
        keyExtractor={(n) => n.id}
        renderItem={row}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 + insets.bottom, gap: 10 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: t.muted }]}>
            {q ? 'No notes match your search.' : 'No notes yet. While listening, tap Note on the player to save a thought linked to that moment, or tap New note.'}
          </Text>
        }
      />
      <Pressable
        onPress={() => app.openNoteEditor(null)}
        style={[styles.fab, { backgroundColor: t.playBg, bottom: 24 + insets.bottom }]}
      >
        <Ionicons name="add" size={20} color={t.playIcon} />
        <Text style={[styles.fabText, { color: t.playIcon }]}>New note</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  count: { fontFamily: FONTS.body, fontSize: 13 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  input: { flex: 1, fontFamily: FONTS.body, fontSize: 15, paddingVertical: 0 },
  card: { padding: 14, borderRadius: 16, borderWidth: 1, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { fontFamily: FONTS.semibold, fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden', flexShrink: 1 },
  at: { fontFamily: FONTS.semibold, fontSize: 12 },
  date: { marginLeft: 'auto', fontFamily: FONTS.body, fontSize: 11 },
  text: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 18 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32 },
  actionText: { fontFamily: FONTS.semibold, fontSize: 13 },
  empty: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21, textAlign: 'center', padding: 24 },
  fab: { position: 'absolute', right: 20, height: 54, paddingHorizontal: 20, borderRadius: 27, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 8 },
  fabText: { fontFamily: FONTS.semibold, fontSize: 15 },
});
