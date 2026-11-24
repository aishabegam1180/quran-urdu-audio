// Bookmarks with the exact time: tap ▶ time to continue from that point.
import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, FlatListProps, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, formatTime } from '../library';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader, StarBadge } from '../ui';
import { shortDate } from './NotesScreen';

/** The list itself, also shown in the Saved tab on the home screen. */
export function SavedList({
  app,
  bottomPad,
  header,
  onScroll,
}: {
  app: AppCtx;
  bottomPad: number;
  header?: React.ReactElement;
  onScroll?: FlatListProps<unknown>['onScroll'];
}) {
  const { t } = app;
  const items = [...app.bookmarks]
    .sort((a, b) => b.savedAt - a.savedAt)
    .map((b) => ({ b, where: app.trackById(b.trackId) }))
    .filter((x) => x.where);

  const remove = (b: Bookmark) =>
    Alert.alert('Remove bookmark?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => app.removeBookmark(b.trackId) },
    ]);

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.b.trackId}
      ListHeaderComponent={header}
      onScroll={onScroll}
      scrollEventThrottle={32}
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 4, paddingBottom: bottomPad, gap: 8 }}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: t.muted }]}>
          Tap the bookmark on the Now playing screen to save the exact moment. It will appear here.
        </Text>
      }
      renderItem={({ item: { b, where } }) => (
        <Pressable
          onPress={() => app.resume(b.trackId, b.position)}
          onLongPress={() => remove(b)}
          style={[styles.row, { backgroundColor: t.surface, borderColor: t.line }]}
        >
          <StarBadge n={where!.track.surah} t={t} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>
              {app.label(where!.track)}
            </Text>
            <Text style={[styles.sub, { color: t.muted }]} numberOfLines={1}>
              {[app.ayahText(where!.track), `saved ${shortDate(b.savedAt).toLowerCase() === 'today' ? 'today' : shortDate(b.savedAt)}`]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
          <View style={[styles.resume, { backgroundColor: t.activeBg }]}>
            <Ionicons name="play" size={12} color={t.green} />
            <Text style={[styles.resumeText, { color: t.green }]}>{formatTime(b.position)}</Text>
          </View>
          <Pressable onPress={() => remove(b)} hitSlop={10} accessibilityLabel="Remove bookmark">
            <Ionicons name="close" size={18} color={t.muted} />
          </Pressable>
        </Pressable>
      )}
    />
  );
}

export function SavedScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top + 10 }}>
      <View style={{ paddingHorizontal: 20, gap: 10, paddingBottom: 10 }}>
        <ScreenHeader t={t} title="Saved" onBack={() => app.navigate('list')} />
        <Text style={[styles.p, { color: t.muted }]}>
          Tap a bookmark to continue from that exact moment. Press and hold to remove it.
        </Text>
      </View>
      <SavedList app={app} bottomPad={24 + insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  p: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 19 },
  empty: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21, textAlign: 'center', padding: 28 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, borderWidth: 1 },
  name: { fontFamily: FONTS.semibold, fontSize: 15 },
  sub: { fontFamily: FONTS.body, fontSize: 12 },
  resume: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 18 },
  resumeText: { fontFamily: FONTS.bold, fontSize: 13 },
});
