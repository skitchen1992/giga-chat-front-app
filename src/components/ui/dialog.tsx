import {X} from 'lucide-react'
import {Dialog} from 'radix-ui'
import type * as React from 'react'
import {cn} from '@/lib/utils'

const DialogRoot = Dialog.Root
const DialogTrigger = Dialog.Trigger
const DialogPortal = Dialog.Portal
const DialogClose = Dialog.Close

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof Dialog.Overlay>) {
	return (
		<Dialog.Overlay
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className
			)}
			data-slot='dialog-overlay'
			{...props}
		/>
	)
}

function DialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof Dialog.Content>) {
	return (
		<Dialog.Portal>
			<DialogOverlay />
			<Dialog.Content
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg',
					className
				)}
				data-slot='dialog-content'
				{...props}
			>
				{children}
				<Dialog.Close className='absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
					<X className='size-4' />
					<span className='sr-only'>Закрыть</span>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	)
}

function DialogHeader({className, ...props}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
			data-slot='dialog-header'
			{...props}
		/>
	)
}

function DialogFooter({className, ...props}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
				className
			)}
			data-slot='dialog-footer'
			{...props}
		/>
	)
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof Dialog.Title>) {
	return (
		<Dialog.Title
			className={cn('font-semibold text-lg leading-none', className)}
			data-slot='dialog-title'
			{...props}
		/>
	)
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof Dialog.Description>) {
	return (
		<Dialog.Description
			className={cn('text-muted-foreground text-sm', className)}
			data-slot='dialog-description'
			{...props}
		/>
	)
}

export {
	DialogRoot as Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription
}
