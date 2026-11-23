// Daily streak reminder: a local notification made on the phone (no internet, no server).
// The next 14 days are scheduled one by one, so a day that is already done can be skipped.
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { recordError } from './crash';
import { addDays, currentStreak, doneToday, StreakData } from './streak';

const CHANNEL = 'streak-reminder';
const DAYS_AHEAD = 14;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Daily reminder',
    description: 'A gentle reminder to keep your daily Quran streak',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Asks for permission to show notifications. Returns true when allowed. */
export async function askReminderPermission(): Promise<boolean> {
  try {
    await ensureChannel();
    const cur = await Notifications.getPermissionsAsync();
    if (cur.granted) return true;
    if (!cur.canAskAgain) return false;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch (e) {
    recordError('reminder-permission', e);
    return false;
  }
}

/** Replaces all scheduled reminders to match the current settings and streak. */
export async function refreshReminders(s: StreakData) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!s.reminder.on) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await ensureChannel();
    const now = new Date();
    const streak = currentStreak(s, now);
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const at = addDays(now, i);
      at.setHours(s.reminder.hour, s.reminder.minute, 0, 0);
      if (at.getTime() <= now.getTime() + 60_000) continue;
      if (i === 0 && s.reminder.onlyIfMissed && doneToday(s, now)) continue;
      const days = i === 0 ? streak : 0;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: days > 1 ? `Keep your ${days}-day streak` : 'Time for the Quran',
          body: 'Listen to the Quran for just 1 minute today.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
      });
    }
  } catch (e) {
    recordError('reminder-schedule', e);
  }
}
