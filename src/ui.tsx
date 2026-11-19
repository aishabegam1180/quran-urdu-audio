// Decorative pieces of the design: the eight-point star badge, the header
// pattern and the gold medallion on the Now playing screen.
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
