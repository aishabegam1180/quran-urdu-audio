// The Quran text for reading: Indo-Pak Arabic, Urdu (Jalandhari) and English (Saheeh International).
// The three files are bundled with the app (one ayah per line, 6,236 lines each) and loaded only
// when first needed, so the app still opens quickly.
//
// Sources, used without change:
// - Indo-Pak (Naskh Nastaleeq) text and font: Ayman Siddiqui and R. Siddiqua for QuranWBW.com and
//   Quran.com, verified against the King Fahd Complex Nastaleeq Mushaf. Free, with credit.
// - Urdu translation: Fateh Muhammad Jalandhari, via Tanzil.net.
// - English translation: Saheeh International, via Tanzil.net.
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import * as Font from 'expo-font';
import { recordError } from './crash';
import { SURAHS } from './surahs';
import { VOTD } from './votd';

export const QURAN_FONT = 'AlQuranIndoPak';

export type QuranText = { ar: string[]; ur: string[]; en: string[] };

/** Index (0-based) of the first ayah of each surah in the 6,236-line files. */
export const SURAH_START: number[] = (() => {
  const out: number[] = [];
  let n = 0;
  for (const s of SURAHS) {
    out.push(n);
    n += s.ayahs;
  }
  return out;
})();

export function ayahIndex(surah: number, ayah: number) {
  return SURAH_START[surah - 1] + ayah - 1;
}

/** Ayah number counted through the whole Quran, 1–6236 (used by the audio service). */
export function globalAyah(surah: number, ayah: number) {
  return ayahIndex(surah, ayah) + 1;
}

/** Mishary Rashid Alafasy, one ayah, from the Islamic Network (alquran.cloud) audio service. */
export function ayahAudioUrl(surah: number, ayah: number) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyah(surah, ayah)}.mp3`;
}

let loading: Promise<QuranText> | null = null;
let loaded: QuranText | null = null;

async function readAsset(mod: number) {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  const text = await new File(asset.localUri ?? asset.uri).text();
  return text.split('\n');
}

/** Loads the Quran text and the Indo-Pak font once; later calls return the same result. */
export function loadQuran(): Promise<QuranText> {
  if (loaded) return Promise.resolve(loaded);
  if (!loading) {
    loading = (async () => {
      const [ar, ur, en] = await Promise.all([
        readAsset(require('../assets/quran/indopak.txt')),
        readAsset(require('../assets/quran/ur.txt')),
        readAsset(require('../assets/quran/en.txt')),
        Font.loadAsync({ [QURAN_FONT]: require('../assets/fonts/AlQuranIndoPak.ttf') }),
      ]);
      if (ar.length < 6236 || ur.length < 6236 || en.length < 6236) throw new Error('Quran text incomplete');
      loaded = { ar, ur, en };
      return loaded;
    })().catch((e) => {
      loading = null; // allow another try
      recordError('quran-load', e);
      throw e;
    });
  }
  return loading;
}

export function quranLoaded() {
  return loaded;
}

/** "2:255" or "2 255" → {surah, ayah}; also accepts a bare surah number. */
export function parseRef(q: string): { surah: number; ayah: number } | null {
  const m = q.trim().match(/^(\d{1,3})(?:\s*[:.\s]\s*(\d{1,3}))?$/);
  if (!m) return null;
  const surah = Number(m[1]);
  const ayah = m[2] ? Number(m[2]) : 1;
  if (surah < 1 || surah > 114) return null;
  if (ayah < 1 || ayah > SURAHS[surah - 1].ayahs) return null;
  return { surah, ayah };
}

/** Parses "94:5-6" → surah 94, ayahs 5..6. */
export function parseRange(ref: string) {
  const [s, r] = ref.split(':');
  const [a, b] = r.split('-').map(Number);
  return { surah: Number(s), from: a, to: b || a };
}

/** Today's verse: day 1 = 1 January; after day 365 the list starts again. */
export function verseOfDay(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const doy = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - start.getTime()) / 864e5) + 1;
  const day = ((doy - 1) % VOTD.length) + 1;
  return { day, ref: VOTD[day - 1], ...parseRange(VOTD[day - 1]) };
}

/** Text of a range of ayahs, joined, for one language. */
export function rangeText(q: QuranText, lang: keyof QuranText, surah: number, from: number, to: number) {
  const out: string[] = [];
  for (let a = from; a <= to; a++) out.push(q[lang][ayahIndex(surah, a)]);
  return out.join(' ');
}

export const BISMILLAH_INDEX = 0; // 1:1 is "Bismillah" in the text file

/** Surahs that open with Bismillah shown above ayah 1 (all except Al-Fatihah, where it is ayah 1, and At-Tawbah). */
export function showsBismillah(surah: number) {
  return surah !== 1 && surah !== 9;
}
