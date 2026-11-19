// Crash safety net: unexpected JavaScript errors are recorded (and, where
// possible, survived) instead of closing the app. The last error is shown the
// next time the app opens so it can be shared for fixing.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'crash.last';

export type CrashInfo = { at: string; where: string; message: string; stack: string };

let lastSaved = 0;

export function recordError(where: string, err: unknown) {
  const e = err instanceof Error ? err : new Error(String(err));
  const info: CrashInfo = {
    at: new Date().toISOString(),
    where,
    message: e.message || String(err),
    stack: (e.stack || '').split('\n').slice(0, 12).join('\n'),
  };
  // avoid hammering storage if something fails in a loop
  const now = Date.now();
  if (now - lastSaved < 2000) return;
  lastSaved = now;
  AsyncStorage.setItem(KEY, JSON.stringify(info)).catch(() => {});
}

export async function takeLastCrash(): Promise<CrashInfo | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

type ErrorUtilsT = {
  getGlobalHandler: () => (error: unknown, isFatal?: boolean) => void;
  setGlobalHandler: (h: (error: unknown, isFatal?: boolean) => void) => void;
};

/** Records every uncaught JS error and keeps the app running instead of closing it. */
export function installCrashHandler() {
  const EU = (globalThis as unknown as { ErrorUtils?: ErrorUtilsT }).ErrorUtils;
  if (!EU) return;
  EU.setGlobalHandler((error, isFatal) => {
    recordError(isFatal ? 'fatal' : 'error', error);
    // Not passing the error on: the default handler would close the app.
    // Screen errors are caught by the ErrorBoundary, which offers a way back.
  });
}

/** Runs a player call, recording instead of throwing if the native side refuses. */
export function safe<T>(where: string, fn: () => T): T | undefined {
  try {
    return fn();
  } catch (e) {
    recordError(where, e);
    return undefined;
  }
}
