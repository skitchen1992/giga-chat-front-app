import { api } from "@/app/services/api";
import { createSlice } from "@reduxjs/toolkit";

export type AssistantResponseStatus = "idle" | "loading" | "success" | "error";

export interface AssistantResponseState {
  text: string | null;
  status: AssistantResponseStatus;
  error: string | null;
}

const initialState: AssistantResponseState = {
  text: null,
  status: "idle",
  error: null,
};

export const assistantResponseSlice = createSlice({
  name: "assistantResponse",
  initialState,
  reducers: {
    clearAssistantResponse: (state) => {
      state.text = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getCompletions.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(api.endpoints.getCompletions.matchFulfilled, (state, action) => {
        state.status = "success";
        console.log(action.payload);
        const raw = action.payload.choices?.[0]?.message?.content;
        state.text = typeof raw === "string" ? raw : null;
      })
      .addMatcher(api.endpoints.getCompletions.matchRejected, (state, action) => {
        state.status = "error";
        state.error =
          action.error?.message?.trim() || "Не удалось получить ответ";
      });
  },
});

export const { clearAssistantResponse } = assistantResponseSlice.actions;

export default assistantResponseSlice.reducer;
