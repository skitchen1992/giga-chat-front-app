import type {DBSchema} from 'idb'
import {bindObjectStoreAccess} from '../indexed-db/bindObjectStoreShortcuts'
import {createIndexedDbConnection} from '../indexed-db/createIndexedDbConnection'

export interface ChatAppChatRecord {
	id: string
	title: string
	updatedAt: number
}

interface ChatAppDBSchema extends DBSchema {
	chats: {
		key: string
		value: ChatAppChatRecord
		indexes: {'by-updatedAt': number}
	}
}

const DB_NAME = 'giga-chat-app'
const DB_VERSION = 1

const connection = createIndexedDbConnection<ChatAppDBSchema>({
	name: DB_NAME,
	version: DB_VERSION,
	upgrade(db) {
		const store = db.createObjectStore('chats', {keyPath: 'id'})
		store.createIndex('by-updatedAt', 'updatedAt')
	}
})

const chatsStore = bindObjectStoreAccess(() => connection.getDb(), 'chats')

export async function getAllChatsFromIndexedDb(): Promise<ChatAppChatRecord[]> {
	const rows = await chatsStore.getAllFromIndex('by-updatedAt')
	return rows.reverse()
}

export async function putChatInIndexedDb(
	record: ChatAppChatRecord
): Promise<void> {
	await chatsStore.put(record)
}
