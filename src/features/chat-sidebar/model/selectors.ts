import {createSelector} from '@reduxjs/toolkit'
import type {RootState} from '@/app/store'

export const selectChatSidebar = (state: RootState) => state.chatSidebar

export const selectChatSidebarSearchQuery = createSelector(
	[selectChatSidebar],
	sidebar => sidebar.searchQuery
)

export const selectChatSidebarActiveId = createSelector(
	[selectChatSidebar],
	sidebar => sidebar.activeChatId
)

export const selectChatSidebarHydrated = createSelector(
	[selectChatSidebar],
	sidebar => sidebar.chatsHydrated
)

export const selectFilteredChats = createSelector(
	[selectChatSidebar],
	sidebar => {
		const q = sidebar.searchQuery.trim().toLowerCase()
		if (!q) {
			return sidebar.chats
		}
		return sidebar.chats.filter(chat => chat.title.toLowerCase().includes(q))
	}
)
