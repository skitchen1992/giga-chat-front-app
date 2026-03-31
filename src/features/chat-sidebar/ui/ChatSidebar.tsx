import { Pencil, Rocket, Search, User } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  selectChatSidebarActiveId,
  selectChatSidebarSearchQuery,
  selectFilteredChats,
} from "../model/selectors";
import type { ChatListItem } from "../model/slice";
import { setActiveChatId, setSearchQuery } from "../model/slice";
import { createNewChatThunk } from "../model/thunks";

function ChatSidebarRow({ chat }: { chat: ChatListItem }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeChatId = useAppSelector(selectChatSidebarActiveId);
  const isActive = chat.id === activeChatId;
  const handleClick = useCallback(() => {
    dispatch(setActiveChatId(chat.id));
    Promise.resolve(navigate(`/chat/${chat.id}`)).catch(() => undefined);
  }, [dispatch, navigate, chat.id]);

  return (
    <li>
      <button
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-muted-foreground text-sm hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent font-medium text-foreground"
        )}
        onClick={handleClick}
        type="button"
      >
        <span className="truncate">{chat.title}</span>
        <Rocket className="size-4 shrink-0 opacity-50" />
      </button>
    </li>
  );
}

export function ChatSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = useAppSelector(selectChatSidebarSearchQuery);
  const filteredChats = useAppSelector(selectFilteredChats);

  const handleNewChat = useCallback(() => {
    dispatch(createNewChatThunk())
      .unwrap()
      .then(({ id }) => Promise.resolve(navigate(`/chat/${id}`)))
      .catch(() => undefined);
  }, [dispatch, navigate]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  return (
    <aside className="fixed top-12 left-0 z-10 flex h-[calc(100vh-3rem)] w-64 flex-col border-border border-r bg-sidebar">
      <div className="flex flex-1 flex-col overflow-hidden p-3">
        <Button
          className="mb-3 w-full justify-start gap-2"
          onClick={handleNewChat}
          type="button"
          variant="outline"
        >
          <Pencil className="size-4" />
          Новый чат
        </Button>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={handleSearchChange}
            placeholder="Поиск в чатах"
            value={searchQuery}
          />
        </div>

        <div className="mt-4 flex-1 overflow-auto">
          <p className="mb-2 px-3 font-medium text-muted-foreground text-xs">
            Недавнее
          </p>
          <ul className="space-y-0.5">
            {filteredChats.map((chat) => (
              <ChatSidebarRow chat={chat} key={chat.id} />
            ))}
          </ul>
        </div>
      </div>

      <div className="border-sidebar-border border-t p-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">Никита Лаврентьев</p>
            <p className="truncate text-muted-foreground text-xs">
              Рабочая область Никита Лаврентьев
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
