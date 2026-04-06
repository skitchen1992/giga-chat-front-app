import { Rocket } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { cn } from "@/lib/utils";
import { selectChatSidebarActiveId } from "../../model/selectors";
import { type ChatListItem, setActiveChatId } from "../../model/slice";

export interface ChatSidebarRowProps {
  chat: ChatListItem;
}

export function ChatSidebarRow({ chat }: ChatSidebarRowProps) {
  const { id, title } = chat;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeChatId = useAppSelector(selectChatSidebarActiveId);
  const isActive = id === activeChatId;

  const handleClick = () => {
    dispatch(setActiveChatId(id));

    navigate(`/chat/${id}`);
  };

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
        <span className="truncate">{title}</span>
        <Rocket className="size-4 shrink-0 opacity-50" />
      </button>
    </li>
  );
}
