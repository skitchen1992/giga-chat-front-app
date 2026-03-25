import type { RootState } from "@/app/store";

export const selectAssistantResponse = (state: RootState) =>
  state.assistantResponse;
