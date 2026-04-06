import { createSelector } from "@reduxjs/toolkit";
import { selectAssistantResponse } from "@/features/assistant-response";
import {
  selectChatSidebar,
  selectChatSidebarHydrated,
} from "@/features/chat-sidebar";

export const selectAppState = createSelector(
  [selectChatSidebarHydrated, selectChatSidebar, selectAssistantResponse],
  (hydrated, { chats }, assistantResponse) => ({
    hydrated,
    chats,
    ...assistantResponse,
  }),
);
