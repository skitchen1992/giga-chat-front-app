import type { RootState } from "@/app/store";

export const selectTokenSelector = (state: RootState) => state.auth.accessToken;

export const selectAuthBootstrapStatus = (state: RootState) =>
  state.auth.bootstrapStatus;

export const selectAuthBootstrapError = (state: RootState) =>
  state.auth.bootstrapError;
