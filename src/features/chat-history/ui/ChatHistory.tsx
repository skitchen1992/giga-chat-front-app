import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppSelector } from "@/app/store/hooks";
import { cn } from "@/lib/utils";
import { selectChatHistory } from "../model/selectors";
import { selectAssistantResponse } from "@/features/assistant-response";

export function ChatHistory() {
  const { messages } = useAppSelector(selectChatHistory);
  const { status: apiStatus, error } = useAppSelector(selectAssistantResponse);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0 && apiStatus === "idle") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <h2 className="text-center font-medium text-2xl text-muted-foreground">
          Готов, когда ты готов.
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {messages.map((msg) => {
        const isPending = msg.id === "__pending__";
        const isUser = msg.role === "user";

        return (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {isUser ? (
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[85%] space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  GigaChat
                </div>
                <div
                  className={cn(
                    "rounded-2xl rounded-tl-sm border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Генерация ответа…
                    </span>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {apiStatus === "error" && error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
