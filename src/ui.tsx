// Decorative pieces of the design: the eight-point star badge, the header
// pattern and the gold medallion on the Now playing screen.
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { FONTS, Theme } from './theme';

function Star({ size, color, width, opacity = 1 }: { size: number; color: string; width: number; opacity?: number }) {
  const sq = { position: 'absolute' as const, width: size, height: size, borderWidth: width, borderColor: color, opacity };
  return (
    <>
      <View style={sq} />
      <View style={[sq, { transform: [{ rotate: '45deg' }] }]} />
    </>
  );
}

export function StarBadge({ n, t }: { n: number; t: Theme }) {
  return (
    <View style={styles.badge}>
      <Star size={22} color={t.gold} width={1.4} />
      <Text style={[styles.badgeText, { color: t.goldText }]}>{n}</Text>
    </View>
  );
}

const TILE = 48;
export const HeaderPattern = memo(function HeaderPattern({ color, width, height }: { color: string; width: number; height: number }) {
  const cols = Math.ceil(width / TILE);
  const rows = Math.ceil(height / TILE);
  const tiles = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      tiles.push(
        <View key={`${r}-${c}`} style={[styles.tile, { left: c * TILE, top: r * TILE }]}>
          <Star size={28} color={color} width={1.2} />
          <View style={[styles.dot, { borderColor: color }]} />
        </View>,
      );
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.14, overflow: 'hidden' }]}>
      {tiles}
    </View>
  );
});

export function Medallion({ t, ar, surah }: { t: Theme; ar: string; surah: number }) {
  return (
    <View style={styles.medal}>
      <View style={[styles.medalCircle, { backgroundColor: t.medal }]} />
      <View style={[styles.medalRing, { borderColor: t.gold }]} />
      <Star size={156} color={t.gold} width={1.6} />
      <Star size={112} color={t.gold} width={0.8} opacity={0.6} />
      <View style={[styles.medalInner, { backgroundColor: t.medalInner }]} />
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.medalAr, { color: t.gold }]} numberOfLines={1} adjustsFontSizeToFit>
          {ar}
        </Text>
        <Text style={[styles.medalSub, { color: t.medalText }]}>SURAH {surah}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sh: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shBack: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  shTitle: { fontFamily: FONTS.display, fontSize: 24, lineHeight: 30 },
  shSub: { fontFamily: FONTS.arabic, fontSize: 16, lineHeight: 24 },
  badge: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: FONTS.bold, fontSize: 12 },
  tile: { position: 'absolute', width: TILE, height: TILE, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.2 },
  medal: { width: 264, height: 264, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  medalCircle: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
  medalRing: { position: 'absolute', width: 236, height: 236, borderRadius: 118, borderWidth: 1, opacity: 0.6 },
  medalInner: { position: 'absolute', width: 128, height: 128, borderRadius: 64 },
  medalAr: { fontFamily: FONTS.arabic, fontSize: 40, lineHeight: 56, maxWidth: 120, textAlign: 'center' },
  medalSub: { fontFamily: FONTS.semibold, fontSize: 11, letterSpacing: 1.3 },
});

/** Top bar used by the menu screens: back button and title. */
export function ScreenHeader({
  t,
  title,
  subtitle,
  onBack,
  right,
}: {
  t: Theme;
  title: string;
  subtitle?: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.sh}>
      <Pressable
        onPress={onBack}
        accessibilityLabel="Back"
        style={[styles.shBack, { backgroundColor: t.surface, borderColor: t.line }]}
      >
        <Ionicons name="chevron-back" size={22} color={t.text} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={[styles.shTitle, { color: t.text }]} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && <Text style={[styles.shSub, { color: t.goldText }]}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

/** Three small bars that move while audio plays (and stand still when paused). */
export function EqBars({ color, playing, size = 16 }: { color: string; playing: boolean; size?: number }) {
  const bars = useRef([0, 1, 2].map(() => new Animated.Value(0.35))).current;
  useEffect(() => {
    if (!playing) {
      bars.forEach((b) => b.setValue(0.35));
      return;
    }
    const loops = bars.map((b, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(b, { toValue: 1, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(b, { toValue: 0.3, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [playing, bars]);
  const w = Math.max(3, Math.round(size / 5));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size, gap: w * 0.6 }} accessibilityLabel={playing ? 'Playing' : 'Paused'}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={{ width: w, height: size, borderRadius: w / 2, backgroundColor: color, transform: [{ translateY: size / 2 }, { scaleY: b }, { translateY: -size / 2 }] }}
        />
      ))}
    </View>
  );
}

/** A Pressable that lightens when a mouse moves over it (laptops, tablets with a mouse). */
export function HoverPressable({
  style,
  hoverStyle,
  ...rest
}: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; hoverStyle: StyleProp<ViewStyle> }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      {...rest}
      onHoverIn={(e) => (setHover(true), rest.onHoverIn?.(e))}
      onHoverOut={(e) => (setHover(false), rest.onHoverOut?.(e))}
      style={({ pressed }) => [style, (hover || pressed) && hoverStyle]}
    />
  );
}
