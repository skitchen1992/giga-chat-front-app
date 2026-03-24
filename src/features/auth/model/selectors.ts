import type { RootState } from "@/app/store";

export const selectTokenSelector = (state: RootState) => state.auth.accessToken;