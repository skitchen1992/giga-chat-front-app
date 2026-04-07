import {Check, ChevronRight, Circle} from 'lucide-react'
import {DropdownMenu} from 'radix-ui'
import type * as React from 'react'
import {cn} from '@/lib/utils'

const DropdownMenuRoot = DropdownMenu.Root
const DropdownMenuTrigger = DropdownMenu.Trigger
const DropdownMenuGroup = DropdownMenu.Group
const DropdownMenuPortal = DropdownMenu.Portal
const DropdownMenuSub = DropdownMenu.Sub
const DropdownMenuRadioGroup = DropdownMenu.RadioGroup

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenu.SubTrigger> & {
	inset?: boolean
}) {
	return (
		<DropdownMenu.SubTrigger
			className={cn(
				"flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent data-[inset]:pl-8 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			data-inset={inset}
			data-slot='dropdown-menu-sub-trigger'
			{...props}
		>
			{children}
			<ChevronRight className='ml-auto' />
		</DropdownMenu.SubTrigger>
	)
}

function DropdownMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenu.SubContent>) {
	return (
		<DropdownMenu.SubContent
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in',
				className
			)}
			data-slot='dropdown-menu-sub-content'
			{...props}
		/>
	)
}

function DropdownMenuContent({
	className,
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof DropdownMenu.Content>) {
	return (
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
					className
				)}
				data-slot='dropdown-menu-content'
				sideOffset={sideOffset}
				{...props}
			/>
		</DropdownMenu.Portal>
	)
}

function DropdownMenuItem({
	className,
	inset,
	variant = 'default',
	...props
}: React.ComponentProps<typeof DropdownMenu.Item> & {
	inset?: boolean
	variant?: 'default' | 'destructive'
}) {
	return (
		<DropdownMenu.Item
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			data-inset={inset}
			data-slot='dropdown-menu-item'
			data-variant={variant}
			{...props}
		/>
	)
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	...props
}: React.ComponentProps<typeof DropdownMenu.CheckboxItem>) {
	return (
		<DropdownMenu.CheckboxItem
			checked={checked}
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			data-slot='dropdown-menu-checkbox-item'
			{...props}
		>
			<span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
				<DropdownMenu.ItemIndicator>
					<Check className='size-4' />
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.CheckboxItem>
	)
}

function DropdownMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenu.RadioItem>) {
	return (
		<DropdownMenu.RadioItem
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			data-slot='dropdown-menu-radio-item'
			{...props}
		>
			<span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
				<DropdownMenu.ItemIndicator>
					<Circle className='size-2 fill-current' />
				</DropdownMenu.ItemIndicator>
			</span>
			{children}
		</DropdownMenu.RadioItem>
	)
}

function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenu.Label> & {
	inset?: boolean
}) {
	return (
		<DropdownMenu.Label
			className={cn(
				'px-2 py-1.5 font-medium text-muted-foreground text-xs data-[inset]:pl-8',
				className
			)}
			data-inset={inset}
			data-slot='dropdown-menu-label'
			{...props}
		/>
	)
}

function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenu.Separator>) {
	return (
		<DropdownMenu.Separator
			className={cn('-mx-1 my-1 h-px bg-muted', className)}
			data-slot='dropdown-menu-separator'
			{...props}
		/>
	)
}

function DropdownMenuShortcut({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			className={cn(
				'ml-auto text-muted-foreground text-xs tracking-widest',
				className
			)}
			data-slot='dropdown-menu-shortcut'
			{...props}
		/>
	)
}

export {
	DropdownMenuRoot as DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup
}
