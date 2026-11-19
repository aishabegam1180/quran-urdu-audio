// Bottom sheet for the sleep timer and playback speed.
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '../theme';
import { AppCtx } from '../types';

const TIMERS: { label: string; value: 'off' | 'end' | number }[] = [
  { label: 'Off', value: 'off' },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: 'End of part', value: 'end' },
];
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function SleepSheet({ app, visible }: { app: AppCtx; visible: boolean }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const current =
    app.sleep.kind === 'off' ? 'off' : app.sleep.kind === 'end' ? 'end' : app.sleep.minutes;
  const note =
    app.sleep.kind === 'end'
      ? 'Stops when this part finishes'
      : app.sleep.kind === 'minutes'
        ? `Stops in ${Math.ceil(app.sleepLeft / 60)} min`
        : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={app.closeSheet} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} onPress={app.closeSheet} accessibilityLabel="Close" />
      <View style={[styles.sheet, { backgroundColor: t.sheet, paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.handle, { backgroundColor: t.line }]} />

        <View style={{ gap: 12 }}>
          <View style={styles.headRow}>
            <Ionicons name="moon-outline" size={22} color={t.goldText} />
            <Text style={[styles.h2, { color: t.text }]}>Sleep timer</Text>
          </View>
          <Text style={[styles.p, { color: t.muted }]}>
            The recitation fades out and stops, for listening at bedtime.
          </Text>
          <View style={styles.grid}>
            {TIMERS.map((o) => {
              const on = current === o.value;
              return (
                <Pressable
                  key={o.label}
                  onPress={() => app.setSleep(o.value)}
                  style={[
                    styles.timer,
                    {
                      borderColor: on ? t.pillActive : t.line,
                      backgroundColor: on ? t.pillActive : t.surface,
                    },
                  ]}
                >
                  <Text style={[styles.timerText, { color: on ? t.pillActiveText : t.text }]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {note && <Text style={[styles.note, { color: t.green }]}>{note}</Text>}
        </View>

        <View style={[styles.rule, { backgroundColor: t.line }]} />

        <View style={{ gap: 12 }}>
          <View style={[styles.headRow, { justifyContent: 'space-between' }]}>
            <Text style={[styles.h2, { color: t.text }]}>Playback speed</Text>
            <Text style={[styles.speedNow, { color: t.goldText }]}>
              {app.speed === 1 ? 'Normal' : `${app.speed}×`}
            </Text>
          </View>
          <View style={[styles.segment, { backgroundColor: t.segment }]}>
            {SPEEDS.map((s) => {
              const on = app.speed === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => app.setSpeed(s)}
                  style={[styles.seg, on && { backgroundColor: t.surface, elevation: 2 }]}
                >
                  <Text style={[styles.segText, { color: on ? t.green : t.muted }]}>{s}×</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable onPress={app.closeSheet} style={[styles.done, { backgroundColor: t.playBg }]}>
          <Text style={[styles.doneText, { color: t.playIcon }]}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 22, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 22 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center' },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h2: { fontFamily: FONTS.display, fontSize: 22 },
  p: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timer: { width: '31.8%', minHeight: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  timerText: { fontFamily: FONTS.semibold, fontSize: 14 },
  note: { fontFamily: FONTS.semibold, fontSize: 13 },
  rule: { height: 1 },
  speedNow: { fontFamily: FONTS.bold, fontSize: 15 },
  segment: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: 16 },
  seg: { flex: 1, minHeight: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: FONTS.semibold, fontSize: 14 },
  done: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontFamily: FONTS.semibold, fontSize: 15 },
});
