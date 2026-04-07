import { RotateCcw, SlidersHorizontal } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { selectRequestParams } from "../../model/selectors"
import { resetRequestParams, setRequestParam } from "../../model/slice"

interface ParamSliderProps {
	label: string
	description: string
	value: number
	min: number
	max: number
	step: number
	onChange: (value: number) => void
}

function ParamSlider({
	label,
	description,
	value,
	min,
	max,
	step,
	onChange
}: ParamSliderProps) {
	const percentage = ((value - min) / (max - min)) * 100

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div>
					<p className="font-medium text-sm">{label}</p>
					<p className="text-muted-foreground text-xs">{description}</p>
				</div>
				<span className="min-w-[3rem] rounded border border-border bg-muted px-2 py-0.5 text-center font-mono text-sm">
					{value}
				</span>
			</div>
			<div className="relative flex h-5 items-center">
				<div className="relative h-1.5 w-full rounded-full bg-muted">
					<div
						className="absolute h-full rounded-full bg-primary"
						style={{ width: `${percentage}%` }}
					/>
				</div>
				<input
					className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
					max={max}
					min={min}
					onChange={e => onChange(Number.parseFloat(e.target.value))}
					step={step}
					type="range"
					value={value}
				/>
			</div>
			<div className="flex justify-between text-muted-foreground text-xs">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	)
}

export function ModelSettingsPanel() {
	const dispatch = useAppDispatch()
	const params = useAppSelector(selectRequestParams)

	const handleChange =
		<K extends keyof typeof params>(key: K) =>
		(value: (typeof params)[K]) => {
			dispatch(setRequestParam({ key, value }))
		}

	const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number.parseInt(e.target.value, 10)
		if (!Number.isNaN(val) && val > 0) {
			dispatch(setRequestParam({ key: "max_tokens", value: val }))
		}
	}

	const handleReset = () => {
		dispatch(resetRequestParams())
	}

	return (
		<Dialog>
			<DialogTrigger asChild={true}>
				<Button
					aria-label="Параметры запроса"
					size="icon-sm"
					title="Параметры запроса"
					variant="ghost"
				>
					<SlidersHorizontal className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Параметры запроса</DialogTitle>
					<DialogDescription>
						Настройте параметры генерации ответа модели GigaChat
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-2">
					<ParamSlider
						description="Влияет на случайность ответов. Чем выше — тем разнообразнее."
						label="Temperature"
						max={2}
						min={0}
						onChange={handleChange("temperature")}
						step={0.01}
						value={params.temperature}
					/>

					<ParamSlider
						description="Nucleus sampling. Отсекает маловероятные токены."
						label="Top P"
						max={1}
						min={0}
						onChange={handleChange("top_p")}
						step={0.01}
						value={params.top_p}
					/>

					<ParamSlider
						description="Штраф за повторения в ответе модели."
						label="Repetition Penalty"
						max={2}
						min={1}
						onChange={handleChange("repetition_penalty")}
						step={0.01}
						value={params.repetition_penalty}
					/>

					<div className="space-y-2">
						<div>
							<p className="font-medium text-sm">Max Tokens</p>
							<p className="text-muted-foreground text-xs">
								Максимальное количество токенов в ответе.
							</p>
						</div>
						<Input
							className="font-mono"
							min={1}
							onChange={handleMaxTokensChange}
							type="number"
							value={params.max_tokens}
						/>
					</div>
				</div>

				<div className="flex justify-end border-border border-t pt-4">
					<Button
						className="gap-2"
						onClick={handleReset}
						size="sm"
						variant="outline"
					>
						<RotateCcw className="size-3.5" />
						Сбросить
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
