// Update C (draft, not used yet): prayer times worked out on the phone, with no internet.
// Uses the open-source "adhan" library (MIT). Karachi method (University of Islamic Sciences)
// with Hanafi Asr, the usual choice in India and Pakistan. Checked against the AlAdhan API.
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export const PRAYERS: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const AZAN_PRAYERS = PRAYERS.filter((p) => p !== 'Sunrise');

export type PrayerSettings = {
  place?: { name: string; lat: number; lng: number };
  azan: Partial<Record<PrayerName, boolean>>; // every prayer off until the person switches it on
  adjust: Partial<Record<PrayerName, number>>; // minutes, -30..+30, to match the local masjid
  sound: 'azan' | 'takbeer' | 'beep';
};

export const DEFAULT_PRAYER: PrayerSettings = { azan: {}, adjust: {}, sound: 'azan' };
export const PRAYER_KEY = 'prayer.v1';

const KEY: Record<PrayerName, 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = {
  Fajr: 'fajr', Sunrise: 'sunrise', Dhuhr: 'dhuhr', Asr: 'asr', Maghrib: 'maghrib', Isha: 'isha',
};

export function timesFor(date: Date, s: PrayerSettings): { name: PrayerName; at: Date }[] {
  if (!s.place) return [];
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  const pt = new PrayerTimes(new Coordinates(s.place.lat, s.place.lng), date, params);
  return PRAYERS.map((name) => {
    const at = new Date(pt[KEY[name]].getTime() + (s.adjust[name] ?? 0) * 60000);
    return { name, at };
  });
}

/** The next prayer from now (today's, or tomorrow's Fajr). */
export function nextPrayer(now: Date, s: PrayerSettings) {
  const today = timesFor(now, s).filter((p) => p.name !== 'Sunrise');
  const upcoming = today.find((p) => p.at > now);
  if (upcoming) return upcoming;
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return timesFor(tomorrow, s).find((p) => p.name === 'Fajr');
}

/** Azan notifications for the next `days` days, only for prayers switched on. */
export function azanSchedule(now: Date, s: PrayerSettings, days = 7) {
  const out: { name: PrayerName; at: Date; fajr: boolean }[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
    for (const p of timesFor(day, s)) {
      if (p.name !== 'Sunrise' && s.azan[p.name] && p.at > now) out.push({ ...p, fajr: p.name === 'Fajr' });
    }
  }
  return out;
}
