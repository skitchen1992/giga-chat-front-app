import { ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { setSelectedModel } from "../../model/slice"
import selector from "./selector"

export function ModelSelector() {
	const dispatch = useAppDispatch()
	const { selectedModel, modelList } = useAppSelector(selector)

	const handleSelect = (modelId: string) => {
		dispatch(setSelectedModel(modelId))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<button
					className="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent"
					type="button"
				>
					<div className="size-6 rounded bg-muted" />
					<span className="max-w-[160px] truncate font-medium">
						{selectedModel ?? "Выбрать модель"}
					</span>
					<ChevronDown className="size-4 shrink-0 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-[200px]">
				{modelList.map(model => (
					<DropdownMenuItem
						className="cursor-pointer"
						key={model.id}
						onClick={() => handleSelect(model.id)}
					>
						<span className={model.id === selectedModel ? "font-medium" : ""}>
							{model.id}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
