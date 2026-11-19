// Bottom sheet to write or edit a note, optionally linked to the part and time playing now.
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatTime, Note } from '../library';
import { FONTS } from '../theme';
import { AppCtx } from '../types';

export type NoteDraft = { note: Note | null } | null;

export function NoteEditor({
  app,
  draft,
  onClose,
  onSave,
}: {
  app: AppCtx;
  draft: NoteDraft;
  onClose: () => void;
  onSave: (text: string, link: { trackId: string; position: number } | null, existing: Note | null) => void;
}) {
  const { t } = app;
  const insets = useSafeAreaInsets();
  const existing = draft?.note ?? null;
  const [text, setText] = useState('');
  const [linkOn, setLinkOn] = useState(true);
  const [link, setLink] = useState<{ trackId: string; position: number } | null>(null);

  // set up the form each time the sheet opens
  useEffect(() => {
    if (!draft) return;
    if (existing) {
      setText(existing.text);
      setLink(existing.trackId ? { trackId: existing.trackId, position: existing.position } : null);
      setLinkOn(!!existing.trackId);
    } else {
      setText('');
      setLink(app.track ? { trackId: app.track.id, position: Math.floor(app.currentTime) } : null);
      setLinkOn(!!app.track);
    }
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  const where = link ? app.trackById(link.trackId) : null;

  return (
    <Modal visible={!!draft} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView behavior="padding" style={styles.wrap} pointerEvents="box-none">
        <View style={[styles.sheet, { backgroundColor: t.sheet, paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.handle, { backgroundColor: t.line }]} />
          <Text style={[styles.h, { color: t.text }]}>{existing ? 'Edit note' : 'Add a note'}</Text>

          {where && link && (
            <Pressable
              onPress={() => setLinkOn((v) => !v)}
              style={[styles.link, { borderColor: linkOn ? t.green : t.line, backgroundColor: linkOn ? t.activeBg : t.surface }]}
            >
              <View style={[styles.check, { borderColor: t.green, backgroundColor: linkOn ? t.green : 'transparent' }]}>
                {linkOn && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.linkTitle, { color: t.text }]}>Link to this moment</Text>
                <Text style={[styles.linkSub, { color: t.muted }]} numberOfLines={1}>
                  {app.label(where.track)} · at {formatTime(link.position)}
                </Text>
              </View>
            </Pressable>
          )}

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write a reflection, a reminder, or something to look up…"
            placeholderTextColor={t.muted}
            accessibilityLabel="Your note"
            multiline
            autoFocus
            textAlignVertical="top"
            style={[styles.input, { color: t.text, backgroundColor: t.surface, borderColor: t.line }]}
          />

          <View style={styles.row}>
            <Pressable onPress={onClose} style={[styles.btn, { flex: 1, borderWidth: 1, borderColor: t.line, backgroundColor: t.surface }]}>
              <Text style={[styles.btnText, { color: t.text }]}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={!text.trim()}
              onPress={() => onSave(text.trim(), linkOn ? link : null, existing)}
              style={[styles.btn, { flex: 2, backgroundColor: t.playBg, opacity: text.trim() ? 1 : 0.5 }]}
            >
              <Text style={[styles.btnText, { color: t.playIcon }]}>Save note</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { paddingHorizontal: 22, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 14 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center' },
  h: { fontFamily: FONTS.display, fontSize: 22 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontFamily: FONTS.semibold, fontSize: 14 },
  linkSub: { fontFamily: FONTS.body, fontSize: 12 },
  input: { minHeight: 130, maxHeight: 240, borderRadius: 14, borderWidth: 1, padding: 14, fontFamily: FONTS.body, fontSize: 15, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONTS.semibold, fontSize: 15 },
});
