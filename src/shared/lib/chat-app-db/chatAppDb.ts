import type { DBSchema } from "idb";
import { bindObjectStoreAccess } from "../indexed-db/bindObjectStoreShortcuts";
import { createIndexedDbConnection } from "../indexed-db/createIndexedDbConnection";

export interface ChatAppChatRecord {
  id: string;
  title: string;
  updatedAt: number;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatAppMessageRecord {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

interface ChatAppDBSchema extends DBSchema {
  chats: {
    key: string;
    value: ChatAppChatRecord;
    indexes: { "by-updatedAt": number };
  };
  messages: {
    key: string;
    value: ChatAppMessageRecord;
    indexes: { "by-chatId-createdAt": [string, number] };
  };
}

const DB_NAME = "giga-chat-app";
const DB_VERSION = 2;

const connection = createIndexedDbConnection<ChatAppDBSchema>({
  name: DB_NAME,
  version: DB_VERSION,
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const store = db.createObjectStore("chats", { keyPath: "id" });
      store.createIndex("by-updatedAt", "updatedAt");
    }
    if (oldVersion < 2) {
      const msgStore = db.createObjectStore("messages", { keyPath: "id" });
      msgStore.createIndex("by-chatId-createdAt", ["chatId", "createdAt"]);
    }
  },
});

const chatsStore = bindObjectStoreAccess(() => connection.getDb(), "chats");
const messagesStore = bindObjectStoreAccess(
  () => connection.getDb(),
  "messages"
);

export async function getAllChatsFromIndexedDb(): Promise<ChatAppChatRecord[]> {
  const rows = await chatsStore.getAllFromIndex("by-updatedAt");
  return rows.reverse();
}

export async function putChatInIndexedDb(
  record: ChatAppChatRecord
): Promise<void> {
  await chatsStore.put(record);
}

export async function getMessagesByChatId(
  chatId: string
): Promise<ChatAppMessageRecord[]> {
  const lower: [string, number] = [chatId, 0];
  const upper: [string, number] = [chatId, Number.MAX_SAFE_INTEGER];
  const range = IDBKeyRange.bound(lower, upper);
  return messagesStore.getAllFromIndex("by-chatId-createdAt", range);
}

export async function putMessageInIndexedDb(
  record: ChatAppMessageRecord
): Promise<void> {
  await messagesStore.put(record);
}
