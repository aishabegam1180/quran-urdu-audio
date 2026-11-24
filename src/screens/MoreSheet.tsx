// The ☰ More menu: Read Quran, Qibla, Tasbeeh, Duas, Streak, Notes, Saved, Feedback, About.
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '../theme';
import { AppCtx, View as Screen } from '../types';

const ITEMS: { view: Screen; label: string; sub: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { view: 'readhome', label: 'Read Quran', sub: 'Indo-Pak script with Urdu & English', icon: 'book-outline' },
  { view: 'qibla', label: 'Qibla direction', sub: 'Compass pointing to the Kaaba', icon: 'compass-outline' },
  { view: 'tasbeeh', label: 'Tasbeeh', sub: 'Count your dhikr with a swipe', icon: 'ellipse-outline' },
  { view: 'duas', label: 'Duas from the Quran', sub: '55 duas with Urdu & English', icon: 'hand-left-outline' },
  { view: 'streak', label: 'Daily streak', sub: 'Your streak and daily reminder', icon: 'flame-outline' },
  { view: 'notes', label: 'Notes', sub: 'Your reflections on surahs', icon: 'document-text-outline' },
  { view: 'saved', label: 'Saved', sub: 'Bookmarks with the exact time', icon: 'bookmark-outline' },
  { view: 'feedback', label: 'Send feedback', sub: 'Suggestions or problems', icon: 'chatbox-ellipses-outline' },
  { view: 'about', label: 'About Quran Safar', sub: 'Our mission and credits', icon: 'information-circle-outline' },
];

export function MoreSheet({ app, visible, onClose }: { app: AppCtx; visible: boolean; onClose: () => void }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} onPress={onClose} accessibilityLabel="Close menu" />
      <View style={[styles.sheet, { backgroundColor: t.sheet, paddingBottom: insets.bottom + 18 }]}>
        <View style={[styles.handle, { backgroundColor: t.line }]} />
        <ScrollView style={{ maxHeight: 560 }} contentContainerStyle={{ gap: 2 }} showsVerticalScrollIndicator={false}>
        {ITEMS.map((it) => (
          <Pressable
            key={it.view}
            onPress={() => {
              onClose();
              app.navigate(it.view);
            }}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: t.activeBg }]}
          >
            <View style={[styles.iconBox, { backgroundColor: t.activeBg }]}>
              <Ionicons name={it.icon} size={21} color={t.green} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.label, { color: t.text }]}>{it.label}</Text>
              <Text style={[styles.sub, { color: t.muted }]}>{it.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.muted} />
          </Pressable>
        ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 2 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 62, paddingHorizontal: 10, borderRadius: 14 },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: FONTS.semibold, fontSize: 15 },
  sub: { fontFamily: FONTS.body, fontSize: 12 },
});
