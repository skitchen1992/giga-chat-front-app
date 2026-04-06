import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChatAppMessageRecord } from "@/shared/lib";
import { api } from "@/shared/api";
import { loadChatHistoryThunk } from "./thunks";

export interface ChatHistoryState {
  chatId: string | null;
  messages: ChatAppMessageRecord[];
  status: "idle" | "loading" | "error";
}

const initialState: ChatHistoryState = {
  chatId: null,
  messages: [],
  status: "idle",
};

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    appendMessage: (state, action: PayloadAction<ChatAppMessageRecord>) => {
      state.messages.push(action.payload);
    },
    clearHistory: (state) => {
      state.messages = [];
      state.chatId = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatHistoryThunk.pending, (state, action) => {
        state.chatId = action.meta.arg;
        state.messages = [];
        state.status = "loading";
      })
      .addCase(loadChatHistoryThunk.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.status = "idle";
      })
      .addCase(loadChatHistoryThunk.rejected, (state) => {
        state.status = "error";
      })
      .addMatcher(api.endpoints.getCompletions.matchPending, (state) => {
        state.messages.push({
          id: "__pending__",
          chatId: state.chatId ?? "",
          role: "assistant",
          content: "",
          createdAt: Date.now(),
        });
      })
      .addMatcher(api.endpoints.getCompletions.matchFulfilled, (state) => {
        state.messages = state.messages.filter((m) => m.id !== "__pending__");
      })
      .addMatcher(api.endpoints.getCompletions.matchRejected, (state) => {
        state.messages = state.messages.filter((m) => m.id !== "__pending__");
      });
  },
});

export const { appendMessage, clearHistory } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
