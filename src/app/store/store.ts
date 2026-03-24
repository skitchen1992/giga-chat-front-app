import authSlice from "@/features/auth/model/slice";
import sendMessageSlice from "@/features/send-message/model/slice";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/app/services/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    sendMessage: sendMessageSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
