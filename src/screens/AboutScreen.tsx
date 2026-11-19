// About Quran Safar: mission, what we offer, promise, credits, email and share.
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_VERSION, FEEDBACK_EMAIL, INSTALL_LINK, RECITERS_FULL, TRANSLATOR } from '../config';
import { FONTS } from '../theme';
import { AppCtx } from '../types';

export function AboutScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();

  const shareApp = () =>
    Share.share({
      message: `Assalamu alaikum! Listen to the Holy Quran with Urdu translation — free, no ads.\n\nQuran Safar – Urdu Tarjuma (Android):\n${INSTALL_LINK}`,
    }).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={[styles.header, { backgroundColor: t.header, paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => app.navigate('list')}
          accessibilityLabel="Back"
          style={[styles.back, { top: insets.top + 12, borderColor: t.headerLine }]}
        >
          <Ionicons name="chevron-back" size={22} color={t.headerText} />
        </Pressable>
        <Image source={require('../../assets/icon.png')} style={styles.icon} accessibilityLabel="Quran Safar icon" />
        <Text style={[styles.name, { color: t.headerText }]}>Quran Safar</Text>
        <Text style={[styles.version, { color: t.headerMuted }]}>Urdu Tarjuma · Version {APP_VERSION}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}>
        <Section t={t} title="OUR MISSION">
          <Text style={[styles.p, { color: t.text }]}>
            To help every Urdu-speaking Muslim listen to the Holy Quran and understand its message — anytime, anywhere, even without
            internet.
          </Text>
        </Section>
        <Section t={t} title="WHAT WE OFFER">
          {[
            `Complete Quran recitation by ${RECITERS_FULL.replace(' & ', ' and ')}`,
            `Urdu translation by ${TRANSLATOR} after every ayah`,
            'Offline listening, bookmarks, notes, duas, Qibla direction and the Islamic date',
          ].map((line) => (
            <View key={line} style={styles.bullet}>
              <Text style={[styles.p, { color: t.goldText }]}>•</Text>
              <Text style={[styles.p, { color: t.text, flex: 1 }]}>{line}</Text>
            </View>
          ))}
        </Section>
        <Section t={t} title="OUR PROMISE">
          <Text style={[styles.p, { color: t.text }]}>
            Quran Safar is, and will always remain, free — with no ads, no sign-up and no personal data collected. It is a non-profit
            effort made for the pleasure of Allah alone.
          </Text>
        </Section>
        <View style={[styles.quote, { backgroundColor: t.activeBg }]}>
          <Text style={[styles.quoteText, { color: t.text }]}>“The best among you are those who learn the Quran and teach it.”</Text>
          <Text style={[styles.quoteSrc, { color: t.green }]}>Sahih al-Bukhari</Text>
        </View>
        <Text style={[styles.p, { color: t.muted }]}>Feedback and suggestions are always welcome.</Text>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Quran Safar')}`).catch(() => app.navigate('feedback'))}
            style={[styles.btn, { backgroundColor: t.playBg }]}
          >
            <Ionicons name="mail-outline" size={18} color={t.playIcon} />
            <Text style={[styles.btnText, { color: t.playIcon }]}>Email us</Text>
          </Pressable>
          <Pressable onPress={shareApp} style={[styles.btn, { backgroundColor: t.surface, borderWidth: 1, borderColor: t.line }]}>
            <Ionicons name="share-social-outline" size={18} color={t.text} />
            <Text style={[styles.btnText, { color: t.text }]}>Share app</Text>
          </Pressable>
        </View>

        <Text style={[styles.small, { color: t.muted }]}>
          Quran text for duas: Tanzil Project (
          <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://tanzil.net').catch(() => {})}>
            tanzil.net
          </Text>
          )
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({ t, title, children }: { t: AppCtx['t']; title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.h, { color: t.goldText }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingBottom: 24, gap: 8, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  back: { position: 'absolute', left: 20, width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 88, height: 88, borderRadius: 24 },
  name: { fontFamily: FONTS.display, fontSize: 26 },
  version: { fontFamily: FONTS.body, fontSize: 13 },
  h: { fontFamily: FONTS.bold, fontSize: 12, letterSpacing: 1 },
  p: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21 },
  bullet: { flexDirection: 'row', gap: 8 },
  quote: { padding: 14, borderRadius: 14, gap: 4 },
  quoteText: { fontFamily: FONTS.display, fontSize: 16, lineHeight: 23 },
  quoteSrc: { fontFamily: FONTS.medium, fontSize: 12 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { fontFamily: FONTS.semibold, fontSize: 15 },
  small: { fontFamily: FONTS.body, fontSize: 11, lineHeight: 16 },
});
