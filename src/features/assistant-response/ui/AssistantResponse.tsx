import { useAppSelector } from "@/app/store/hooks";
import { Loader2 } from "lucide-react";
import { selectAssistantResponse } from "../model/selectors";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AssistantResponse() {
  const { text, status, error } = useAppSelector(selectAssistantResponse);
  const isEmpty = status === "idle" && !text && !error;

  if (isEmpty) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl space-y-3",
        status === "loading" && "min-h-[2.5rem]"
      )}
    >
      {status === "loading" && (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <Loader2 className="size-4 shrink-0 animate-spin" />
          <span>Генерация ответа…</span>
        </div>
      )}
      {status === "error" && error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {text ? (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
