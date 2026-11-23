// Tasbeeh counter: tap or swipe on the circle to count, with gentle vibration,
// preset dhikr with targets, colour themes and today's total. Saved on the phone.
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dayKey } from '../streak';
import { FONTS } from '../theme';
import { AppCtx } from '../types';

const KEY = 'tasbeeh.v1';

type Preset = { id: string; label: string; ar: string; meaning: string; target: number };

const PRESETS: Preset[] = [
  { id: 'subhanallah', label: 'SubhanAllah', ar: 'سُبْحَانَ ٱللَّٰهِ', meaning: 'Glory be to Allah', target: 33 },
  { id: 'alhamdulillah', label: 'Alhamdulillah', ar: 'ٱلْحَمْدُ لِلَّٰهِ', meaning: 'All praise is for Allah', target: 33 },
  { id: 'allahuakbar', label: 'Allahu Akbar', ar: 'ٱللَّٰهُ أَكْبَرُ', meaning: 'Allah is the Greatest', target: 34 },
  { id: 'tahleel', label: 'La ilaha illallah', ar: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', meaning: 'There is no god but Allah', target: 100 },
  { id: 'istighfar', label: 'Astaghfirullah', ar: 'أَسْتَغْفِرُ ٱللَّٰهَ', meaning: 'I seek forgiveness from Allah', target: 100 },
  { id: 'durood', label: 'Durood', ar: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', meaning: 'O Allah, send blessings upon Muhammad', target: 100 },
  { id: 'custom', label: 'Custom', ar: 'ذِكْر', meaning: 'Your own dhikr', target: 100 },
];

const CUSTOM_TARGETS = [33, 99, 100, 313, 500, 1000];

const COLOURS = [
  { name: 'Emerald', bg: '#0F3D2E', ring: '#D4AF63' },
  { name: 'Night blue', bg: '#16325C', ring: '#8FB4F0' },
  { name: 'Rose', bg: '#7A2E4A', ring: '#F4A9C4' },
  { name: 'Purple', bg: '#45306E', ring: '#C6B0F2' },
  { name: 'Teal', bg: '#0E5560', ring: '#8FDCE3' },
  { name: 'Charcoal', bg: '#24292E', ring: '#F2D58F' },
];

type Saved = { preset: string; counts: Record<string, number>; colour: number; customTarget: number; todayKey: string; todayTotal: number };

const EMPTY: Saved = { preset: 'subhanallah', counts: {}, colour: 0, customTarget: 100, todayKey: '', todayTotal: 0 };

const RING = 236;

export function TasbeehScreen({ app }: { app: AppCtx }) {
  const insets = useSafeAreaInsets();
  const [s, setS] = useState<Saved>(EMPTY);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const v = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
        if (v.todayKey !== dayKey(new Date())) Object.assign(v, { todayKey: dayKey(new Date()), todayTotal: 0 });
        setS(v);
      })
      .catch(() => {})
      .finally(() => (loaded.current = true));
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
  }, [s]);

  const preset = PRESETS.find((p) => p.id === s.preset) ?? PRESETS[0];
  const target = preset.id === 'custom' ? s.customTarget : preset.target;
  const total = s.counts[preset.id] ?? 0;
  const count = total % target;
  const round = Math.floor(total / target) + 1;
  const colour = COLOURS[s.colour] ?? COLOURS[0];

  // the latest values for the gesture handler (it is created once)
  const live = useRef({ preset, target, total });
  live.current = { preset, target, total };

  const increment = () => {
    const { preset: p, target: tg, total: tot } = live.current;
    const next = tot + 1;
    if (next % tg === 0) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setS((v) => {
      const k = dayKey(new Date());
      const today = v.todayKey === k ? v.todayTotal : 0;
      return { ...v, counts: { ...v.counts, [p.id]: (v.counts[p.id] ?? 0) + 1 }, todayKey: k, todayTotal: today + 1 };
    });
  };

  // a tap, or a swipe in any direction, counts one
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: () => increment(),
        onPanResponderTerminationRequest: () => false,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const reset = () =>
    Alert.alert('Reset count?', `${preset.label} will start again from 0.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => setS((v) => ({ ...v, counts: { ...v.counts, [preset.id]: 0 } })) },
    ]);

  const pickTarget = () =>
    Alert.alert(
      'Custom target',
      'How many counts in one round?',
      [
        ...CUSTOM_TARGETS.map((n) => ({ text: String(n), onPress: () => setS((v) => ({ ...v, customTarget: n })) })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
      { cancelable: true },
    );

  const pct = count / target;

  return (
    <View style={[styles.root, { backgroundColor: colour.bg, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => app.navigate('list')} accessibilityLabel="Back" style={styles.circle}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Tasbeeh</Text>
        <Pressable onPress={reset} accessibilityLabel="Reset count" style={[styles.circle, { marginLeft: 'auto' }]}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: 14 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {PRESETS.map((p) => {
          const on = p.id === preset.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setS((v) => ({ ...v, preset: p.id }))}
              style={[styles.chip, { backgroundColor: on ? '#FFFFFF' : 'transparent' }]}
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.chipText, { color: on ? colour.bg : '#FFFFFF' }]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.words}>
        <Text style={styles.ar}>{preset.ar}</Text>
        <Text style={styles.tr}>{preset.label}</Text>
        <Text style={styles.meaning}>{preset.meaning}</Text>
        {preset.id === 'custom' && (
          <Pressable onPress={pickTarget} style={styles.targetBtn}>
            <Text style={styles.targetText}>Target: {target} · change</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.tapArea} {...pan.panHandlers} accessible accessibilityRole="button" accessibilityLabel={`Count. ${count} of ${target}`} onAccessibilityTap={increment}>
        <View style={styles.ringBox}>
          <ProgressRing pct={pct} colour={colour.ring} target={target} />
          <View style={styles.center}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.of}>
              of {target} · Round {round}
            </Text>
          </View>
        </View>
        <Text style={styles.hint}>Tap or swipe on the circle to count</Text>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Today’s total</Text>
          <Text style={styles.totalValue}>{s.todayTotal}</Text>
        </View>
        <View style={styles.colours}>
          <Text style={styles.totalLabel}>Colour</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {COLOURS.map((c, i) => (
              <Pressable
                key={c.name}
                onPress={() => setS((v) => ({ ...v, colour: i }))}
                accessibilityLabel={c.name}
                accessibilityState={{ selected: i === s.colour }}
                style={[styles.swatch, { backgroundColor: c.bg, borderWidth: i === s.colour ? 3 : 2, borderColor: i === s.colour ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

/** A circle of prayer beads that light up as the count grows (one bead per count up to 34, else 50). */
function ProgressRing({ pct, colour, target }: { pct: number; colour: string; target: number }) {
  const n = target <= 34 ? target : 50;
  const lit = Math.round(Math.max(0, Math.min(1, pct)) * n);
  const bead = n > 34 ? 9 : 12;
  return (
    <View style={{ width: RING, height: RING }}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={[StyleSheet.absoluteFill, { alignItems: 'center', transform: [{ rotate: `${(i * 360) / n}deg` }] }]}>
          <View
            style={{
              marginTop: 2,
              width: bead,
              height: bead,
              borderRadius: bead / 2,
              backgroundColor: i < lit ? colour : 'rgba(255,255,255,0.18)',
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  circle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FONTS.display, fontSize: 26, color: '#FFFFFF' },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: FONTS.semibold, fontSize: 13 },
  words: { marginTop: 18, alignItems: 'center', gap: 4, paddingHorizontal: 24 },
  ar: { fontFamily: FONTS.arabic, fontSize: 32, lineHeight: 52, color: '#FFFFFF', textAlign: 'center' },
  tr: { fontFamily: FONTS.semibold, fontSize: 15, color: '#FFFFFF' },
  meaning: { fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'center' },
  targetBtn: { marginTop: 6, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', justifyContent: 'center' },
  targetText: { fontFamily: FONTS.semibold, fontSize: 13, color: '#FFFFFF' },
  tapArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  ringBox: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', gap: 2 },
  count: { fontFamily: FONTS.bold, fontSize: 68, lineHeight: 76, color: '#FFFFFF' },
  of: { fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.82)' },
  hint: { fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  totalLabel: { fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.88)' },
  totalValue: { fontFamily: FONTS.bold, fontSize: 18, color: '#FFFFFF' },
  colours: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  swatch: { width: 36, height: 36, borderRadius: 18 },
});
