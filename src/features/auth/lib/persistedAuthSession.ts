const STORAGE_KEY = "gigachat-auth-session";

export interface PersistedAuthSession {
  accessToken: string;
  tokenExpiresAtMs: number;
}

/** Ответ OAuth: expires_at в секундах Unix; если число уже «как ms», не трогаем. */
export function oauthExpiresAtToMs(expiresAt: number): number {
  return expiresAt < 1_000_000_000_000 ? expiresAt * 1000 : expiresAt;
}

/** Запас по времени, чтобы не слать запрос с почти истёкшим токеном. */
const EXPIRY_SKEW_MS = 60_000;

export function isAccessTokenExpired(
  tokenExpiresAtMs: number,
  now = Date.now(),
): boolean {
  return now >= tokenExpiresAtMs - EXPIRY_SKEW_MS;
}

export function readPersistedAuthSession(): PersistedAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAuthSession;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.tokenExpiresAtMs !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistAuthSession(session: PersistedAuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearPersistedAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
