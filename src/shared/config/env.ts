/**
 * Читает первое непустое значение из import.meta.env.
 * Локально — из `.env`; в CI/проде — задайте те же имена в секретах платформы
 * (они попадут в process.env при `vite dev` / `vite build`).
 * Префикс VITE_ обязателен, иначе Vite не пробросит переменную в клиент.
 */
export function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export const gigaChatAuthorizationKey = (): string | undefined =>
  readEnv("VITE_GIGA_CHAT_AUTHORIZATION_KEY");

export const gigaChatOauthScope = (): string | undefined =>
  readEnv("VITE_GIGA_OAUTH_SCOPE");
