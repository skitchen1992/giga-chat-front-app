import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store/store";
import { selectTokenSelector } from "@/features/auth/model/selectors";
import { gigaChatAuthorizationKey, gigaChatOauthScope } from "@/shared/config/env";
import { setToken } from "@/features/auth/model/slice";

export interface AccessTokenResponse {
  access_token: string;
  expires_at: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://gigachat.devices.sberbank.ru/api/v1",
    prepareHeaders: (headers, { getState, endpoint }) => {
      if (endpoint !== "getAuthToken") {
        const token = selectTokenSelector(getState() as RootState);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
      }
      headers.set("Accept", "application/json");
      headers.set("RqUID", crypto.randomUUID());

      return headers;
    },
  }),
  endpoints: (build) => ({
    getAuthToken: build.mutation<AccessTokenResponse, void>({
      query: () => {
        const scope = gigaChatOauthScope() ?? "";
        const oauthUrl =
          import.meta.env.DEV && typeof window !== "undefined"
            ? `${window.location.origin}/api/v2/oauth`
            : "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";

        return {
          url: oauthUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${gigaChatAuthorizationKey()}`,
          },
          body: new URLSearchParams({ scope }).toString(),
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.access_token));
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const { useGetAuthTokenMutation } = api;
