// Colours and fonts for the light (emerald, cream & gold) and dark themes.

export type Theme = {
  dark: boolean;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  green: string;
  gold: string;
  goldText: string;
  onGold: string;
  header: string;
  headerText: string;
  headerMuted: string;
  headerLine: string;
  card: string;
  activeBg: string;
  mini: string;
  miniText: string;
  miniMuted: string;
  pill: string;
  pillActive: string;
  pillActiveText: string;
  track: string;
  accent: string;
  medal: string;
  medalInner: string;
  medalText: string;
  playBg: string;
  playIcon: string;
  ctrl: string;
  chipOn: string;
  chipOnText: string;
  sheet: string;
  segment: string;
  scrim: string;
};

export const LIGHT: Theme = {
  dark: false,
  bg: '#F7F3EA',
  surface: '#FFFFFF',
  text: '#1D2A24',
  muted: '#5B675F',
  line: '#E6DFD0',
  green: '#0F5132',
  gold: '#C49A45',
  goldText: '#7A561A',
  onGold: '#13201A',
  header: '#0F3D2E',
  headerText: '#F7F3EA',
  headerMuted: '#CFE0D5',
  headerLine: 'rgba(212,175,99,0.35)',
  card: 'rgba(255,255,255,0.06)',
  activeBg: '#EAF2EC',
  mini: '#0F3D2E',
  miniText: '#F7F3EA',
  miniMuted: '#CFE0D5',
  pill: '#FFFFFF',
  pillActive: '#0F3D2E',
  pillActiveText: '#F7F3EA',
  track: '#E6DFD0',
  accent: '#0F5132',
  medal: '#0F3D2E',
  medalInner: '#0B2F23',
  medalText: '#CFE0D5',
  playBg: '#0F3D2E',
  playIcon: '#F7F3EA',
  ctrl: '#0F3D2E',
  chipOn: '#EAF2EC',
  chipOnText: '#0F5132',
  sheet: '#F7F3EA',
  segment: '#EDE6D6',
  scrim: 'rgba(8,20,16,0.55)',
};

export const DARK: Theme = {
  dark: true,
  bg: '#0D1814',
  surface: '#14231D',
  text: '#EDE7D9',
  muted: '#A3B1AA',
  line: '#23352D',
  green: '#6CC49C',
  gold: '#D4AF63',
  goldText: '#D4AF63',
  onGold: '#13201A',
  header: '#0A1310',
  headerText: '#EDE7D9',
  headerMuted: '#A3B1AA',
  headerLine: 'rgba(212,175,99,0.28)',
  card: 'rgba(255,255,255,0.04)',
  activeBg: '#173027',
  mini: '#1B2E26',
  miniText: '#EDE7D9',
  miniMuted: '#A3B1AA',
  pill: '#14231D',
  pillActive: '#D4AF63',
  pillActiveText: '#13201A',
  track: '#23352D',
  accent: '#D4AF63',
  medal: '#12221B',
  medalInner: '#0D1814',
  medalText: '#A3B1AA',
  playBg: '#D4AF63',
  playIcon: '#13201A',
  ctrl: '#EDE7D9',
  chipOn: '#173027',
  chipOnText: '#6CC49C',
  sheet: '#14231D',
  segment: '#0D1814',
  scrim: 'rgba(0,0,0,0.6)',
};

export const FONTS = {
  arabic: 'Amiri_400Regular',
  urdu: 'NotoNastaliqUrdu_400Regular',
  display: 'Marcellus_400Regular',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};
