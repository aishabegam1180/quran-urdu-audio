// Prayer times for the person's city: next prayer, today's six times, and −/+ minutes per prayer
// to match the local masjid. Worked out on the phone; no internet and no Azan sound.
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CITIES, MAX_ADJUST, PRAYER_AR, Place, PrayerName, clockText, leftText, nextPrayer, timesFor } from '../prayer';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

const CAP = 1.3;

function km(a1: number, o1: number, a2: number, o2: number) {
  const r = Math.PI / 180;
  const x = (o2 - o1) * r * Math.cos(((a1 + a2) / 2) * r);
  const y = (a2 - a1) * r;
  return Math.sqrt(x * x + y * y) * 6371;
} // labels grow with the phone's text size, but not so much that the layout breaks

export function PrayerScreen({ app }: { app: AppCtx }) {
  const { t, prayer } = app;
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(() => new Date());
  const [choosing, setChoosing] = useState(!prayer.place);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const useMyLocation = async () => {
    setLocating(true);
    setLocError(null);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') throw new Error('perm');
      const pos =
        (await Location.getLastKnownPositionAsync({ maxAge: 24 * 3600_000 })) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      const { latitude: lat, longitude: lng } = pos.coords;
      // name it after a listed city within 40 km; nothing is looked up online
      const near = CITIES.map((c) => ({ c, d: km(lat, lng, c.lat, c.lng) })).sort((x, y) => x.d - y.d)[0];
      const name = near && near.d < 40 ? `${near.c.name} (my location)` : 'My location';
      app.setPrayer({ place: { name, lat: Math.round(lat * 1e4) / 1e4, lng: Math.round(lng * 1e4) / 1e4 } });
      setChoosing(false);
    } catch {
      setLocError('Could not get your location. Turn on location, or choose your city below.');
    }
    setLocating(false);
  };

  const pickCity = (c: Place) => {
    app.setPrayer({ place: c });
    setChoosing(false);
  };

  const adjust = (name: PrayerName, d: number) => {
    const v = Math.max(-MAX_ADJUST, Math.min(MAX_ADJUST, (prayer.adjust[name] ?? 0) + d));
    app.setPrayer({ adjust: { ...prayer.adjust, [name]: v } });
  };

  const times = timesFor(now, prayer);
  const next = nextPrayer(now, prayer);

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10 }]}>
      <ScreenHeader t={t} title="Prayer times" onBack={() => app.navigate('list')} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
        {prayer.place && next && !choosing && (
          <View style={[styles.hero, { backgroundColor: t.header }]}>
            <Text maxFontSizeMultiplier={CAP} style={[styles.eyebrow, { color: t.gold }]}>NEXT PRAYER</Text>
            <View style={styles.heroRow}>
              <Text maxFontSizeMultiplier={CAP} style={[styles.heroName, { color: t.headerText }]}>{next.name}</Text>
              <Text maxFontSizeMultiplier={CAP} style={[styles.heroTime, { color: t.headerText }]}>{clockText(next.at)}</Text>
            </View>
            <Text maxFontSizeMultiplier={CAP} style={[styles.small, { color: t.headerMuted }]}>in {leftText(next.at.getTime() - now.getTime())}</Text>
            <View style={styles.chipRow}>
              <Pressable onPress={() => setChoosing(true)} style={[styles.chip, { borderColor: t.headerLine }]} accessibilityLabel={`City: ${prayer.place.name}. Change city`}>
                <Ionicons name="location-outline" size={14} color={t.gold} />
                <Text maxFontSizeMultiplier={CAP} style={[styles.chipText, { color: t.headerText }]}>{prayer.place.name} · change</Text>
              </Pressable>
              <View style={[styles.chip, { borderColor: t.headerLine }]}>
                <Text maxFontSizeMultiplier={CAP} style={[styles.chipText, { color: t.headerMuted }]}>Karachi method · Hanafi Asr</Text>
              </View>
            </View>
          </View>
        )}

        {choosing ? (
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text maxFontSizeMultiplier={CAP} style={[styles.label, { color: t.text }]}>Where are you?</Text>
            <Text maxFontSizeMultiplier={CAP} style={[styles.small, { color: t.muted }]}>
              Prayer times depend on your city. Your location stays on your phone and is used only for this.
            </Text>
            <Pressable onPress={useMyLocation} disabled={locating} style={[styles.primary, { backgroundColor: t.header }]}>
              {locating ? <ActivityIndicator color={t.gold} /> : <Ionicons name="navigate" size={18} color={t.gold} />}
              <Text maxFontSizeMultiplier={CAP} style={[styles.primaryText, { color: t.headerText }]}>Use my location</Text>
            </Pressable>
            {!!locError && <Text maxFontSizeMultiplier={CAP} style={[styles.small, { color: '#B4442E' }]}>{locError}</Text>}
            <Text maxFontSizeMultiplier={CAP} style={[styles.cardTitle, { color: t.muted }]}>Or choose a city</Text>
            <View style={styles.cities}>
              {CITIES.map((c) => {
                const on = prayer.place?.name === c.name;
                return (
                  <Pressable
                    key={c.name}
                    onPress={() => pickCity(c)}
                    style={[styles.city, { borderColor: on ? t.green : t.line, backgroundColor: on ? t.activeBg : t.bg }]}
                  >
                    <Text maxFontSizeMultiplier={CAP} style={[styles.cityText, { color: t.text }]}>{c.name}</Text>
                  </Pressable>
                );
              })}
            </View>
            {prayer.place && (
              <Pressable onPress={() => setChoosing(false)} style={styles.link}>
                <Text maxFontSizeMultiplier={CAP} style={[styles.linkText, { color: t.goldText }]}>Keep {prayer.place.name}</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <>
            <View style={styles.dayRow}>
              <Text maxFontSizeMultiplier={CAP} style={[styles.small, { color: t.muted, flex: 1 }]}>
                {app.gregorianText}
                {app.hijriText ? ` · ${app.hijriText}` : ''}
              </Text>
              <Pressable onPress={() => setEditing((e) => !e)} style={[styles.editBtn, { borderColor: editing ? t.green : t.line, backgroundColor: editing ? t.activeBg : t.surface }]}>
                <Ionicons name={editing ? 'checkmark' : 'options-outline'} size={16} color={t.green} />
                <Text maxFontSizeMultiplier={CAP} style={[styles.editText, { color: t.green }]}>{editing ? 'Done' : 'Adjust'}</Text>
              </Pressable>
            </View>
            {times.map((p) => {
              const isNext = next?.name === p.name && next.at.getDate() === p.at.getDate();
              const adj = prayer.adjust[p.name] ?? 0;
              return (
                <View
                  key={p.name}
                  style={[styles.row, { backgroundColor: isNext ? t.activeBg : t.surface, borderColor: isNext ? t.green : t.line }]}
                  accessibilityLabel={`${p.name} ${clockText(p.at)}${isNext ? ', next prayer' : ''}`}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text maxFontSizeMultiplier={CAP} style={[styles.name, { color: t.text }]}>
                      {p.name} <Text style={[styles.ar, { color: t.muted }]}>{PRAYER_AR[p.name]}</Text>
                    </Text>
                    {p.name === 'Sunrise' && (
                      <Text maxFontSizeMultiplier={CAP} style={[styles.tiny, { color: t.muted }]}>Not a prayer time · Fajr ends</Text>
                    )}
                    {!!adj && (
                      <Text maxFontSizeMultiplier={CAP} style={[styles.tiny, { color: t.goldText }]}>
                        {adj > 0 ? '+' : ''}
                        {adj} min adjusted
                      </Text>
                    )}
                  </View>
                  {editing && (
                    <>
                      <Pressable onPress={() => adjust(p.name, -1)} accessibilityLabel={`${p.name} one minute earlier`} style={[styles.pm, { borderColor: t.line }]}>
                        <Ionicons name="remove" size={18} color={t.green} />
                      </Pressable>
                      <Pressable onPress={() => adjust(p.name, 1)} accessibilityLabel={`${p.name} one minute later`} style={[styles.pm, { borderColor: t.line }]}>
                        <Ionicons name="add" size={18} color={t.green} />
                      </Pressable>
                    </>
                  )}
                  <Text maxFontSizeMultiplier={CAP} style={[styles.time, { color: isNext ? t.green : t.text }]}>{clockText(p.at)}</Text>
                </View>
              );
            })}
            <View style={[styles.info, { backgroundColor: t.dark ? t.surface : '#FDF3DF', borderColor: t.line }]}>
              <Text maxFontSizeMultiplier={CAP} style={[styles.small, { color: t.text }]}>
                These are calculated times for {prayer.place?.name}. Your masjid's timetable may differ by a few minutes; tap Adjust to
                match it. Please follow your local masjid for jamaat times.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  body: { gap: 10, paddingTop: 14, width: '100%', maxWidth: 640, alignSelf: 'center' },
  hero: { padding: 18, borderRadius: 22, gap: 4 },
  eyebrow: { fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 0.8 },
  heroRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' },
  heroName: { fontFamily: FONTS.display, fontSize: 34, lineHeight: 40 },
  heroTime: { fontFamily: FONTS.bold, fontSize: 22 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingHorizontal: 10, borderRadius: 17, borderWidth: 1 },
  chipText: { fontFamily: FONTS.medium, fontSize: 12 },
  card: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 12 },
  cardTitle: { fontFamily: FONTS.semibold, fontSize: 13 },
  label: { fontFamily: FONTS.semibold, fontSize: 16 },
  small: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 19 },
  tiny: { fontFamily: FONTS.body, fontSize: 11 },
  primary: { minHeight: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { fontFamily: FONTS.semibold, fontSize: 15 },
  cities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  city: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, justifyContent: 'center' },
  cityText: { fontFamily: FONTS.medium, fontSize: 14 },
  link: { alignSelf: 'center', padding: 8 },
  linkText: { fontFamily: FONTS.semibold, fontSize: 14 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1 },
  editText: { fontFamily: FONTS.semibold, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 64, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  name: { fontFamily: FONTS.semibold, fontSize: 16 },
  ar: { fontFamily: FONTS.arabic, fontSize: 15 },
  time: { fontFamily: FONTS.bold, fontSize: 17, minWidth: 82, textAlign: 'right', fontVariant: ['tabular-nums'] },
  pm: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  info: { padding: 12, borderRadius: 14, borderWidth: 1, marginTop: 4 },
});
