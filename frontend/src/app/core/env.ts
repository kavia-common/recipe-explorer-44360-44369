/**
 * Helpers to retrieve environment variables safely for both browser and server.
 * It reads from process.env (SSR build) and gracefully falls back to undefined in browser.
 */
export const getEnv = (key: string): string | undefined => {
  try {
    const maybeProcess: any = (typeof process !== 'undefined') ? (process as any) : undefined;
    const val = maybeProcess?.env?.[key];
    if (val && typeof val === 'string') return val;
  } catch {
    // ignore
  }
  // Also try globalThis injected variables if any future setup populates them
  const anyGlobal = globalThis as any;
  const candidate = anyGlobal?.[key];
  return typeof candidate === 'string' ? candidate : undefined;
};

export const API_BASE =
  getEnv('NG_APP_API_BASE') ||
  getEnv('NG_APP_BACKEND_URL') ||
  undefined;
