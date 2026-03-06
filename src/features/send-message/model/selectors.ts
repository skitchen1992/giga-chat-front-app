import type { RootState } from "@/app/store";


export const selectMessageSelector = (state: RootState) => state.sendMessage.message
export const selectAttachmentsSelector = (state: RootState) => state.sendMessage.attachments