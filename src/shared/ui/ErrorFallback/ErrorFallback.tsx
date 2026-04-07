import { AlertCircle, RefreshCw } from "lucide-react"
import type { FallbackProps } from "react-error-boundary"

interface ErrorFallbackProps extends FallbackProps {
	variant?: "page" | "section" | "compact"
}

export function ErrorFallback({
	error,
	resetErrorBoundary,
	variant = "section"
}: ErrorFallbackProps) {
	const message = error instanceof Error ? error.message : "Неизвестная ошибка"

	if (variant === "compact") {
		return (
			<div className="flex items-center gap-2 px-3 py-2 text-destructive text-sm">
				<AlertCircle className="size-4 shrink-0" />
				<span className="truncate">Ошибка компонента</span>
				<button
					className="ml-auto shrink-0 underline underline-offset-2 hover:no-underline"
					onClick={resetErrorBoundary}
					type="button"
				>
					Повторить
				</button>
			</div>
		)
	}

	if (variant === "page") {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-6 p-8 text-center">
				<div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
					<AlertCircle className="size-8 text-destructive" />
				</div>
				<div className="max-w-sm space-y-2">
					<h1 className="font-semibold text-xl">Приложение упало</h1>
					<p className="text-muted-foreground text-sm">
						Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
					</p>
					{message && (
						<p className="rounded-md bg-muted px-3 py-2 font-mono text-muted-foreground text-xs">
							{message}
						</p>
					)}
				</div>
				<div className="flex gap-3">
					<button
						className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90"
						onClick={resetErrorBoundary}
						type="button"
					>
						<RefreshCw className="size-4" />
						Попробовать снова
					</button>
					<button
						className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
						onClick={() => window.location.reload()}
						type="button"
					>
						Перезагрузить страницу
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
			<div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
				<AlertCircle className="size-6 text-destructive" />
			</div>
			<div className="max-w-xs space-y-1">
				<p className="font-medium text-sm">Что-то пошло не так</p>
				{message && <p className="text-muted-foreground text-xs">{message}</p>}
			</div>
			<button
				className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm hover:bg-primary/90"
				onClick={resetErrorBoundary}
				type="button"
			>
				<RefreshCw className="size-3.5" />
				Повторить
			</button>
		</div>
	)
}

export function makeErrorFallback(
	variant: NonNullable<ErrorFallbackProps["variant"]>
) {
	return function BoundFallback(props: FallbackProps) {
		return <ErrorFallback {...props} variant={variant} />
	}
}
