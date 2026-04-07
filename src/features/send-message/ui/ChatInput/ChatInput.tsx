import {ArrowUpIcon, FileText, Loader2, Plus, X} from 'lucide-react'
import {useDropzone} from 'react-dropzone'
import {useNavigate, useParams} from 'react-router'
import {useAppDispatch, useAppSelector} from '@/app/store/hooks'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'
import {appendMessage} from '@/features/chat-history'
import {createNewChatThunk} from '@/features/chat-sidebar'
import {cn} from '@/lib/utils'
import type {ChatMessage} from '@/shared/api'
import {useGetCompletionsMutation} from '@/shared/api'
import {
	formatFileSize,
	getMessagesByChatId,
	putMessageInIndexedDb
} from '@/shared/lib'
import {addFile, clearFiles, removeFile} from '../../model/attachmentStore'
import {
	addAttachment,
	clearAttachments,
	removeAttachment,
	resetMessage,
	setMessage
} from '../../model/slice'
import selector from './selector'

function ChatInput() {
	const [getCompletions, {isLoading}] = useGetCompletionsMutation()
	const {message, attachments} = useAppSelector(selector)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const {chatId} = useParams()

	const persistDraftChatIfNeeded = async (
		messageText: string
	): Promise<string | null> => {
		const isDraftRoute = chatId === null || chatId === 'new'

		if (!isDraftRoute) {
			return chatId ?? null
		}

		try {
			const {id} = await dispatch(
				createNewChatThunk({firstUserMessage: messageText})
			).unwrap()
			await navigate(`/chat/${id}`, {replace: true})
			return id
		} catch {
			// без записи в IndexedDB не переходим на постоянный URL
			return null
		}
	}

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
		open
	} = useDropzone({
		onDrop: acceptedFiles => {
			acceptedFiles.forEach(file => {
				const id = addFile(file)
				dispatch(addAttachment({id, name: file.name, size: file.size}))
			})
		},
		noClick: true, // не открывать диалог по клику
		noKeyboard: true, // не открывать по клавише
		accept: {
			'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.tiff', '.bmp'],
			'text/plain': ['.txt'],
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				['.docx'],
			'application/epub+zip': ['.epub'],
			'application/vnd.ms-powerpoint': ['.ppt'],
			'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				['.pptx']
		},
		maxSize: 10 * 1024 * 1024 // 10 MB
	})

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		dispatch(setMessage(e.target.value))
	}

	const handleSend = async () => {
		const text = message.trim()

		const resolvedChatId = await persistDraftChatIfNeeded(text)

		const userMessage: ChatMessage = {role: 'user', content: text}

		if (resolvedChatId) {
			const userRecord = {
				id: crypto.randomUUID(),
				chatId: resolvedChatId,
				role: 'user' as const,
				content: text,
				createdAt: Date.now()
			}
			await putMessageInIndexedDb(userRecord)
			dispatch(appendMessage(userRecord))

			const history = await getMessagesByChatId(resolvedChatId)
			const messages: ChatMessage[] = history.map(m => ({
				role: m.role,
				content: m.content
			}))

			const result = await getCompletions({messages}).unwrap()
			const assistantContent = result.choices?.[0]?.message?.content

			if (assistantContent) {
				const assistantRecord = {
					id: crypto.randomUUID(),
					chatId: resolvedChatId,
					role: 'assistant' as const,
					content: assistantContent,
					createdAt: Date.now()
				}
				await putMessageInIndexedDb(assistantRecord)
				dispatch(appendMessage(assistantRecord))
			}
		} else {
			getCompletions({messages: [userMessage]})
		}

		dispatch(resetMessage())
		dispatch(clearAttachments())
		clearFiles()
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if ((message.trim() || attachments.length > 0) && !isLoading) {
				void handleSend()
			}
		}
		if (e.key === 'Escape') {
			dispatch(resetMessage())
		}
	}

	const handleRemoveAttachment = (id: string) => () => {
		removeFile(id)
		dispatch(removeAttachment(id))
	}

	return (
		<div className='w-full max-w-2xl space-y-3' {...getRootProps()}>
			{attachments.length > 0 && (
				<div className='flex flex-wrap gap-2'>
					{attachments.map(attachment => (
						<div
							className='flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm'
							key={attachment.id}
						>
							<FileText className='size-4 shrink-0 text-muted-foreground' />
							<span className='max-w-[180px] truncate' title={attachment.name}>
								{attachment.name}
							</span>
							<span className='shrink-0 text-muted-foreground'>
								{formatFileSize(attachment.size)}
							</span>
							<Button
								aria-label='Удалить вложение'
								className='-my-1 -mr-1 shrink-0'
								onClick={handleRemoveAttachment(attachment.id)}
								size='icon-xs'
								variant='ghost'
							>
								<X className='size-3' />
							</Button>
						</div>
					))}
				</div>
			)}
			<div
				className={cn(
					'relative flex items-center rounded-xl border px-4 py-3 transition-colors',
					isDragReject && 'border-destructive bg-destructive/10',
					isDragAccept && 'border-primary bg-primary/10',
					!isDragActive && 'border-input bg-muted/30'
				)}
			>
				<Button
					aria-label='Добавить'
					onClick={open}
					size='icon-sm'
					variant={null}
				>
					<Plus className='size-5 text-muted-foreground' />
				</Button>
				<input {...getInputProps()} />
				<Textarea
					className='max-h-[40vh] min-h-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder='Спросите GigaGhat'
					rows={1}
					value={message}
				/>
				<Button
					aria-label='Отправить'
					className='rounded-full'
					disabled={(!message.trim() && attachments.length === 0) || isLoading}
					onClick={handleSend}
					size='icon-sm'
					variant='default'
				>
					{isLoading ? (
						<Loader2 className='size-5 animate-spin' />
					) : (
						<ArrowUpIcon className='size-5' />
					)}
				</Button>
			</div>
		</div>
	)
}

export default ChatInput
