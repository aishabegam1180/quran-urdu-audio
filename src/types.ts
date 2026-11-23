import { Bookmark, DuaLang, Note, Track } from './library';
import { Reminder } from './streak';
import { SurahInfo } from './surahs';
import { Theme } from './theme';

export type Part = { track: Track; i: number };
export type SurahGroup = { info: SurahInfo; parts: Part[] };

export type Sleep =
  | { kind: 'off' }
  | { kind: 'minutes'; minutes: number; endsAt: number }
  | { kind: 'end' };

export type View = 'list' | 'player' | 'qibla' | 'notes' | 'saved' | 'duas' | 'feedback' | 'about' | 'tasbeeh' | 'streak';

export type StreakInfo = {
  current: number;
  best: number;
  doneToday: boolean;
  todaySecs: number;
  week: { label: string; done: boolean; today: boolean; key: string }[];
  reminder: Reminder;
};

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
  trackById: (id: string) => { track: Track; i: number } | null;
  trackForAyah: (surah: number, ayah: number) => number;
  pick: (i: number) => void;
  resume: (trackId: string, position: number) => void;
  playPause: () => void;
  skip: (delta: number) => void;
  go: (delta: number) => void;
  seek: (sec: number) => void;
  isDownloaded: (t: Track) => boolean;
  downloading: Record<string, boolean>;
  toggleDownload: (t: Track) => void;
  downloadAll: () => void;
  bulk: { done: number; total: number } | null;
  // bookmarks (with the exact time)
  bookmarks: Bookmark[];
  isBookmarked: (trackId: string) => boolean;
  toggleBookmark: () => void;
  removeBookmark: (trackId: string) => void;
  // notes
  notes: Note[];
  openNoteEditor: (note: Note | null) => void;
  deleteNote: (id: string) => void;
  // duas
  duaFavs: string[];
  toggleDuaFav: (id: string) => void;
  duaLang: DuaLang;
  setDuaLang: (l: DuaLang) => void;
  // dates
  gregorianText: string;
  hijriText: string;
  hijriArabic: string;
  adjustHijri: () => void;
  // playback extras
  speed: number;
  setSpeed: (s: number) => void;
  toggleTheme: () => void;
  sleep: Sleep;
  sleepLeft: number;
  setSleep: (choice: 'off' | 'end' | number) => void;
  repeat: boolean;
  toggleRepeat: () => void;
  // daily streak
  streak: StreakInfo;
  setReminder: (patch: Partial<Reminder>) => void;
  reminderBlocked: boolean;
  openIntro: () => void;
  // navigation
  view: View;
  navigate: (v: View) => void;
  openPlayer: () => void;
  closePlayer: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  openMenu: () => void;
};
