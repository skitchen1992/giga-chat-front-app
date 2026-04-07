import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { setActiveChatId } from "../../model/slice"
import { deleteChatThunk, renameChatThunk } from "../../model/thunks"
import { makeSelectChatSidebarRowState } from "./selector"

export interface ChatSidebarRowProps {
	chat: { id: string; title: string; snippet?: string }
}

export function ChatSidebarRow(props: ChatSidebarRowProps) {
	const { chat } = props
	const { id, title, snippet } = chat

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const selectRowState = useMemo(() => makeSelectChatSidebarRowState(id), [id])
	const { isActive } = useAppSelector(selectRowState)

	const [renameOpen, setRenameOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [renameValue, setRenameValue] = useState(title)

	const inputRef = useRef<HTMLInputElement>(null)

	const handleClick = () => {
		dispatch(setActiveChatId(id))
		navigate(`/chat/${id}`)
	}

	const handleRenameOpen = () => {
		setRenameValue(title)
		setRenameOpen(true)
	}

	const handleRenameConfirm = () => {
		if (renameValue.trim()) {
			dispatch(renameChatThunk({ id, title: renameValue }))
		}
		setRenameOpen(false)
	}

	const handleDeleteConfirm = () => {
		dispatch(deleteChatThunk(id)).then(() => {
			navigate("/chat/new")
		})
	}

	const handleDialogClose = () => {
		setRenameOpen(false)
		setDeleteOpen(false)
	}

	return (
		<>
			<li>
				<div
					className={cn(
						"group flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-muted-foreground text-sm hover:bg-sidebar-accent",
						isActive && "bg-sidebar-accent font-medium text-foreground"
					)}
				>
					<button
						className="min-w-0 flex-1 overflow-hidden text-left"
						onClick={handleClick}
						type="button"
					>
						<span className="block truncate">{title}</span>
						{snippet && (
							<span className="block truncate font-normal text-muted-foreground text-xs">
								{snippet}
							</span>
						)}
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild={true}>
							<Button
								className="size-6 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
								onClick={e => e.stopPropagation()}
								size="icon-xs"
								type="button"
								variant="ghost"
							>
								<MoreHorizontal className="size-3.5" />
								<span className="sr-only">Действия с чатом</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" side="right">
							<DropdownMenuItem onSelect={handleRenameOpen}>
								<Pencil />
								Переименовать
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Удалить
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</li>

			<Dialog onOpenChange={handleDialogClose} open={renameOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Переименовать чат</DialogTitle>
					</DialogHeader>
					<Input
						maxLength={100}
						onChange={e => setRenameValue(e.target.value)}
						onKeyDown={e => {
							if (e.key === "Enter") {
								handleRenameConfirm()
							}
						}}
						placeholder="Название чата"
						ref={inputRef}
						value={renameValue}
					/>
					<DialogFooter>
						<Button onClick={handleDialogClose} variant="outline">
							Отмена
						</Button>
						<Button
							disabled={!renameValue.trim()}
							onClick={handleRenameConfirm}
						>
							Сохранить
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Удалить чат?</AlertDialogTitle>
						<AlertDialogDescription>
							Чат «{title}» и все его сообщения будут удалены без возможности
							восстановления.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={handleDeleteConfirm}
						>
							Удалить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
