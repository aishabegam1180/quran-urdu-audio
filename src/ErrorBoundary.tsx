// If a screen hits an error while drawing, show a calm message with a way back
// instead of letting the whole app close. Playback keeps going underneath.
import { Component, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { recordError } from './crash';
import { FONTS, Theme } from './theme';

type Props = { t: Theme; onReset: () => void; children: ReactNode };

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    recordError('screen', error);
  }

  reset = () => {
    this.props.onReset();
    this.setState({ failed: false });
  };

  render() {
    if (!this.state.failed) return this.props.children;
    const { t } = this.props;
    return (
      <View style={[styles.box, { backgroundColor: t.bg }]}>
        <Text style={[styles.h, { color: t.text }]}>Something went wrong</Text>
        <Text style={[styles.p, { color: t.muted }]}>The recitation keeps playing. Tap below to go back to the surah list.</Text>
        <Pressable onPress={this.reset} style={[styles.btn, { backgroundColor: t.playBg }]}>
          <Text style={[styles.btnText, { color: t.playIcon }]}>Back to surah list</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  h: { fontFamily: FONTS.display, fontSize: 24, textAlign: 'center' },
  p: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  btn: { marginTop: 8, height: 50, paddingHorizontal: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONTS.semibold, fontSize: 15 },
});
