import {ChevronDown} from 'lucide-react'
import {useEffect} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router'
import {useAppDispatch, useAppSelector} from '@/app/store/hooks'
import {
	AssistantResponse,
	selectAssistantResponse
} from '@/features/assistant-response'
import {
	ChatSidebar,
	hydrateChatsFromIndexedDb,
	selectChatSidebar,
	selectChatSidebarHydrated,
	setActiveChatId
} from '@/features/chat-sidebar'
import ChatInput from '@/features/send-message/ui/ChatInput/ChatInput'

export function App() {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const {chatId} = useParams()
	const hydrated = useAppSelector(selectChatSidebarHydrated)
	const {chats} = useAppSelector(selectChatSidebar)
	const {text, status, error} = useAppSelector(selectAssistantResponse)
	const showEmptyPlaceholder = status === 'idle' && !text && !error

	useEffect(() => {
		dispatch(hydrateChatsFromIndexedDb())
	}, [dispatch])

	useEffect(() => {
		const resolved =
			chatId != null && chatId !== 'new' ? chatId : null
		dispatch(setActiveChatId(resolved))
	}, [chatId, dispatch])

	useEffect(() => {
		if (!hydrated || location.pathname !== '/') return
		const [firstChat] = chats
		if (firstChat) {
			Promise.resolve(navigate(`/chat/${firstChat.id}`, {replace: true})).catch(
				() => undefined
			)
		}
	}, [hydrated, location.pathname, chats, navigate])

	return (
		<div className='flex h-screen bg-background'>
			{/* Шапка */}
			<header className='fixed top-0 right-0 left-0 z-10 flex h-12 items-center justify-between border-border border-b bg-background px-4'>
				<div className='flex items-center gap-2'>
					<div className='size-6 rounded bg-muted' />
					<span className='font-medium text-sm'>ChatGPT Auto</span>
					<ChevronDown className='size-4 text-muted-foreground' />
				</div>
				<button
					aria-label='Профиль'
					className='size-8 rounded-full border border-border'
					type='button'
				/>
			</header>

			<ChatSidebar />

			{/* Основная область */}
			<main className='ml-64 flex flex-1 flex-col pt-12'>
				<div className='flex min-h-0 flex-1 flex-col px-4 pb-6'>
					<div className='flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto py-8'>
						<AssistantResponse />
						{showEmptyPlaceholder ? (
							<div className='flex w-full flex-1 flex-col items-center justify-center'>
								<h2 className='text-center font-medium text-2xl text-muted-foreground'>
									Готов, когда ты готов.
								</h2>
							</div>
						) : null}
					</div>
					<div className='flex shrink-0 justify-center pt-2'>
						<ChatInput />
					</div>
				</div>

				<footer className='py-4 text-center'>
					<p className='text-muted-foreground text-xs'>
						ChatGPT может допускать ошибки. OpenAI не использует данные рабочей
						области Рабочая область Никита Лаврентьев для обучения своих
						моделей.
					</p>
				</footer>
			</main>
		</div>
	)
}
