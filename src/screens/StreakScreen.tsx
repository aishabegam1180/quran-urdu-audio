// Daily streak: current and best streak, the last 7 days, and the daily reminder.
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOAL_SECONDS, timeLabel } from '../streak';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

const TIMES: [number, number][] = [
  [5, 30],
  [7, 0],
  [13, 0],
  [18, 0],
  [20, 30],
  [21, 30],
  [22, 30],
];

export function StreakScreen({ app }: { app: AppCtx }) {
  const { t, streak } = app;
  const insets = useSafeAreaInsets();
  const r = streak.reminder;
  const left = Math.max(0, GOAL_SECONDS - streak.todaySecs);

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10 }]}>
      <ScreenHeader t={t} title="Your daily streak" onBack={() => app.navigate('list')} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: t.header }]}>
          <View style={[styles.flameRing, { borderColor: t.gold }]}>
            <Ionicons name="flame" size={42} color="#F2B54A" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.big, { color: t.headerText }]}>
              {streak.current} {streak.current === 1 ? 'day' : 'days'}
            </Text>
            <Text style={[styles.sub, { color: t.headerMuted }]}>Current streak · Best: {streak.best} {streak.best === 1 ? 'day' : 'days'}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.cardTitle, { color: t.muted }]}>Last 7 days</Text>
          <View style={styles.week}>
            {streak.week.map((d) => (
              <View key={d.key} style={styles.dayCol}>
                <Text style={[styles.dayName, { color: d.today ? t.text : t.muted }]}>{d.today ? 'Today' : d.label}</Text>
                <View
                  style={[
                    styles.dot,
                    d.done
                      ? { backgroundColor: t.green }
                      : d.today
                        ? { borderWidth: 2, borderStyle: 'dashed', borderColor: '#E39A2D', backgroundColor: t.dark ? 'transparent' : '#FDF3DF' }
                        : { backgroundColor: t.segment },
                  ]}
                  accessibilityLabel={`${d.today ? 'Today' : d.label}: ${d.done ? 'done' : 'not done'}`}
                >
                  {d.done ? (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  ) : d.today ? (
                    <Text style={[styles.dotText, { color: t.goldText }]}>{Math.floor(streak.todaySecs)}s</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <Text style={[styles.note, { color: t.muted }]}>
            {streak.doneToday
              ? 'Today is done. Masha’Allah! Come back tomorrow to keep it going.'
              : `Listen for ${left} more second${left === 1 ? '' : 's'} today to keep your streak.`}
            {'\n'}A day counts when you listen to the Quran for at least 1 minute.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.label, { color: t.text }]}>Daily reminder</Text>
              <Text style={[styles.small, { color: t.muted }]}>A gentle notification so you don’t miss a day</Text>
            </View>
            <Switch
              value={r.on}
              onValueChange={(on) => app.setReminder({ on })}
              trackColor={{ true: t.green, false: t.line }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Daily reminder"
            />
          </View>
          {app.reminderBlocked && (
            <Pressable onPress={() => Linking.openSettings()} style={[styles.warn, { backgroundColor: t.segment }]}>
              <Ionicons name="notifications-off-outline" size={18} color={t.goldText} />
              <Text style={[styles.small, { color: t.text, flex: 1 }]}>
                Notifications are turned off for Quran Safar. Tap here to allow them in Settings.
              </Text>
            </Pressable>
          )}
          {r.on && (
            <>
              <Text style={[styles.small, { color: t.muted, marginTop: 4 }]}>Remind me at</Text>
              <View style={styles.times}>
                {TIMES.map(([h, m]) => {
                  const on = r.hour === h && r.minute === m;
                  return (
                    <Pressable
                      key={`${h}:${m}`}
                      onPress={() => app.setReminder({ hour: h, minute: m })}
                      style={[styles.time, { backgroundColor: on ? t.pillActive : t.bg, borderColor: on ? t.pillActive : t.line }]}
                      accessibilityState={{ selected: on }}
                    >
                      <Text style={[styles.timeText, { color: on ? t.pillActiveText : t.text }]}>{timeLabel(h, m)}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                onPress={() => app.setReminder({ onlyIfMissed: !r.onlyIfMissed })}
                style={styles.check}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: r.onlyIfMissed }}
              >
                <Ionicons name={r.onlyIfMissed ? 'checkbox' : 'square-outline'} size={22} color={t.green} />
                <Text style={[styles.small, { color: t.text, flex: 1, fontSize: 13 }]}>Only if I haven’t listened yet that day</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  hero: { marginTop: 14, padding: 18, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 16 },
  flameRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(242,181,74,0.14)' },
  big: { fontFamily: FONTS.bold, fontSize: 36, lineHeight: 42 },
  sub: { fontFamily: FONTS.body, fontSize: 13 },
  card: { padding: 14, borderRadius: 18, borderWidth: 1, gap: 12 },
  cardTitle: { fontFamily: FONTS.semibold, fontSize: 13 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6, flex: 1 },
  dayName: { fontFamily: FONTS.body, fontSize: 11 },
  dot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontFamily: FONTS.bold, fontSize: 11 },
  note: { fontFamily: FONTS.body, fontSize: 12, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontFamily: FONTS.semibold, fontSize: 15 },
  small: { fontFamily: FONTS.body, fontSize: 12, lineHeight: 17 },
  warn: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, borderRadius: 12 },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: { minHeight: 40, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  timeText: { fontFamily: FONTS.semibold, fontSize: 13 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
});
