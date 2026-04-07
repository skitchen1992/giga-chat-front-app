import {createSelector} from '@reduxjs/toolkit'
import {
	selectChatSidebar,
	selectChatSidebarHydrated
} from '@/features/chat-sidebar'

export const selectAppState = createSelector(
	[selectChatSidebarHydrated, selectChatSidebar],
	(hydrated, {chats}) => ({
		hydrated,
		chats
	})
)
