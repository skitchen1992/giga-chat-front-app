import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useAppSelector } from "@/app/store/hooks"
import { cn } from "@/lib/utils"
import { selectAssistantResponse } from "../model/selectors"

export function AssistantResponse() {
	const { text, status, error } = useAppSelector(selectAssistantResponse)
	const isEmpty = status === "idle" && !text && !error

	if (isEmpty) {
		return null
	}

	return (
		<div
			className={cn(
				"w-full max-w-2xl space-y-3",
				status === "loading" && "min-h-[2.5rem]"
			)}
		>
			{status === "loading" && (
				<div
					aria-live="polite"
					className="flex items-center gap-2 text-muted-foreground text-sm"
				>
					<Loader2 className="size-4 shrink-0 animate-spin" />
					<span>Генерация ответа…</span>
				</div>
			)}
			{status === "error" && error && (
				<p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
					{error}
				</p>
			)}
			{text ? (
				<div className="whitespace-pre-wrap rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
				</div>
			) : null}
		</div>
	)
}
