import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

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

export interface FilteredChat {
	id: string
	title: string
	snippet?: string
}

export const selectContentMatches = createSelector(
	[selectChatSidebar],
	sidebar => sidebar.contentMatches
)

export const selectFilteredChats = createSelector(
	[selectChatSidebar],
	(sidebar): FilteredChat[] => {
		const q = sidebar.searchQuery.trim().toLowerCase()

		if (!q) {
			return sidebar.chats
		}

		const titleMatched = sidebar.chats.filter(chat =>
			chat.title.toLowerCase().includes(q)
		)
		const titleMatchedIds = new Set(titleMatched.map(c => c.id))

		const contentOnlyMatched: FilteredChat[] = sidebar.chats
			.filter(
				chat =>
					!titleMatchedIds.has(chat.id) && chat.id in sidebar.contentMatches
			)
			.map(chat => ({
				...chat,
				...(sidebar.contentMatches[chat.id] !== undefined && {
					snippet: sidebar.contentMatches[chat.id]
				})
			}))

		return [...titleMatched, ...contentOnlyMatched]
	}
)
