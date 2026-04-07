import { createSelector } from "@reduxjs/toolkit"

import { selectChatSidebarActiveId } from "../../model/selectors"

export const makeSelectChatSidebarRowState = (chatId: string) =>
	createSelector([selectChatSidebarActiveId, state => state], activeChatId => ({
		isActive: chatId === activeChatId
	}))
