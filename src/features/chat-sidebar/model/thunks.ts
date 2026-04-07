import {createAsyncThunk} from '@reduxjs/toolkit'
import {
	deleteChatFromIndexedDb,
	deleteMessagesByChatId,
	getAllChatsFromIndexedDb,
	putChatInIndexedDb,
	updateChatTitleInIndexedDb
} from '@/shared/lib'

const CHAT_LIST_TITLE_MAX = 48

function chatTitleFromFirstMessage(text: string): string {
	const line = text.replace(/\s+/gu, ' ').trim()

	if (!line) {
		return 'Новый чат'
	}

	return line.length <= CHAT_LIST_TITLE_MAX
		? line
		: `${line.slice(0, CHAT_LIST_TITLE_MAX - 1)}…`
}

function recordToListItem(r: {id: string; title: string}) {
	return {id: r.id, title: r.title}
}

export const hydrateChatsFromIndexedDb = createAsyncThunk(
	'chatSidebar/hydrateChats',
	async () => {
		let rows = await getAllChatsFromIndexedDb()

		if (rows.length === 0) {
			rows = await getAllChatsFromIndexedDb()
		}
		return rows.map(recordToListItem)
	}
)

export const createNewChatThunk = createAsyncThunk(
	'chatSidebar/createNewChat',
	async (payload?: {firstUserMessage?: string}) => {
		const id = crypto.randomUUID()

		const title = payload?.firstUserMessage
			? chatTitleFromFirstMessage(payload.firstUserMessage)
			: 'Новый чат'
		const updatedAt = Date.now()

		await putChatInIndexedDb({id, title, updatedAt})
		return {id, title}
	}
)

export const renameChatThunk = createAsyncThunk(
	'chatSidebar/renameChat',
	async (payload: {id: string; title: string}) => {
		const trimmed = payload.title.trim() || 'Новый чат'
		await updateChatTitleInIndexedDb(payload.id, trimmed)
		return {id: payload.id, title: trimmed}
	}
)

export const deleteChatThunk = createAsyncThunk(
	'chatSidebar/deleteChat',
	async (chatId: string) => {
		await deleteMessagesByChatId(chatId)
		await deleteChatFromIndexedDb(chatId)
		return chatId
	}
)
