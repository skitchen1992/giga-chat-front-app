import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  gigaChatAuthorizationKey,
  gigaChatOauthScope,
} from "@/shared/config/env";

export interface AccessTokenResponse {
  access_token: string;
  expires_at: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CompletionsResponse {
  choices: [
    {
      message: {
        content: string;
        role: string;
      };
      index: number;
      finish_reason: string;
    },
  ];
  created: number;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    precached_prompt_tokens: number;
  };
}

export interface Model {
  id: string;
  object: string;
  owned_by: string;
}

export interface ModelResponse {
  data: Model[];
  object: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.DEV && typeof window !== "undefined"
        ? `${window.location.origin}/api/v1`
        : "https://gigachat.devices.sberbank.ru/api/v1",
    prepareHeaders: (headers, { getState, endpoint }) => {
      if (endpoint !== "getAuthToken") {
        const token = (getState() as { auth?: { accessToken?: string } }).auth
          ?.accessToken;
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
    }),
    getModels: build.query<ModelResponse, void>({
      query: () => ({
        url: "/models",
        method: "GET",
      }),
    }),
    getCompletions: build.mutation<CompletionsResponse, { messages: ChatMessage[] }>({
      query: ({ messages }) => ({
        url: "/chat/completions",
        method: "POST",
        body: {
          model: "GigaChat-2-Max",
          messages,
        },
      }),
    }),
  }),
});

export const { useGetAuthTokenMutation, useGetCompletionsMutation, useGetModelsQuery } = api;
