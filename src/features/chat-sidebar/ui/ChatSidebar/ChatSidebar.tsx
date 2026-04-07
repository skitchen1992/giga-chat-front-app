import { Pencil, Search } from "lucide-react"
import { type ChangeEvent, useCallback, useEffect } from "react"
import { useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clearAssistantResponse } from "@/features/assistant-response"
import { clearFiles } from "@/features/send-message/model/attachmentStore"
import {
	clearAttachments,
	resetMessage
} from "@/features/send-message/model/slice"
import { setSearchQuery } from "../../model/slice"
import { searchMessagesContentThunk } from "../../model/thunks"
import { ChatSidebarRow } from "../ChatSidebarRow/ChatSidebarRow"
import { selectChatSidebarView } from "./selector"

export function ChatSidebar() {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const { searchQuery, filteredChats } = useAppSelector(selectChatSidebarView)

	const handleNewChat = useCallback(() => {
		dispatch(clearAssistantResponse())
		dispatch(resetMessage())
		dispatch(clearAttachments())
		clearFiles()

		navigate("/chat/new")
	}, [dispatch, navigate])

	const handleSearchChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			dispatch(setSearchQuery(e.target.value))
		},
		[dispatch]
	)

	useEffect(() => {
		const q = searchQuery.trim()

		if (!q) {
			return
		}
		const timer = setTimeout(() => {
			dispatch(searchMessagesContentThunk(q))
		}, 300)

		return () => clearTimeout(timer)
	}, [searchQuery, dispatch])

	return (
		<aside className="fixed top-12 left-0 z-10 flex h-[calc(100vh-3rem)] w-64 flex-col border-border border-r bg-sidebar">
			<div className="flex flex-1 flex-col overflow-hidden p-3">
				<Button
					className="mb-3 w-full justify-start gap-2"
					onClick={handleNewChat}
					type="button"
					variant="outline"
				>
					<Pencil className="size-4" />
					Новый чат
				</Button>
				<div className="relative mb-4">
					<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-9"
						onChange={handleSearchChange}
						placeholder="Поиск в чатах"
						value={searchQuery}
					/>
				</div>

				<div className="mt-4 flex-1 overflow-auto">
					<p className="mb-2 px-3 font-medium text-muted-foreground text-xs">
						Недавнее
					</p>
					<ul className="space-y-0.5">
						{filteredChats.map(chat => (
							<ChatSidebarRow chat={chat} key={chat.id} />
						))}
					</ul>
				</div>
			</div>
		</aside>
	)
}
