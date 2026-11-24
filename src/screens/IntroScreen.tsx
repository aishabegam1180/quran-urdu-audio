// Short welcome shown once on first launch (and again from About): 4 cards with Skip.
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECITERS_FULL, TRANSLATOR } from '../config';
import { FONTS, LIGHT } from '../theme';
import { HeaderPattern } from '../ui';

const STEPS: { title: string; text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    title: 'Listen with Urdu translation',
    text: `All 114 surahs by ${RECITERS_FULL}, with Urdu by ${TRANSLATOR}. Tap any surah to start.`,
    icon: 'headset-outline',
  },
  {
    title: 'Listen offline',
    text: 'Tap the download icon next to a surah once. After that it plays anywhere, even without internet.',
    icon: 'download-outline',
  },
  {
    title: 'Save your place',
    text: 'Bookmark the exact moment, write notes, and carry on from where you stopped.',
    icon: 'bookmark-outline',
  },
  {
    title: 'More in the menu',
    text: 'Tap the menu at the top to read the Quran in Indo-Pak script, and for Duas, Qibla, Tasbeeh and your daily streak.',
    icon: 'menu',
  },
];

export function IntroScreen({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [size, setSize] = useState({ w: 400, h: 800 });
  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  const finish = () => {
    setStep(0);
    onDone();
  };
  const t = LIGHT;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={finish} statusBarTranslucent navigationBarTranslucent>
      <View
        style={[styles.root, { backgroundColor: t.header, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
        onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <HeaderPattern color={t.gold} width={size.w} height={size.h} />
        <View style={styles.top}>
          <Text style={[styles.count, { color: t.headerMuted }]}>
            {step + 1} of {STEPS.length}
          </Text>
          <Pressable onPress={finish} style={styles.skip} accessibilityRole="button">
            <Text style={[styles.skipText, { color: '#D4AF63' }]}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.middle}>
          <View style={styles.medal}>
            <Ionicons name={s.icon} size={78} color="#D4AF63" />
          </View>
          <Text style={[styles.title, { color: t.headerText }]}>{s.title}</Text>
          <Text style={[styles.text, { color: t.headerMuted }]}>{s.text}</Text>
        </View>

        <View style={{ alignItems: 'center', gap: 22 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, i === step ? { width: 24, backgroundColor: '#D4AF63' } : { backgroundColor: 'rgba(207,224,213,0.35)' }]} />
            ))}
          </View>
          <Pressable
            onPress={() => (last ? finish() : setStep(step + 1))}
            style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>{last ? 'Get started' : 'Next'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontFamily: FONTS.body, fontSize: 13 },
  skip: { minHeight: 44, minWidth: 60, alignItems: 'flex-end', justifyContent: 'center' },
  skipText: { fontFamily: FONTS.semibold, fontSize: 15 },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  medal: { width: 176, height: 176, borderRadius: 88, borderWidth: 1.5, borderColor: 'rgba(212,175,99,0.6)', backgroundColor: 'rgba(212,175,99,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 34, textAlign: 'center' },
  text: { fontFamily: FONTS.body, fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 340 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cta: { alignSelf: 'stretch', height: 54, borderRadius: 27, backgroundColor: '#D4AF63', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: FONTS.bold, fontSize: 16, color: '#0B2F23' },
});
