import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Model } from "@/app/services/api";

export interface SettingsState {
  modelList: Model[];
}

const initialState: SettingsState = {
  modelList: [],
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setModelList: (state, action: PayloadAction<Model[]>) => {
      state.modelList = action.payload;
    },
  },
});

export const { setModelList } = settingsSlice.actions;

export default settingsSlice.reducer;
