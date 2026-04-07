// Public API для shared/lib
// Утилиты, хелперы, хуки

export type {
	DBSchema,
	IDBPDatabase,
	IDBPTransaction,
	IndexKey,
	IndexNames,
	StoreKey,
	StoreNames,
	StoreValue
} from 'idb'
export {openDB} from 'idb'
export type {
	ChatAppChatRecord,
	ChatAppMessageRecord,
	MessageRole
} from './chat-app-db/chatAppDb'
export {
	deleteChatFromIndexedDb,
	deleteMessagesByChatId,
	getAllChatsFromIndexedDb,
	getMessagesByChatId,
	putChatInIndexedDb,
	putMessageInIndexedDb,
	updateChatTitleInIndexedDb
} from './chat-app-db/chatAppDb'
export {formatFileSize} from './formatFileSize'
export {
	type CreateIndexedDbConnectionOptions,
	createIndexedDbConnection,
	deleteIndexedDb,
	type IndexedDbConnection
} from './indexed-db/createIndexedDbConnection'
export {
	createObjectStoreAccess,
	type ObjectStoreAccess
} from './indexed-db/createObjectStoreAccess'
export {runIndexedDbTransaction} from './indexed-db/runIndexedDbTransaction'
