import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

export interface AttachmentMeta {
	id: string
	name: string
	size: number
}

export interface SendMessageState {
	message: string
	attachments: AttachmentMeta[]
}

const initialState: SendMessageState = {
	message: '',
	attachments: []
}

export const sendMessageSlice = createSlice({
	name: 'sendMessage',
	initialState,
	reducers: {
		setMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload
		},
		resetMessage: state => {
			state.message = ''
		},
		sendMessage: (_state, _action: PayloadAction<string>) => {},
		addAttachment: (state, action: PayloadAction<AttachmentMeta>) => {
			state.attachments.push(action.payload)
		},
		removeAttachment: (state, action: PayloadAction<string>) => {
			state.attachments = state.attachments.filter(a => a.id !== action.payload)
		},
		clearAttachments: state => {
			state.attachments = []
		}
	}
})

export const {
	setMessage,
	resetMessage,
	sendMessage,
	addAttachment,
	removeAttachment,
	clearAttachments
} = sendMessageSlice.actions

export default sendMessageSlice.reducer
