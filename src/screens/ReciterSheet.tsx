// Choose a reciter: the app's own Urdu audio (Al-Sudais & Al-Shuraim with Urdu translation), or one of
// ten Arabic-only reciters who are played ayah by ayah, so the Quran text can follow along.
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECITERS_FULL, TRANSLATOR } from '../config';
import { ARABIC_RECITERS, URDU } from '../reciters';
import { FONTS } from '../theme';
import { AppCtx } from '../types';

const CAP = 1.3;

export function ReciterSheet({ app, visible, onClose }: { app: AppCtx; visible: boolean; onClose: () => void }) {
  const { t } = app;
  const insets = useSafeAreaInsets();

  const row = (id: string, title: string, sub: string, badge: string) => {
    const on = app.reciter === id;
    return (
      <Pressable
        key={id}
        onPress={() => app.setReciter(id)}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
        style={[styles.row, { borderColor: on ? t.green : t.line, backgroundColor: on ? t.activeBg : t.surface }]}
      >
        <View style={[styles.badge, { backgroundColor: on ? t.header : t.segment }]}>
          <Text maxFontSizeMultiplier={CAP} style={[styles.badgeText, { color: on ? t.gold : t.green }]}>{badge}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text maxFontSizeMultiplier={CAP} style={[styles.name, { color: t.text }]}>{title}</Text>
          <Text maxFontSizeMultiplier={CAP} style={[styles.sub, { color: t.muted }]}>{sub}</Text>
        </View>
        {on && <Ionicons name="checkmark-circle" size={24} color={t.green} />}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { backgroundColor: t.sheet, paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.handle, { backgroundColor: t.line }]} />
        <Text maxFontSizeMultiplier={CAP} style={[styles.h2, { color: t.text }]}>Choose a reciter</Text>
        <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          <Text maxFontSizeMultiplier={CAP} style={[styles.section, { color: t.goldText }]}>WITH URDU TRANSLATION</Text>
          {row(URDU, RECITERS_FULL.replace(/Shaykh /g, ''), `Urdu by ${TRANSLATOR} · works offline when downloaded`, 'اردو')}
          <Text maxFontSizeMultiplier={CAP} style={[styles.section, { color: t.goldText, marginTop: 8 }]}>ARABIC ONLY · HIGHLIGHTS EACH AYAH</Text>
          <Text maxFontSizeMultiplier={CAP} style={[styles.note, { color: t.muted }]}>
            Plays the same part ayah by ayah. Open "Quran text" in the player to read along. Needs internet.
          </Text>
          {ARABIC_RECITERS.map((r) =>
            row(
              r.id,
              r.name,
              'Arabic recitation',
              r.short
                .replace(/^(Al|As|Ash|Ar|Abdul)[- ]/, '')
                .slice(0, 2)
                .toUpperCase(),
            ),
          )}
          <Text maxFontSizeMultiplier={CAP} style={[styles.note, { color: t.muted, marginTop: 6 }]}>
            Arabic recitations: Islamic Network (alquran.cloud).
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '86%', paddingHorizontal: 20, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 12, alignSelf: 'center', width: '100%', maxWidth: 680 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center' },
  h2: { fontFamily: FONTS.display, fontSize: 22 },
  section: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 0.8 },
  note: { fontFamily: FONTS.body, fontSize: 12, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1.5 },
  badge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: FONTS.bold, fontSize: 13 },
  name: { fontFamily: FONTS.semibold, fontSize: 15 },
  sub: { fontFamily: FONTS.body, fontSize: 12 },
});
