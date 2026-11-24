// Prayer times, worked out on the phone with no internet, using the open-source "adhan" library (MIT).
// Karachi method (University of Islamic Sciences, Karachi) with Hanafi Asr, the usual choice in
// India and Pakistan. Checked against the AlAdhan service for Indian, Pakistani and Gulf cities:
// every prayer matched within a minute. No Azan sound; times only.
import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes } from 'adhan';

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export const PRAYERS: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const PRAYER_AR: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export type Place = { name: string; lat: number; lng: number };
export type PrayerSettings = {
  place: Place | null;
  adjust: Partial<Record<PrayerName, number>>; // minutes, −30…+30, to match the local masjid
};
export const DEFAULT_PRAYER: PrayerSettings = { place: null, adjust: {} };
export const PRAYER_KEY = 'prayer.v1';
export const MAX_ADJUST = 30;

// A few cities to choose from without GPS.
export const CITIES: Place[] = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Mangaluru', lat: 12.9141, lng: 74.856 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { name: 'Makkah', lat: 21.3891, lng: 39.8579 },
];

const KEY: Record<PrayerName, 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = {
  Fajr: 'fajr',
  Sunrise: 'sunrise',
  Dhuhr: 'dhuhr',
  Asr: 'asr',
  Maghrib: 'maghrib',
  Isha: 'isha',
};

export function timesFor(date: Date, s: PrayerSettings): { name: PrayerName; at: Date }[] {
  if (!s.place) return [];
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  // far north or south in summer the sky never gets fully dark; this keeps Fajr and Isha sensible
  if (Math.abs(s.place.lat) > 48) params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const pt = new PrayerTimes(new Coordinates(s.place.lat, s.place.lng), day, params);
  return PRAYERS.map((name) => ({ name, at: new Date(pt[KEY[name]].getTime() + (s.adjust[name] ?? 0) * 60000) }));
}

/** The next prayer from now (today's, or tomorrow's Fajr). Sunrise is not a prayer. */
export function nextPrayer(now: Date, s: PrayerSettings) {
  const upcoming = timesFor(now, s).find((p) => p.name !== 'Sunrise' && p.at > now);
  if (upcoming) return upcoming;
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return timesFor(tomorrow, s).find((p) => p.name === 'Fajr') ?? null;
}

export function clockText(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

export function leftText(ms: number) {
  const mins = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} hr ${m} min` : `${m} min`;
}
