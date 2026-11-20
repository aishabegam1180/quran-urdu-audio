// Qibla compass: uses the phone's location (only on this screen, never sent anywhere)
// and its compass to point towards the Kaaba.
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

const KAABA = { lat: 21.4225, lon: 39.8262 };
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function qiblaFrom(lat: number, lon: number) {
  const φ1 = rad(lat);
  const φ2 = rad(KAABA.lat);
  const Δλ = rad(KAABA.lon - lon);
  const bearing = (deg(Math.atan2(Math.sin(Δλ) * Math.cos(φ2), Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ))) + 360) % 360;
  const c = Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const km = 6371 * Math.acos(Math.min(1, Math.max(-1, c)));
  return { bearing, km };
}

type State =
  | { kind: 'loading' }
  | { kind: 'off' } // the phone's location is switched off
  | { kind: 'denied'; canAsk: boolean }
  | { kind: 'error' }
  | { kind: 'ready'; bearing: number; km: number };

const DIAL = 296;

export function QiblaScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [heading, setHeading] = useState<number | null>(null);
  const [lowAccuracy, setLowAccuracy] = useState(false);
  const [noCompass, setNoCompass] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    (async () => {
      try {
        // 1. location switched off? ask Android to show its own "Turn on location" prompt
        if (!(await Location.hasServicesEnabledAsync())) {
          try {
            await Location.enableNetworkProviderAsync();
          } catch {
            // the person said no to the prompt
          }
          if (cancelled) return;
          if (!(await Location.hasServicesEnabledAsync())) return setState({ kind: 'off' });
        }
        // 2. permission for this app
        const perm = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (perm.status !== 'granted') return setState({ kind: 'denied', canAsk: perm.canAskAgain });
        // 3. where are we (give up after 15 s rather than spin forever)
        const pos =
          (await Location.getLastKnownPositionAsync({ maxAge: 6 * 3600_000 })) ??
          (await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 15000)),
          ]));
        if (cancelled) return;
        if (!pos) return setState({ kind: 'error' });
        setState({ kind: 'ready', ...qiblaFrom(pos.coords.latitude, pos.coords.longitude) });
        // 4. compass
        timer = setTimeout(() => !cancelled && setNoCompass(true), 4000);
        sub = await Location.watchHeadingAsync((h) => {
          const v = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
          if (timer) clearTimeout(timer);
          setNoCompass(false);
          setHeading((prev) => (prev == null || Math.abs(prev - v) >= 1 ? v : prev));
          setLowAccuracy(h.accuracy != null && h.accuracy < 2);
        });
        if (cancelled) sub.remove();
      } catch {
        // location problems are normal (switched off, indoors, no signal): show a message, never an error report
        if (!cancelled) setState({ kind: 'error' });
      }
    })();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      sub?.remove();
    };
  }, [attempt]);

  // came back from the app's settings page (permission was blocked)? try again automatically.
  // Only in that case: Android's own pop-ups also pause the app, and retrying after those would loop.
  const needsRetry = state.kind === 'denied' && !state.canAsk;
  useEffect(() => {
    if (!needsRetry) return;
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') {
        setState({ kind: 'loading' });
        setAttempt((a) => a + 1);
      }
    });
    return () => sub.remove();
  }, [needsRetry]);

  const retry = () => {
    setState({ kind: 'loading' });
    setAttempt((a) => a + 1);
  };

  let body: React.ReactNode;
  if (state.kind === 'loading') {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={t.green} />
        <Text style={[styles.p, { color: t.muted }]}>Finding your location…</Text>
      </View>
    );
  } else if (state.kind === 'off' || state.kind === 'denied' || state.kind === 'error') {
    const title =
      state.kind === 'off'
        ? 'Location is off'
        : state.kind === 'denied'
          ? 'Location is needed for Qibla'
          : 'Could not find your location';
    const extra =
      state.kind === 'off'
        ? ' Please turn on location to see the Qibla direction.'
        : state.kind === 'error'
          ? ' If you are indoors, move near a window and try again.'
          : '';
    const openSettings = state.kind === 'denied' && !state.canAsk;
    body = (
      <View style={styles.center}>
        <Ionicons name="location-outline" size={40} color={t.goldText} />
        <Text style={[styles.h, { color: t.text }]}>{title}</Text>
        <Text style={[styles.p, { color: t.muted }]}>
          Your location is used only on this phone to work out the direction of the Kaaba. It is never sent anywhere.{extra}
        </Text>
        <Pressable onPress={() => (openSettings ? Linking.openSettings() : retry())} style={[styles.btn, { backgroundColor: t.playBg }]}>
          <Text style={[styles.btnText, { color: t.playIcon }]}>
            {state.kind === 'off' ? 'Turn on location' : openSettings ? 'Open settings' : 'Try again'}
          </Text>
        </Pressable>
        <Text style={[styles.p, { color: t.muted }]}>
          Qibla is {''}
          <Text style={{ fontFamily: FONTS.semibold }}>the only part of the app</Text> that uses location. Everything else works with it off.
        </Text>
      </View>
    );
  } else {
    const h = heading ?? 0;
    const diff = ((state.bearing - h + 540) % 360) - 180;
    const aligned = heading != null && Math.abs(diff) <= 3;
    const status =
      heading == null
        ? `Qibla is ${Math.round(state.bearing)}° from North`
        : aligned
          ? 'You are facing the Qibla'
          : diff > 0
            ? `Turn right ${Math.round(diff)}°`
            : `Turn left ${Math.round(-diff)}°`;
    body = (
      <>
        <View style={{ alignItems: 'center', gap: 4, marginTop: 18 }}>
          <Text style={[styles.status, { color: aligned ? t.green : t.goldText }]}>{status}</Text>
          <Text style={[styles.p, { color: t.muted }]}>
            {noCompass && heading == null
              ? 'This phone has no compass. Use the angle below with a separate compass.'
              : aligned
                ? 'The Kaaba is straight ahead'
                : 'Turn until the Kaaba is at the top'}
          </Text>
        </View>

        <View style={[styles.dial, { backgroundColor: t.medal }]}>
          <View style={[styles.ring, { borderColor: t.gold }]} />
          {/* compass rose turns with the phone */}
          <View style={[styles.layer, { transform: [{ rotate: `${-h}deg` }] }]}>
            {(['N', 'E', 'S', 'W'] as const).map((c, k) => (
              <View key={c} style={[styles.layer, { transform: [{ rotate: `${k * 90}deg` }] }]}>
                <Text style={[styles.cardinal, { color: c === 'N' ? t.gold : t.medalText }]}>{c}</Text>
              </View>
            ))}
          </View>
          {/* Kaaba pointer */}
          <View style={[styles.layer, { transform: [{ rotate: `${heading == null ? state.bearing : diff}deg` }] }]}>
            <View style={[styles.kaaba, { borderColor: t.gold }]}>
              <View style={[styles.kaabaBand, { backgroundColor: t.gold }]} />
            </View>
            <View style={[styles.needle, { borderBottomColor: t.gold }]} />
          </View>
          <View style={[styles.hub, { backgroundColor: t.medalInner, borderColor: t.gold }]}>
            <Text style={[styles.hubText, { color: '#F7F3EA' }]}>{heading == null ? '—' : `${Math.round(h)}°`}</Text>
          </View>
          <View style={[styles.marker, { backgroundColor: aligned ? '#2FA36B' : t.gold }]} />
        </View>

        <View style={styles.cards}>
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.cardLabel, { color: t.muted }]}>Qibla from North</Text>
            <Text style={[styles.cardValue, { color: t.green }]}>{Math.round(state.bearing)}°</Text>
          </View>
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.cardLabel, { color: t.muted }]}>Distance to Makkah</Text>
            <Text style={[styles.cardValue, { color: t.green }]}>{Math.round(state.km).toLocaleString('en-IN')} km</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <View style={[styles.tip, { backgroundColor: lowAccuracy ? t.chipOn : t.segment }]}>
          <Ionicons name="infinite-outline" size={22} color={t.goldText} />
          <Text style={[styles.tipText, { color: t.text }]}>
            {lowAccuracy ? 'Compass needs calibrating: ' : ''}Keep the phone flat, away from metal and magnets. If the arrow seems wrong, move
            the phone in a figure-8 a few times.
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 }]}>
      <ScreenHeader t={t} title="Qibla direction" onBack={() => app.navigate('list')} />
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 12 },
  h: { fontFamily: FONTS.display, fontSize: 22, textAlign: 'center' },
  p: { fontFamily: FONTS.body, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  btn: { marginTop: 6, height: 50, paddingHorizontal: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONTS.semibold, fontSize: 15 },
  status: { fontFamily: FONTS.bold, fontSize: 20 },
  dial: { marginTop: 22, alignSelf: 'center', width: DIAL, height: DIAL, borderRadius: DIAL / 2, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: DIAL - 24, height: DIAL - 24, borderRadius: (DIAL - 24) / 2, borderWidth: 1, opacity: 0.5 },
  layer: { position: 'absolute', width: DIAL, height: DIAL, alignItems: 'center' },
  cardinal: { marginTop: 22, fontFamily: FONTS.bold, fontSize: 16 },
  kaaba: { marginTop: 40, width: 28, height: 28, borderRadius: 4, borderWidth: 2, backgroundColor: '#1D2A24', justifyContent: 'flex-start' },
  kaabaBand: { marginTop: 6, height: 2 },
  needle: { width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 64, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: 4 },
  hub: { width: 84, height: 84, borderRadius: 42, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  hubText: { fontFamily: FONTS.bold, fontSize: 20 },
  marker: { position: 'absolute', top: 4, width: 14, height: 14, transform: [{ rotate: '45deg' }] },
  cards: { marginTop: 22, flexDirection: 'row', gap: 10 },
  card: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, gap: 4 },
  cardLabel: { fontFamily: FONTS.body, fontSize: 12 },
  cardValue: { fontFamily: FONTS.bold, fontSize: 20 },
  tip: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, alignItems: 'center' },
  tipText: { flex: 1, fontFamily: FONTS.body, fontSize: 12, lineHeight: 18 },
});
