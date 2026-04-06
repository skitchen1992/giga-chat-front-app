import type { RootState } from "@/app/store";

export const selectChatHistory = (state: RootState) => state.chatHistory;
