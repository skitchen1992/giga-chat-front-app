import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createNewChatThunk, hydrateChatsFromIndexedDb } from "./thunks";

export interface ChatListItem {
  id: string;
  title: string;
}

export interface ChatSidebarState {
  chats: ChatListItem[];
  searchQuery: string;
  activeChatId: string | null;
  chatsHydrated: boolean;
}

const initialState: ChatSidebarState = {
  chats: [],
  searchQuery: "",
  activeChatId: null,
  chatsHydrated: false,
};

export const chatSidebarSlice = createSlice({
  name: "chatSidebar",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveChatId: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateChatsFromIndexedDb.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.chatsHydrated = true;
      })
      .addCase(createNewChatThunk.fulfilled, (state, action) => {
        const { id, title } = action.payload;
        state.chats.unshift({ id, title });
        state.activeChatId = id;
      });
  },
});

export const { setSearchQuery, setActiveChatId } = chatSidebarSlice.actions;

export const chatSidebarReducer = chatSidebarSlice.reducer;
