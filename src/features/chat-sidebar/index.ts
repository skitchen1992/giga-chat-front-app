export {
	selectChatSidebar,
	selectChatSidebarActiveId,
	selectChatSidebarHydrated,
	selectChatSidebarSearchQuery,
	selectFilteredChats
} from './model/selectors'
export type {ChatListItem, ChatSidebarState} from './model/slice'
export {setActiveChatId, setSearchQuery} from './model/slice'
export {
	createNewChatThunk,
	hydrateChatsFromIndexedDb
} from './model/thunks'
export {ChatSidebar} from './ui/ChatSidebar'
