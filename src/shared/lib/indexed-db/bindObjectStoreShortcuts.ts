import type {
	DBSchema,
	IDBPDatabase,
	IndexKey,
	IndexNames,
	StoreKey,
	StoreNames,
	StoreValue
} from 'idb'

export function bindObjectStoreCrud<
	Schema extends DBSchema,
	StoreName extends StoreNames<Schema>
>(getDb: () => Promise<IDBPDatabase<Schema>>, storeName: StoreName) {
	return {
		get(query: StoreKey<Schema, StoreName> | IDBKeyRange) {
			return getDb().then(db => db.get(storeName, query))
		},

		getKey(query: StoreKey<Schema, StoreName> | IDBKeyRange) {
			return getDb().then(db => db.getKey(storeName, query))
		},

		getAll(
			query?: StoreKey<Schema, StoreName> | IDBKeyRange | null,
			count?: number
		) {
			return getDb().then(db => db.getAll(storeName, query, count))
		},

		getAllKeys(
			query?: StoreKey<Schema, StoreName> | IDBKeyRange | null,
			count?: number
		) {
			return getDb().then(db => db.getAllKeys(storeName, query, count))
		},

		add(
			value: StoreValue<Schema, StoreName>,
			key?: StoreKey<Schema, StoreName> | IDBKeyRange
		) {
			return getDb().then(db => db.add(storeName, value, key))
		},

		put(
			value: StoreValue<Schema, StoreName>,
			key?: StoreKey<Schema, StoreName> | IDBKeyRange
		) {
			return getDb().then(db => db.put(storeName, value, key))
		},

		delete(key: StoreKey<Schema, StoreName> | IDBKeyRange) {
			return getDb().then(db => db.delete(storeName, key))
		},

		clear() {
			return getDb().then(db => db.clear(storeName))
		},

		count(key?: StoreKey<Schema, StoreName> | IDBKeyRange | null) {
			return getDb().then(db => db.count(storeName, key))
		}
	}
}

export function bindObjectStoreIndexes<
	Schema extends DBSchema,
	StoreName extends StoreNames<Schema>
>(getDb: () => Promise<IDBPDatabase<Schema>>, storeName: StoreName) {
	return {
		getFromIndex<IndexName extends IndexNames<Schema, StoreName>>(
			indexName: IndexName,
			query: IndexKey<Schema, StoreName, IndexName> | IDBKeyRange
		) {
			return getDb().then(db => db.getFromIndex(storeName, indexName, query))
		},

		getKeyFromIndex<IndexName extends IndexNames<Schema, StoreName>>(
			indexName: IndexName,
			query: IndexKey<Schema, StoreName, IndexName> | IDBKeyRange
		) {
			return getDb().then(db => db.getKeyFromIndex(storeName, indexName, query))
		},

		getAllFromIndex<IndexName extends IndexNames<Schema, StoreName>>(
			indexName: IndexName,
			query?: IndexKey<Schema, StoreName, IndexName> | IDBKeyRange | null,
			count?: number
		) {
			return getDb().then(db =>
				db.getAllFromIndex(storeName, indexName, query, count)
			)
		},

		getAllKeysFromIndex<IndexName extends IndexNames<Schema, StoreName>>(
			indexName: IndexName,
			query?: IndexKey<Schema, StoreName, IndexName> | IDBKeyRange | null,
			count?: number
		) {
			return getDb().then(db =>
				db.getAllKeysFromIndex(storeName, indexName, query, count)
			)
		},

		countFromIndex<IndexName extends IndexNames<Schema, StoreName>>(
			indexName: IndexName,
			key?: IndexKey<Schema, StoreName, IndexName> | IDBKeyRange | null
		) {
			return getDb().then(db => db.countFromIndex(storeName, indexName, key))
		}
	}
}

export function bindObjectStoreAccess<
	Schema extends DBSchema,
	StoreName extends StoreNames<Schema>
>(getDb: () => Promise<IDBPDatabase<Schema>>, storeName: StoreName) {
	return Object.assign(
		bindObjectStoreCrud(getDb, storeName),
		bindObjectStoreIndexes(getDb, storeName)
	)
}
