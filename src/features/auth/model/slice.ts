import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AuthBootstrapStatus = "idle" | "loading" | "ready" | "error";

export interface AuthState {
  accessToken: string;
  tokenExpiresAtMs: number | null;
  bootstrapStatus: AuthBootstrapStatus;
  bootstrapError: string | null;
}

const initialState: AuthState = {
  accessToken: "",
  tokenExpiresAtMs: null,
  bootstrapStatus: "idle",
  bootstrapError: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession: (
      state,
      action: PayloadAction<{
        accessToken: string;
        tokenExpiresAtMs: number;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.tokenExpiresAtMs = action.payload.tokenExpiresAtMs;
    },
    clearAuthSession: (state) => {
      state.accessToken = "";
      state.tokenExpiresAtMs = null;
    },
    authBootstrapStarted: (state) => {
      state.bootstrapStatus = "loading";
      state.bootstrapError = null;
    },
    authBootstrapSucceeded: (state) => {
      state.bootstrapStatus = "ready";
      state.bootstrapError = null;
    },
    authBootstrapFailed: (state, action: PayloadAction<string>) => {
      state.bootstrapStatus = "error";
      state.bootstrapError = action.payload;
    },
    authBootstrapReset: (state) => {
      state.bootstrapStatus = "idle";
      state.bootstrapError = null;
    },
  },
});

export const {
  setAuthSession,
  clearAuthSession,
  authBootstrapStarted,
  authBootstrapSucceeded,
  authBootstrapFailed,
  authBootstrapReset,
} = authSlice.actions;

export default authSlice.reducer;
