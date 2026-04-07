import type { DBSchema, IDBPDatabase, IDBPTransaction, StoreNames } from "idb"

/**
 * Несколько операций в одной транзакции. После колбэка дожидаемся `tx.done`.
 */
export async function runIndexedDbTransaction<
	Schema extends DBSchema,
	Names extends StoreNames<Schema>[],
	Mode extends IDBTransactionMode = "readwrite"
>(
	database: IDBPDatabase<Schema>,
	storeNames: Names,
	mode: Mode,
	callback: (tx: IDBPTransaction<Schema, Names, Mode>) => void | Promise<void>
): Promise<void> {
	const tx = database.transaction(storeNames, mode)
	await Promise.resolve(callback(tx as IDBPTransaction<Schema, Names, Mode>))
	await tx.done
}
