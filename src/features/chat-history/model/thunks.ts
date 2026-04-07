import { createAsyncThunk } from "@reduxjs/toolkit"
import { getMessagesByChatId } from "@/shared/lib"

export const loadChatHistoryThunk = createAsyncThunk(
	"chatHistory/load",
	async (chatId: string) => getMessagesByChatId(chatId)
)
