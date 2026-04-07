import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {
	createNewChatThunk,
	deleteChatThunk,
	hydrateChatsFromIndexedDb,
	renameChatThunk,
	searchMessagesContentThunk
} from './thunks'

export interface ChatListItem {
	id: string
	title: string
}

export interface ChatSidebarState {
	chats: ChatListItem[]
	searchQuery: string
	activeChatId: string | null
	chatsHydrated: boolean
	contentMatches: Record<string, string>
}

const initialState: ChatSidebarState = {
	chats: [],
	searchQuery: '',
	activeChatId: null,
	chatsHydrated: false,
	contentMatches: {}
}

export const chatSidebarSlice = createSlice({
	name: 'chatSidebar',
	initialState,
	reducers: {
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload
			if (!action.payload.trim()) {
				state.contentMatches = {}
			}
		},
		setActiveChatId: (state, action: PayloadAction<string | null>) => {
			state.activeChatId = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(hydrateChatsFromIndexedDb.fulfilled, (state, action) => {
				state.chats = action.payload
				state.chatsHydrated = true
			})
			.addCase(createNewChatThunk.fulfilled, (state, action) => {
				const {id, title} = action.payload

				state.chats.unshift({id, title})
				state.activeChatId = id
			})
			.addCase(renameChatThunk.fulfilled, (state, action) => {
				const {id, title} = action.payload

				const chat = state.chats.find(c => c.id === id)
				if (chat) {
					chat.title = title
				}
			})
			.addCase(searchMessagesContentThunk.fulfilled, (state, action) => {
				state.contentMatches = action.payload
			})
			.addCase(deleteChatThunk.fulfilled, (state, action) => {
				const deletedId = action.payload

				state.chats = state.chats.filter(c => c.id !== deletedId)

				if (state.activeChatId === deletedId) {
					state.activeChatId = state.chats[0]?.id ?? null
				}
			})
	}
})

export const {setSearchQuery, setActiveChatId} = chatSidebarSlice.actions

export const chatSidebarReducer = chatSidebarSlice.reducer
