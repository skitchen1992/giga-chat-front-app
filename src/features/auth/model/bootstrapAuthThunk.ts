import { api } from "@/app/services/api";
import type { AppDispatch } from "@/app/store";
import {
  clearPersistedAuthSession,
  isAccessTokenExpired,
  readPersistedAuthSession,
} from "@/features/auth/lib/persistedAuthSession";
import {
  authBootstrapFailed,
  authBootstrapStarted,
  authBootstrapSucceeded,
  clearAuthSession,
  setAuthSession,
} from "./slice";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string") return msg;
    }
  }
  if (error instanceof Error) return error.message;
  return "Не удалось получить токен авторизации";
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "status" in error &&
    (error as { status: unknown }).status === 401
  );
}

/** Поднимаем сессию из storage, затем модели; при 401 или протухшем токене — OAuth и повтор. */
export function bootstrapAuth() {
  return async (dispatch: AppDispatch) => {
    dispatch(authBootstrapStarted());

    try {
      const persisted = readPersistedAuthSession();
      if (persisted) {
        if (isAccessTokenExpired(persisted.tokenExpiresAtMs)) {
          clearPersistedAuthSession();
          dispatch(clearAuthSession());
        } else {
          dispatch(setAuthSession(persisted));
        }
      }

      try {
        await dispatch(
          api.endpoints.getModels.initiate(undefined, { forceRefetch: true }),
        ).unwrap();
      } catch (firstModelsError) {
        if (!isUnauthorizedError(firstModelsError)) {
          throw firstModelsError;
        }
        dispatch(clearAuthSession());
        clearPersistedAuthSession();
        await dispatch(api.endpoints.getAuthToken.initiate()).unwrap();
        await dispatch(
          api.endpoints.getModels.initiate(undefined, { forceRefetch: true }),
        ).unwrap();
      }
      dispatch(authBootstrapSucceeded());
    } catch (error) {
      dispatch(authBootstrapFailed(getErrorMessage(error)));
      throw error;
    }
  };
}
