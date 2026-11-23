// Daily streak: a day counts once the person has listened for 1 minute.
// Everything is kept on the phone; nothing is sent anywhere.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'streak.v1';
export const GOAL_SECONDS = 60;

export type Reminder = { on: boolean; hour: number; minute: number; onlyIfMissed: boolean };

export type StreakData = {
  days: string[]; // completed days, "2026-11-23", oldest first
  best: number;
  todayKey: string;
  todaySecs: number;
  reminder: Reminder;
};

export const DEFAULT_REMINDER: Reminder = { on: false, hour: 20, minute: 30, onlyIfMissed: true };

export function dayKey(d: Date) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function emptyStreak(now = new Date()): StreakData {
  return { days: [], best: 0, todayKey: dayKey(now), todaySecs: 0, reminder: DEFAULT_REMINDER };
}

export async function loadStreak(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyStreak();
    const s = { ...emptyStreak(), ...JSON.parse(raw) } as StreakData;
    s.reminder = { ...DEFAULT_REMINDER, ...s.reminder };
    return rollDay(s, new Date());
  } catch {
    return emptyStreak();
  }
}

export function saveStreak(s: StreakData) {
  return AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
}

/** A new day started: reset today's seconds. */
export function rollDay(s: StreakData, now: Date): StreakData {
  const k = dayKey(now);
  return s.todayKey === k ? s : { ...s, todayKey: k, todaySecs: 0 };
}

/** Add listening seconds for today; marks the day done when it reaches the goal. */
export function addListening(s: StreakData, secs: number, now: Date): StreakData {
  const r = rollDay(s, now);
  const todaySecs = Math.min(GOAL_SECONDS * 10, r.todaySecs + secs);
  let days = r.days;
  if (todaySecs >= GOAL_SECONDS && !days.includes(r.todayKey)) days = [...days, r.todayKey].slice(-800);
  const next = { ...r, todaySecs, days };
  next.best = Math.max(next.best, currentStreak(next, now));
  return next;
}

export function doneToday(s: StreakData, now: Date) {
  return s.days.includes(dayKey(now));
}

/** Days in a row up to today (or up to yesterday, if today is not done yet). */
export function currentStreak(s: StreakData, now: Date) {
  const set = new Set(s.days);
  let d = set.has(dayKey(now)) ? now : addDays(now, -1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/** The last 7 days (oldest first) with whether each was done. */
export function lastWeek(s: StreakData, now: Date) {
  const set = new Set(s.days);
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(now, i - 6);
    return { label: names[d.getDay()], done: set.has(dayKey(d)), today: i === 6, key: dayKey(d) };
  });
}

export function timeLabel(hour: number, minute: number) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute < 10 ? '0' : ''}${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}
