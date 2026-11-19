// Feedback: pick a type, write a message, send it through the person's own email app.
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_VERSION, FEEDBACK_EMAIL } from '../config';
import { FONTS } from '../theme';
import { AppCtx } from '../types';
import { ScreenHeader } from '../ui';

const KINDS: { label: string; placeholder: string }[] = [
  { label: 'Suggestion', placeholder: 'A feature or improvement you would like…' },
  { label: 'Problem', placeholder: 'What happened, and what were you doing at the time?' },
  { label: 'Praise & dua', placeholder: 'Share what you like about the app…' },
];

export function FeedbackScreen({ app }: { app: AppCtx }) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState(0);
  const [msg, setMsg] = useState('');

  const send = async () => {
    const subject = `Quran Safar feedback: ${KINDS[kind].label}`;
    const body = `${msg.trim()}\n\n—\nQuran Safar ${APP_VERSION} · Android ${String(Platform.Version)}`;
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('No email app found', `Please send your feedback to ${FEEDBACK_EMAIL}`);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: insets.bottom + 24, gap: 18, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader t={t} title="Send feedback" onBack={() => app.navigate('list')} />
        <Text style={[styles.p, { color: t.muted }]}>
          Your suggestions help make Quran Safar better for everyone. JazakAllah khair.
        </Text>

        <View style={{ gap: 10 }}>
          <Text style={[styles.label, { color: t.muted }]}>What is it about?</Text>
          <View style={styles.chips}>
            {KINDS.map((k, i) => {
              const on = i === kind;
              return (
                <Pressable
                  key={k.label}
                  onPress={() => setKind(i)}
                  style={[styles.chip, { borderColor: on ? t.pillActive : t.line, backgroundColor: on ? t.pillActive : t.pill }]}
                >
                  <Text style={[styles.chipText, { color: on ? t.pillActiveText : t.text }]}>{k.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={[styles.label, { color: t.muted }]}>Your message</Text>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder={KINDS[kind].placeholder}
            placeholderTextColor={t.muted}
            accessibilityLabel="Your message"
            multiline
            textAlignVertical="top"
            style={[styles.input, { color: t.text, backgroundColor: t.surface, borderColor: t.line }]}
          />
        </View>

        <View style={[styles.info, { backgroundColor: t.segment }]}>
          <Ionicons name="mail-outline" size={20} color={t.goldText} />
          <Text style={[styles.infoText, { color: t.text }]}>
            Opens your email app with the message ready to send to {FEEDBACK_EMAIL}. The app version is added so problems can be fixed faster.
          </Text>
        </View>

        <View style={{ flex: 1 }} />
        <Pressable
          onPress={send}
          disabled={!msg.trim()}
          style={[styles.btn, { backgroundColor: t.playBg, opacity: msg.trim() ? 1 : 0.5 }]}
        >
          <Ionicons name="send" size={17} color={t.playIcon} />
          <Text style={[styles.btnText, { color: t.playIcon }]}>Send by email</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  p: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21 },
  label: { fontFamily: FONTS.semibold, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { height: 40, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, justifyContent: 'center' },
  chipText: { fontFamily: FONTS.semibold, fontSize: 14 },
  input: { minHeight: 160, borderRadius: 14, borderWidth: 1, padding: 14, fontFamily: FONTS.body, fontSize: 15, lineHeight: 22 },
  info: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, alignItems: 'center' },
  infoText: { flex: 1, fontFamily: FONTS.body, fontSize: 12, lineHeight: 18 },
  btn: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { fontFamily: FONTS.semibold, fontSize: 16 },
});
