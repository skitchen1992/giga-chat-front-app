import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { selectAppState } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  ChatHistory,
  clearHistory,
  loadChatHistoryThunk,
} from "@/features/chat-history";
import {
  ChatSidebar,
  hydrateChatsFromIndexedDb,
  setActiveChatId,
} from "@/features/chat-sidebar";
import ChatInput from "@/features/send-message/ui/ChatInput/ChatInput";
import { ModelSettingsPanel } from "@/features/settings";

export function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const { hydrated, chats } = useAppSelector(selectAppState);

  useEffect(() => {
    dispatch(hydrateChatsFromIndexedDb());
  }, [dispatch]);

  useEffect(() => {
    const resolved =
      chatId !== null && chatId !== "new" ? (chatId ?? null) : null;
    dispatch(setActiveChatId(resolved));

    if (resolved) {
      dispatch(loadChatHistoryThunk(resolved));
    } else {
      dispatch(clearHistory());
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (!hydrated || location.pathname !== "/") {
      return;
    }

    const [firstChat] = chats;

    if (firstChat) {
      navigate(`/chat/${firstChat.id}`, { replace: true });
    }
  }, [hydrated, location.pathname, chats, navigate]);

  return (
    <div className="flex h-screen bg-background">
      {/* Шапка */}
      <header className="fixed top-0 right-0 left-0 z-10 flex h-12 items-center justify-between border-border border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-muted" />
          <span className="font-medium text-sm">ChatGPT Auto</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <ModelSettingsPanel />
          <button
            aria-label="Профиль"
            className="size-8 rounded-full border border-border"
            type="button"
          />
        </div>
      </header>

      <ChatSidebar />

      {/* Основная область */}
      <main className="ml-64 flex flex-1 flex-col pt-12">
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-6">
          <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto py-8">
            <ChatHistory />
          </div>
          <div className="flex shrink-0 justify-center pt-2">
            <ChatInput />
          </div>
        </div>

        <footer className="py-4 text-center">
          <p className="text-muted-foreground text-xs">
            GigaChat может допускать ошибки.
          </p>
        </footer>
      </main>
    </div>
  );
}
