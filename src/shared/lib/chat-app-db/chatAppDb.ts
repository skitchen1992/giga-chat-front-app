import type { DBSchema } from "idb"
import { bindObjectStoreAccess } from "../indexed-db/bindObjectStoreShortcuts"
import { createIndexedDbConnection } from "../indexed-db/createIndexedDbConnection"

export interface ChatAppChatRecord {
	id: string
	title: string
	updatedAt: number
}

export type MessageRole = "user" | "assistant" | "system"

export interface ChatAppMessageRecord {
	id: string
	chatId: string
	role: MessageRole
	content: string
	createdAt: number
}

interface ChatAppDBSchema extends DBSchema {
	chats: {
		key: string
		value: ChatAppChatRecord
		indexes: { "by-updatedAt": number }
	}
	messages: {
		key: string
		value: ChatAppMessageRecord
		indexes: { "by-chatId-createdAt": [string, number] }
	}
}

const DB_NAME = "giga-chat-app"
const DB_VERSION = 2

const connection = createIndexedDbConnection<ChatAppDBSchema>({
	name: DB_NAME,
	version: DB_VERSION,
	upgrade(db, oldVersion) {
		if (oldVersion < 1) {
			const store = db.createObjectStore("chats", { keyPath: "id" })
			store.createIndex("by-updatedAt", "updatedAt")
		}
		if (oldVersion < 2) {
			const msgStore = db.createObjectStore("messages", { keyPath: "id" })
			msgStore.createIndex("by-chatId-createdAt", ["chatId", "createdAt"])
		}
	}
})

const chatsStore = bindObjectStoreAccess(() => connection.getDb(), "chats")
const messagesStore = bindObjectStoreAccess(
	() => connection.getDb(),
	"messages"
)

export async function getAllChatsFromIndexedDb(): Promise<ChatAppChatRecord[]> {
	const rows = await chatsStore.getAllFromIndex("by-updatedAt")
	return rows.reverse()
}

export async function putChatInIndexedDb(
	record: ChatAppChatRecord
): Promise<void> {
	await chatsStore.put(record)
}

export async function getMessagesByChatId(
	chatId: string
): Promise<ChatAppMessageRecord[]> {
	const lower: [string, number] = [chatId, 0]
	const upper: [string, number] = [chatId, Number.MAX_SAFE_INTEGER]
	const range = IDBKeyRange.bound(lower, upper)
	return messagesStore.getAllFromIndex("by-chatId-createdAt", range)
}

export async function putMessageInIndexedDb(
	record: ChatAppMessageRecord
): Promise<void> {
	await messagesStore.put(record)
}

export async function deleteChatFromIndexedDb(chatId: string): Promise<void> {
	await chatsStore.delete(chatId)
}

export async function deleteMessagesByChatId(chatId: string): Promise<void> {
	const lower: [string, number] = [chatId, 0]
	const upper: [string, number] = [chatId, Number.MAX_SAFE_INTEGER]
	const range = IDBKeyRange.bound(lower, upper)
	const messages = await messagesStore.getAllFromIndex(
		"by-chatId-createdAt",
		range
	)
	await Promise.all(messages.map(m => messagesStore.delete(m.id)))
}

export interface MessageSearchResult {
	chatId: string
	snippet: string
}

function extractSnippet(text: string, query: string): string {
	const normalized = text.replace(/\s+/gu, " ").trim()
	const idx = normalized.toLowerCase().indexOf(query.toLowerCase())

	if (idx === -1) {
		return normalized.slice(0, 80)
	}

	const start = Math.max(0, idx - 25)
	const end = Math.min(normalized.length, idx + query.length + 50)
	const snippet = normalized.slice(start, end)

	return (start > 0 ? "…" : "") + snippet + (end < normalized.length ? "…" : "")
}

export async function searchMessageContent(
	query: string
): Promise<MessageSearchResult[]> {
	const allMessages = await messagesStore.getAll()
	const lower = query.toLowerCase()
	const seen = new Set<string>()
	const results: MessageSearchResult[] = []

	for (const msg of allMessages) {
		if (!seen.has(msg.chatId) && msg.content.toLowerCase().includes(lower)) {
			seen.add(msg.chatId)
			results.push({
				chatId: msg.chatId,
				snippet: extractSnippet(msg.content, query)
			})
		}
	}

	return results
}

export async function updateChatTitleInIndexedDb(
	chatId: string,
	title: string
): Promise<void> {
	const db = await connection.getDb()
	const tx = db.transaction("chats", "readwrite")
	const existing = await tx.store.get(chatId)
	if (existing) {
		await tx.store.put({ ...existing, title, updatedAt: Date.now() })
	}
	await tx.done
}
