import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Model } from "@/shared/api";

export interface RequestParams {
  temperature: number;
  top_p: number;
  max_tokens: number;
  repetition_penalty: number;
}

export interface SettingsState {
  modelList: Model[];
  selectedModel: string | null;
  requestParams: RequestParams;
}

const initialState: SettingsState = {
  modelList: [],
  selectedModel: null,
  requestParams: {
    temperature: 1.0,
    top_p: 0.9,
    max_tokens: 1024,
    repetition_penalty: 1.0,
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setModelList: (state, action: PayloadAction<Model[]>) => {
      state.modelList = action.payload;
      const first = action.payload[0];
      if (!state.selectedModel && first) {
        state.selectedModel = first.id;
      }
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    setRequestParam: <K extends keyof RequestParams>(
      state: SettingsState,
      action: PayloadAction<{ key: K; value: RequestParams[K] }>
    ) => {
      state.requestParams[action.payload.key] = action.payload.value;
    },
    resetRequestParams: (state) => {
      state.requestParams = initialState.requestParams;
    },
  },
});

export const {
  setModelList,
  setSelectedModel,
  setRequestParam,
  resetRequestParams,
} = settingsSlice.actions;

export default settingsSlice.reducer;
