import { createSelector } from "@reduxjs/toolkit"
import {
	selectChatSidebarSearchQuery,
	selectFilteredChats
} from "../../model/selectors"

export const selectChatSidebarView = createSelector(
	[selectChatSidebarSearchQuery, selectFilteredChats],
	(searchQuery, filteredChats) => ({ searchQuery, filteredChats })
)
