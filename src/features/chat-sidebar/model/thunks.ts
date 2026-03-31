import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllChatsFromIndexedDb, putChatInIndexedDb } from "@/shared/lib";

function recordToListItem(r: { id: string; title: string }) {
  return { id: r.id, title: r.title };
}

export const hydrateChatsFromIndexedDb = createAsyncThunk(
  "chatSidebar/hydrateChats",
  async () => {
    let rows = await getAllChatsFromIndexedDb();

    if (rows.length === 0) {
      rows = await getAllChatsFromIndexedDb();
    }
    return rows.map(recordToListItem);
  }
);

export const createNewChatThunk = createAsyncThunk(
  "chatSidebar/createNewChat",
  async () => {
    const id = crypto.randomUUID();
    const title = "Новый чат";
    const updatedAt = Date.now();

    await putChatInIndexedDb({ id, title, updatedAt });
    return { id, title };
  }
);
