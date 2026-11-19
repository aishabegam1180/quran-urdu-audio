import { Track } from './library';
import { SurahInfo } from './surahs';
import { Theme } from './theme';

export type Part = { track: Track; i: number };
export type SurahGroup = { info: SurahInfo; parts: Part[] };

export type Sleep =
  | { kind: 'off' }
  | { kind: 'minutes'; minutes: number; endsAt: number }
  | { kind: 'end' };

/** Everything the screens need from the app: state plus actions. */
export type AppCtx = {
  t: Theme;
  tracks: Track[];
  groups: SurahGroup[];
  index: number | null;
  track: Track | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  buffering: boolean;
  label: (t: Track) => string;
  partLabel: (t: Track) => string;
  ayahText: (t: Track) => string;
  pick: (i: number) => void;
  playPause: () => void;
  skip: (delta: number) => void;
  go: (delta: number) => void;
  seek: (sec: number) => void;
  isDownloaded: (t: Track) => boolean;
  downloading: Record<string, boolean>;
  toggleDownload: (t: Track) => void;
  downloadAll: () => void;
  bulk: { done: number; total: number } | null;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  speed: number;
  setSpeed: (s: number) => void;
  toggleTheme: () => void;
  sleep: Sleep;
  sleepLeft: number;
  setSleep: (choice: 'off' | 'end' | number) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
  openSheet: () => void;
  closeSheet: () => void;
};
