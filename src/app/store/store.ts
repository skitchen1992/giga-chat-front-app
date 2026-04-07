import {configureStore} from '@reduxjs/toolkit'
import {api} from '@/app/services/api'
import assistantResponseSlice from '@/features/assistant-response/model/slice'
import authSlice from '@/features/auth/model/slice'
import chatHistoryReducer from '@/features/chat-history/model/slice'
import {chatSidebarReducer} from '@/features/chat-sidebar/model/slice'
import sendMessageSlice from '@/features/send-message/model/slice'
import settingsSlice from '@/features/settings/model/slice'

export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		sendMessage: sendMessageSlice,
		auth: authSlice,
		assistantResponse: assistantResponseSlice,
		chatSidebar: chatSidebarReducer,
		settings: settingsSlice,
		chatHistory: chatHistoryReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
