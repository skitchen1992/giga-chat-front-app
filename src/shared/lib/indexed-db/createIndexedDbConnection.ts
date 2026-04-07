import {
	type DBSchema,
	deleteDB,
	type IDBPDatabase,
	type OpenDBCallbacks,
	openDB
} from 'idb'

export type CreateIndexedDbConnectionOptions<Schema extends DBSchema> = {
	name: string
	version: number
} & Pick<
	OpenDBCallbacks<Schema>,
	'upgrade' | 'blocked' | 'blocking' | 'terminated'
>

function buildOpenDbCallbacks<Schema extends DBSchema>(
	options: CreateIndexedDbConnectionOptions<Schema>
): OpenDBCallbacks<Schema> {
	const callbacks: OpenDBCallbacks<Schema> = {}
	if (options.upgrade !== undefined) {
		callbacks.upgrade = options.upgrade
	}
	if (options.blocked !== undefined) {
		callbacks.blocked = options.blocked
	}
	if (options.blocking !== undefined) {
		callbacks.blocking = options.blocking
	}
	if (options.terminated !== undefined) {
		callbacks.terminated = options.terminated
	}
	return callbacks
}

/**
 * Ленивое открытие IndexedDB с кешированием промиса.
 * После `deleteIndexedDb` вызовите `reset()`, чтобы следующий `getDb()` открыл БД заново.
 */
export function createIndexedDbConnection<Schema extends DBSchema>(
	options: CreateIndexedDbConnectionOptions<Schema>
) {
	let promise: Promise<IDBPDatabase<Schema>> | undefined

	return {
		getDb(): Promise<IDBPDatabase<Schema>> {
			promise ??= openDB<Schema>(
				options.name,
				options.version,
				buildOpenDbCallbacks(options)
			)
			return promise
		},
		reset(): void {
			promise = undefined
		}
	}
}

export type IndexedDbConnection<Schema extends DBSchema> = ReturnType<
	typeof createIndexedDbConnection<Schema>
>

export function deleteIndexedDb(
	name: string,
	callbacks?: Parameters<typeof deleteDB>[1]
): Promise<void> {
	return deleteDB(name, callbacks)
}
