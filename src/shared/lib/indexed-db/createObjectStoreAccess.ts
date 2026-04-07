import type {DBSchema, StoreNames} from 'idb'
import {bindObjectStoreAccess} from './bindObjectStoreShortcuts'
import type {IndexedDbConnection} from './createIndexedDbConnection'

/**
 * Типизированные шорткаты idb для одного object store: чтение, запись, индексы, count.
 */
export function createObjectStoreAccess<
	Schema extends DBSchema,
	StoreName extends StoreNames<Schema>
>(connection: IndexedDbConnection<Schema>, storeName: StoreName) {
	return bindObjectStoreAccess(() => connection.getDb(), storeName)
}

export type ObjectStoreAccess<
	Schema extends DBSchema,
	StoreName extends StoreNames<Schema>
> = ReturnType<typeof createObjectStoreAccess<Schema, StoreName>>
